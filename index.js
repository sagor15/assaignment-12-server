const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// midlewere
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hlovr.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
  try {
    await client.connect();
    console.log('database connected');

    const productCollection = client.db('auto_parts').collection('products');
    const bookingCollection = client.db('auto_parts').collection('booking');

    app.get('/product', async (req, res) => {
      const query = {};
      const products = await productCollection.find(query).toArray();
      res.send(products);





      app.get('/product/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const buy = await productCollection.findOne(query);
        res.send(buy);
        
      });

      app.get('/booking',async(req,res)=>{
        const user= req.query.user;
        const query = {user:user};
        const allbookings = await bookingCollection.find(query).toArray();
        res.send(allbookings);
      })


      app.post('/booking', async(req,res)=>{
        const booking = req.body;
        const allbookings = await bookingCollection.insertOne(booking);
        res.send(allbookings);
      })






    })
  }
  finally {

  }

}
run().catch(console.dir);





app.get('/', (req, res) => {
  res.send('Hello from assaignment 12');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})