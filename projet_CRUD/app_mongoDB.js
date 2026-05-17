const express = require('express');

const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3004;

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

app.get('/connect', async (req,res) => {
    try{
        await myconnection();
        res.send("successfully connected ...");
        client.close();
    }
    catch(error){
        res.send("error connecting to the MongoDB server!")
    }
})


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



// Get a specific stagiaire, by CNE
app.get('/stagiaires/:cne', async (req, res) => {
    try {
        await myconnection();
        const stagiaireCNE = parseInt(req.params.cne);
        const stagiaire = await mycollection.findOne({ cne:stagiaireCNE});
        if(stagiaire != null){
            res.json(stagiaire);
        }
        else{
            res.send("stagiaire not found!");
        }
        client.close();
    }
    catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).send('Error retrieving data');
    }
});

// Get a distinct names, by classe
app.get('/stagiaires/classe/:classe', async (req, res) => {
    try {
        await myconnection();
        const stagiaireClasse = req.params.classe;
        const distinct_noms_prenoms = await mycollection.distinct("nom_prenom", {classe : stagiaireClasse});
        res.json(distinct_noms_prenoms);
        client.close();
    }
    catch (error) {
        console.error('Error retrieving data:', error);
        res.status(500).send('Error retrieving data');
    }
});

// Update a stagiaire, using $set operator
app.put('/stagiaires/set/:cne', async (req, res) => {
    try {
        await myconnection();
        const stagiaireCNE = parseInt(req.params.cne.toString());
        const updateData = { $set: req.body }; //the $set operator is used to specify new values for fields within an existing document
        const result = await mycollection.updateOne({ cne: stagiaireCNE }, updateData);
        
        if(result.modifiedCount == 1)
            res.json({ message: 'document successfuly updated, by $set' });
        else
            res.send("no documents have been updated by $set");
        client.close();
    }
    catch (error) {
        console.error('Error updating data:', error);
        res.status(500).send('Error updating data');
    }
}); 

//update a stagiaire, by replacing it; put()
app.put('/stagiaires/replacement/:cne', async (req, res) => {
    try {
        await myconnection();
        const stagiaireCNE = parseInt(req.params.cne);
        const nouvelStagiaire = req.body; 
        nouvelStagiaire.cne = stagiaireCNE;
        const result = await mycollection.replaceOne({ cne: stagiaireCNE }, nouvelStagiaire);
        if(result.modifiedCount == 1)
            res.json({ message: 'document successfuly updated, by replacement' });
        else
            res.send("no documents have been updated by replacement");
        client.close();
    }
    catch (error) {
        console.error('Error updating data:', error);
        res.status(500).send('Error updating data');
    }
});

//update a stagiaire, by replacing it; patch()
// app.patch('/stagiaires/replacement/:cne', async (req, res) => {
//     try {
//         await myconnection();
//         const stagiaireCNE = parseInt(req.params.cne);
//         const nouvelStagiaire = req.body; 
//         nouvelStagiaire.cne = stagiaireCNE;
//         const result = await mycollection.replaceOne({ cne: stagiaireCNE }, nouvelStagiaire);
//         if(result.modifiedCount == 1)
//             res.json({ message: 'document successfuly updated, by replacement' });
//         else
//             res.send("no documents have been updated by replacement");
//         client.close();
//     }
//     catch (error) {
//         console.error('Error updating data:', error);
//         res.status(500).send('Error updating data');
//     }
// });

// Update a stagiaire, using $set operator => more aligned with the conventional use of PATCH
// app.patch('/stagiaires/set/:cne', async (req, res) => {
//     try {
//         await myconnection();
//         const stagiaireCNE = parseInt(req.params.cne.toString());
//         const updateData = { $set: req.body }; //the $set operator is used to specify new values for fields within an existing document
//         const result = await mycollection.updateOne({ cne: stagiaireCNE }, updateData);
        
//         if(result.modifiedCount == 1)
//             res.json({ message: 'document successfuly updated, by $set' });
//         else
//             res.send("no documents have been updated by $set");
//         client.close();
//     }
//     catch (error) {
//         console.error('Error updating data:', error);
//         res.status(500).send('Error updating data');
//     }
// }); 

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
