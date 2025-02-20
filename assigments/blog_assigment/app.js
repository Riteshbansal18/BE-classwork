const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true })); 
app.use(express.json()); 
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

const postsFile = path.join(__dirname, 'posts.json');

if (!fs.existsSync(postsFile)) {
    fs.writeFileSync(postsFile, JSON.stringify([]));
}

const readPosts = () => {
    try {
        const data = fs.readFileSync(postsFile);
        return JSON.parse(data) || [];
    } catch (error) {
        console.error('Error reading posts.json:', error);
        return [];
    }
};

const writePosts = (posts) => {
    try {
        fs.writeFileSync(postsFile, JSON.stringify(posts, null, 2));
    } catch (error) {
        console.error('Error writing to posts.json:', error);
    }
};

app.get('/', (req, res) => {
    const posts = readPosts();
    res.render('home', { posts });
});

app.get('/post', (req, res) => {
    const posts = readPosts();
    const post = posts.find(p => p.id === parseInt(req.query.id));
    if (post) {
        res.render('post', { post });
    } else {
        res.status(404).send('Post not found');
    }
});

app.get('/add', (req, res) => {
    res.render('addPost');
});

app.post('/add-post', (req, res) => {
    const posts = readPosts();
    const newPost = {
        id: Date.now(), 
        title: req.body.title,
        content: req.body.content
    };
    posts.push(newPost);
    writePosts(posts);
    res.redirect('/');
});

app.delete('/delete-post', (req, res) => {
    const posts = readPosts();
    const updatedPosts = posts.filter(post => post.id !== parseInt(req.query.id));

    if (posts.length === updatedPosts.length) {
        return res.status(404).send("Post not found");
    }

    writePosts(updatedPosts);
    res.status(200).send("Post deleted successfully");
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
