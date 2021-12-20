const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
var multer = require('multer');
var upload = multer();
var cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cookieParser())
app.use(cors())

app.use(express.static('public/assets/images'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(upload.array()); 

const productsRoutes = require('./routes/products');
app.use('/products', productsRoutes)

const categoryRoutes = require('./routes/categories');
app.use('/categories', categoryRoutes)

const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes)

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({'message': err.message});

    return;
})

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
});