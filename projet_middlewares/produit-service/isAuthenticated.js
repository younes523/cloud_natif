const jwt = require('jsonwebtoken');

// Authentication Middleware
const isAuthenticated = (req, res, next) => {
    // Retrieve the token from the request headers
    const token = req.headers.authorization;
    //const token = req.header('Authorization');
    //console.log(token);
    //res.send(token);
    if (!token) {
      return res.status(401).json({ error: 'Token not found' });
    }
  
    try {
      // Verify the token using the secret key
      //verify() => returns the decoded payload or information that was initially encoded within the token
      const decoded = jwt.verify(token, "SECRET_KEY_3");
      console.log(decoded);
      //req.user = decoded; // Set the user data in the request object
      next(); // Continue to the next middleware or route handler
    } catch (error) {
      return res.status(403).json({ error: 'Invalid token' });
    }
  };

  module.exports = isAuthenticated;