require('dotenv').config()
const express = require('express')
const app = express()
const routesRegister = require('./routes/auth.js')
const routesUser = require('./routes/users.js')
const routesProduct = require('./routes/product.js')
const routesCart = require('./routes/cart.js')
const routesOrder = require('./routes/order.js')
const port = 3040;
const connectDB = require('./database/database.js')
const cors = require('cors')
const path = require('path')
const { tokenAuthorizationOnlyAdmin } = require('./Controllers/verifyToken.js');
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const User = require('./models/User.js');


const session = require('express-session');
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production' // Adjust this based on your environment
    }
}));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', './views'); // Set the views directory

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// Setting up static files directory without redeclaring __dirname
app.use(express.static(path.join(__dirname, 'public')));



app.use(express.json());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});


mongoose.connect('mongodb+srv://ahmedmokhtar2407:1234@cluster1.0ddauuc.mongodb.net/ecommerce')
    .then(console.log('database is connected'))
    .catch((err) => {
        console.log('connection error')
    })


app.use('/auth',routesRegister);
app.use('/user',routesUser);
app.use('/product',routesProduct)
app.use('/cart',routesCart)
app.use('/order',routesOrder)

app.get('/', async (req, res) => {
    try {
        const featuredProducts = await Product.find({ featured: true }).limit(10);
        res.render('index', { featuredProducts });
    } catch (error) {
        console.error('Failed to fetch featured products:', error);
        res.status(500).render('index', { featuredProducts: [] });
    }
});


// Render the login page
app.get('/login', (req, res) => {
    res.render('login', { error: null });
});

app.post('/login', async (req, res) => {
    const { username, password } = req.body;  // Now correctly expecting 'username' instead of 'email'
    try {
        const user = await User.findOne({ username });  // Make sure the 'username' field matches your database schema, or adjust as needed.
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).render('login', { error: 'Invalid username or password' }); // Use return to stop execution here
        }
        // Assuming session or token setup
        req.session.user = user; // Example of setting the user in the session
        res.redirect('/'); // Redirect to a dashboard or appropriate route
    } catch (error) {
        res.status(500).render('login', { error: 'An error occurred, please try again.' });
    }
});



// Render the signup page
app.get('/signup', (req, res) => {
    res.render('signup', { error: null });
});


app.post('/signup', async (req, res) => {
    const { name, password } = req.body;
    try {
        const existingUser = await User.findOne({ name });
        if (existingUser) {
            return res.status(400).send("The username is already taken");
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({
            name, // This matches the "name" attribute of the input element
            password: hashedPassword
        });
        await newUser.save();
        res.status(201).send("User registered successfully");
    } catch (error) {
        res.status(500).send(error.message);
    }
});





app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username });
        if (!user) {
            res.render('login', { error: 'Invalid username or password' });
            return;
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (passwordMatch) {
            req.session.user = user; // Setting the user in the session
            res.redirect('/dashboard'); // Redirect to a different route upon successful login
        } else {
            res.render('login', { error: 'Invalid username or password' });
        }
    } catch (error) {
        res.render('login', { error: 'An error occurred, please try again.' });
    }
});

app.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.render('product', { products }); // Assuming you have a 'products.ejs' that lists products
    } catch (error) {
        res.status(500).render('error', { message: 'Failed to retrieve products.' });
    }
});

// Render a form for adding a new product
app.get('/products/new', tokenAuthorizationOnlyAdmin, (req, res) => {
    res.render('add_product'); // Assuming you have an 'add_product.ejs' template
});

// Process the form submission for a new product
app.post('/products', tokenAuthorizationOnlyAdmin, async (req, res) => {
    try {
        const newProduct = await Product.create(req.body);
        res.redirect('/products');
    } catch (error) {
        res.status(500).render('add_product', { message: 'Failed to add product.', form: req.body });
    }
});

// Render a form for updating a product
app.get('/products/edit/:id', tokenAuthorizationOnlyAdmin, async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            res.status(404).render('404', { message: 'Product not found.' });
        } else {
            res.render('edit_product', { product }); // Assuming an 'edit_product.ejs' template
        }
    } catch (error) {
        res.status(500).render('error', { message: 'Failed to load product for editing.' });
    }
});

