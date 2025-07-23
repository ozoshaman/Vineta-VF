import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import UserProfile from './pages/UserProfile';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import VerifyCode from './pages/VerifyCode';
import ChangePassword from './pages/ChangePassword';
import ResetPassword from './pages/Reset-password';

import DashboardLayout from './pages/DashboardLayout';
import Feed from './pages/Feed.jsx';
import Following from './pages/Following.jsx';
import MyPosts from './pages/MyPosts.jsx';
import SettingsPanel from './pages/SettingsPanel.jsx';
import CreatePost from './pages/CreatePost.jsx';
import EditPost from './pages/EditPost.jsx';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/verify" element={<VerifyCode />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />


          {/* ÁREA PROTEGIDA */}
          <Route
            path="/"
            element={
              <PrivateRoute>
                <DashboardLayout />
              </PrivateRoute>
            }
          >
            <Route path="profile" element={<Profile />} />
            <Route path="/user/:author_id" element={<UserProfile />} />
            <Route path="feed" element={<Feed />} />
            <Route path="following" element={<Following />} />
            <Route path="create" element={<CreatePost />} />
            <Route path="myposts" element={<MyPosts />} />
            <Route path="edit-post/:postId" element={<EditPost />} />
            <Route path="settings" element={<SettingsPanel />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
