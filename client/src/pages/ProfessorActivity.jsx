import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import io from 'socket.io-client';
import axios from 'axios';
import { StopCircle, Users } from 'lucide-react';

const socket = io('http://localhost:5000');

const ProfessorActivity = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/activities/${code}`);
        setActivity(res.data);
      } catch (err) {
        alert('Error loading activity');
        navigate('/professor/home');
      }
    };
    fetchActivity();

    socket.emit('join_activity', code);

    socket.on('receive_feedback', (feedback) => {
      setFeedbacks((prev) => [feedback, ...prev]);
    });

    return () => {
      socket.off('receive_feedback');
    };
  }, [code, navigate]);

  const endActivity = async () => {
    if (window.confirm('Are you sure you want to end this activity?')) {
      try {
        await axios.put(`http://localhost:5000/api/activities/${code}/end`);
        navigate('/professor/home');
      } catch (err) {
        alert('Error ending activity');
      }
    }
  };

  const getReactionIcon = (type) => {
    switch(type) {
      case 1: return '😀';
      case 2: return '☹️';
      case 3: return '�';
      case 4: return '😕';
      default: return '•';
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4 md:p-8 max-w-6xl mx-auto">
      <header className="flex justify-between items-center mb-8 bg-slate-800/50 p-4 rounded-xl backdrop-blur-sm border border-slate-700">
        <div>
          <h1 className="text-2xl font-bold text-white">{activity?.name}</h1>
          <div className="flex items-center gap-2 text-indigo-400 font-mono mt-1">
            <span className="text-slate-400">CODE:</span>
            <span className="text-xl font-bold">{code}</span>
          </div>
        </div>
        <button onClick={endActivity} className="btn bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/50 flex items-center gap-2">
          <StopCircle size={20} />
          End Activity
        </button>
      </header>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Activity Area (Placeholder) */}
        <div className="lg:col-span-2 card min-h-[400px] flex items-center justify-center border-dashed border-2 border-slate-700 bg-slate-800/30">
          <div className="text-center text-slate-500">
            <Users size={48} className="mx-auto mb-4 opacity-50" />
            <p>Activity Content Area</p>
            <p className="text-sm">Project on screen for students</p>
          </div>
        </div>

        {/* Live Feedback Log */}
        <div className="card flex flex-col h-[600px]">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Live Feedback
          </h2>
          <div className="flex-1 overflow-y-auto space-y-3 pr-2 scrollbar-thin scrollbar-thumb-slate-700">
            {feedbacks.length === 0 ? (
              <p className="text-center text-slate-500 mt-10">No feedback yet...</p>
            ) : (
              feedbacks.map((fb) => (
                <div key={fb.id} className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50 flex items-center gap-3 animate-in slide-in-from-right fade-in duration-300">
                  <span className="text-2xl">{getReactionIcon(fb.type)}</span>
                  <div>
                    <p className="text-sm text-slate-300">
                      {fb.type === 1 && "Happy"}
                      {fb.type === 2 && "Unhappy"}
                      {fb.type === 3 && "Surprised"}
                      {fb.type === 4 && "Confused"}
                    </p>
                    <p className="text-xs text-slate-500">
                      {new Date(fb.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfessorActivity;
