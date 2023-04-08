const express = require("express");
const expressHandlebars = require("express-handlebars");
const indexRouter = require("./routes/index");
const path = require("path");
const session = require("express-session");
const bodyParser = require("body-parser");
const { MongoClient, ServerApiVersion } = require("mongodb");
const app = express();
const mime = require("mime");
const handlebars = require("handlebars");

handlebars.registerHelper("eq", function (a, b) {
  return a === b;
});
handlebars.registerHelper("json", function (context) {
  return JSON.stringify(context);
});
app.use(express.static(path.join(__dirname, "images")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  session({
    secret: "mySecretKey",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);
app.engine(
  "handlebars",
  expressHandlebars.engine({
    defaultLayout: "main",
  })
);
app.set("view engine", "handlebars");

app.use(express.static("public"));

const uri =
  "mongodb+srv://rutvik:rutvik123@cluster0.aazvz.mongodb.net/?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});
async function createCollection() {
  try {
    await client.connect();

    const galleryCollection = client.db("dbs311").collection("Gallery");

    const galleryItems = [
      {
        FILENAME: "../images/BathroomStuff.jpg",
        DESCRIPTION: "Bathroom Stuff",
        PRICE: 2000,
        STATUS: "A",
      },
      {
        FILENAME: "../images/Cereal.jpg",
        DESCRIPTION: "Cereal",
        PRICE: 2500,
        STATUS: "A",
      },
      {
        FILENAME: "../images/Cones.jpg",
        DESCRIPTION: "Cones",
        PRICE: 3200,
        STATUS: "A",
      },
      {
        FILENAME: "../images/ConesAndGrass.jpg",
        DESCRIPTION: "Cones and grass",
        PRICE: 6700,
        STATUS: "A",
      },
      {
        FILENAME: "../images/Leafs.jpg",
        DESCRIPTION: "Leafs",
        PRICE: 6700,
        STATUS: "A",
      },
      {
        FILENAME: "../images/leafs2.jpg",
        DESCRIPTION: "More Leafs",
        PRICE: 6700,
        STATUS: "A",
      },
      {
        FILENAME: "../images/Matches.jpg",
        DESCRIPTION: "Matches here",
        PRICE: 6700,
        STATUS: "A",
      },
      {
        FILENAME: "../images/Nuts.jpg",
        DESCRIPTION: "Nuts",
        PRICE: 6700,
        STATUS: "A",
      },
      {
        FILENAME: "../images/Peppers.jpg",
        DESCRIPTION: "Huhhh Peppers",
        PRICE: 6700,
        STATUS: "A",
      },
      {
        FILENAME: "../images/Rocks.jpg",
        DESCRIPTION: "Rocks",
        PRICE: 6700,
        STATUS: "A",
      },
    ];

    for (let item of galleryItems) {
      const existingItem = await galleryCollection.findOne({
        FILENAME: item.FILENAME,
      });
      if (!existingItem) {
        await galleryCollection.insertOne(item);
        console.log(`Inserted gallery item with filename ${item.FILENAME}`);
      } else {
        console.log(
          `Gallery item with filename ${item.FILENAME} already exists`
        );
      }
    }

    console.log("Gallery collection created successfully");
  } catch (err) {
    console.log(err.stack);
  } finally {
    await client.close();
  }
}

createCollection().catch(console.dir);
// Express app setup
app.use("/", indexRouter);
app.listen(3000, function () {
  console.log("Express app listening on port 3000!");
});
