const express = require('express');
const morgan = require('morgan'); 
const mongoose = require('mongoose');
const Blog = require('./models/blog'); // Blog model

// express app
const app = express();

// middleware for parsing form data and JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// connect to MongoDB
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

// serve static files
app.use(express.static('public'));
app.use(morgan('dev'));

// Mongoose and MongoDB sandbox routes
app.get('/add-blog', (req, res) => {
  const blog = new Blog({
    title: 'New Blog 2',
    snippet: 'About my new blog',
    body: 'More about my new blog'
  });

  blog.save()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

// get all blogs
app.get('/all-blogs', (req, res) => {
  Blog.find()
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

// get a single blog by ID
app.get('/single-blog', (req, res) => {
  Blog.findById('67b06ffbc86e7073c26a4a26')
    .then((result) => {
      res.send(result);
    })
    .catch((err) => {
      console.log(err);
    });
});

// redirect to blogs
app.get('/', (req, res) => {
  res.redirect('/blogs');
});

// about page
app.get('/about', (req, res) => {
  res.render('about', { title: 'About' });
});

// blog routes

// get all blogs and display them
app.get('/blogs', (req, res) => {
  Blog.find().sort({ createdAt: -1 })
    .then((result) => {
      res.render('index', { title: 'All Blogs', blogs: result });
    })
    .catch((err) => {
      console.log(err);
    });
});

// handle blog creation
app.post('/blogs', (req, res) => {
  const blog = new Blog(req.body);
  blog.save()
    .then((result) => {
      res.redirect('/blogs');
    })
    .catch((err) => {
      console.log(err);
    });
});

// view a single blog by ID
// Route to create a new blog
app.get('/blogs/create', (req, res) => {
    res.render('create', { title: 'Create a new blog' });
  });
  
  // Route to view a single blog by ID
  app.get('/blogs/:id', (req, res) => {
    const id = req.params.id;
    Blog.findById(id)
      .then(result => {
        if (result) {
          res.render('details', { blog: result, title: 'Blog Details' });
        } else {
          res.status(404).render('404', { title: 'Blog Not Found' });
        }
      })
      .catch(err => {
        console.error(err);
        res.status(404).render('404', { title: 'Blog Not Found' });
      });
  });
  

// delete a blog by ID
app.delete('/blogs/:id', (req, res) => {
  const id = req.params.id;

  Blog.findByIdAndDelete(id)
    .then(result => {
      if (result) {
        res.json({ redirect: '/blogs' });
      } else {
        res.status(404).json({ error: 'Blog not found' });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: 'Failed to delete blog' });
    });
});

// create blog page
app.get('/blogs/create', (req, res) => {
  res.render('create', { title: 'Create a new blog' });
});

// 404 page
app.use((req, res) => {
  res.status(404).render('404', { title: '404' });
});
