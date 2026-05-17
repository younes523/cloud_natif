const express = require('express');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3000;

const mongoUrl = process.env.MONGO_URL || 'mongodb://127.0.0.1:27017';
const dbname = process.env.MONGO_DB || 'formation';
const collname = process.env.MONGO_COLLECTION || 'stagiaire';

let client;
let collection;


app.use(express.json());


async function connection() {
    client = new MongoClient(mongoUrl);
    await client.connect();

    const db = client.db(dbname);
    collection = db.collection(collname);
}

app.get('/stagiaires', async (req, res) => {
    try {
        await connection();
        const result = await collection.find({}).toArray(); // Retrieve all documents
        res.json(result); // Send the retrieved data as JSON response
        client.close();
    }
    catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).send('Error retrieving data');
    }
});

// Create a new stagiaire
app.post('/stagiaires', async (req, res) => {
    try {
        await connection();
        const stagiaire = req.body;
        
        const result = await collection.insertOne(stagiaire);

       if (result.acknowledged == true) {
            res.status(201).json('document successfuly inserted');
        } else {
            res.status(500).json({ error: 'Failed to insert the document.' });
        }  
    }
    catch (error) {
        console.error('Error posting data:', error);
        res.status(500).send('Error posting data');
    }
    finally {
        client.close();
    }
});



// Get a specific stagiaire
app.get('/stagiaires/:id', async (req, res) => {
    try {
        await connection();
        const stagiaireCNE = parseInt(req.params.id.toString());
        const stagiaire = await collection.findOne({ cne:stagiaireCNE});
        res.json(stagiaire);
        client.close();
    }
    catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).send('Error retrieving data');
    }
});

// Update a stagiaire
/* app.put('/stagiaires/:id', async (req, res) => {
    try {
        await connection();
        const stagiaireCNE = parseInt(req.params.id.toString());
        const updateData = { $set: req.body }; //the $set operator is used to specify new values for fields within an existing document
        const result = await collection.updateOne({ cne: stagiaireCNE }, updateData);
        if(result.modifiedCount == 1)
            res.json({ message: 'document successfuly updated' });
        else
            res.send("no documents have been modified");
        client.close();
    }
    catch (error) {
        console.error('Error updating data:', error);
        res.status(500).send('Error updating data');
    }
}); */

app.put('/stagiaires/:id', async (req, res) => {
    try {
        await connection();
        const stagiaireCNE = parseInt(req.params.id.toString());
        const nouvelStagiaire = req.body; //the $set operator is used to specify new values for fields within an existing document
        nouvelStagiaire.cne = stagiaireCNE;
        const result = await collection.replaceOne({ cne: stagiaireCNE }, nouvelStagiaire);
        if(result.modifiedCount == 1)
            res.json({ message: 'document successfuly replaced' });
        else
            res.send("no documents has been replaced");
        client.close();
    }
    catch (error) {
        console.error('Error updating data:', error);
        res.status(500).send('Error updating data');
    }
});

// Delete a stagiaire
app.delete('/stagiaires/:cne', async (req, res) => {
    try {
        await connection();
        const stagiaireCNE = parseInt(req.params.cne.toString());
        const result = await collection.deleteOne({ cne: stagiaireCNE });
        if(result.deletedCount == 1)
            res.json({ message: 'document successfuly deleted' });
        else
            res.send("no documents have been deleted");
        client.close();
    }
    catch (error) {
        console.error('Error deleting data:', error);
        res.status(500).send('Error deleting data');
    }
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
