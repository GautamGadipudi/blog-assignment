var app = require('express')();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";
var uuidv1 = require('uuid/v1');
var URL = require('url');
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'info';

app.use(bodyParser.json());

//User login
app.post('/UserLogin', function(req, res) { //{username: "Gautam", password: "ggwp"}
	var body = req.body;
	
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		db.collection("users").find(body).toArray(function(err, result) {
			if (err) throw err;
			
			if (result.length) {
				logger.info(body.username + " logged in as: "+ result[0].type + "\n");
				res.status(200).send();
			} 
			else {
				logger.info(body.username + " login failed.\n");
				res.status(401).send();
			}
		})
	});
})

//User Sign up
app.post('/UserSignUp', function(req, res) {
	var body = req.body;
	
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		db.collection('users').find({username: body.username}).toArray(function(err, result) {
			if (err) throw err;
			if (result.length) {
				logger.info("Username " + body.username + " already taken.");
				res.status(400).send();
			}
			else {
				logger.info(result)
				body._id = uuidv1();
				body.type = "user";
				db.collection("users").insertOne(body, function(err, result) {
					if (err) throw err;
					logger.info(body.username + " given id: " + body._id);
					logger.info(body.username + " signed up.\n");
					res.status(200).send();
					db.close();
				});
			}
		})
	})
})

//Admin login route
app.post('/AdminLogin', function(req, res) { //{username: "blah", password: "blahblah"}
	if (req.body.password == "CPAdmin") {
		logger.info(req.body.username + " logged in as: admin");
		res.status(200).send();
	} else {
		logger.info("Incorrect credentials entered. Try Again.");
		res.status(401).send();
	}
})

//NewBlog route
app.post('/NewBlog', function(req, res) { //{author: "Gautam", title: "blah", description: "blahblah"}
	body = req.body;
	body._id = uuidv1();
	body.timestamp = Date.now();
	body.comments = [];
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		db.collection('users').find({ username: body.author }).toArray(function(err, result) {
			if (err) throw err;
			if (result.length) {
				db.collection('blogs').insertOne(body, function(err, result) {
					if (err) throw err;
					res.status(200).send();
					logger.info(body.author + " blog posted.\n");
					db.close();
				})
			} else {
				logger.info(body.author + " needs to sign up.\nBlog not posted.\n")
				res.status(400).send();
				db.close();
			}
		})
	})
});

//GET all blogs (use querystring for filter)
app.get('/BlogFeed', function(req, res) {
	var queryData = URL.parse(req.url, true).query;

	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		db.collection('blogs').find(queryData).toArray(function(err, result) {
			if (err) throw err;
			res.status(200).send(result);

			db.close();
		})
	})
})

//GET details of single blog post (blogid from URL querystring)
app.get('/Blog', function(req, res) {
	var queryData = URL.parse(req.url, true).query;
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		db.collection('blogs').find({ _id: queryData.blogid }).toArray(function(err, result) {
			if (err) throw err;
			if (result.length) {
				res.status(200).send(result);
			} else {
				res.status(400).send();
				logger.info("Invalid blog_id.\n");
			}
			db.close();
		})
	})
})

//Comment route
app.post('/Comment', function(req, res) { //{blog_id: "34refdwepf90we", user_id: "saldhidhew333", comment: "blahblah"}
	var body = req.body;
	var comment = {};
	comment._id = uuidv1();
	comment.user_id = body.user_id;
	comment.comment = body.comment;
	comment.timestamp = Date.now();
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		var query = { _id: body.blog_id };
		db.collection('blogs').find(query).toArray(function(err, result) {
			if (err) throw err;
			if (result.length) {
				db.collection('users').find({ _id: body.user_id }).toArray(function(err, result2) {
					if (err) throw err;
					if (result2.length) {
						var newValues = result[0];
						newValues.comments.push(comment);
						db.collection('blogs').updateOne(query, newValues, function(err, result) {
							if (err) throw err;
							logger.info(comment.user_id + " commented on blog " + body.blog_id);
							res.status(200).send();
						})
					} else {
						logger.info("User: " + body.user_id + " need to sign up before commenting.");
						res.status(400).send();
					}
				})
			} else {
				logger.info("Invalid blog to comment");
				res.status(400).send();
			}
		})
	})
})

//DELETE blog (querystring will be the query to delete docs)
app.delete('/Admin/DeletePost', function(req, res) {
	var queryData = URL.parse(req.url, true).query;
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		db.collection('blogs').find(queryData).toArray(function(err, result) {
			if (result.length) {
				db.collection('blogs').remove({ _id: queryData.blogid });
				logger.info("Blog: " + queryData.blogid + " deleted.");
				res.status(200).send();
			} else {
				logger.info("Invalid blog_id.");
				res.status(400).send();
			}
		})
	})
})

//Update blog using PUT (blogid from URL querystring)
app.put('/Admin/UpdatePost', function(req, res) {

	var queryData = URL.parse(req.url, true).query;
	var body = req.body;
	MongoClient.connect(url, function(err, db) {
		if (err) throw err;
		db.collection('blogs').find({ _id: queryData.blogid }).toArray(function(req, result) {
			if (result.length) {
				var newValues = result[0];
				newValues.description = body.description;
				db.collection('blogs').updateOne(queryData, newValues, function(err, result) {
					if (err) throw err;
					logger.info("Blog: " + queryData.blogid + " updated.");
					res.status(200).send();
				})
			} else {
				logger.info("Invalid blog_id.")
				res.status(400).send();
			}
		})
	})
})

http.listen(1337, function() {
	logger.info("Listening at port 1337\n");
});