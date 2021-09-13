const {Product} = require('../models/product.model')
const express = require('express')
const router = express.Router()

router.route('/')
.get(async (req, res) => {
    try{
    const products= await Product.find({})
      res.json({ test: "succesfull", products})
    }
    catch (error) {
        res.json({success : false , message : 'cannot fetch products! please try again later'})
    } 
    })

 router.param('productId',async(req,res,next,productId)=>{
   try{
    const product = await Product.findById(productId)
    if(!product){
      return res.json({success:"false",message:"error getting product"})
    }
    req.product=product;
    next();
   }
   catch(error){
    res.json({message: "error while getting product"})
   }
 })

  router.route('/:productId')
  .get((req,res)=>{
    const product = req.product;
    res.json({product})    
  })

  module.exports= router