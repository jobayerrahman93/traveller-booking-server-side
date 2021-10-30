const { MongoClient } = require('mongodb');
const express = require('express');
require('dotenv').config();
const cors = require('cors');
const app = express()
const ObjectId = require('mongodb').ObjectId;
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());



// travellerBooking
// fcmONsOBCctKRHmS

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ipq6z.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

// console.log(uri);

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        console.log("connected to the database");

        const database = client.db("travellerBooking");
        const bookingServices = database.collection("services");
        const orderPlace = database.collection("order")

        // post api
        app.post('/addBooking', async (req, res) => {

            const service = req.body;
            // console.log(service);

            const result = await bookingServices.insertOne(service);
            // console.log(result);

            res.json(result);

        });

        // get single service

        app.get('/bookingDetails/:Bookid', async (req, res) => {

            console.log("hitting single services ");
            const id = req.params.Bookid;

            // console.log("hitting ", id);

            // const query={_id: ObjectId(id)};
            // console.log(query);

            const SingleService = await bookingServices.findOne({ _id: ObjectId(id) });
            // console.log(SingleService);
            res.json(SingleService);


        });


        // place order

        app.post("/bookingDetails/order", async (req, res) => {
            console.log("hitting order");
            const UserOrder = req.body;
            // console.log("hittiong order body",UserOrder);

            const result = await orderPlace.insertOne(UserOrder);
            // console.log(result);
            res.json(result);

        });

        // manage order

        app.get('/manageOrder', async (req, res) => {

            // console.log("manage hitting")
            const cursor = await orderPlace.find({});
            const result = await cursor.toArray();
            // console.log(result);
            // res.send(result)
            res.json(result)
        });

        // update status

        app.put("/manageOrder/:id",async(req,res)=>{
            const id=req.params.id;
            console.log("hitting status");
            const updateOrder=req.body;
            console.log(req.body)
            const query={_id: ObjectId(id)};
            const options = { upsert: true };

            const updateDoc = {
                $set: {
                  status:updateOrder.status
                },
              };

              const result = await orderPlace.updateOne(query, updateDoc, options);
              res.json(result)

        })

        // delete manage order

        app.delete('/manageOrder/:id', async (req, res) => {
            const id = req.params.id;
            // console.log(id);

            const query = { _id: ObjectId(id) };
            const result = await orderPlace.deleteOne(query);

            res.json(result);
        });

        // my order api

        app.get("/myOrder", async(req, res) => {

            // console.log("hitting order");
            const cursor = await orderPlace.find({});
            const result = await cursor.toArray();
            // console.log(result);

            res.json(result);

        });

        // delete my order
        app.delete("/myOrder/:id", async (req, res) => {
            const id = req.params.id;
            // console.log("to backend", id);
            const query = { _id: ObjectId(id) };
            const result = await orderPlace.deleteOne(query);
            res.json(result);
        })




        // get api

        app.get("/services", async (req, res) => {

            const cursor = await bookingServices.find({});
            const result = await cursor.toArray();
            // console.log(result);
            res.send(result);

        })

    }
    finally {
        // await client.close();
    }
}
run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Yeah ! Traveller server is working')
})

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})