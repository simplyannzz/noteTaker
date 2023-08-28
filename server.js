const express = require('express');
const { clog } = require('./middleware/clog');
const apiRoute = require('./routes/api.js');
const htmlRoute = require('./routes/html.js');


const PORT = process.env.PORT || 3001;
const app = express();

// Import custom middleware, "cLog"
app.use(clog);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));
app.use(apiRoute);
app.use(htmlRoute);


app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);