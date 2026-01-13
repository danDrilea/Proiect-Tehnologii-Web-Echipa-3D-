/**
 * StudentHome Component
 * Landing page for students to enter activity codes and join sessions
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { LogIn } from 'lucide-react';

const StudentHome = () => {
  const [code, setCode] = useState('');
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  /**
   * Validate activity code and join the session
   */
  const joinActivity = async (e) => {
    e.preventDefault();
    try {
      await axios.get(`http://localhost:5000/api/activities/${code}`);
      navigate(`/student/activity/${code}`);
    } catch (err) {
      console.error(err);
      alert('Activity not found or ended');
    }
  };

  return (
    <div className="login-container">
      <div className="card login-card">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-white mb-2">Join Activity</h1>
          <p className="text-emerald-200">Enter the code provided by your professor</p>
        </header>

        <form onSubmit={joinActivity} className="space-y-6">
          <div>
            <input
              type="text"
              className="input-field code-input"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="CODE"
              maxLength={6}
              required
            />
          </div>
          <button type="submit" className="btn btn-secondary w-full flex items-center justify-center gap-2">
            <LogIn size={20} />
            Join Session
          </button>
        </form>
      </div>
    </div>
  );
};

export default StudentHome;
