import React, { useEffect, useState } from 'react';
import axios from 'axios';

const API = 'https://employees-2vss.onrender.com/api/employees';

function App() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ name: '', email: '', position: '' });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    const res = await axios.get(API);
    setEmployees(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`${API}/${editingId}`, form);
      setEditingId(null);
    } else {
      await axios.post(API, form);
    }
    setForm({ name: '', email: '', position: '' });
    fetchEmployees();
  };

  const handleEdit = (emp) => {
    setForm(emp);
    setEditingId(emp._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API}/${id}`);
    fetchEmployees();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Employee Manager</h2>

      <form onSubmit={handleSubmit}>
        <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input placeholder="Position" value={form.position} onChange={e => setForm({ ...form, position: e.target.value })} />
        <button type="submit">{editingId ? 'Update' : 'Add'}</button>
      </form>

      <ul>
        {employees.map(emp => (
          <li key={emp._id}>
            {emp.name} | {emp.email} | {emp.position}
            <button onClick={() => handleEdit(emp)}>Edit</button>
            <button onClick={() => handleDelete(emp._id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
