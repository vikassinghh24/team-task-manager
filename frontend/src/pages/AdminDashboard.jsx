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
      // FIXING ONLY THIS LINE: Adding the missing users endpoint to match userRes
      const [projRes, userRes] = await Promise.all([
        axios.get('/api/projects', config).catch(() => ({ data: [] })),
        axios.get('/api/users', config).catch(() => ({ data: [] }))
      ]);
      setProjects(projRes.data);
      setUsers(userRes.data);
    } catch (err) { console.error(err); }
  };

  // Automatically load data when the component loads
  useEffect(() => {
    fetchData();
  }, []);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/projects', { name: projectName }, config);
      setProjectName('');
      fetchData();
    } catch (err) { console.error(err); }
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/tasks', taskData, config);
      setTaskData({ title: '', description: '', assignedTo: '', project: '' });
      alert('Task Created Successfully');
    } catch (err) { console.error(err); }
  };

  // Your exact original return statement goes below here unchanged...
  return (
    <div style={{ padding: '20px' }}>
      <h1>Admin Dashboard</h1>

      {/* Create Project */}
      <div>
        <h3>Create Project</h3>
        <form onSubmit={handleCreateProject}>
          <input
            type="text"
            placeholder="Project Name"
            value={projectName}
            onChange={(e) => setProjectName(e.target.value)}
            required
            style={{ color: '#000', marginRight: '10px' }}
          />
          <button type="submit">Create Project</button>
        </form>
      </div>

      {/* Create Task */}
      <div style={{ marginTop: '20px' }}>
        <h3>Create Task</h3>
        <form onSubmit={handleCreateTask}>
          <input
            type="text"
            placeholder="Task Title"
            value={taskData.title}
            onChange={(e) => setTaskData({ ...taskData, title: e.target.value })}
            required
            style={{ color: '#000', display: 'block', marginBottom: '10px' }}
          />
          <textarea
            placeholder="Task Description"
            value={taskData.description}
            onChange={(e) => setTaskData({ ...taskData, description: e.target.value })}
            required
            style={{ color: '#000', display: 'block', marginBottom: '10px' }}
          />
          
          <select
            value={taskData.assignedTo}
            onChange={(e) => setTaskData({ ...taskData, assignedTo: e.target.value })}
            required
            style={{ color: '#000', display: 'block', marginBottom: '10px' }}
          >
            <option value="">Assign To</option>
            {users && users.map((user) => (
              <option key={user._id} value={user._id}>
                {user.name}
              </option>
            ))}
          </select>

          <select
            value={taskData.project}
            onChange={(e) => setTaskData({ ...taskData, project: e.target.value })}
            required
            style={{ color: '#000', display: 'block', marginBottom: '10px' }}
          >
            <option value="">Select Project</option>
            {projects && projects.map((proj) => (
              <option key={proj._id} value={proj._id}>
                {proj.name}
              </option>
            ))}
          </select>

          <button type="submit">Create Task</button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;