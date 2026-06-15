import { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]); // To list members for assignment
  const [projectName, setProjectName] = useState('');
  
  // Task Form State
  const [taskData, setTaskData] = useState({
    title: '',
    description: '',
    assignedTo: '',
    project: ''
  });

  const config = { headers: { 'x-auth-token': localStorage.getItem('token') } };

  const fetchData = async () => {
    try {
      const [projRes, userRes] = await Promise.all([
        axios.get('/api/projects')
      ]);
      setProjects(projRes.data);
      setUsers(userRes.data);
    } catch (err) { console.error(err); }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    await axios.get('/api/projects')
    setProjectName('');
    fetchData();
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.get('/api/projects')
      alert('Task Assigned Successfully!');
      setTaskData({ title: '', description: '', assignedTo: '', project: '' });
    } catch (err) { alert('Error creating task'); }
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div style={{ padding: '40px', fontFamily: 'sans-serif', maxWidth: '800px', margin: '0 auto' }}>
      <h1>Admin Control Panel</h1>
      
      {/* SECTION 1: PROJECTS */}
      <section style={{ background: '#f4f4f4', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h3>Create New Project</h3>
        <form onSubmit={handleCreateProject}>
          <input value={projectName} onChange={(e) => setProjectName(e.target.value)} placeholder="Project Name" required />
          <button type="submit">Add Project</button>
        </form>
      </section>

      {/* SECTION 2: TASKS */}
      <section style={{ background: '#eef2ff', padding: '20px', borderRadius: '8px' }}>
        <h3>Assign a New Task</h3>
        <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <input placeholder="Task Title" onChange={e => setTaskData({...taskData, title: e.target.value})} required />
          <textarea placeholder="Description" onChange={e => setTaskData({...taskData, description: e.target.value})} />
          
          <select onChange={e => setTaskData({...taskData, project: e.target.value})} required>
            <option value="">Select Project</option>
            {projects.map(p => <option key={p._id} value={p._id}>{p.name}</option>)}
          </select>

          <input placeholder="Member ID (Paste from MongoDB for now)" onChange={e => setTaskData({...taskData, assignedTo: e.target.value})} required />
          
          <button type="submit" style={{ background: '#4f46e5', color: 'white', padding: '10px' }}>Assign Task</button>
        </form>
      </section>

      <hr />
      <h3>Existing Projects</h3>
      <ul>{projects.map(p => <li key={p._id}><strong>{p.name}</strong></li>)}</ul>
    </div>
  );
};

export default AdminDashboard;