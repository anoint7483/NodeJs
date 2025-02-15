const express = require('express');
const mongoose = require('mongoose');
const Blog = require('./models/blog'); // Fix the path to the Blog model

// express app
const app = express();

// connect to mongodb
const dbURI = 'mongodb+srv://yabhishek:anoint2050@nodelearn.vgebc.mongodb.net/node-learn?retryWrites=true&w=majority&appName=nodelearn';
mongoose.connect(dbURI)
  .then((result) => {
    console.log('Connected to MongoDB');
    // listen for requests
    app.listen(3000, () => {
      console.log('Server is running on port 3000');
    });
  })
  .catch((err) => console.log(err));

// register view engine
app.set('view engine', 'ejs');

// mongoose and mongo sandbox routes
// app.get('/add-blog', (req, res) => {
//   const blog = new Blog({
//     title: 'New Blog 2',
//     snippet: 'About my new blog',
//     body: 'More about my new blog'
//   });
  
//   blog.save()
//     .then((result) => {
//       res.send(result);
//     })
//     .catch((err) => {
//       console.log(err);
//     });
// });

app.get('/all-blogs', (req, res) =>{
    Blog.find()
    .then((result) => {
        res.send(result);
    })
    .catch((err) =>{
        console.log(err);
    });
})
app.get('/single-blog', (req, res) =>{
    Blog.findById('67b06ffbc86e7073c26a4a26')
    .then((result) => {
        res.send(result);
    })
    .catch((err) =>{
        console.log(err);
    });
})

// middleware to log requests
app.use((req, res, next) => {
  console.log('New request made:');
  console.log('Host: ', req.hostname);
  console.log('Path: ', req.path);
  console.log('Method: ', req.method);
  next();
});

app.get('/', (req, res) => {
  const blogs = [
    { title: 'Yoshi finds eggs', snippet: 'Lorem ipsum dolor sit amet consectetur' },
    { title: 'Mario finds stars', snippet: 'Lorem ipsum dolor sit amet consectetur' },
    { title: 'How to defeat Bowser', snippet: 'Lorem ipsum dolor sit amet consectetur' },
  ];
  res.render('index', { title: 'Home', blogs });
});

app.get('/', (req, res) => {
  res.redirect('/blogs');
});

app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

//blog routes
app.get('/blogs', (req, res) =>{
    Blog.find()
    .then((result) => {
        res.render('index', {title: 'All blogs', blogs: result} );
    })
    .catch((err) =>{
        console.log(err);
    });
})

app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new blog' });
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});
