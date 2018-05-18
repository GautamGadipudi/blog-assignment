# blog-assignment

Basic useful features:
* User Login and signup
* Admin Login
* (GET) GET All Blog Posts
* (GET) GET Details of single blog posts (along with comments)
* (POST) Create a new blog post
* (POST) Add comments for a blog post
* (GET) Get filtered list of posts (filter by title, author)
* (DELETE) Delete an existing blog post
* (PUT) Update an existing blog post

### Softwares required to run the API: 

1. NodeJs (v6.11.0 atleast)
2. Npm (v3.10.10 atleast)
3. MongoDB
4. POSTMAN (For testing the API)

### Steps to get the API running: 
	
1. Clone the repo
2. Run mongoDB in the background
3. Open a terminal in the root of the repo
4. Type the following in the terminal to get all the node_module dependencies:
```shell
npm install
```
5. Then to get the API running, type the following in terminal: 
```shell	
node index.js
```
6. Postman documentation link: [![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/2dfdaa126f6b68264b1f)

### Different endpoints and their properties: 

#### /UserLogin
HTTP POST
Description: Login existing users or signup new users.
Example JSON request: 
```javascript
{  
  "username":"Rick",
  "password":"blehbleh"
}
```

#### /AdminLogin
HTTP POST
Description: Login for admin. (default admin password: CPAdmin)
Example JSON request:
```javascript
{  
  "username":"Morty",
  "password":"blehbleh"
}
```
#### /BlogFeed
HTTP GET
Description: Gets all the blogs from the db. Also does a filter if appropriate querystring given.
#### /NewBlog
HTTP POST
Description: Creates a new blog for a user. Takes author from the JSON request.
Example JSON request: 
```javascript
{  
  "author":"Gautam",
  "title":"blah",
  "description":"blahblah"
}
```
#### /Blog
HTTP GET
Description: Requests the blog. Takes blogid from querystring.
#### /Comment
HTTP POST
Description: Takes a comment (in JSON) as request and appends it to appropriate blog.
Example JSON request:
```javascript
{  
  "blogid":"34refdwepf90we",
  "userid":"saldhidhew333",
  "comment":"blahblah"
}
```
#### /Admin/DeletePost
HTTP DELETE
Description: Removes all the documents that are returned with querystring as query.
#### /Admin/UpdatePost
HTTP PUT
Description: Updates the description of a blog. blog_id from querystring and new description from JSON request.
Example JSON request:
```javascript
{  
  "description":"New description"
}
```
