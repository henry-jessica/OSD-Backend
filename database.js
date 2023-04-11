const { mongoose } = require('mongoose');
require("dotenv").config(); 

//Mongodb connection 
mongoose
.connect(process.env.MONGODB_URI)
.then(()=> console.log('Connected to MongoDb ATLAS'))
.catch((error => console.error(error))); 