const express = require('express');
const path = require('path');
require('cross-fetch/polyfill');

const app = express();
const host = '127.0.0.1';
const port = 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// serve static css to each route
app.use(express.static(__dirname + '/static'));
app.use('/gallery', express.static(__dirname + '/static'));
app.use('/object', express.static(__dirname + '/static'));

const API_KEY = '6f433300-bafc-11e8-88c5-811c39b2c016';

let comments = [];

// behavior for the index route
app.get('/', (req, res) => {
  const url = `https://api.harvardartmuseums.org/gallery?size=100&apikey=${API_KEY}`;
  fetch(url)
  .then(response => response.json())
  .then(data => {
    res.render('index', {galleries: data.records});
  });
});

// gallery route
app.get('/gallery/:gallery_id', (req, res) => {
  const objsUrl = `https://api.harvardartmuseums.org/object?apikey=${API_KEY}&size=99&gallery=${req.params.gallery_id}`;
  fetch(objsUrl)
  .then(response => response.json())
  .then(data => {
    res.render('gallery', {objs: data.records});
  });
});

// single object route
app.get('/object/:object_id', (req, res) => {
  objUrl = `https://api.harvardartmuseums.org/object?apikey=${API_KEY}&objectnumber=${req.params.object_id}`;
  fetch(objUrl)
  .then(response => response.json())
  .then(data => {
    res.render('object', {obj: data.records, cmnts: comments});
  });
});

app.post('/object/:object_id', (req, res) => {
	getComment(req, result => {
	    comment = result.substring(8).replace("+", " "); // very hacky, not good. why?
	    obj = req.params.object_id;

	    comments.push({
	    	comment: comment,
	    	object: obj
	    });

	    res.redirect(301, `${req.url}`);
	});
})

app.listen(port, host, () => {
  console.log(`Server running on http://${host}:${port}/`);
});

function getComment(request, callback) {
    let text = '';

    request.on('data', chunk => {
        text += chunk;
        console.log(text);
    });
    request.on('end', () => {
        callback(text);
    });
}