// Process the form submission for updating the product
app.post('/products/edit/:id', tokenAuthorizationOnlyAdmin, async (req, res) => {
    try {
        const { id } = req.params;
        await Product.findByIdAndUpdate(id, { $set: req.body }, { new: true });
        res.redirect('/products');
    } catch (error) {
        res.status(500).render('edit_product', { message: 'Failed to update product.', product: req.body });
    }
});

app.post('/products/delete/:id', tokenAuthorizationOnlyAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.redirect('/products');
    } catch (error) {
        res.status(500).render('products', { message: 'Failed to delete product.' });
    }
});


app.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Excludes passwords from the result
        res.render('users', { users }); // Assuming you have a 'users.ejs' to list users
    } catch (error) {
        res.status(500).render('error', { message: 'Failed to retrieve users.' });
    }
});



app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            res.status(404).render('404', { message: 'User not found.' });
        } else {
            res.render('user_detail', { user }); // Assuming a 'user_detail.ejs'
        }
    } catch (error) {
        res.status(500).render('error', { message: 'Failed to fetch user details.' });
    }
});


app.post('/users/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        ).select('-password');
        res.redirect('/users/' + req.params.id); // Redirect back to the user detail page
    } catch (error) {
        res.status(500).render('user_edit', { user: req.body, error: 'Failed to update user.' }); // Assuming 'user_edit.ejs'
    }
});


app.post('/users/delete/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/users'); // Redirect back to the users list
    } catch (error) {
        res.status(500).render('users', { error: 'Failed to delete user.' });
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Excludes passwords from the result
        res.render('users', { users }); // Assuming you have a 'users.ejs' to list users
    } catch (error) {
        res.status(500).render('error', { message: 'Failed to retrieve users.' });
    }
});

app.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');
        if (!user) {
            res.status(404).render('404', { message: 'User not found.' });
        } else {
            res.render('user_detail', { user }); // Assuming a 'user_detail.ejs'
        }
    } catch (error) {
        res.status(500).render('error', { message: 'Failed to fetch user details.' });
    }
});


app.post('/users/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true, runValidators: true }
        ).select('-password');
        res.redirect('/users/' + req.params.id); // Redirect back to the user detail page
    } catch (error) {
        res.status(500).render('user_edit', { user: req.body, error: 'Failed to update user.' }); // Assuming 'user_edit.ejs'
    }
});

app.post('/users/delete/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/users'); // Redirect back to the users list
    } catch (error) {
        res.status(500).render('users', { error: 'Failed to delete user.' });
    }
});



app.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find();
        res.render('orders', { orders }); // Assuming 'orders.ejs' lists all orders
    } catch (error) {
        res.status(500).render('error', { message: 'Failed to retrieve orders.' });
    }
});


app.get('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            res.status(404).render('404', { message: 'Order not found.' });
        } else {
            res.render('order_detail', { order }); // Assuming 'order_detail.ejs' for single order view
        }
    } catch (error) {
        res.status(500).render('error', { message: 'Failed to fetch order details.' });
    }
});


app.post('/orders', async (req, res) => {
    try {
        const newOrder = await Order.create(req.body); // Make sure body correctly structures the Order schema
        res.redirect('/orders'); // Redirect to orders list or to the new order's page
    } catch (error) {
        res.status(500).render('order_form', { error: 'Failed to create order.', form: req.body });
    }
});


app.post('/orders/:id', async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { $set: req.body },
            { new: true }
        );
        res.redirect('/orders/' + req.params.id); // Redirect to the updated order's detail page
    } catch (error) {
        res.status(500).render('order_edit', { error: 'Failed to update order.', order: req.body, orderId: req.params.id });
    }
});


app.post('/orders/delete/:id', async (req, res) => {
    try {
        await Order.findByIdAndDelete(req.params.id);
        res.redirect('/orders'); // Redirect back to the orders list
    } catch (error) {
        res.status(500).render('orders', { error: 'Failed to delete order.' });
    }
});






app.listen(5000, () => {
    console.log('Server is running on port 5000');
});

// const start = async() => {
//     try {
//     connectDB()
//         app.listen(port , console.log('server is connceted'))
//     } catch (error) {
//         console.log('server is not connected')
//     }
// }

