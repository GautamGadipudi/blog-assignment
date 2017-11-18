var app = require('express')();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/mydb";
const uuidv1 = require('uuid/v1');

app.use(bodyParser.json());

//User login/signup route
app.post('/', function(req, res){
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

http.listen(1337, function(){
	console.log("Listening at port 1337\n");
});