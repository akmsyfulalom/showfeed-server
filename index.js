const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());



const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.qoygz5c.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const postsCollection = client.db('showfeed').collection('posts');
        const usersCollection = client.db('showfeed').collection('users');

        app.get('/posts', async (req, res) => {
            const posts = {};
            const result = await postsCollection.find(posts).toArray();
            res.send(result);
        });

        app.post('/post', async (req, res) => {
            const posts = req.body;
            const result = await postsCollection.insertOne(posts);
            res.send(result);
        });

        app.post('/users', async (req, res) => {
            const users = req.body;
            console.log(users)
            const result = await usersCollection.insertOne(users);
            res.send(result);
        });

        app.get('/users/sfUser/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await usersCollection.findOne(query);
            res.send({ isUser: user.role === 'sfUser' });
        })

    }
    finally { }
}

run()
    .catch(err => console.log(err))




app.get('/', (req, res) => {
    res.send('ShowFeed server is running');
});


app.listen(PORT, () => {
    console.log(`ShowFeed is running in ${PORT}`);
});
