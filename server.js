const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphs = require('express-handlebars');
const path = require('path');
const ConnectDB = require('./config/db');
const connectDB = require('./config/db');
const app = express();

// load environmental variables
dotenv.config({
    path:'./config/config.env'
})

// express setup
app.use(express.json());
app.use(express.urlencoded({
    extended:'false'
}));

// handlebars setup
app.engine('.hbs', exphs({
    defaultLayout:'main',
    extname:'.hbs'
}));
app.set('view engine', '.hbs')

// static folder
app.use(express.static(path.join(__dirname, "public")));

// DB connection
connectDB();

app.get('/',(req, res) => {
    res.send('HEllO from Homepage');
})


// morgan config
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}
// load port
const port = process.env.PORT || 8000;
app.listen(port, () => {
    console.log(`Server started on Port  ${port}`);
});
