const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const {engine} = require('express-handlebars');
const port = 5050;

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public/'))
app.use(express.static(__dirname + '/public/'));

app.set('view engine', 'handlebars');
app.engine('handlebars', engine());
app.set('views', './views');

const homeRouter = require('./routes/index');
app.use('/', homeRouter);

const loginRouter = require('./routes/login');
app.use('/login', loginRouter);

const registerRouter = require('./routes/register');
app.use('/register', registerRouter);

const productsRouter = require('./routes/products');
app.use('/products', productsRouter);

const profileRouter = require('./routes/profile');
app.use('/profile', profileRouter);

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`)
});