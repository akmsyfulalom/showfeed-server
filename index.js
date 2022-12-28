const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const cors = require('cors');
require('dotenv').config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
    res.send('ShowFeed server is running');
});



const uri = `mongodb+srv://${process.env.USER}:${process.env.PASS}@cluster0.qoygz5c.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const postsCollection = client.db('showfeed').collection('posts');

        app.get('/posts', async (req, res) => {
            const posts = {};
            const result = await postsCollection.find(posts).toArray();
            res.send(result);
        })

    }
    finally { }
}

run().catch(err => console.log(err))







app.listen(PORT, () => {
    console.log(`ShowFeed is running in ${PORT}`);
});
