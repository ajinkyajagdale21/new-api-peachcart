const mongoose= require('mongoose')

const initialConnection=async()=>{
    try{
        const connection = await mongoose.connect('mongodb+srv://ajinkyajagdale:ajinkya@21@peachcart.46ya6.mongodb.net/peachcart', {
            useUnifiedTopology : true,
            useNewUrlParser : true
        })
        if(connection){
            console.log("connection Successful")
        }
    }
    catch(error){
       console.log("connection failed ", error)
    }
}

module.exports= {initialConnection}