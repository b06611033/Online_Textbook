# MYMathApps Store
## Introduction

This repository is a another collection of code that makes up the MYMathApps. However, the backend framework is `Express.js` + `MongoDB`, while the original one is build on `Nest.js` + `MariaDB`. The frontend (client) of both repository is basically the same, both built on `React.js`. 

This server has only one API, which is Google Login function. For other APIs, please refer to the original repository.

The reason why we changed the backend framework is that none of our team member has experience in web development, and the original backend code is too difficult for us to work on. If you have experience in backend, it is recommened to work on the original one.


## Run on localhost
### Step 1: Apply for Google OAuth2.0 credential
https://developers.google.com/identity/protocols/oauth2
Follow the guidance the link above to create google OAuth2.0 credential and get the client ID and secret.
You also need to add Authorized redirect URIs
```
http://localhost:8080/auth/google/callback
```

### Step 2: Create MongoDB on MongoDB Atlas
1. Create a MongoDB Atlas account
2. Create a free database
3. Go to "Network Access" and add ip address: "0.0.0.0/0"
4. Go to Database and choose the connection method "Connect with your application"
5. Add your connection string into your application code. Your connection string should look like: 
```
mongodb+srv://<username><database password>@cluster0.unuulls.mongodb.net/?retryWrites=true&w=majority
```
    
### Step 3: Add Environment Variables

#### Add .env in project root directory
For the `PASSPORT_SECRET` and `SESSION_SECRET`, you can assign an arbitrary `string` as your secret, this is for creating session and passport token

/.env
```text=
GOOGLE_CLIENT_ID = "xxx" #Your Google Client ID
GOOGLE_CLIENT_SECRET = "xxx" #Your Google Client Secret
PASSPORT_SECRET = "xxx" #Your Own Secret
SESSION_SECRET = "xxx" #Your Own Secret
MONGODB_CONNECTION = "mongodb+srv://<username>:<database password>@cluster0.unuulls.mongodb.net/?retryWrites=true&w=majority" ＃Your connection string
```
    
#### Add .env in client directory
client/.env
```text=
REACT_APP_SERVER_DOMAIN=http://localhost:8080
```

### Step 4: Run Server and Client
#### Start Server
In the root directory:
```
yarn
yarn start
```
#### Start Client
```
cd client
yarn
yarn start
```
## Deploying to Heroku
1. Login or create Heroku accout, then create a new Heroku app
2. Go to "Settings" tab of your Heroku app, find "Config Vars" and add your environment variables
3. Go to "Deploy" tab, find "Deployment method", link your github repository with the app
4. Enable automatic deploy
5. Change client/.env 
```
REACT_APP_SERVER_DOMAIN= "xxx" #Your deployed web address
```
6. Push your code to github
7. Add deployed url to the redirect url in your Google OAuth2.0 credential
8. Your website should be deployed to Heroku automatically


## Deploying to https://dev.mymathapps.com
Refer to the README file of the original repository of MyMathApps