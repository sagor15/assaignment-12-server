const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const stripe = require('stripe')(process.env.SECRET_API_KEY);
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 5000;


// midlewere this api
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
    const userCollection = client.db('auto_parts').collection('user');

    // product api 
    app.get('/product', async (req, res) => {
      const query = {};
      const products = await productCollection.find(query).toArray();
      res.send(products);
// user api 
      app.get('/user', async (req, res) => {
        const user = await userCollection.find().toArray();
        res.send(user);
      })
// admin id sepefic
      app.get('/admin/:email', async (req, res) => {
        const email = req.params.email;
        const user = await userCollection.findOne({ email: email });
        const isAdmin = user.role === 'admin';
        res.send({ admin: isAdmin });
      })
// user admin email api
      app.put('/user/admin/:email', async (req, res) => {
        const email = req.params.email;
        const filter = { email: email };
        const updateDoc = {
          $set: { role: 'admin' },
        };
        const results = await userCollection.updateOne(filter, updateDoc);

        res.send(results)
      })


      //   app.delete('/user/:email', async (req, res) => {
      //     const email = req.params.email;
      //     const filter = { email: email }
      //     const result = await doctorCollection.deleteOne(filter);
      //     res.send(result);
      // })

      app.put('/user/:email', async (req, res) => {
        const email = req.params.email;
        const user = req.body;
        const filter = { email: email };
        const options = { upsert: true };
        const updateDoc = {
          $set: user,
        };
        const result = await userCollection.updateOne(filter, updateDoc, options);

        res.send(result)
      })


      app.get('/product/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const buy = await productCollection.findOne(query);
        res.send(buy);

      });

      app.get('/booking', async (req, res) => {
        const user = req.query.user;
        // const authoraization = req.headers.authorization;
        // console.log('this is ',authoraization);
        const query = { user: user };
        const allbookings = await bookingCollection.find(query).toArray();
        res.send(allbookings);
      })


      app.post('/booking', async (req, res) => {
        const booking = req.body;
        const allbookings = await bookingCollection.insertOne(booking);
        res.send(allbookings);
      })
      //   app.delete('/booking/:id', async (req, res) => {
      //     const id = req.params.email;
      //     const filter = { email: email }
      //     const result = await doctorCollection.deleteOne(filter);
      //     res.send(result);
      // })

      app.get('/booking/:id', async (req, res) => {
        const id = req.params.id;
        const query = { _id: ObjectId(id) };
        const booking = await bookingCollection.findOne(query);
        res.send(booking);
      })


      // app.post('/create', async (req, res) => {
      //   const service = req.body;
      //   const price = service.price;
      //   const amount = price*100;

      //   // Create a PaymentIntent with the order amount and currency
      //   const paymentIntent = await stripe.paymentIntents.create({
      //     amount: amount,
      //     currency: "usd",
      //     payment_method_types: [
      //       "card"
      //     ]
      //   });
      //   res.send({
      //       clientSecret: paymentIntent.client_secret,
      //     });
      //   });


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