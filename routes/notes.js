const notes = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const {
    readFromFile,
    readAndAppend,
    writeToFile,
} = require('../helpers/fsUtils');

notes.get('/', (req, res) => {
    readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

notes.get('/:notes_id', (req, res) => {
    const notesId = req.params.notes_id;
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            const result = json.filter((notes) => notes.notes_id === notesId);
            return result.length > 0
                ? res.json(result)
                : res.json('No notes with that ID');
        });
});

// Delete
notes.delete('/:notes_id', (req, res) => {
    const notesId = req.params.notes_id;
    readFromFile('./db/db.json')
        .then((data) => JSON.parse(data))
        .then((json) => {
            // Make a new array of all tips except the one with the ID provided in the URL
            const result = json.filter((notes) => notes.notes_id !== notesId);

            // Save that array to the filesystem
            writeToFile('./db/db.json', result);

            // Respond to the DELETE request
            res.json(`Item ${notesId} has been deleted 🗑️`);
        });
});
notes.post('/', (req, res) => {
    console.log(req.body);

    const { title, text } = req.body;

    if (req.body) {
        const newNotes = {
            title,
            text,
            tip_id: uuidv4(),
        };

        readAndAppend(newNotes, './db/db.json');
        res.json(`Notes added successfully`);
    } else {
        res.error('Error in adding notes');
    }
});

module.exports = notes;