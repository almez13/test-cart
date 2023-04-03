const express = require('express');

const {handleErrors} = require('./middlewares.js');
const usersRepo = require('../../repositories/users.js');
const signupTemplate = require('../../views/admin/auth/signup.js');
const signinTemplate = require('../../views/admin/auth/signin.js');
const {
  requireEmail, 
  requirePassword, 
  requirePasswordConfirmation, 
  requireEmailExists, 
  requirePasswordExists
} = require('./validators.js');


const router = express.Router();

router.get('/signup', (req, res) => {
  res.send(signupTemplate({req: req}));
});

router.post('/signup', 
  [requireEmail, requirePassword, requirePasswordConfirmation],
  handleErrors(signupTemplate), 
  async (req, res) => {   
    const {email, password} = req.body;    
    //create a user in user repo 
    const user = await usersRepo.create({email: email, password: password});
    //store the id of the user inside the users cookie
    req.session.userId = user.id;
    res.redirect("/admin/products");
});

router.get('/signout', (req, res) => {
  req.session = null;
  res.send("You`re logged out");
});

router.get('/signin', (req, res) =>{
  res.send(signinTemplate({}));
});

router.post('/signin', 
  [requireEmailExists, requirePasswordExists],
  handleErrors(signinTemplate), 
  async (req, res) => {
    const {email} = req.body;
    //check if user already exists 
    const user = await usersRepo.getByOne({email: email});    

    req.session.userId = user.id;
    res.redirect("/admin/products");
});

module.exports = router;