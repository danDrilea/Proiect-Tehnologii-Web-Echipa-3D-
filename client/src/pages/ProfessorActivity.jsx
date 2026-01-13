/**
 * ProfessorActivity Component
 * Real-time activity monitoring dashboard for professors
 * Displays live feedback stream from students
 */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";
import { StopCircle, Users, Clock } from "lucide-react";

const socket = io("http://localhost:5000");

/**
 * Countdown timer component with callback on expiry
 */
const Countdown = ({ createdAt, durationMinutes, onEnd }) => {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      const startTime = new Date(createdAt).getTime();
      const durationMs = durationMinutes * 60000;
      const now = Date.now();
      const diff = startTime + durationMs - now;

      if (diff <= 0) {
        setTimeLeft("00:00");
        clearInterval(interval);
        if (onEnd) onEnd();
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [createdAt, durationMinutes, onEnd]);

  return <span className="countdown-value text-xl">{timeLeft}</span>;
};

const ProfessorActivity = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [feedbacks, setFeedbacks] = useState([]);
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    /**
     * Fetch activity details
     */
    const fetchActivity = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/activities/${code}`
        );
        setActivity(res.data);
      } catch (err) {
        alert("Error loading activity");
        navigate("/professor/home");
      }
    };

    /**
     * Fetch existing feedbacks for this activity
     */
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/activities/${code}/feedbacks`
        );
        setFeedbacks(res.data);
      } catch (err) {
        console.error("Error loading feedbacks", err);
      }
    };

    fetchActivity();
    fetchFeedbacks();

    // Join socket room
    socket.emit("join_activity", code);

    // Listen for new feedback
    socket.on("receive_feedback", (feedback) => {
      if (feedback.activityCode === code) {
        setFeedbacks((prev) => [feedback, ...prev]);
      }
    });

    // Listen for activity end
    socket.on("activity_ended", () => {
      setActivity((prev) => ({ ...prev, isActive: false }));
    });

    return () => {
      socket.off("receive_feedback");
      socket.off("activity_ended");
    };
  }, [code, navigate]);

  /**
   * Manually end the activity
   */
  const endActivity = async () => {
    if (window.confirm("Are you sure you want to end this activity?")) {
      try {
        await axios.put(`http://localhost:5000/api/activities/${code}/end`);
        setActivity((prev) => ({ ...prev, isActive: false }));
      } catch (err) {
        alert("Error ending activity");
      }
    }
  };

  /**
   * Get emoji icon for feedback type
   */
  const getReactionIcon = (type) => {
    switch (parseInt(type)) {
      case 1: return "😀";
      case 2: return "☹️";
      case 3: return "😮";
      case 4: return "😕";
      default: return "•";
    }
  };

  /**
   * Get label for feedback type
   */
  const getReactionLabel = (type) => {
    switch (parseInt(type)) {
      case 1: return "Happy";
      case 2: return "Unhappy";
      case 3: return "Surprised";
      case 4: return "Confused";
      default: return "";
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-4 max-w-6xl mx-auto" style={{ padding: '2rem' }}>
      {/* Header Section */}
      <header className="page-header">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white">{activity?.name}</h1>
            {!activity?.isActive && (
              <span className="badge badge-danger">ENDED</span>
            )}
          </div>

          <div className="flex items-center gap-4 text-indigo-400 font-mono mt-2">
            <div className="flex items-center gap-2">
              <span className="text-slate-400">CODE:</span>
              <span className="text-xl font-bold select-all">{code}</span>
            </div>

            {activity?.durationMinutes && activity?.isActive && (
              <div className="timer-box">
                <Clock size={16} style={{ color: 'var(--color-primary)' }} />
                <Countdown
                  createdAt={activity.createdAt}
                  durationMinutes={activity.durationMinutes}
                />
              </div>
            )}

            {activity?.durationMinutes && !activity?.isActive && (
              <div className="text-slate-500 text-sm">
                Duration: {activity.durationMinutes} min (Expired)
              </div>
            )}
          </div>

          {activity?.description && (
            <p className="text-slate-300 mt-2 text-sm" style={{ maxWidth: '42rem' }}>
              {activity.description}
            </p>
          )}
        </div>

        {activity?.isActive ? (
          <button onClick={endActivity} className="btn btn-danger shrink-0 flex items-center gap-2">
            <StopCircle size={20} />
            End Activity
          </button>
        ) : (
          <button
            onClick={() => navigate("/professor/home")}
            className="btn btn-secondary shrink-0"
          >
            Back to Dashboard
          </button>
        )}
      </header>

      {/* Main Content Grid */}
      <div className="grid-professor">
        {/* Activity Content Area Placeholder */}
        <div className="card card-dashed activity-placeholder">
          <div className="content">
            <Users size={48} className="icon" style={{ margin: '0 auto 1rem' }} />
            <p className="text-lg font-medium">Activity Content Area</p>
            <p className="text-sm">Project this screen for students to see the code</p>
          </div>
        </div>

        {/* Live Feedback Log */}
        <div className="card feedback-log">
          <h2 className="feedback-log-header">
            <span className={`status-dot ${activity?.isActive ? 'active' : 'inactive'}`}></span>
            {activity?.isActive ? "Live Feedback" : "Feedback History"}
          </h2>

          <div className="feedback-list">
            {feedbacks.length === 0 ? (
              <p className="text-center text-slate-500 mt-10">
                No feedback yet...
              </p>
            ) : (
              feedbacks.map((fb) => (
                <div key={fb.id} className="feedback-item">
                  <span className="emoji">{getReactionIcon(fb.type)}</span>
                  <div className="info">
                    <p className="type">{getReactionLabel(fb.type)}</p>
                    <p className="time">{new Date(fb.timestamp).toLocaleTimeString()}</p>
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
