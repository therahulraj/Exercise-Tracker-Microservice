const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const {ObjectID} = require('mongodb');
const mongoose = require('./db/mongoose');
const {User} = require('./models/User');
const _ = require('lodash');

var port = process.env.PORT || 3000;

var app = express();
app.use(cors());
app.use(bodyParser.json());
var urlencodedParser = bodyParser.urlencoded({extended: false });
app.use(express.static(path.join(__dirname, '..', 'public')));



app.get('/', (req, res) => {
  res.status(200).sendFile(path.join(__dirname, '..', 'public', 'index.html'));
});


app.post('/api/exercise/new-user', urlencodedParser, (req, res) => {
  var username = _.pick(req.body, ['username']);
  var user = new User(username);
  user.save().then((user) => {
    res.status(200).send(_.pick(user, ['_id', 'username']));
  }).catch((e) => {
    res.status(400).send(e);
  })
});

app.post('/api/exercise/add', urlencodedParser, (req, res) => {
  console.log(req.body);
  var id = req.body.userid;
  var typeStr = "";
  var nullStr = "";
  var details = _.pick(req.body, ['description', 'duration', 'date']);
  var mydate = new Date(details.date);

  if(!ObjectID.isValid(id)) {
    return res.status(400).send('unknown _id');
  }
 Object.keys(details).forEach(function(d) {
   if(details[d].replace(/\s/g,'') == '') {
    nullStr += `path ${d} is required <br>`;
   }
 });
 if (nullStr != '') {
   return res.status(400).send(nullStr);
 }

  if (mydate.toDateString() === 'Invalid Date') {
    typeStr += `cast to Date for value ${details.date} at path date <br>`;
  } if (typeof JSON.parse(details.duration) != 'number') {
    typeStr += `cast to number for value ${details.duration} at path duration <br>`;
  } if (typeStr.length != 0) {
    return res.status(400).send(typeStr);
  }
  details.date = mydate.toDateString();

  User.findOneAndUpdate({_id: id}, {$set: details}, {new: true}).then((detail) => {
    if(!detail) {
      return res.status(404).send('user id not found');
    }
    res.status(200).send(detail);
  }).catch((e) => {
    res.status(400).send(e);
  })

})

app.listen(port, () => {
  console.log(`we are on port ${port}`);
})
