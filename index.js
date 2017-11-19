var app = require('express')();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";
var uuidv1 = require('uuid/v1');
var URL = require('url');

app.use(bodyParser.json());

//User login/signup route
app.post('/UserLogin', function(req, res){ //{username: "Gautam", password: "ggwp"}
	var body = req.body;
	body.type = "user";
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
					res.writeHead(200);
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
				res.status(200).send(result);
				
				db.close();
			})
		})
		
	
	
})

//GET details of single blog post (blog id from URL querystring)
app.get('/Blog', function(req, res){
	var queryData = URL.parse(req.url, true).query;
	MongoClient.connect(url, function(err, db){
		if (err) throw err;
		db.collection('blogs').find({_id: queryData.blogid}).toArray(function(err, result){
			if (err) throw err;
			if (result.length){
				res.status(200).send(result);
			}
			else {
				console.log("Invalid blog_id.\n");
			}
			db.close();
		})
	})
})

http.listen(1337, function(){
	console.log("Listening at port 1337\n");
});