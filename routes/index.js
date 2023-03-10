const express = require('express');
const router = express.Router();
const { fetchFile } = require('../services/helpers');
const users = require('../user.json');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const fs = require('fs');

let temp = {}

router.get('/', function (req, res) {
  res.render('login');
});

router.get('/login', (req, res) => {
  res.render('login');
});

router.post('/login', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (users[email]) {
    // bcrypt.compare(password, users[email], (err, result) => {
      if (users[email] && users[email] === password) {
        req.session.user = email;
        res.redirect('/gallary');
      } else {
        res.render('login', { message: 'Invalid email or password.' });
      }
    // });
  } else {
    res.render('login', { message: 'Invalid email or password.' });
  }
});
router.get('/register', (req, res) => {
  res.render('register');
});
router.post('/register', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  // Check if email and password are valid
  if (!email || !password || !confirmPassword) {
    return res.render('register', { errorMessage: 'Please enter a valid email and password.' });
  } else if (password !== confirmPassword) {
    return res.render('register', { errorMessage: 'Passwords do not match.' });
  }

  // Check if user already exists
  if (users[email]) {
    return res.render('register', { errorMessage: 'Email already exists.' });
  }

  // Save user to user.json
  users[email] = password;
  fs.writeFile('./user.json', JSON.stringify(users, null, 2), (err) => {
    if (err) {
      console.error(err);
      return res.render('register', { errorMessage: 'Error saving user.' });
    }
    console.log(`User ${email} saved to user.json`);
    req.session.user = email;
    res.redirect('/gallary');
  });
});
router.get('/gallary', (req, res) => {
  if (req.session.user) {
    const email = req.session.user;
    fetchFile()
      .then(({ namesWithExtension, namesWithoutExtension }) => (
        res.render("gallary", {
          title: "My Gallery",
          images: [
            { src: "/images/image1.jpg", alt: "Image 1" },
            { src: "/images/image2.jpg", alt: "Image 2" },
            { src: "/images/image3.jpg", alt: "Image 3" }
          ],
          fileNames: namesWithExtension,
          namesWithoutFileExtension: namesWithoutExtension,
          email: email // pass the email of the logged-in user to the gallery view
        })
      ))
      .catch(err => console.error(err));
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
