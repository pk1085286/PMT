// Create task schema
const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  status: { type: String, enum: ['Open', 'In Progress', 'Completed'], default: 'Open' },
  dueDate: { type: Date },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  project: { type: mongoose.Schema.Types.ObjectId, ref: 'Project' },
});

// Create task model
const Task = mongoose.model('Task', taskSchema);

// Create task routes
app.post('/tasks', async (req, res) => {
  try {
    const { name, description, status, dueDate, assignedTo, projectId } = req.body;
    const task = new Task({ name, description, status, dueDate, assignedTo, project: projectId });
    await task.save();
    res.send(task);
  } catch (err) {
    console.log(err);
    res.status(422).send({ error: 'Unable to create task' });
  }
});

app.get('/tasks', async (req, res) => {
  try {
    const { projectId } = req.query;
    const tasks = await Task.find({ project: projectId }).populate('assignedTo', 'email');
    res.send(tasks);
  } catch (err) {
    console.log(err);
    res.status(422).send({ error: 'Unable to get tasks' });
  }
});

// Start server
app.listen(3000, () => console.log('Server started'));
