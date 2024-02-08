const express = require('express');
const app = express();
const port = 5500;
const cors = require('cors');
const pool = require('./config/database')

const bodyparser = require('body-parser');
const authenticateRouter = require('./routes/authenticate');
const nutritionRouter = require('./routes/nutrition')
const calculatorRouter = require('./routes/calculator');

app.use(bodyparser.json());
app.use(cors());
app.use('/authenticate', authenticateRouter);
app.use('/nutrition', nutritionRouter);
app.use('/calculator', calculatorRouter);

app.get('/', (req, res) => {
    res.send('Hello');
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});