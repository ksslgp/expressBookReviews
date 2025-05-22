const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  //Write your code here
  const { username, password } = req.body;
  // Check if username already exists
  if (!username || !password) {
    return res.status(400).json({ message: "Unable to register user. Please provide username and password." });
  }
  if (isValid(username)) {
    users.push({ username: username, password: password });
    return res.status(200).json({ message: "User successfully registered. Now you can login." });
  } else {
    return res.status(401).json({ message: "User already exists!" });
  }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  //Task 10, with Promise
  new Promise((resolve, reject) => {
    resolve(books);
  })
    .then(data => res.status(200).send(JSON.stringify(data, null, 4)))
    .catch(err => res.status(500).json({ message: "Error fetching books" }));

  /*Task 1 without Promise 
  return res.status(200).send(JSON.stringify(books, null, 4));
  */
});

// Get book details based on ISBN


public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  //Task 11, with async-await
   new Promise ((resolve, reject) => {
    const isbnArray = Object.keys(books);
    let target_key = isbnArray.find((key) => key === isbn);
    // Check if the book with the given ISBN exists
    if (!target_key) {
      reject({ message: "ISBN not found" });
    }
    resolve(books[target_key]);
  })
  .then((data) => res.status(200).send(JSON.stringify(data))) 
  .catch((error) => res.status(404).json({ message: "ISBN not found" }));
  
  
  /* Task 2, without Promise
  const isbn = req.params.isbn;  
  let isbnArray = Object.keys(books);
  let target_key = isbnArray.find((key)=>key === isbn);
      // Check if the book with the given ISBN exists
  if (!target_key) {
    res.status(404).json({message: "ISBN not found"});
  }  
  res.status(200).send(JSON.stringify(books[target_key]));
  */
});


// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  //Task 12 using Promise
  new Promise((resolve, reject) => {
    let bookArray = Object.values(books).filter((element) => { return element.author === author });
    // Check if the book with the given author exists
    if (bookArray.length === 0) {
      reject({ message: "Author not found" });
    }
    resolve(bookArray);
  })
    .then((data) => res.status(200).send(JSON.stringify(data)))
    .catch((error) => res.status(404).json({ message: "Author not found" }));
  
  /*Task 3 -- without Promise
  const author = req.params.author;
  let bookArray = Object.values(books).filter((element) => { return element.author === author });
  if (bookArray.length === 0) {
    res.status(404).json({ message: "Author not found" });
  }
  return res.status(200).send(JSON.stringify(bookArray));
  */
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  //Task 13 using Promise
  new Promise((resolve, reject) => {
    let booktitleArray = Object.values(books).filter((element) => { return element.title === title });
    // Check if the book with the given title exists
    if (booktitleArray.length === 0) {
      reject({ message: "Title not found" });
    }
    resolve(booktitleArray);
  })
    .then((data) => res.status(200).send(JSON.stringify(data)))
    .catch((error) => res.status(404).json({ message: "Title not found" }));
/*
  const title = req.params.title;
  let booktitleArray = Object.values(books).filter((element) => { return element.title === title });
  // Check if the book with the given title exists
  if (booktitleArray.length === 0) {
    res.status(404).json({ message: "Title not found" });
  }
  return res.status(200).send(JSON.stringify(booktitleArray));
  */
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  let isbnArray = Object.keys(books);
  let target_key = isbnArray.find((key) => key === isbn);

  // Check if the book with the given ISBN exists
  if (!target_key) {
    res.status(404).json({ message: "ISBN not found" });
  }
  res.status(200).send(JSON.stringify(books[target_key].reviews));
});

module.exports.general = public_users;
