const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user.routes');

const Employee = require('./models/Employee');

const app = express();
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://pinkusubhasish:subhasish1302006649@cluster0.lq9sywk.mongodb.net/employees', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Routes
app.get('/api/employees', async (req, res) => {
  const employees = await Employee.find();
  res.json(employees);
});

app.post('/api/employees', async (req, res) => {
  const { name, email, position } = req.body;
  const newEmployee = new Employee({ name, email, position });
  await newEmployee.save();
  res.json(newEmployee);
});

app.put('/api/employees/:id', async (req, res) => {
  const { name, email, position } = req.body;
  const updated = await Employee.findByIdAndUpdate(
    req.params.id,
    { name, email, position },
    { new: true }
  );
  res.json(updated);
});

app.delete('/api/employees/:id', async (req, res) => {
  await Employee.findByIdAndDelete(req.params.id);
  res.json({ message: 'Employee deleted' });
});
app.use('/api/users', userRoutes);

app.listen(5000, () => console.log('Server running on port 5000'));
