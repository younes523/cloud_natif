// const { Console } = require('console');
const express = require('express');
const fs = require('fs/promises');
const app = express();
const port = 3002;

// Middleware to parse JSON data
app.use(express.json());

const dataFilePath = './books.json';

// Read books from JSON file
const readBooks = async () => {
  try {
    const jsonData = await fs.readFile(dataFilePath,'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.error('Error reading file:', error);
    return [];
  }
};

// Write books to JSON file
const writeBooks = async (books) => {
  try {
    await fs.writeFile(dataFilePath, JSON.stringify(books, null, 2));
  } catch (error) {
    console.error('Error writing file:', error);
  }
};

// GET all books
app.get('/books', async (req, res) => {
    try{
  const books = await readBooks();
  if(books !== null)
    res.json(books);
  else
        res.send("error in reading file");
  //res.json(books);
    }
    catch(error){
        console.log("erreur : " + error);
    }
});

// POST a new book
app.post('/books', async (req, res) => {
  const books = await readBooks();
  const newBook = req.body;
  newBook.id = books.length + 1;
  books.push(newBook);
  await writeBooks(books);
  res.status(201).json(newBook);
});

// PUT (update) a book
app.put('/books/:id', async (req, res) => {
  const books = await readBooks();
  const bookId = parseInt(req.params.id);
  const updatedBook = req.body;
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    books[bookIndex] = { ...books[bookIndex], ...updatedBook };
    await writeBooks(books);
    res.json(books[bookIndex]);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// DELETE a book
app.delete('/books/:id', async (req, res) => {
  const books = await readBooks();
  const bookId = parseInt(req.params.id);
  const bookIndex = books.findIndex((book) => book.id === bookId);

  if (bookIndex !== -1) {
    const deletedBook = books.splice(bookIndex, 1)[0];
    await writeBooks(books);
    res.json(deletedBook);
  } else {
    res.status(404).json({ message: 'Book not found' });
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
