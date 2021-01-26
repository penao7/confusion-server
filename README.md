# Confusion Server

Alternate server implemention for [Confusion restaurant](http://www.github.com/penao7/restaurant-app)-app made with Node.js, express.js, mongodb (mongoose), passport (jwt, OAuth2 and local).

## Description

By default runs at port `3000`. 

Cors whitelisted URL's:
```
http://localhost:3000 
https://localhost:3443
http://localhost:8000
```

User is considerated to be an `admin` if admin boolean value is set to `true` in the database. The verification is made by using verifyOrdinaryUser and verifyAdmin middlewares inside routers.
The full authentication code can be inspected [here](server/authenticate.js).

Dishes, promotion and leaders can be set as `featured` by changing featured value to `true` in the database.

## Routes

### Users

```bash
Fetch all users
GET /users
# requires admin authentication

User signup
POST /signup
# firstname, lastname, password

User login
POST /login
# username, password

User signout
GET /logout

Check JWTToken
GET /checkJWTToken
#token

Facebook-authentication
GET /facebook/token
```

### Dishes

```bash
Fetch all dishes
GET /dishes

Create dish
POST /dishes
# requires admin authentication

Delete dish
DELETE /dishes/:dishId
# requires admin authentication

Edit dish
PUT /dishes/:dishId
# requires admin authentication
```

### Comments

```bash
Fetch all comments
GET /comments

Add a comment
PUT /comments/:commentId
# user can only edit his/her own comments
  
Delete comment
DELETE /comments/:commentId
# user can only delete his/her own comments

Edit comment
PUT /comments/:commentId
# user can only delete his/her own comments
```

### Favourites

```bash
Fetch favourites
GET /favourites
# fetched by userid

Add multiple dishes to favourites
POST /favourites
# added by userid

Checks is dish already a favourite
GET /favourites/:dishId
# checked by userid

Adds a dish to favourites by id
POST /favourites/:dishId
# added by userid

```

### Promotions
```bash
Fetch all promotions
GET /promotions

Add a promotion
POST /promotions
# requires admin authentication

Delete all promotions
DELETE /promotions
# requires admin authentication

Fetch a promotion with id
GET /promotions/:promoId
# requires admin authentication

Edit a promotion with id
PUT /promotions/:promoId
# requires admin authentication

Delete promotion
DELETE /promotions/:promoId
# requires admin authentication
```

### Leaders

```bash
Fetch all leaders
GET /leaders

Add a leader
POST /leaders
# requires admin authentication

Delete all leaders
DELETE /leaders
# requires admin authentication

Fetch a promotion with id
GET /leaders/:leaderId
# requires admin authentication

Edit a promotion with id
PUT /leaders/:leaderId
# requires admin authentication

Delete promotion
DELETE /leaders/:leaderId
# requires admin authentication
```

