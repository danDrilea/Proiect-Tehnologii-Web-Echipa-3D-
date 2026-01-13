/**
 * Login Component
 * Handles user authentication and role selection (student/professor)
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { User, GraduationCap } from 'lucide-react';

const Login = () => {
  const [username, setUsername] = useState('');
  const [role, setRole] = useState('student');
  const navigate = useNavigate();

  /**
   * Handle login form submission
   * Sends credentials to backend and redirects based on role
   */
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', { username, role });
      localStorage.setItem('user', JSON.stringify(res.data));
      if (role === 'professor') {
        navigate('/professor/home');
      } else {
        navigate('/student/home');
      }
    } catch (err) {
      console.error(err);
      alert('Login failed');
    }
  };

  return (
    <div className="login-container">
      <div className="card login-card">
        <h1 className="login-title">Welcome Back</h1>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 text-emerald-100" style={{ display: 'block' }}>
              Username
            </label>
            <input
              type="text"
              className="input-field"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="role-selector">
            <button
              type="button"
              onClick={() => setRole('student')}
              className={`role-btn ${role === 'student' ? 'active-student' : ''}`}
            >
              <User size={24} />
              <span className="font-medium">Student</span>
            </button>
            <button
              type="button"
              onClick={() => setRole('professor')}
              className={`role-btn ${role === 'professor' ? 'active-professor' : ''}`}
            >
              <GraduationCap size={24} />
              <span className="font-medium">Professor</span>
            </button>
          </div>

          <button type="submit" className="btn btn-primary w-full py-3 text-lg">
            Get Started
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
