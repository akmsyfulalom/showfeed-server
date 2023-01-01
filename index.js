const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        const commentsCollection = client.db('showfeed').collection('comments');
        const likesCollection = client.db('showfeed').collection('likes');

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
        app.get('/post/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const post = await postsCollection.findOne(query);
            res.send(post);
        });


        app.get('/users/sfUser/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await usersCollection.findOne(query);
            res.send({ isUser: user?.role === 'sfUser' });
        });

        app.get('/user/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email };
            const user = await usersCollection.findOne(query);
            res.send(user);
        });

        app.post('/comments', async (req, res) => {
            const comments = req.body;
            const result = await commentsCollection.insertOne(comments);
            res.send(result);
        });

        app.get('/comments', async (req, res) => {
            const comments = await commentsCollection.find({}).sort({ time: -1 }).toArray();
            res.send(comments);
        })


        app.get('/viewPostComments', async (req, res) => {
            const iDComment = req.query.id;
            const body = req.body;
            const query = { id: iDComment };
            const comments = await commentsCollection.find(query).sort({ time: -1 }).toArray()
            res.send(comments);
        });

        app.get('/likes', async (req, res) => {
            const likes = await postsCollection.find({}).project({ likes: 1 }).toArray();
            res.send(likes);
        })


        app.put('/like/:id', async (req, res) => {
            try {
                // Find the item in the database
                console.log(req.body)

                // Find the item in the database
                const post = await postsCollection.findOne({ _id: new ObjectId(req.params.id) });

                // Check if the user has already liked the item
                const userAlreadyLiked = post.likes.includes(req.body.user);

                if (userAlreadyLiked) {
                    // If the user has already liked the item, remove their like
                    post.likes = post.likes.filter((like) => like.toString() !== req.body.user);

                } else {
                    // If the user has not liked the item, add their like
                    post.likes.push(req.body.user);
                }

                // Save the updated item back to the database
                await postsCollection.updateOne({ _id: new ObjectId(req.params.id) }, { $set: post });

                // Send the updated item as a response
                res.send(post);
            } catch (error) {
                res.status(400).send({ error: error.message });
            }
        });
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
