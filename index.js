const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
require("dotenv").config();
const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.1bvos1q.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const foodCollection = client.db("foodDB").collection("food");
    const cartsCollection = client.db("cartsDB").collection("carts");

    app.post("/food", async (req, res) => {
      const newFood = req.body;
      console.log(newFood);
      const result = await foodCollection.insertOne(newFood);
      res.send(result);
    });

    app.get("/food", async (req, res) => {
      const cursor = foodCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/food/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await foodCollection.findOne(query);
      res.send(result);
    });

    // update

    app.put("/food/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updatedFood = req.body;
      const food = {
        $set: {
          name: updatedFood.name,
          food_photo: updatedFood.food_photo,
          location: updatedFood.location,
          quantity: updatedFood.quantity,
          notes: updatedFood.notes,
          available: updatedFood.available,
          date: updatedFood.date,
        },
      };
      const result = await foodCollection.updateOne(filter, food, options);
      res.send(result);
    });

    app.delete("/food/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await foodCollection.deleteOne(query);
      res.send(result);
    });

    // Add to cart

    app.post("/carts", async (req, res) => {
      const newFood = req.body;
      console.log(newFood);
      const result = await cartsCollection.insertOne(newFood);
      res.send(result);
    });

    app.get("/carts", async (req, res) => {
      const cursor = cartsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/carts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartsCollection.findOne(query);
      res.send(result);
    });

    app.delete("/carts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cartsCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
