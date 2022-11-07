import express from 'express';

const app = express();
app.get('/test', (req, res) => {
    res.send('uwu');
})

app.listen(3000, () => console.log(`Listening on http://localhost:3000`))