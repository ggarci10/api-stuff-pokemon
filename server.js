const express = require('express');

const app = express();
const port = 8888;

//const mongo = require('./db/index.js');

const search = require('./routes/search.js');
const history = require('./routes/history.js');


app.use('/search', search);
app.use('/history', history);

// start the server
app.listen(port, async () => {
    console.log(`Server is listening on port ${port}`);
   // await mongo.connect();
});
