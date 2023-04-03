const {check} = require("express-validator");
const usersRepo = require("../../repositories/users.js");

module.exports = {
  requireTitle: check("title")
    .trim()
    .isLength({min: 5, max: 40})
    .withMessage("must be between 5 and 40 characters"),
  requirePrice: check("price")
    .trim()
    .toFloat()
    .isFloat({min: 1})
    .withMessage("must be a number greater than 1"),
   //make sanitazetion and validation with express-validator
   requireEmail: check("email")
   .trim()
   .normalizeEmail()
   .isEmail()
   .custom(async (email) => {
     const existingUser = await usersRepo.getByOne({email: email});
     if(existingUser) {
     throw new Error("Email in use");
     };
   }),
   requirePassword: check("password")
   .trim()
   .isLength({min: 4, max: 20}),   
   requirePasswordConfirmation: check("passwordConfirmation")
   .trim()
   .isLength({min: 4, max: 20})
   .custom((passwordConfirmation, {req}) => {    
     if(passwordConfirmation !== req.body.password) {      
       throw new Error("Password must match");
     };
     return true;
   }),
   requireEmailExists: check("email")
   .trim()
   .normalizeEmail()
   .isEmail()
   .withMessage("Must provide a valid email")
   .custom(async (email) => {
     const user = await usersRepo.getByOne({email: email});
     if(!user) {
       throw new Error("Email not found");          
     }
   }),
   requirePasswordExists: check("password")
   .trim()
   .custom(async (password, {req}) => {
     const user = await usersRepo.getByOne({email: req.body.email});
     if(!user){
       throw new Error("Invalid password");
     }
     const validPassword = await usersRepo.comparePasswords(user.password, password);
     //check password
     if(!validPassword) {
       throw new Error("Invalid password");
     };
   }) 
};