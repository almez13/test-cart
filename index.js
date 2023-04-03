const express = require('express');
const bodyParser = require('body-parser');
const cookieSession = require('cookie-session');
const authRouter = require('./routes/admin/auth.js');
const adminProductsRouter = require('./routes/admin/products.js');
const productsRouter = require('./routes/products.js');
const cartsRouter = require('./routes/carts.js');

const app = express();
//middlewares
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  //incrypt data from users
  //name: "session",
  keys: ["$amamam&"],
}));

app.use(authRouter);
app.use(adminProductsRouter);
app.use(productsRouter);
app.use(cartsRouter);

app.listen(3000, () => {
});