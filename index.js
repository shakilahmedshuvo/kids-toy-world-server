const express = require('express');
const cors = require('cors');
const port = process.env.PORT || 5000;
const app = express();

// use middle ware
app.use(cors());
app.use(express.json())


app.get('/', (req, res) => {
    res.send('Kids Toy World is running')
});
app.listen(port, () => {
    console.log(`Kids Toy World is running on port: ${port}`);
})