import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [employees, setEmployees] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    salary: '',
    state: '',
  });

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      const response = await axios.get('/employees');
      setEmployees(response.data);
    } catch (error) {
      console.error('Error fetching employee data:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('/add', formData);
      fetchEmployeeData();
      setFormData({
        name: '',
        position: '',
        salary: '',
        state: '',
      });
    } catch (error) {
      console.error('Error saving employee data:', error);
    }
  };

  return (
    <div style={{ maxWidth: '600px', margin: 'auto' }}>
      <h1>Employee Information Form</h1>

      <form
        onSubmit={handleSubmit}
        style={{ marginBottom: '20px', backgroundColor: '#f2f2f2', padding: '10px', borderRadius: '5px' }}
      >
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            style={{ marginLeft: '10px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="position">Position:</label>
          <input
            type="text"
            id="position"
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            required
            style={{ marginLeft: '10px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="salary">Salary:</label>
          <input
            type="number"
            id="salary"
            name="salary"
            value={formData.salary}
            onChange={handleInputChange}
            required
            style={{ marginLeft: '10px' }}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="state">State:</label>
          <input
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            required
            style={{ marginLeft: '10px' }}
          />
        </div>

        <button
          type="submit"
          style={{ backgroundColor: 'blue', color: 'white', padding: '8px 16px', borderRadius: '5px', cursor: 'pointer' }}
        >
          Submit
        </button>
      </form>

      <h1>Employee Information</h1>
      <table
        style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px', borderRadius: '5px', overflow: 'hidden' }}
      >
        <thead>
          <tr style={{ backgroundColor: '#f2f2f2' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Position</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>Salary</th>
            <th style={{ border: '1px solid #ddd', padding: '8px' }}>State</th>
          </tr>
        </thead>
        <tbody>
          {employees.map((employee) => (
            <tr key={employee.id}>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{employee.name}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{employee.position}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{employee.salary}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px' }}>{employee.state}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
