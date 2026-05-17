const ............... = require(...............);
const MongoClient = require(...............).MongoClient;

const app = ...............;
const port = 3004;
const dbname = 'formation';
const collname = "stagiaire";
let client;
let collection;

app.use(express.json());

async function connection() {
    client = new MongoClient('mongodb://127.0.0.1:27018', 
                    { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db(dbname); 
    collection = db.collection(collname); 
}

//extraire tous les stagiaires
app.get('/stagiaires', async (req, res) => {
    try {
        await connection();
        ............... 
        res.json(result); 
        client.close();
    }
    catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).send('Error retrieving data');
    }
});

//ajouter un stagiaire
app.post('/stagiaires', async (req, res) => {
    try {
        await connection();
        ................... 
        
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


//rechercher un stagiaire par son cne
app.get('/stagiaires/:id', async (req, res) => {
    try {
        await connection();
        ...................
        const stagiaire = await collection.findOne({ cne:stagiaireCNE});
        res.json(stagiaire);
        client.close();
    }
    catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).send('Error retrieving data');
    }
});

//modifier un stagiaire identifié par son id
app.put('/stagiaires/:id', async (req, res) => {
    try {
        await connection();
        ...............
        res.json({ message: 'document successfuly updated' });
        client.close();
    }
    catch (error) {
        console.error('Error updating data:', error);
        res.status(500).send('Error updating data');
    }
});

//supprimer un stagiaire par son id (passé en qury string)
app.delete('/stagiaires/', async (req, res) => {
    try {
        await connection();
        const { stagiaireCNE } = req.query;
        ............... 
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
