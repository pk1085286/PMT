// Import required modules
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Initialize app
const app = express();

// Set up middleware
app.use(express.json());
app.use(cors());

// Connect to MongoDB database
mongoose.connect('mongodb://localhost/project-tool', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log(err));

// Create user schema
const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Hash password before saving user to database
userSchema.pre('save', async function (next) {
  const user = this;
  if (user.isModified('password')) {
    user.password = await bcrypt.hash(user.password, 10);
  }
  next();
});

// Create user model
const User = mongoose.model('User', userSchema);

// Create authentication routes
app.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = new User({ email, password });
    await user.save();
    const token = jwt.sign({ userId: user._id }, 'secretkey');
    res.send({ token });
  } catch (err) {
    console.log(err);
    res.status(422).send({ error: 'Unable to sign up' });
  }
});

app.post('/signin', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(422).send({ error: 'Invalid email or password' });
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(422).send({ error: 'Invalid email or password' });
  }
  const token = jwt.sign({ userId: user._id }, 'secretkey');
  res.send({ token });
});

// Create project schema
const projectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['Open', 'In Progress', 'Completed'], default: 'Open' },
  dueDate: { type: Date },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
});

// Create project model
const Project = mongoose.model('Project', projectSchema);

// Create project routes
app.post('/projects', async (req, res) => {
  try {
    const { name, description, status, dueDate, assignedTo } = req.body;
    const project = new Project({ name, description, status, dueDate, assignedTo });
    await project.save();
    res.send(project);
  } catch (err) {
    console.log(err);
    res.status(422).send({ error: 'Unable to create project' });
  }
});