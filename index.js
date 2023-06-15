const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;
// json files for toys
const toyOne = require('./toysOne.json');
const toyTwo = require('./toysTwo.json');
const toyThree = require('./toysThree.json');

// use middle ware
app.use(cors());
app.use(express.json());


// mongodb

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.frhesy5.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        // await client.connect();

        const toysCollection = client.db('kidsToyWorld').collection('toys');

        // all toys get function
        app.get('/allToys', async (req, res) => {
            let query = {};
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await toysCollection.find(query).toArray();
            res.send(result)
        });

        // get the toys update data
        app.get('/allToys/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await toysCollection.findOne(query);
            res.send(result)
        });

        // all toys delete function
        app.delete('/toyDelete/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await toysCollection.deleteOne(query);
            res.send(result)
        });


        // toy post
        app.post('/addToy', async (req, res) => {
            const toyData = req.body;
            const result = await toysCollection.insertOne(toyData);
            res.send(result);
        })

        // toy put and update
        app.put('/updateToys/:id', async (req, res) => {
            const id = req.params.id;
            const update = req.body;
            const filter = { _id: new ObjectId(id) };
            const options = { upsert: true };
            const data = {
                $set: {
                    description: update.description,
                    quantity: update.quantity,
                    price: update.price
                }
            }
            const result = await toysCollection.updateOne(filter, data, options);
            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

// base api
app.get('/', (req, res) => {
    res.send('Kids Toy World is running')
});

// three toy json file section
app.get('/toyOne', (req, res) => {
    res.send(toyOne)
});
app.get('/toyTwo', (req, res) => {
    res.send(toyTwo)
});
app.get('/toyThree', (req, res) => {
    res.send(toyThree)
});


app.listen(port, () => {
    console.log(`Kids Toy World is running on port: ${port}`);
})