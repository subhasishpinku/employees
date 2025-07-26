require('dotenv').config(); // ✅ Load env variables

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user.routes');
const authRoutes = require('./routes/auth.routes');
const Employee = require('./models/Employee');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// 👨‍💼 Employee Routes
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

// 👤 Auth/User Routes
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
