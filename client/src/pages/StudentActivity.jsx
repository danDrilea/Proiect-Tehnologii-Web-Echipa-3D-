import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';

const socket = io('http://localhost:5000');

const StudentActivity = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/activities/${code}`);
        setActivity(res.data);
      } catch (err) {
        alert('Activity not found or ended');
        navigate('/student/home');
      }
    };
    fetchActivity();

    socket.emit('join_activity', code);

    socket.on('activity_ended', () => {
      alert('The professor has ended the activity.');
      navigate('/student/home');
    });

    return () => {
      socket.off('activity_ended');
    };
  }, [code, navigate]);

  const sendFeedback = (type) => {
    socket.emit('send_feedback', {
      activityCode: code,
      type,
      timestamp: new Date()
    });
    
    // Visual feedback (vibration/animation could be added here)
    const btn = document.getElementById(`btn-${type}`);
    btn.classList.add('scale-95', 'ring-4');
    setTimeout(() => btn.classList.remove('scale-95', 'ring-4'), 200);
  };

  const reactions = [
    { id: 1, icon: '😀', label: 'Happy', color: 'bg-green-500 hover:bg-green-600 ring-green-500/50' },
    { id: 2, icon: '☹️', label: 'Unhappy', color: 'bg-red-500 hover:bg-red-600 ring-red-500/50' },
    { id: 3, icon: '😮', label: 'Surprised', color: 'bg-blue-500 hover:bg-blue-600 ring-blue-500/50' },
    { id: 4, icon: '😕', label: 'Confused', color: 'bg-orange-500 hover:bg-orange-600 ring-orange-500/50' },
  ];

  return (
    <div className="min-h-screen flex flex-col p-4 max-w-md mx-auto">
      <header className="mb-8 text-center pt-8">
        <h1 className="text-xl font-bold text-white mb-1">{activity?.name}</h1>
        <p className="text-slate-400 font-mono">CODE: {code}</p>
      </header>

      <div className="flex-1 flex flex-col justify-center gap-4 pb-12">
        {reactions.map((r) => (
          <button
            key={r.id}
            id={`btn-${r.id}`}
            onClick={() => sendFeedback(r.id)}
            className={`${r.color} h-24 rounded-2xl flex items-center justify-between px-8 transition-all duration-100 shadow-lg active:scale-95`}
          >
            <span className="text-4xl">{r.icon}</span>
            <span className="text-2xl font-bold text-white">{r.label}</span>
          </button>
        ))}
      </div>
      
      <p className="text-center text-slate-500 text-sm">
        Tap a button to send feedback instantly
      </p>
    </div>
  );
};

export default StudentActivity;
