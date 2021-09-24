const express= require('express');
const { extend } = require('lodash');
const {Wishlist} = require('../models/wishlist.model');
const router = express.Router();
const {verifyToken} = require('../middleware/auth.verify')

router.route('/')
    .get(async(req,res)=>{
        try{
            let wishlist= await Wishlist.find({})
            res.status(200).json({success:true,wishlist})
        }
        catch(error){
            res.status(404).json({success:false,message: "unable to fetch Wishlist!"})
        }
    })

    router.use(verifyToken);

router.param("userId",async(req,res,next,userId)=>{
    try{
        const wishlist = await Wishlist.findOne({uid: userId})
        if(!wishlist){
        res.status(404).json({success:false,message:"wishlist not found pls signup"})
            }
        req.wishlist= wishlist;
        next()
    }
    catch(error){
        res.status(404).json({success:false,message:"wishlist not found pls signup",error})   
    }
})

router.route('/:userId')
    .get(async(req,res)=>{
      try{
        let {wishlist} = req;
        wishlist= await wishlist.populate('items._id').execPopulate();
        const NormalizedWishlist= wishlist.items.map((item) => ({...item._id._doc , quantity : item.quantity}))
        res.status(200).json({success : true , wishlist : NormalizedWishlist})
    }
      catch(error){
        res.status(404).json({success : false , message : error.message})
      }
    } 
    )
    .post(async(req,res)=>{
        try{
            let {wishlist} = req;
            let {productId} = req.body;
            if(wishlist.items.some(item=>item._id==productId)){
                res.json({success:false,message: "product already present in wishlist"})
            }
            wishlist.items.push({_id:productId,quantity:1})
            wishlist= await wishlist.save();
            wishlist = await wishlist.populate('items._id').execPopulate()
            const NormalizedWishlist = wishlist.items.map((item) => ({...item._id._doc , quantity : item.quantity}))
            let product = NormalizedWishlist.find(each => each._id == productId)
            if(product){
                res.status(201).json({success : true , product})
            } 
        }
        catch(error){
            res.status(404).json({success : false , message : error.message})
        }
    })      

router.route('/:userId/:productId')
    .delete(async(req,res)=>{
      try{
        const {wishlist}= req;
        const {productId}= req.params;
        const product = wishlist.items.find(item=>item._id==productId)
        if(product){
          wishlist.items.pull({_id: productId})
          await wishlist.save();
          return res.status(200).json({success : true , product})
        }
        res.status(400).json({success : false , message : 'product not found'})
      }
      catch(error){
        res.status(400).json({success : false , message : error.message })
      }
    })

module.exports = router
