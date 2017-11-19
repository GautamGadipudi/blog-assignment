# blog-assignment

Basic useful features:

## New User sign up
Login
(GET) GET All Blog Posts
(GET) GET Details of single blog posts (along with comments)
(POST) Create a new blog post
(POST) Add comments for a blog post
(GET) Get filtered list of posts (filter by title, author)
(DELETE) Delete an existing blog post
(PUT) Update an existing blog post

## Steps to get the API running: 
	
Clone the repo
Open a terminal in the root of the repo
Type the following in the terminal to get all the node_module dependencies:
```
npm install
```
## Then to get the API running, type the following in terminal: 
```	
node index.js
```

## Different endpoints and their properties: 

/UserLogin
	HTTP POST
	Description: Login existing users or signup new users.
	Example JSON request: 
	```
	{"username": "Rick", "password": "blehbleh"}
	```
/AdminLogin
	HTTP POST
	Description: Login for admin. (default admin password: CPAdmin)
	Example JSON request:
	``` 
	{"username": "Morty", "password": "blehbleh"}
	```
/BlogFeed
	HTTP GET
	Description: Gets all the blogs from the db. Also does a filter if appropriate querystring given.
/NewBlog
	HTTP POST
	Description: Creates a new blog for a user. Takes author from the JSON request.
	Example JSON request: 
	```
	{"author": "Gautam", "title": "blah", "description": "blahblah"}
	```
/Blog
	HTTP GET
	Description: Requests the blog. Takes blogid from querystring.
/Comment
	HTTP POST
	Description: Takes a comment (in JSON) as request and appends it to appropriate blog.
	Example JSON request:
	```
	{"blogid": "34refdwepf90we", "userid": "saldhidhew333", "comment": "blahblah"}
	```
/Admin/DeletePost
	HTTP DELETE
	Description: Removes all the documents that are returned with querystring as query.
/Admin/UpdatePost
	HTTP PUT
	Description: Updates the description of a blog. blog_id from querystring and new description from JSON request.
	Example JSON request:
	```
	{"description": "New description"}
	```
