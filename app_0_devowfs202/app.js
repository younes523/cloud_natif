const express = require('express');
const app = express();
const port = 3001;


// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});