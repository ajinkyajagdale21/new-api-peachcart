const {products} = require('../dataset/data')
const mongoose= require('mongoose')
const {Schema} = mongoose;

const ProductSchema = new Schema({
    productName:{
         type: String,
         required: 'product Name is required'
    },
    image : {
        type :String , 
        required : 'image Url is Required'
    },
    price : {
        type : Number,
        required : 'price is required'
    },
    ratings : Number,
    description : String,
    fastDelivery : Boolean,
    inStock : Boolean,
    gender : {
        type :String,
        required : 'for whom this product is suitable for'
    },
    offers : Array 
    })

const Product = mongoose.model('Product',ProductSchema);

const addProductToDB =()=>{
    products.forEach(async(item)=>{
        const NewProducts= new Product (item)
        try{
            await NewProducts.save()
        }
        catch(error){
            console.log("error adding Products",error)
        }
  })
}

module.exports={Product,addProductToDB}