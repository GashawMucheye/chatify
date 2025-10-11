import express from 'express';
import colors from 'colors';
import connectDb from './lib/db.js';

const app = express();
const PORT = process.env.PORT || 8080;
connectDb();

app.get('/test', (req, res) => {
  res.send('test the api');
});

app.listen(() =>
  console.log(
    `server running on port:http://localhost:${PORT}`.bgYellow.underline
  )
);
