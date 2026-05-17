const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

//const Connecter = require('./Connecter');
const MongoClient = require('mongodb').MongoClient;

const mongoUrl = 'mongodb://127.0.0.1:27017';
const dbname = 'authentification';
const collectname = 'users';
let client;
let collection;

//const fixedsalt = '$2b$10$J9p8h1TEhTN6hjkf0p6f2O';

async function connection() {
  try {
    client = new MongoClient('mongodb://127.0.0.1:27017', 
                                { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();
    const db = client.db(dbname); 
    collection = db.collection(collectname);
  }
  catch (error) {
    console.log("error of connection : " + error.message);
  }
}

connection();

const app = express();

// Middleware to parse JSON body
app.use(express.json());

const fixedsalt = '$2b$10$J9p8h1TEhTN6hjkf0p6f2O';

// Authentication Middleware
const authenticateToken = (req, res, next) => {
  // Retrieve the token from the request headers
  const token = req.headers.authorization;
  //res.send(token);
  if (!token) {
    return res.status(401).json({ error: 'Token not found' });
  }

  try {
    // Verify the token using the secret key
    //verify() => returns the decoded payload or information that was initially encoded within the token
    const decoded = jwt.verify(token, 'SECRET_KEY');

    req.user = decoded; // Set the user data in the request object
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Login Route
app.post('/login', async (req, res) => {
  const u = req.body;

  connection();

  // Find user by email
  const user = await collection.findOne({ email: u.email });
  if (!user) {
    return res.status(401).json({ error: 'User not found!' });
  }

  try {
    const isMatch = await comparePasswords(u.password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect password!' });
    }
    // Generate JWT token
    const token = jwt.sign({ userIdentifier: user.email }, 'SECRET_KEY', { expiresIn: '1h' });
    console.log({ userIdentifier: user.email });
    res.status(200).json({ token });
  }
  catch (error) {
    res.status(500).send(error.message);
  }
});

async function comparePasswords(plainPassword, hashedPassword) {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

app.post('/user', async (req, res) => {
  try {
    await connection();
    let user = req.body;
    const hashedpassword = await generateHashedPassword(user.password);
    const userToInsert = {
      ...user,
      password: hashedpassword
    };
    //console.log("userToInsert : " + JSON.stringify(userToInsert));
    const result = await collection.insertOne(userToInsert);
    if (result.acknowledged == true) {
      res.status(201).json('user successfuly inserted');
    } else {
      console.log('Failed to insert the user.');
      res.status(500).json({ error: 'Failed to insert the user.' });
    }
  }
  catch (error) {
    console.log('Error inserting data');
    res.status(500).send('Error inserting data');
  }
});

async function generateHashedPassword(plainPassword) {
  try {
    const hashedPassword = await bcrypt.hash(plainPassword, fixedsalt);
    // Return the hashedPassword
    return hashedPassword;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Protected Route
//to test it in postman => in the request header section, add a new header with the key : 'Authorization' and the value : 'your_token_here'; 'your_token_here' => the string in token object
/*
to test in some cases :
=> go to 'Auth' => 'Bearer token' as a type => give the new token
=> change the type to 'Inherit auth from parent'
then
=>go to 'Headers' => Add 'Authorization' propertie => give the new token as value
*/
app.get('/protected', authenticateToken, (req, res) => {
  // Access the authenticated user's data from req.user
  const userId = req.user.userIdentifier;
  //res.json(req.user); => {"userIdentifier": "karimi@example.com","iat": 1686074481,"exp": 1686078081}
  res.json({ message: 'Access granted to protected route', userId });
});

// Unprotected Route
app.get('/unprotected', (req, res) => {
  res.json({ message: 'Access granted to unprotected route' });
});

// Start the server
app.listen(3006, () => {
  console.log('Server started on port 3006');
});
