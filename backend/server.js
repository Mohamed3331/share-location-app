const express = require('express')
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose')
const cors = require('cors')

const placesRoutes = require('./routes/places-routes')
const usersRoutes = require('./routes/user-routes');

const app = express()
app.use(cors())
app.use(express.json());

const port = process.env.PORT || 5000;

app.use('/uploads/images', express.static(path.join('uploads', 'images')));

app.use('/api/places', placesRoutes)
app.use('/api/users', usersRoutes);


app.use((req, res) => {
  if (req.file) {
    fs.unlink(req.file.path, err => {
      console.log(err);
    });
  } 

  if (!req.file) {
    console.log('error happened sir');
  }
  
  console.log(req.file);
  res.status(404).send({message: 'wrong route bro'})
})

const uri = 'mongodb+srv://Mohamed:Mo3i2bnm@cluster0.jpvlo.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

mongoose.connect(uri, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true })
const connection = mongoose.connection;
connection.once('open', () => {
  console.log("MongoDB database connection established successfully");
})

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});




