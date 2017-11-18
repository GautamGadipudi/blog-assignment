var app = require('express')();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";
const uuidv1 = require('uuid/v1');
const queryString = require('query-string');

app.use(bodyParser.json());

//User login/signup route
app.post('/UserLogin', function(req, res){ //{username: "Gautam", password: "ggwp"}
	var body = req.body;
	MongoClient.connect(url, function(err, db) {
	  	if (err) throw err;
	  	db.collection("users").find({username: body.username}).toArray(function(err, result){
	  		
	  		if(err) throw err;
	  		if(result.length == 0){		//signup
	  			body._id = uuidv1();
	  			db.collection("users").insertOne(body, function(err, res) {
	  				if (err) throw err;
	  				console.log("New user " + body.username + " connected.");
	  				console.log(body.username + " given id: " + body._id);
	  				console.log(body.username + " signed up.\n");
	  				db.close();
	  			});
	  		}
	  		else{		//login
	  			db.collection("users").find(body).toArray(function(err, result){
	  				if (err) throw err;

	  				if(result.length){
	  					console.log(body.username + " logged in.\n");
	  				}
	  				else{
	  					console.log(body.username + " login failed.\n");
	  				}
	  			})
	  			
	  		}
	  	});
		
	});
})

//Admin login route
app.post('/AdminLogin', function(req, res){
	if (req.body.password == "CPAdmin"){
		console.log(req.body.username + " logged in as: Admin");
	}
	else{
		console.log("Incorrect credentials entered. Try Again.");
	}
})

//NewBlog route
app.post('/NewBlog', function(req, res){	//{author: "Gautam", title: "blah", description: "blahblah"}
	body = req.body;
	body._id = uuidv1();
	body.timestamp = Date.now();
	body.comments = "";
	MongoClient.connect(url, function(err, db){
		if (err) throw err;
		db.collection('users').find({username: body.author}).toArray(function(err, result){
			if (err) throw err;
			if(result.length){
				db.collection('blogs').insertOne(body, function(err, result){
					if (err) throw err;
					console.log(body);
					console.log(body.author + " blog posted.\n");
					db.close();
				})
			}
			else{
				console.log(body.author + " needs to sign up.\nBlog not posted.\n")
				db.close();
			}
		})
	})
});

//GET all blogs
app.get('/BlogFeed', function(req, res){
	MongoClient.connect(url, function(err, db){
		if (err) throw err;
		db.collection('blogs').find({}).toArray(function(err, result){
			if (err) throw err;
			res.body = result;
			db.close();
		})
	})
})

//GET details of single blog post (blog id from URL querystring)
app.get('/Blog', function(req, res){	
	var parsedQueryString = queryString.parse(location.search);
	blog_id = parsedQueryString.blogid;
	MongoClient.connect(url, function(err, db){
		if (err) throw err;
		db.collection('blogs').find({_id: blog_id}).toArray(function(err, result){
			if (err) throw err;
			res.body = result;
			db.close();
		})
	})
})

http.listen(1337, function(){
	console.log("Listening at port 1337\n");
});