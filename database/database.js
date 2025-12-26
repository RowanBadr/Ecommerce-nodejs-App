const mongoose = require('mongoose')
require('dotenv').config()
const connectionString = process.env.MONGO_URI

function connectDB(){ 
    mongoose.connect('mongodb+srv://ahmedmokhtar2407:1234@cluster1.0ddauuc.mongodb.net/ecommerce')
    .then(console.log('database is connected'))
    .catch((err)=>{
        console.log('big failure')
    })
}
module.exports = connectDB;