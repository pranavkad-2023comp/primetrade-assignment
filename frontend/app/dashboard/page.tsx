'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';

interface Task {
  _id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
}

interface User {
  name: string;
  email: string;
  role: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editTask, setEditTask] = useState<Task | null>(null);
  const [form, setForm] = useState({ title: '', description: '', status: 'todo' });

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (!stored) { router.push('/'); return; }
    setUser(JSON.parse(stored));
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const { data } = await api.get('/tasks');
      setTasks(data.tasks);
    } catch {
      router.push('/');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(''); setSuccess('');
    try {
      if (editTask) {
        await api.patch(`/tasks/${editTask._id}`, form);
        setSuccess('Task updated! ✅');
      } else {
        await api.post('/tasks', form);
        setSuccess('Task created! ✅');
      }
      setForm({ title: '', description: '', status: 'todo' });
      setShowForm(false);
      setEditTask(null);
      fetchTasks();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error saving task');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this task?')) return;
    try {
      await api.delete(`/tasks/${id}`);
      setSuccess('Task deleted! ✅');
      fetchTasks();
    } catch {
      setError('Error deleting task');
    }
  };

  const handleEdit = (task: Task) => {
    setEditTask(task);
    setForm({ title: task.title, description: task.description, status: task.status });
    setShowForm(true);
  };

  const handleLogout = () => {
    localStorage.clear();
    router.push('/');
  };

  const statusColor = (status: string) => {
    if (status === 'done') return 'bg-green-500/20 text-green-400 border-green-500/30';
    if (status === 'in-progress') return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
    return 'bg-gray-500/20 text-gray-400 border-gray-500/30';
  };

  if (loading) return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center">
      <p className="text-white text-xl">Loading...</p>
    </div>
  );

  return (
    <main className="min-h-screen bg-gray-950 p-6">
      <div className="max-w-4xl mx-auto">

        {/* Navbar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white">PrimeTrade Dashboard</h1>
            <p className="text-gray-400 text-sm">
              Welcome, <span className="text-blue-400">{user?.name}</span>
              <span className="ml-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 text-xs px-2 py-0.5 rounded-full">
                {user?.role}
              </span>
            </p>
          </div>
          <button onClick={handleLogout}
            className="bg-red-600/20 text-red-400 border border-red-500/30 px-4 py-2 rounded-lg hover:bg-red-600/40 transition-all text-sm">
            Logout
          </button>
        </div>

        {/* Alerts */}
        {error && <div className="bg-red-500/10 border border-red-500 text-red-400 rounded-lg p-3 mb-4 text-sm">{error}</div>}
        {success && <div className="bg-green-500/10 border border-green-500 text-green-400 rounded-lg p-3 mb-4 text-sm">{success}</div>}

        {/* Add Task Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-white font-semibold text-lg">My Tasks ({tasks.length})</h2>
          <button
            onClick={() => { setShowForm(!showForm); setEditTask(null); setForm({ title: '', description: '', status: 'todo' }); }}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all">
            {showForm ? 'Cancel' : '+ New Task'}
          </button>
        </div>

        {/* Task Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-gray-900 border border-gray-800 rounded-xl p-6 mb-6 space-y-4">
            <h3 className="text-white font-semibold">{editTask ? 'Edit Task' : 'Create New Task'}</h3>
            <input
              type="text" placeholder="Task title" required
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
            />
            <textarea
              placeholder="Description (optional)"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 resize-none"
              rows={2}
            />
            <select
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
              className="w-full bg-gray-800 text-white border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500"
            >
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
            </select>
            <button type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all">
              {editTask ? 'Update Task' : 'Create Task'}
            </button>
          </form>
        )}

        {/* Task List */}
        {tasks.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-4xl mb-3">📋</p>
            <p>No tasks yet. Create your first task!</p>
          </div>
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task._id} className="bg-gray-900 border border-gray-800 rounded-xl p-5 flex items-start justify-between hover:border-gray-700 transition-all">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-white font-medium">{task.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColor(task.status)}`}>
                      {task.status}
                    </span>
                  </div>
                  {task.description && <p className="text-gray-400 text-sm">{task.description}</p>}
                </div>
                <div className="flex gap-2 ml-4">
                  <button onClick={() => handleEdit(task)}
                    className="bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 px-3 py-1 rounded-lg text-xs hover:bg-yellow-500/40 transition-all">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(task._id)}
                    className="bg-red-500/20 text-red-400 border border-red-500/30 px-3 py-1 rounded-lg text-xs hover:bg-red-500/40 transition-all">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
