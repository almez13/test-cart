const express = require('express');
const cartsRepo = require("../repositories/carts.js");
const productsRepo = require("../repositories/products.js");
const cartsShowTemplate = require("../views/carts/show.js");

const router = express.Router();

//recieve post request to add an item to a cart 
router.post("/cart/products", async (req, res) => {
   //figure out the cart
   let cart;
   if (!req.session.cartId) {
    //dont have a cart, need to create a new one and store the cart id on the res.session.cartId
    cart = await cartsRepo.create({items: []});
    req.session.cartId = cart.id;
   }else {
    //we have a cart and need to get it from the repository
    cart = await cartsRepo.getOne(req.session.cartId);
   };
      
   //either increment quantity for existing product 
   //or add new products to items array
   const existingItem = cart.items.find(item => item.id === req.body.productId);

   if (existingItem) {
    //incremet the quantity and save cart
    existingItem.quantity++;
   } else {
    //add new product id to items array
    cart.items.push({id: req.body.productId, quantity: 1});
   }
   
   await cartsRepo.update(cart.id, {items: cart.items});


  res.redirect("/cart");
});

//recieve a get request to show all items in cart
router.get('/cart', async (req, res) => {
  if(!req.session.cartId) {
    return res.redirect("/");
  }

  const cart = await cartsRepo.getOne(req.session.cartId); 

  for (let item of cart.items) {
    const product = await productsRepo.getOne(item.id);
    item.product = product;
  };

  res.send(cartsShowTemplate({items: cart.items}));

});
//recieve a post request to delete an item from a cart
router.post("/cart/products/delete", async (req, res) => {
  const {itemId} = req.body;
  const cart = await cartsRepo.getOne(req.session.cartId);

  const items = cart.items.filter(item => item.id !== itemId);

  await cartsRepo.update(req.session.cartId, {items});

  res.redirect('/cart');
});

module.exports = router;
