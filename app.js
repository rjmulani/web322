const express = require('express');
const expressHandlebars = require('express-handlebars');
const indexRouter = require('./routes/index');
const path = require('path')
const session = require('express-session');
const bodyParser = require('body-parser');

const app = express();
app.use(express.static(path.join(__dirname, 'images')))
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: 'mySecretKey', // replace with your own secret key
  resave: false,
  saveUninitialized: true,
  cookie: { secure: false } // set to true if using HTTPS
}));

app.engine('handlebars', expressHandlebars.engine({
  defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

app.use(express.static('public'));

app.use('/', indexRouter);

app.listen(3000, function () {
  console.log('Express app listening on port 3000!');
});
