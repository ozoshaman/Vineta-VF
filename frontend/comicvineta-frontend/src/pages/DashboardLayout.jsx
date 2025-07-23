import { useState } from 'react';
import NavigationTabs from '../components/NavigationTabs';
import Sidebar from '../components/Sidebar';
import { Outlet } from 'react-router-dom';
import '../styles/DashboardLayout.css';

function DashboardLayout() {
  const [sidebarVisible, setSidebarVisible] = useState(false);

  return (
    <div className="dashboard-layout">
      <div className="top-bar">
        <button
          className="menu-button"
          onClick={() => setSidebarVisible(!sidebarVisible)}
        >
          ☰
        </button>
        <NavigationTabs />
      </div>

      <div className="dashboard-body">
        <div className={`sidebar-wrapper ${sidebarVisible ? 'visible' : ''}`}>
          <Sidebar />
        </div>
        <div className="main-content">
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default DashboardLayout;
