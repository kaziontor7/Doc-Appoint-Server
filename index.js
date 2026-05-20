const express = require('express');
const app = express();
const cors = require('cors');
const dotenv = require('dotenv');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
app.use(cors());
app.use(express.json());
dotenv.config();
const port = process.env.PORT
const uri = process.env.MONGODB_URI

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
    await client.connect();
    const db = client.db("doc-appoint");
    const appointCollection = db.collection("appoints");
    const bookingCollection = db.collection("bookings");
    app.get('/appoints', async (req, res) => {
      const result = await appointCollection.find().toArray();
      res.send(result);
    });
    app.get('/top-appoints', async (req, res) => {
      const result = await appointCollection.find().sort({rating: -1 }).limit(3).toArray();
      res.send(result);
    });
     
    app.get('/appoints/search/:name', async (req, res) => {
      const name = req.params.name;
      const result = await appointCollection.find({name: { $regex: name, $options: 'i' }}).toArray();
      res.send(result);
    });
    
    app.get('/appoints/:id', async (req, res) => {
      const id = req.params.id;
      const result = await appointCollection.findOne({_id: new ObjectId(id)});
      res.send(result);
    });
    app.post('/bookings', async (req, res) => {
      const booking = req.body;
      const result = await bookingCollection.insertOne(booking);
      res.send(result);
    });
   

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}run().catch(console.dir);


app.get('/', (req, res) => {
  res.send('Hello World!');
});



app.listen(port, () => {  console.log(`Example app listening at http://localhost:${port}`);
});