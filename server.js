const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const exphs = require('express-handlebars');
const path = require('path');
const app = express();
const db = require('./models');

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


app.get('/',(req, res) => {
    res.send('HEllO from Homepage');
})
app.use('/user', require('./routes/users'));


// morgan config
if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev"));
}
// load port
const port = process.env.PORT || 8000;
db.sequelize.sync()
.then(() => {
    app.listen(port, () => {
        console.log(`Server started on Port  ${port}`);
    });
})
.catch(err => {
    console.error(err);
})

