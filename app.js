const express = require('express');
const body = require('body-parser');
const mongoose = require('mongoose');
const ejs = require('ejs');
const app = express();

app.set('view engine', 'ejs');
app.use(body.urlencoded({ extended: true }));
app.use(express.static('public'));

app.listen(3000 || process.env.PORT, function () {
	console.log('The server is running');
});

mongoose.connect('mongodb://localhost:27017/wikiDB', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const wikiSchema = mongoose.Schema({
	title: String,
	content: String,
});

const Wiki = mongoose.model('article', wikiSchema);

app.get('/articles/:userInput', function (req, res) {
	Wiki.findOne({ title: req.params.userInput.toUpperCase() }, function (
		err,
		result
	) {
		res.send(result);
	});
});

app.delete('/articles/:userInput', function (req, res) {
	Wiki.deleteOne({ title: req.params.userInput }, function (err, result) {
		res.send(result);
	});
});

app.patch('/articles/:userInput', function (req, res) {
	Wiki.updateOne(
		{ title: req.params.userInput },
		{ $set: { content: 'update successfully' } },
		function (err, result) {
			res.send(result);
		}
	);
});

app.put('/articles/:userInput', function (req, res) {
	Wiki.updateOne(
		{ title: req.params.userInput },
		{ content: 'update successfully again' },
		{ overwrite: true },
		function (err, result) {
			res.send(result);
		}
	);
});

app
	.route('/articles')
	.get(function (req, res) {
		res.send('successfully get');
	})
	.post(function (req, res) {
		const insertData = new Wiki({
			title: req.body.title,
			content: req.body.content,
		});
		insertData.save(function (err) {
			if (!err) {
				res.send('successfully added a new article');
			} else {
				res.send(err);
			}
		});
	})
	.delete(function (req, res) {
		Wiki.deleteMany({ title: 'Jack  Bauer' }, function (err) {
			if (!err) {
				res.send('successfully deleted the article');
			} else {
				res.send(err);
			}
		});
	});
