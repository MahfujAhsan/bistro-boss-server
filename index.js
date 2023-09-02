const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const stripe = require('stripe')(process.env.PAYMENT_SECRET_KEY)
const jwt = require('jsonwebtoken');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;


// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@bistrobossrestaurent.seqzpxz.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

const verifyJWT = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (!authorization) {
        return res.status(401).send({ error: true, message: 'unauthorized access' })
    }

    const token = authorization.split(' ')[1];

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).send({ error: true, message: 'unauthorized access' })
        }
        req.decoded = decoded;
        next();
    })
}

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();


        const usersCollection = client.db("bistroDb").collection("users");
        const menuCollection = client.db("bistroDb").collection("menu");
        const reviewsCollection = client.db("bistroDb").collection("reviews");
        const cartCollection = client.db("bistroDb").collection("carts");
        const paymentCollection = client.db("bistroDb").collection("payments");
        const bookingCollection = client.db("bistroDb").collection("booking");

        app.post('/jwt', (req, res) => {
            const user = req.body;
            const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '12h' })

            res.send({ token })
        });

        // Warning: User verifyJWT before using verifyAdmin
        const verifyAdmin = async (req, res, next) => {
            const email = req.decoded.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);

            if (user?.role !== 'admin') {
                return res.status(403).send({ error: true, message: 'forbidden access' });
            }
            next();
        }

        // booking related apis
        app.post('/booking', async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.send(result);
        })

        app.get('/booking', verifyJWT, async (req, res) => {
            const email = req.query.email;
            if(!email) {
                res.send([])
            }

            const decodedEmail = req.decoded.email;
            if(email !== decodedEmail) {
                return res.send(403).send({error: true, message: 'forbidden access'});
            }

            const query = {email: email};
            const result = await bookingCollection.find(query).toArray();
            res.send(result);
        })

        // app.get('/carts', verifyJWT, async (req, res) => {
        //     const email = req.query.email;
        //     if (!email) {
        //         res.send([])
        //     }

        //     const decodedEmail = req.decoded.email;
        //     if (email !== decodedEmail) {
        //         return res.status(403).send({ error: true, message: 'forbidden access' })
        //     }

        //     const query = { email: email };
        //     const result = await cartCollection.find(query).toArray();
        //     res.send(result);
        // })

        // users related apis
        app.post("/users", async (req, res) => {
            const user = req.body;
            const query = { email: user.email };
            const existingUser = await usersCollection.findOne(query);
            if (existingUser) {
                return res.send({ message: 'User already exists' })
            }
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

        app.get('/users', verifyJWT, verifyAdmin, async (req, res) => {
            const result = await usersCollection.find().toArray();
            res.send(result);
        })

        app.get('/users/admin/:email', verifyJWT, async (req, res) => {
            const email = req.params.email;

            if (req.decoded.email !== email) {
                res.send({ admin: false })
            }

            const query = { email: email };
            const user = await usersCollection.findOne(query);
            const result = { admin: user?.role === 'admin' };
            res.send(result);
        })

        app.patch('/users/admin/:id', async (req, res) => {
            const id = req.params.id;
            const filter = { _id: new ObjectId(id) };

            const updatedDoc = {
                $set: {
                    role: 'admin'
                }
            };

            const result = await usersCollection.updateOne(filter, updatedDoc);
            res.send(result);
        })

        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const user = await usersCollection.findOne(query);
            if(user.role === 'admin') {
                res.send({"error": "You Can't Delete an Admin"})
            } else {
                const result = await usersCollection.deleteOne(query);
                res.send(result);
            }
            
        })

        // app.delete("/menu/:id", verifyJWT, verifyAdmin, async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: new ObjectId(id) }
        //     const result = await menuCollection.deleteOne(query);
        //     res.send({ result });
        // })

        // menu related apis
        app.get("/menu", async (req, res) => {
            const result = await menuCollection.find().toArray();
            res.send(result)
        })

        app.get('/menu/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await menuCollection.findOne(query);
            res.send(result);
        })

        app.post("/menu", verifyJWT, verifyAdmin, async (req, res) => {
            const newItem = req.body;
            const result = await menuCollection.insertOne(newItem);
            res.send(result);
        })

        app.delete("/menu/:id", verifyJWT, verifyAdmin, async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await menuCollection.deleteOne(query);
            res.send({ result });
        })

        app.patch('/menu/:id', async (req, res) => {
            const itemId = req.params.id;
            try {
                const updateData = req.body;

                const updatedItem = await menuCollection.findOneAndUpdate(
                    { _id: new ObjectId(itemId) },
                    { $set: updateData },
                    { new: true }
                );

                if (!updatedItem) {
                    return res.status(404).json({ message: 'Item not found' });
                }

                res.json(updatedItem);
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'Server error' });
            }
        });

        app.get("/reviews", async (req, res) => {
            const result = await reviewsCollection.find().toArray();
            res.send(result)
        })

        // Carts collection apis
        app.get('/carts', verifyJWT, async (req, res) => {
            const email = req.query.email;
            if (!email) {
                res.send([])
            }

            const decodedEmail = req.decoded.email;
            if (email !== decodedEmail) {
                return res.status(403).send({ error: true, message: 'forbidden access' })
            }

            const query = { email: email };
            const result = await cartCollection.find(query).toArray();
            res.send(result);
        })

        app.post("/carts", async (req, res) => {
            const item = req.body;
            const result = await cartCollection.insertOne(item);
            res.send(result)
        })

        app.delete("/carts/:id", async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) };
            const result = await cartCollection.deleteOne(query);
            res.send(result);
        })

        app.post("/create-payment-intent", verifyJWT, async (req, res) => {
            const { price } = req.body;
            const amount = parseInt(price * 100);
            const paymentIntent = await stripe.paymentIntents.create({
                amount: amount,
                currency: "usd",
                payment_method_types: ["card"]
            })

            res.send({ clientSecret: paymentIntent.client_secret })
        })

        app.post('/payments', verifyJWT, async (req, res) => {
            const payment = req.body;
            const insertResult = await paymentCollection.insertOne(payment);

            const query = { _id: { $in: payment.cartItems.map(id => new ObjectId(id)) } };

            const deleteResult = await cartCollection.deleteMany(query);

            res.send({ insertResult, deleteResult });
        })

        app.get('/admin-stats', verifyJWT, verifyAdmin, async (req, res) => {
            const users = await usersCollection.estimatedDocumentCount();
            const products = await menuCollection.estimatedDocumentCount();
            const orders = await paymentCollection.estimatedDocumentCount();
            const payments = await paymentCollection.find().toArray();
            const revenue = payments.reduce((sum, payment) => sum + payment.price, 0)
            res.send({ users, products, orders, revenue });
        })

        app.get('/order-stats', verifyJWT, verifyAdmin, async (req, res) => {

            const pipeline = [
                {
                    $addFields: {
                        menuItemsIds: {
                            $map: {
                                input: '$menuItems',
                                as: 'itemId',
                                in: { $convert: { input: '$$itemId', to: 'objectId' } }
                            }
                        }
                    }
                },
                {
                    $lookup: {
                        from: 'menu',
                        localField: 'menuItemsIds',
                        foreignField: '_id',
                        as: 'menuItemsData'
                    }
                },
                {
                    $unwind: '$menuItemsData'
                },
                {
                    $group: {
                        _id: '$menuItemsData.category',
                        count: { $sum: 1 },
                        totalPrice: { $sum: '$menuItemsData.price' }
                    }
                },
                {
                    $project: {
                        category: '$_id',
                        count: 1,
                        total: { $round: ['$totalPrice', 2] },
                        _id: 0
                    }
                }
            ];

            const result = await paymentCollection.aggregate(pipeline).toArray();

            res.send(result);
        })

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('Bistro is running')
})

app.listen(port, () => {
    console.log(`Bistro is listening on port ${port}`)
})

/**
 * ----------------------------------------------------------------
 * NAMING CONVENTION
 * ----------------------------------------------------------------
 * users : userCollection
 * app.get('/users')
 * app.get('/users/:id')
 * app.post('/users')
 * app.patch('/users/:id')
 * app.put('/users/:id')
 * app.delete('/delete/:id')
 */

