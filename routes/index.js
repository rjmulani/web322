const express = require("express");
const router = express.Router();
const { fetchFile } = require("../services/helpers");
const users = require("../user.json");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const fs = require("fs");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const uri =
  "mongodb+srv://rutvik:rutvik123@cluster0.aazvz.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
let temp = {};

router.get("/", function (req, res) {
  res.render("login");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (users[email]) {
    if (users[email] && users[email] === password) {
      req.session.user = email;
      const galleryCollection = client.db("dbs311").collection("Gallery");
      await galleryCollection.updateMany({}, { $set: { STATUS: "a" } });
      res.redirect("/gallary");
    } else {
      res.render("login", { message: "Invalid email or password." });
    }
  } else {
    res.render("login", { message: "Invalid email or password." });
  }
});
router.get("/register", (req, res) => {
  res.render("register");
});
router.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;
  if (!email || !password || !confirmPassword) {
    return res.render("register", {
      errorMessage: "Please enter a valid email and password.",
    });
  } else if (password !== confirmPassword) {
    return res.render("register", { errorMessage: "Passwords do not match." });
  }
  if (users[email]) {
    return res.render("register", { errorMessage: "Email already exists." });
  }
  users[email] = password;
  fs.writeFile("./user.json", JSON.stringify(users, null, 2), (err) => {
    if (err) {
      console.error(err);
      return res.render("register", { errorMessage: "Error saving user." });
    }
    console.log(`User ${email} saved to user.json`);
    req.session.user = email;
    res.redirect("/gallary");
  });
});
router.get("/gallary", async (req, res) => {
  try {
    const galleryCollection = client.db("dbs311").collection("Gallery");
    const galleryItems = await galleryCollection.find({}).toArray();
    res.render("gallary", { email: req.session.user, galleryItems });
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("Error retrieving gallery items");
  }
});

router.put("/products/:productId", async (req, res) => {
  console.log("buy end point hitted");
  try {
    const id = new ObjectId(req.params.productId);
    const newStatus = req.body.status;

    const galleryCollection = client.db("dbs311").collection("Gallery");
    const result = await galleryCollection.updateOne(
      { _id: id },
      { $set: { STATUS: newStatus } }
    );
    res.status(200).json(result);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error updating product status." });
  }
});
router.get("/order/:id", async (req, res) => {
  try {
    const galleryCollection = client.db("dbs311").collection("Gallery");
    const id = new ObjectId(req.params.id);

    const product = await galleryCollection.findOne({ _id: id });
    if (!product) {
      res.status(404).send("Product not found");
      return;
    }
    res.render("orderPurchase", {
      productId: product._id.toString(),
      imageSrc: product.FILENAME,
      imageName: product.DESCRIPTION,
      imageDescription: product.DESCRIPTION,
      imagePrice: product.PRICE,
    });
  } catch (err) {
    console.log(err.stack);
    res.status(500).send("Error retrieving product information");
  }
});

module.exports = router;
