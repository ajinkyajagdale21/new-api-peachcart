const mongoose = require('mongoose')

const initialConnection = async () => {
    try {
        const connection = await mongoose.connect(process.env.URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true
        })
        if (connection) {
            console.log("connection Successful")
        }
    }
    catch (error) {
        console.log("connection failed ", error)
    }
}

module.exports = { initialConnection }