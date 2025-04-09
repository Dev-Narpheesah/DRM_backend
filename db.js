const mongoose = require('mongoose');
require("dotenv").config();
const connectDb = async () => {
    try {
        await mongoose.connect(process.env.MONGODB,{
            // useNewUrlParser: true,
            // useUnifiedTopology: true,
            
     } );
}catch(error){
    console.log(error)
}
}
module.exports = connectDb