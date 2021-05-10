const express = require('express');
const ExpressError = require('./expressError');
const router = new express.Router();

let items = [];

const fs = require('fs');
fs.readFile('./database', 'utf8', (err, data)=>{
    if (err){
        console.log("Reading errors");
        process.exit(1);
    }
    items = JSON.parse(data);
    console.log(items);
})

function writeToFile(content){
    fs.writeFile('./database',content,'utf8', (err)=>{
        if (err){
            console.log("Writing errors");
            process.exit(1);
        }
        console.log("Wrote successfully!");
        console.log(items);
    })
}

global.items = items;

router.get('/', (req, res)=>{
    return res.json(
        items
    )
})

router.post('/', (req, res, next)=>{
    try {
        debugger;
        if (!req.body.name || !req.body.price){
            throw new ExpressError("name and price are required!", 402)
        }else{
            items.push({name: req.body.name, price: req.body.price});
            writeToFile(JSON.stringify(items));  
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
        const foundItem = items.find(i=>i.name == req.params.name);
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
        const foundItemIndex = items.findIndex(i=>i.name === req.params.name);
        if (foundItemIndex==-1){
            throw new ExpressError("given name is not found", 404);
        }
        if (!req.body.name && !req.body.price){
            throw new ExpressError("name and price are required in the body", 402);
        }
        items[foundItemIndex].name = req.body.name || items[foundItemIndex].name;
        items[foundItemIndex].price = req.body.price || items[foundItemIndex].price;
        return res.status(200).json({
            updated: items[foundItemIndex]
        })
    } catch (e) {
        next(e);
    }
})

router.delete('/:name', (req, res, next)=>{
    try {
        const foundItemIndex = items.findIndex(i=>i.name === req.params.name);
        if (foundItemIndex==-1){
            throw new ExpressError("given name is not found", 404);
        }
        items.splice(foundItemIndex,1);
        return res.json({
            message:'Deleted'
        })
    } catch (e) {
        next(e);
    }
})

module.exports = router;