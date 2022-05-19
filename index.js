const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

require('dotenv').config();

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.kby4d.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const taskCollection = client.db('ToDoApp').collection('task');

        app.get('/task', async (req, res) => {
            const query = {};
            const cursor = taskCollection.find(query);
            const tasks = await cursor.toArray();
            res.send(tasks);
        })

        // POST
        app.post('/task', async (req, res) => {
            const newTask = req.body;
            const result = await taskCollection.insertOne(newTask);
            res.send(result);
        })

        // DELETE
        app.delete('/task/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await taskCollection.deleteOne(query);
            res.send(result)
        })
    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Running To-Do App');
});

app.listen(port, () => {
    console.log('Listening to port', port);
})
