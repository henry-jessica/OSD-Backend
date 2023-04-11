const express = require('express'); 
const db = require('./database');
const eventRoutes = require('./routes/events')
// const auth = require('./routes/auth');
// const users = require('./routes/users');
require('dotenv').config();
// note this required a .env file which is not in github

const passport = require('passport');
const {User} = require('./model/users');



var cors = require('cors')

const app=express(); 
const port = process.env.PORT || 3000; 

var corsOptions = {
  origin: '*'
}


// Passport Config
passport.use(User.createStrategy());
app.use(passport.initialize());

app.use(cors());

// Middleware
app.use(express.json()); 

app.use('/api',eventRoutes); 

//routes 
app.get('/', (req,res)=>{
    res.send('Welcome to my API');
})

// //Mongodb connection 
// mongoose
// .connect(process.env.MONGODB_URI)
// .then(()=> console.log('Connected to MongoDb ATLAS'))
// .catch((error => console.error(error))); 
app.use('/api', cors(), (eventRoutes));
// app.use('/users', users);
// app.use('/auth', auth)


app.use(cors(corsOptions));


//Test 


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
