const express = require('express');
const ExpressError = require('./expressError');
const router = new express.Router();

const File = require('./file');
global.path = './database';
global.file = new File(path);

file.readFromFile();

router.get('/', (req, res)=>{
    file.readFromFile();
    return res.json(
        file.items
    )
})

router.post('/', (req, res, next)=>{
    try {
        debugger;
        if (!req.body.name || !req.body.price){
            throw new ExpressError("name and price are required!", 402)
        }else{
            file.readFromFile();
            file.items.push({name: req.body.name, price: req.body.price});
            file.writeToFile();  
            return res.status(201).json({
                added:{name: req.body.name, price:req.body.price}
            })
        }
    } catch (e) {
        next(e);
    }
})

router.get('/:name', (req, res, next)=>{
    try {
        file.readFromFile();
        const foundItem = file.items.find(i=>i.name.toLowerCase() == req.params.name.toLowerCase());
        if (!foundItem){
            throw new ExpressError("given name is not found", 404);
        }
        return res.status(200).json(
            foundItem
        )
    } catch (e) {
        next(e);
    }
})

router.patch('/:name', (req, res, next)=>{
    try {
        file.readFromFile();
        const foundItemIndex = file.items.findIndex(i=>i.name.toLowerCase() === req.params.name.toLowerCase());
        if (foundItemIndex==-1){
            throw new ExpressError("given name is not found", 404);
        }
        if (!req.body.name && !req.body.price){
            throw new ExpressError("name and price are required in the body", 402);
        }
        file.items[foundItemIndex].name = req.body.name || items[foundItemIndex].name;
        file.items[foundItemIndex].price = req.body.price || items[foundItemIndex].price;
        file.writeToFile(); 
        return res.status(200).json({
            updated: file.items[foundItemIndex]
        })
    } catch (e) {
        next(e);
    }
})

router.delete('/:name', (req, res, next)=>{
    try {
        file.readFromFile();
        const foundItemIndex = file.items.findIndex(i=>i.name.toLowerCase() === req.params.name.toLowerCase());
        if (foundItemIndex==-1){
            throw new ExpressError("given name is not found", 404);
        }
        file.items.splice(foundItemIndex,1);
        file.writeToFile(); 
        return res.status(200).json({
            message:'Deleted'
        })
    } catch (e) {
        next(e);
    }
})

module.exports = router;