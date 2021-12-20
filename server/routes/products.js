const express = require('express');
const router = express.Router();
const products = require('../services/products');

router.get('/', async function(req, res, next){
    try{
        const data = await products.getMultiple(req.query.page);
        res.json(data)
    } catch(err){
        console.error('Error while getting products', err.message);
        next(err);
    }
})

.get('/latest', async function(req, res, next){
    try {
        const data = await products.getLatest();
        res.json(data);
    } catch (err) {
        console.error('Error while getting latest products', err.message);
        next(err);
    }
})

// .get('/category/:id', async function(req, res, next){
//     try {
//         const data = await products.getFilteredProducts(req.params.id);
//         res.json(data);
//     } catch (err) {
//         console.error('Error filtering products', err.message);
//         next(err);
//     }
// })

.get('/:id', async function (req, res, next){
    try{
        const data = await products.getProduct(req.params.id);
        res.json(data);
    } catch (err) {
        console.error('Error while getting product', err.message);
        next(err);
    }
})

module.exports = router;