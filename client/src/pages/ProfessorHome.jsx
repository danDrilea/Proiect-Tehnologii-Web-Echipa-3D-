/**
 * ProfessorHome Component
 * Dashboard for professors to create new activities and view history
 */
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Plus, History, Clock, FileText } from "lucide-react";

const ProfessorHome = () => {
  const [activityName, setActivityName] = useState("");
  const [description, setDescription] = useState("");
  const [duration, setDuration] = useState("");
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    fetchHistory();
  }, []);

  /**
   * Fetch professor's activity history from server
   */
  const fetchHistory = async () => {
    if (!user?.id) return;
    try {
      const res = await axios.get(
        `http://localhost:5000/api/professors/${user.id}/activities`
      );
      setHistory(res.data);
    } catch (err) {
      console.error("Failed to fetch history", err);
    }
  };

  /**
   * Create a new activity and navigate to its page
   */
  const createActivity = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/activities", {
        professorId: user.id,
        name: activityName,
        description: description,
        durationMinutes: duration || null,
      });
      navigate(`/professor/activity/${res.data.code}`);
    } catch (err) {
      console.error(err);
      alert("Failed to create activity");
    }
  };

  return (
    <div className="min-h-screen p-4 max-w-6xl mx-auto" style={{ padding: '2rem' }}>
      <header className="flex justify-between items-center mb-12">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Professor Dashboard
          </h1>
          <p className="text-emerald-200">Welcome back, {user?.username}</p>
        </div>
      </header>

      <div className="grid-2-cols">
        {/* Create Activity Section */}
        <div className="card" style={{ height: 'fit-content' }}>
          <div className="flex items-center gap-3 mb-6 text-primary">
            <Plus size={24} />
            <h2 className="text-xl font-semibold">New Activity</h2>
          </div>
          <form onSubmit={createActivity} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 text-emerald-100" style={{ display: 'block' }}>
                Activity Name
              </label>
              <input
                type="text"
                className="input-field"
                value={activityName}
                onChange={(e) => setActivityName(e.target.value)}
                placeholder="e.g. Lecture 1: Intro to Web"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 text-emerald-100" style={{ display: 'block' }}>
                Description (Optional)
              </label>
              <textarea
                className="input-field"
                style={{ minHeight: '80px' }}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Briefly describe the activity..."
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 text-emerald-100" style={{ display: 'block' }}>
                Duration (Minutes, Optional)
              </label>
              <input
                type="number"
                min="1"
                className="input-field"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="Auto-close after minutes (empty = manual close)"
              />
            </div>

            <button type="submit" className="btn btn-primary w-full" style={{ marginTop: '0.5rem' }}>
              Create & Start
            </button>
          </form>
        </div>

        {/* History Section */}
        <div className="card" style={{ height: 'fit-content' }}>
          <div className="flex items-center gap-3 mb-6 text-secondary">
            <History size={24} />
            <h2 className="text-xl font-semibold">History</h2>
          </div>

          <div className="history-list">
            {history.length === 0 ? (
              <p className="text-emerald-400 text-sm text-center" style={{ padding: '2rem 0', opacity: 0.6 }}>
                No past activities found.
              </p>
            ) : (
              history.map((act) => (
                <div
                  key={act.id}
                  onClick={() => navigate(`/professor/activity/${act.code}`)}
                  className="history-item"
                >
                  <div className="header">
                    <h3 className="title">{act.name}</h3>
                    <span className={`badge ${act.isActive ? 'badge-active' : 'badge-ended'}`}>
                      {act.isActive ? "Active" : "Ended"}
                    </span>
                  </div>
                  <div className="meta">
                    <div className="flex items-center gap-2">
                      <span className="code">{act.code}</span>
                      <span>•</span>
                      <span>{new Date(act.createdAt).toLocaleDateString()}</span>
                    </div>
                    {act.description && (
                      <p className="description line-clamp-1">{act.description}</p>
                    )}
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

export default ProfessorHome;
