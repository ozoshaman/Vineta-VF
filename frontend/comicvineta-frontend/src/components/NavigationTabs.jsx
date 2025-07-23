import { NavLink } from 'react-router-dom';
import '../styles/NavigationTabs.css';

function NavigationTabs() {
  return (
    <nav className="navigation-tabs">
      <NavLink to="/feed" className={({ isActive }) => isActive ? 'tab active' : 'tab'}>🏠 Publicaciones</NavLink>
      <NavLink to="/following" className={({ isActive }) => isActive ? 'tab active' : 'tab'}>👥 Mis Seguidos</NavLink>
      <NavLink to="/profile" className={({ isActive }) => isActive ? 'tab active' : 'tab'}>👤 Mi Perfil</NavLink>
      <NavLink to="/create" className={({ isActive }) => isActive ? 'tab active' : 'tab'}>
        ➕ Crear Publicación
      </NavLink>
    </nav>
  );
}

export default NavigationTabs;
