const express = require('express');
const router = express.Router();
const categories = require('../services/categories');

router.get('/', async function(req, res, next){
    try{
        const data = await categories.getCategories();
        res.json(data)
    } catch(err){
        console.error('Error while getting categories', err.message);
        next(err);
    }
})

router.get('/:id', async function(req, res, next){
    try{
        const data = await categories.getProductsByCategory(req.params.id);
        res.json(data)
    } catch(err){
        console.error('Error while getting products by category', err.message);
        next(err);
    }
})

module.exports = router;