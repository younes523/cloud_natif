const express = require('express');
const axios = require('axios'); 
const app = express();
const port = 3001;

// Middleware to parse JSON data => Allow Express to read JSON data sent by the client and put it inside req.body
app.use(express.json()); 

let books = [];
// GET all books
app.get('/books', async (req, res) => {
  res.json(books);
});


// POST a new book
app.post('/books', async (req, res) => {
  const newBook = req.body;
  newBook.id = books.length + 1;
  books.push(newBook);
  console.log(books.length);
  res.status(201).json(newBook);
});

// PUT (update) a book
app.put('/books/:id', async (req, res) => {
  const bookId = parseInt(req.params.id);
  const updatedBook = req.body;

  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    books[bookIndex] = { ...books[bookIndex], ...updatedBook };
    res.json(books[bookIndex]);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// DELETE a book
app.delete('/books/:id', async (req, res) => {
  const bookId = parseInt(req.params.id);

  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    const deletedBook = books.splice(bookIndex, 1)[0];
    res.json(deletedBook);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
