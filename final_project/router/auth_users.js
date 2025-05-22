const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ username: "lovelyreader", password: "ilovebooks" }, { username: "user123", password: "3357!57ei" }];

const isValid = (username) => {
  //returns boolean
  const filtered_user = users.filter(user => user.username === username);
  if (filtered_user.length === 0) {
    return true;
  } else {
    return false;
  }
}

const authenticatedUser = (username, password) => {
  //returns boolean
  //check if username and password match the one we have in records.
  let found = users.find((user) => user.username === username && user.password === password);
  if (!found) {
    return false;
  } else {
    return true;
  }
}


//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here

  const { username, password } = req.body;


  if (username && password) {
    // Check if the password is valid
    if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({ data: password }, 'access', { expiresIn: 60 * 60 });
      req.session.authorization = { accessToken, username };
      return res.status(200).send("User successfully logged in");
    } else {
      return res.status(208).json({ message: "Invalid login" });
    }
  } else {
    return res.status(404).json({ message: "Error logging in" });
  }
});


// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  let username = req.session.authorization.username;
  let comment = req.query.review;

  if (!req.session.authorization || !req.session.authorization.username) {
    return res.status(401).json({ message: "User not authenticated" });
  }


  if (!isbn || !comment) {
    return res.status(400).json({ message: "ISBN and review are required" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "ISBN not found" });
  }

  // Add or update the review
  books[isbn].reviews[username] = comment;

  return res.status(200).json({ message: "Review added/updated successfully" });
}
);


// Delete a book review
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  let username = req.session.authorization.username;


  if (!req.session.authorization || !req.session.authorization.username) {
    return res.status(401).json({ message: "User not authenticated" });
  }
  if (!isbn) {
    return res.status(400).json({ message: "ISBN are required" });
  }

  if (!books[isbn]) {
    return res.status(404).json({ message: "ISBN not found" });
  }
  if (!books[isbn].reviews[username]) {
    return res.status(404).json({ message: "Review not found" });
  } else {
    delete books[isbn].reviews[username];
    return res.status(200).json({ message: "Review deleted successfully" });
  }
})

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
