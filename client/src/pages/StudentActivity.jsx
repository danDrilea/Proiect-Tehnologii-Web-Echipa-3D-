/**
 * StudentActivity Component
 * Main feedback interface for students to react to ongoing activities
 * Features 4 emoticon buttons for real-time feedback submission
 */
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000");

/**
 * Countdown timer component
 * Displays remaining time for the activity
 */
const Countdown = ({ createdAt, durationMinutes }) => {
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
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setTimeLeft(`${minutes}:${seconds.toString().padStart(2, "0")}`);
      }
    }, 1000);
    return () => clearInterval(interval);
  }, [createdAt, durationMinutes]);

  return <span className="countdown-value">{timeLeft}</span>;
};

const StudentActivity = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);

  useEffect(() => {
    /**
     * Fetch activity details from server
     */
    const fetchActivity = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/activities/${code}`
        );
        setActivity(res.data);
      } catch (err) {
        alert("Activity not found");
        navigate("/student/home");
      }
    };
    fetchActivity();

    // Join socket room for real-time updates
    socket.emit("join_activity", code);

    // Listen for activity end event
    socket.on("activity_ended", () => {
      setActivity((prev) => (prev ? { ...prev, isActive: false } : null));
    });

    return () => {
      socket.off("activity_ended");
    };
  }, [code, navigate]);

  /**
   * Send feedback reaction via socket
   */
  const sendFeedback = (type) => {
    if (!activity?.isActive) return;

    socket.emit("send_feedback", {
      activityCode: code,
      type,
      timestamp: new Date(),
    });

    // Visual feedback animation
    const btn = document.getElementById(`btn-${type}`);
    if (btn) {
      btn.classList.add("scale-95");
      setTimeout(() => btn.classList.remove("scale-95"), 200);
    }
  };

  // Reaction button configuration
  const reactions = [
    { id: 1, icon: "😀", label: "Happy", colorClass: "happy" },
    { id: 2, icon: "☹️", label: "Unhappy", colorClass: "unhappy" },
    { id: 3, icon: "😮", label: "Surprised", colorClass: "surprised" },
    { id: 4, icon: "😕", label: "Confused", colorClass: "confused" },
  ];

  if (!activity) {
    return <div className="text-center text-slate-500 mt-20">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col p-4 max-w-md mx-auto">
      <header className="mb-8 text-center pt-8">
        <h1 className="text-2xl font-bold text-white mb-2">{activity.name}</h1>
        <div className="text-slate-400 font-mono text-lg mb-4">
          CODE: {code}
        </div>

        {activity.isActive && activity.durationMinutes && (
          <div className="countdown-badge mb-4">
            <span className="text-slate-400 text-sm" style={{ marginRight: '0.5rem' }}>Time Left:</span>
            <Countdown
              createdAt={activity.createdAt}
              durationMinutes={activity.durationMinutes}
            />
          </div>
        )}

        {activity.description && (
          <div className="description-box">
            {activity.description}
          </div>
        )}

        {!activity.isActive && (
          <div className="alert alert-ended mt-6">
            Activity has ended. Thank you for your feedback!
          </div>
        )}
      </header>

      <div className={`feedback-grid ${!activity.isActive ? 'disabled' : ''}`}>
        {reactions.map((r) => (
          <button
            key={r.id}
            id={`btn-${r.id}`}
            onClick={() => sendFeedback(r.id)}
            className={`feedback-btn ${r.colorClass} ${!activity.isActive ? 'disabled' : ''}`}
            disabled={!activity.isActive}
          >
            <span className="emoji">{r.icon}</span>
            <span className="label">{r.label}</span>
          </button>
        ))}
      </div>

      {activity.isActive && (
        <p className="text-center text-slate-500 text-sm">
          Tap a button to send feedback instantly
        </p>
      )}

      <div className="text-center mt-4">
        <button
          onClick={() => navigate("/student/home")}
          className="text-slate-500 underline text-sm"
          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          onMouseOver={(e) => e.target.style.color = 'white'}
          onMouseOut={(e) => e.target.style.color = '#64748b'}
        >
          Exit to Home
        </button>
      </div>
    </div>
  );
};

export default StudentActivity;
