const express = require('express');
const ExpressError = require('./expressError');
const router = new express.Router();

const items = require('./fakeDb');

router.get('/', (req, res)=>{
    return res.json(
        items
    )
})

router.post('/items', (req, res, next)=>{
    try {
        if (!req.body.name || !req.body.price){
            throw new ExpressError("name and price are required!", 402)
        }else{
            items.push({name, price});
            return res.json({
                added:{name, price}
            })
        }
    } catch (e) {
        next(e);
    }
})

router.get('/:name', (req, res, next)=>{
    try {
        const foundItem = items.find(i=>i.name == req.body.name);
        if (!foundItem){
            throw new ExpressError("given name is not found", 404);
        }
        return res.json(
            foundItem
        )
    } catch (e) {
        next(e);
    }
})

router.patch('/:name', (req, res, next)=>{
    try {
        const foundItemIndex = items.findIndex(i=>i.name == req.body.name);
        if (foundItemIndex!==-1){
            throw new ExpressError("given name is not found", 404);
        }
        if (!req.body.name && !req.body.price){
            throw new ExpressError("name and price are required in the body", 402);
        }
        items[foundItemIndex].name = req.body.name || items[foundItemIndex].name;
        items[foundItemIndex].price = req.body.price || items[foundItemIndex].price;
        return res.json({
            updated: items[foundItemIndex]
        })
    } catch (e) {
        next(e);
    }
})

router.delete('/:name', (req, res, next)=>{
    try {
        const foundItemIndex = items.findIndex(i=>i.name == req.body.name);
        if (foundItemIndex!==-1){
            throw new ExpressError("given name is not found", 404);
        }
        items.slice(foundItemIndex,1);
        return res.json({
            message:'Deleted'
        })
    } catch (e) {
        next(e);
    }
})

module.exports = router;