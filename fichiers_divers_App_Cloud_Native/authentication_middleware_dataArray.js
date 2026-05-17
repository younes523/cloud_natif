const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const app = express();

// Middleware to parse JSON body
app.use(express.json());

const fixedsalt = '$2b$10$J9p8h1TEhTN6hjkf0p6f2O';


var users;

// Mock User Model
(async () => {
  const password = "karimi@2023";
  const hashedPassword = await generateHashedPassword(password);
  //simulation database
  users = [
    {
      id: 1,
      name: 'karimi',
      email: 'karimi@example.com',
      password: hashedPassword
    }
  ];
})();

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
    const decoded = jwt.verify(token, 'SECRET_KEY');

    req.user = decoded; // Set the user data in the request object
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    return res.status(403).json({ error: 'Invalid token' });
  }
};

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  // Find user by email
  const user = users.find(user => user.email == email);
  if (!user) {
    return res.status(401).json({ error: 'User not found!' });
  }

  try {
    const isMatch = await comparePasswords(password, user.password);

    //Compare password using bcrypt
    //bcrypt.compare(password, user.password)
    //.then(isMatch => {
    if (!isMatch) {
      return res.status(401).json({ error: 'Incorrect password!' });
    }

    // Generate JWT token
    const token = jwt.sign({ userIdentifier: user.email }, 'SECRET_KEY', { expiresIn: '1h' });

    res.status(200).json({ token });
  }
  catch (error) {
    res.status(500).send(error.message);
  }
  //})
  //.catch(error => res.status(500).json({ error }));
});

async function generateHashedPassword(plainPassword) {
  try {
    //fiwedsalt is the cost factor (rounds nb) if it's a number; it's a salt otherwise
    const hashedPassword = await bcrypt.hash(plainPassword, fixedsalt);
    //console.log('Hashed password:', hashedPassword);

    /* // Comparing passwords
    const isMatch = await bcrypt.compare("plainPassword", hashedPassword);
    if (isMatch) {
      console.log('Password match!');
    } else {
      console.log('Password does not match!');
    } */

    // Return the hashedPassword
    return hashedPassword;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

async function comparePasswords(plainPassword, hashedPassword) {
  try {
    const isMatch = await bcrypt.compare(plainPassword, hashedPassword);
    return isMatch;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

// Protected Route
//to test it in postman => in the request header section, add a new header with the key : 'Authorization' and the value : 'your_token_here'; 'your_token_here' => the string in token object
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
app.listen(3005, () => {
  console.log('Server started on port 3005');
});
