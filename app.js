const express = require('express');
const ExpressError = require('./expressError');
const app = express();

const itemsRouter = require('./itemsRouter');

app.use(express.json());

app.use('/items', itemsRouter);

//404 handler
app.use((req, res, next)=>{
    throw new ExpressError("Page Not Found", 404);
})

//generic errors handler
app.use((err, req, res, next)=>{
    let status = err.status || 500;
    let msg = err.msg || "Just an error";
    
    return res.status(status).json({
        error:{
            msg:msg,
            status:status
        }
    })
})


module.exports = app;