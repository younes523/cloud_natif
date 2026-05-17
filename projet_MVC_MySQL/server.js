const express = require('express');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/userRoutes');
const errorHandler = require('./middleware/errorHandler');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());

// Routes
app.use('/users', userRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});


/*******without validator */
// const express = require('express');
// const bodyParser = require('body-parser');
// const userRoutes = require('./routes/userRoutes');
// const errorHandler = require('./middleware/errorHandler');
// require('dotenv').config();

// const app = express();
// const port = process.env.PORT || 3000;

// // Middleware
// app.use(bodyParser.json());

// // Routes
// app.use('/users', userRoutes);

// // Error handling middleware
// app.use(errorHandler);

// // Start server
// app.listen(port, () => {
//     console.log(`Server running on port ${port}`);
// });
