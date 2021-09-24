const { Router } = require("express");
const express= require('express');
const { Cart } = require("../models/cart.model");
const router = Router()
const {extend} = require('lodash')
const {verifyToken} = require('../middleware/auth.verify')

router.route('/')
    .get(async(req,res)=>{
        try{
            const cart= await Cart.find({})
            res.status(200).json({success:true,cart})
        }
        catch(error){
            res.status(404).json({success:false,message:"unable to fetch cart"})
        }
})
router.use(verifyToken);

router.param("userId",async(req,res,next,userId)=>{
    try{
        const cart= await Cart.findOne({uid:userId})
        if(!cart){
            res.json({success:false,message:"cart not find pls sign up"})
        }
      req.cart= cart
      next();
    }
    catch(error){
       res.json({success:false,message:"cart not find pls sign up",error})
    }
})

router.route('/:userId')
    .get(async(req,res)=>{
        let {cart}= req
        try {
            cart = await cart.populate('items._id').execPopulate()
            const NormalizedCart = cart.items.map((item) => ({...item._id._doc , quantity : item.quantity}))
            res.status(200).json({success : true , cart : NormalizedCart})
        }
        catch (error) {
        res.status(404).json({success : false , message : error.message})
    }
    })
    .post(async(req,res)=>{
        try{
            let {cart} = req;
            let {productId} = req.body;
            if(cart.items.some(item=> item._id==productId)){
                return res.json({success:false,message: "product already present in cart"})
            }
            cart.items.push({_id:productId,quantity:1})
            cart= await cart.save();
            cart = await cart.populate('items._id').execPopulate()
            const NormalizedCart = cart.items.map((item) => ({...item._id._doc , quantity : item.quantity}))
            let product = NormalizedCart.find(each => each._id == productId)
            if(product)
                res.status(201).json({success : true , product})
            } 
        catch (error) {
            res.status(404).json({success : false , message : error.message})
        }
    })

router.route('/:userId/:productId')
    .post(async (req,res)=>{
        try{
            let {cart} = req;
            const {productId}= req.params;
            const updateProduct = req.body;
            let product = cart.items.find(item=>item._id == productId)
            if(product){
                product = extend(product,updateProduct);
                await cart.save();
               return res.json({success:true,product})
            }
            res.status(400).json({success : false , message : 'product not found'})
        }
        catch(error){
            res.status(400).json({success : false , message: error.message})
        }
    })
    .delete(async(req,res)=>{
       try{
        const {productId} = req.params;
        const {cart} = req;
        const product=cart.items.find(item=> item._id==productId);
        if(product){
            cart.items.pull({_id:productId})
            cart.save();
            return res.status(200).json({success : true , product})
        }
        res.status(400).json({success : false , message : 'product not found'})
    } catch (error) {
        res.status(400).json({success : false , message : error.message })
    }
    })
module.exports = router