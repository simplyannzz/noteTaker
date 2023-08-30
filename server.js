const express = require('express');
const path = require('path');
const fs = require('fs');
const { v4: uuidv4 } = require('uuid');

// const { clog } = require('./middleware/clog');
const notes = require('./routes/notesRoutes.js');
const {
    readFromFile,
    readAndAppend,
    writeToFile,
} = require('./helpers/fsUtils');

const PORT = process.env.PORT || 3001;

const app = express();

// Import custom middleware, "clog"
// app.use(clog);

// Middleware for parsing JSON and urlencoded form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/notes', notes);

app.use(express.static('public'));

// GET Route for homepage
app.get('/', (req, res) =>
    res.sendFile(path.join(__dirname, './public/index.html'))
);

// GET Route for notes page
app.get('/notes', (req, res) =>
    res.sendFile(path.join(__dirname, './public/notes.html'))
);
app.get('/api/notes', (req, res) => {
    // res.sendFile(path.join(__dirname, './db/db.json'))
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});
app.post('/api/notes', (req, res) => {
    console.log("Hello", req.body)
    const { title, text } = req.body;

    const newNotes = {
        title,
        text,
        id: uuidv4(),
    };

    fs.readFile('./db/db.json', 'utf8', (err, data) => {
        if (err) {
            console.error(err);
        } else {
            const parsedData = JSON.parse(data);
            parsedData.push(newNotes);
            console.log(parsedData)
            fs.writeFile('./db/db.json', JSON.stringify(parsedData, null, 4), (err) =>
                err ? console.error(err) : console.info(`\nData written to db.json`)
            );
        }
    });
});

// delete
app.delete('/api/notes/:id', (req, res) => {
    const notesId = req.params.id;
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            const result = json.filter((notes) => notes.id !== notesId);

            // Save that array to the filesystem
            writeToFile('./db/db.json', result);

            // Respond to the DELETE request
            res.json(`Item ${notesId} has been deleted 🗑️`);
        });
});
app.listen(PORT, () =>
    console.log(`App listening at http://localhost:${PORT}`)
);