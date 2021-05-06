process.env.NODE_ENV = "test";

const app = require('./app');

const request = require('supertest');
const items = require('./fakeDb');

const firstItem = {name:'popsicle', price:1.45};
const secondItem = {name:'cherrios', price:3.40}



describe("Testing /get routes", ()=>{
    beforeEach(()=>{
        items.push(firstItem);
        items.push(secondItem);
    })
    
    afterEach(()=>{
        items.length=0;
    })
    test("testing get /items", async ()=>{
        const res = await request(app).get('/items');

        expect(res.statusCode).toBe(200);

        expect(res.body).toEqual([firstItem, secondItem]);
    })
    test("testing get single item", async ()=>{
        const res = await request(app).get('/items/popsicle');

        expect(res.statusCode).toBe(200);

        expect(res.body).toEqual(firstItem);
    })
    test("testing get a single item that not in the list", async()=>{
        const res = await request(app).get('/items/badabum');

        expect(res.statusCode).toBe(404);

        expect(res.body).toEqual({error:{msg:"given name is not found", status:404}});
    })
})

describe("Tesing /post /patch /delete routes", ()=>{
    beforeEach(()=>{
        items.push(firstItem);
        items.push(secondItem);
    })
    
    afterEach(()=>{
        items.length=0;
    })
    test("testing post /items", async ()=>{
        const res = await request(app).post('/items').send({name:'Skittles', price: 3.40});

        expect(res.statusCode).toBe(201);

        expect(res.body).toEqual({
            added:{name:"Skittles", price:3.40}
        })
    })
    test("testing patch /items", async ()=>{
        const res = await request(app).patch('/items/popsicle').send({name:'Chocolate', price:4.50});
        
        expect(res.statusCode).toBe(200);
        
        expect(res.body).toEqual({
            updated:{name:'Chocolate', price:4.50}
        })
    })
    test("testing delete /items", async ()=>{
        const res = await request(app).delete('/items/cherrios');
        
        expect(res.statusCode).toBe(200);
        
        expect(res.body).toEqual({
            message:'Deleted'
        })
    })
})