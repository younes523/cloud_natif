const MongoClient = require('mongodb').MongoClient;

const mongoUrl = 'mongodb://127.0.0.1:27017';
const dbname = 'authentification';
let client;
let collection;

const fixedsalt = '$2b$10$J9p8h1TEhTN6hjkf0p6f2O';

exports.connection = async function connection() {
    client = new MongoClient('mongodb://127.0.0.1:27017', { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db(dbname); // Replace with your database name
    collection = db.collection('users'); // Replace with your collection name
}
/*
exports.login = (req, res, next) => {
    collection.findOne({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({ error: 'Utilisateur non trouvé !' });
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({ error: 'Mot de passe incorrect !' });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'SECRET_KEY',
                            { expiresIn: '24h' }
                        )
                    });
                })
                .catch(error => res.status(500).json({ error }));
        })
        .catch(error => res.status(500).json({ error }));
};

// Create a new user
exports.insert = app.post('/user', async (req, res) => {
    try {
        await connection();
        let user = req.body;
        const hashedpassword = await generateHashedPassword(user.password);
        const updatedUser = {
            ...user,
            password:hashedpassword
        };
        //user = updatedUser;
        const result = await collection.insertOne(updatedUser);

       if (result.acknowledged == true) {
            res.status(201).json('user successfuly inserted');
        } else {
            res.status(500).json({ error: 'Failed to insert the user.' });
        }  
    }
    catch (error) {
        //console.error('Error inserting data:', error);
        res.status(500).send('Error inserting data');
    }
    finally {
        client.close();
    }
});

async function generateHashedPassword(plainPassword) {
    try {
      const hashedPassword = await bcrypt.hash(plainPassword, fixedsalt);
      return hashedPassword;
    } catch (error) {
      console.error('Error:', error);
      throw error;
    }
  }
  */