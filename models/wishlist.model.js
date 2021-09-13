const mongoose = require('mongoose')
const {Schema} = mongoose

const WishlistSchema = new Schema({
    uid : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    },
    items : [
        {
            _id : {type : mongoose.Schema.Types.ObjectId , ref : 'Product'}
        }
    ]
})


const Wishlist = mongoose.model('Wishlist' , WishlistSchema)

module.exports = {Wishlist};