const express = require('express');
const app = express();
const cors = require('cors');
const morgan = require('morgan');

app.use(cors());
app.use(morgan('tiny'));
app.use(express.json()); // Use express.json() to enable JSON body parsing
app.use(express.urlencoded({ extended: true }));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server started at ${PORT}`);
});
