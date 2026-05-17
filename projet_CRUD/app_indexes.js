const { MongoClient } = require("mongodb");
const uri = "mongodb://localhost:27017";
const client = new MongoClient(uri);

let collection;

(async () => {
    try {
        await client.connect();
        const db = client.db("bdformation");
        collection = db.collection("stagiaires");

        // // Create a single field index
        // await collection.createIndex({ nom_prenom: 1 }); // Ascending order
        // console.log("Single field index created on 'nom_prenom'");

        // // Create a compound index
        // await collection.createIndex({ nom_prenom: 1, classe: -1 }, {name: 'myindex_nom-prenom_classe'});
        // console.log("Compound index created on 'nom_prenom' and 'classe'");

        // // Create a text index (for full-text search)
        // await collection.createIndex({ nom_prenom: "text" });
        // console.log("Text index created on 'nom_prenom'");

        // // Create a unique index
        // await collection.createIndex({ cne: 1 }, { unique: true });
        // console.log("Unique index created on 'cne'");

        console.log("List of indexes:");
        await list();
        // await drop_one();
        // console.log("List of indexes, after deleting one:");
        // await list();
        
        await drop_all();
        console.log("List of indexes, after deleting all:");
        await list();

    } catch (err) {
        console.error(err);
    } finally {
        await client.close();
    }
})();

//to view all indexes

const list = (async () => {
    const indexes = await collection.indexes();
    console.log(indexes);

});

//to drop a speific index
const drop_one = (async () => {
    await collection.dropIndex("nom_prenom_1");
    console.log("Index 'nom_prenom_1' dropped");

});

//to drop all indexes
const drop_all = (async () => {
    await collection.dropIndexes();
    console.log("All indexes dropped");
});