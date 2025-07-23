import { Link, useNavigate } from 'react-router-dom';
import '../styles/Sidebar.css';

function Sidebar() {
  const navigate = useNavigate();
  const goToCreatePost = () => {
    navigate('/create');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <aside className="sidebar">
      <h3>Panel</h3>
      <ul>
        <li><Link to="/settings">⚙️ Configuración</Link></li>
        <li><Link to="/myposts">📸 Mis Publicaciones</Link></li>
        <li><button onClick={handleLogout} className="logout-button">🚪 Cerrar sesión</button></li>
      </ul>
    </aside>
  );
}

export default Sidebar;
