const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');


const db = knex({
  client: 'pg',
  version: '8.3.2',
  connection: {
    host : '127.0.0.1',
    user : 'ralstonjosephs',
    password : 'your_database_password',
    database : 'smart-brain'
  }
});

// db.select('*').table('users').then(data=>{
// 	console.log(data);
// });

const app = express();

app.use(express.json());
// const database = {
//    users : [
//    {
//        id: '123',
//        name: 'John',
//        email: 'john@gmail.com',
//        password: 'cookies',
//        entries: 0,
//        joined: new Date()
//     },
//     {
//        id: '124',
//        name: 'Sally',
//        email: 'sally@gmail.com',
//        password: 'bananas',
//        entries: 0,
//        joined: new Date()
//     }

//    ],
//    login: [
//    {
//    	id: '987',
//    	hash: '',
//    	email: 'john@gmail.com'
//    }

//    ]



// }
app.use(cors())
app.get('/',(req,res)=>{
	res.json(database.users);
})

app.post('/signin',(req,res) =>{signin.handleSignin(req,res,db,bcrypt)});
	
app.post('/register', (req,res) => {register.handleRegister(req,res,db,bcrypt)});


app.get('/profile/:id',(req,res)=>{profile.handleProfileGet(req,res,db)});
	
app.put('/image',(req,res)=>{image.handleImage(req,res,db)});
app.post('/imageurl',(req,res)=>{image.handleApiCall(req,res)});
	
	
// bcrypt.hash("bacon", null, null, function(err, hash) {
  // Store hash in your password DB.
// });

// Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
    // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
    // res = false
// });
app.listen(3000,() =>{
	console.log('app is running on port 3000');
});

/*
/ --> res = this is working
/signin --> POST success/fail
/register --> POST = user
/profile/:userid --> GET = user
/image --> PUT --> user
*/
