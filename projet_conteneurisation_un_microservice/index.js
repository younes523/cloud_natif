const express = require('express');

const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3000;

const mongoUrl = 'mongodb://127.0.0.1:27017';
const dbname = 'bdformation';
const collname = "stagiaires";
let client;
let mycollection;


app.use(express.json());

async function myconnection() {
    client = new MongoClient(mongoUrl); // ,{ useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db(dbname); // Replace with your database name
    mycollection = db.collection(collname); // Replace with your collection name
}

// Retrieve all documents sorted by 'classe' in descending order; find() returns a 'FindCursor'
app.get('/stagiaires', async (req, res) => {
    try {
        await myconnection();
        const result = await mycollection.find({}).sort({'classe':-1}).toArray(); 
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
        await myconnection();
        const stagiaire = req.body;
        
        const result = await mycollection.insertOne(stagiaire);

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

// Delete a stagiaire
app.delete('/stagiaires/:cne', async (req, res) => {
    try {
        await myconnection();
        const stagiaireCNE = parseInt(req.params.cne.toString());
        const result = await mycollection.deleteOne({ cne: stagiaireCNE });
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
