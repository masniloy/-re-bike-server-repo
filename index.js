const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());
require('dotenv').config();


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.g924zd8.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const categoryCollections = client.db('re-bike').collection('category')
        const bookingCollections = client.db('re-bike').collection('booking')
        app.get('/category', async (req, res) => {
            const query = {}
            const categoryOptions = await categoryCollections.find(query).toArray();
            res.send(categoryOptions);
        });
        app.get('/category/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const oneCategoryOptions = await categoryCollections.findOne(query);
            res.send(oneCategoryOptions);
        });

        app.get('/booking', async (req, res) => {
            const email = req.query.email;
            const query = { buyerEmail: email };
            const booking = await bookingCollections.find(query).toArray();
            res.send(booking);
        });

        app.post('/booking', async (req, res) => {
            const booking = req.body
            console.log(booking);
            const result = await bookingCollections.insertOne(booking);
            res.send(result);
        });



    }
    finally {

    }
}
run().catch(err => console.log(err));


app.get('/', (req, res) => {
    res.send('ok');
})

app.listen(port, () => {
    console.log('port :', port);
})