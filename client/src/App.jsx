/**
 * App Component
 * Main application router and layout wrapper
 */
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import ProfessorHome from './pages/ProfessorHome';
import StudentHome from './pages/StudentHome';
import ProfessorActivity from './pages/ProfessorActivity';
import StudentActivity from './pages/StudentActivity';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/professor/home" element={<ProfessorHome />} />
          <Route path="/student/home" element={<StudentHome />} />
          <Route path="/professor/activity/:code" element={<ProfessorActivity />} />
          <Route path="/student/activity/:code" element={<StudentActivity />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
