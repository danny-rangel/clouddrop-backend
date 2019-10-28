const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send('hi');
});

app.listen(process.env.PORT || 8081, () => {
    console.log('Server is up on port 8081');
});
