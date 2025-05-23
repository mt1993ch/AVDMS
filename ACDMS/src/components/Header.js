import React from 'react';
import { useTheme } from '../styles/theme';

function Header({ currentPage, navigateTo, onLogout, darkMode, toggleDarkMode }) {
  const { colors } = useTheme();
  
  const navItems = [
    { id: 'home', label: 'Home', icon: 'home' },
    { id: 'search', label: 'Search Database', icon: 'search' },
    { id: 'add', label: 'Add Agniveer', icon: 'user-plus' },
    { id: 'manage', label: 'Data Management', icon: 'database' }
  ];
  
  return (
    <header>
      <nav className="navbar navbar-expand-lg" style={{ backgroundColor: colors.primary }}>
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center" href="#" onClick={() => navigateTo('home')}>
            <svg className="me-2" width="30" height="30" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M24 4L6 12L24 20L42 12L24 4Z" fill={colors.accent} />
              <path d="M6 12V36L24 44V20L6 12Z" fill={colors.secondary} />
              <path d="M24 20V44L42 36V12L24 20Z" fill={colors.secondaryDark} />
              <path d="M24 4L12 9L24 14L36 9L24 4Z" fill={colors.white} />
              <circle cx="24" cy="24" r="4" fill={colors.accent} />
            </svg>
            <span style={{ color: colors.white, fontWeight: 'bold' }}>ACDMS</span>
          </a>
          
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            style={{ borderColor: colors.white }}
          >
            <i data-feather="menu" style={{ color: colors.white }}></i>
          </button>
          
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              {navItems.map(item => (
                <li key={item.id} className="nav-item">
                  <a
                    className={`nav-link ${currentPage === item.id ? 'active' : ''}`}
                    href="#"
                    onClick={() => navigateTo(item.id)}
                    style={{ 
                      color: colors.white,
                      backgroundColor: currentPage === item.id ? colors.primaryDark : 'transparent' 
                    }}
                  >
                    <i
                      data-feather={item.icon}
                      style={{ 
                        verticalAlign: 'middle', 
                        marginRight: '5px',
                        width: '16px',
                        height: '16px' 
                      }}
                    ></i>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
            
            <div className="d-flex align-items-center">
              <button
                className="btn btn-sm me-3"
                onClick={toggleDarkMode}
                title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                style={{ 
                  backgroundColor: 'transparent', 
                  border: 'none',
                  color: colors.white
                }}
              >
                <i data-feather={darkMode ? 'sun' : 'moon'}></i>
              </button>
              
              <button
                className="btn btn-outline-light btn-sm"
                onClick={onLogout}
              >
                <i
                  data-feather="log-out"
                  style={{ 
                    verticalAlign: 'middle', 
                    marginRight: '5px',
                    width: '16px',
                    height: '16px' 
                  }}
                ></i>
                Logout
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="sub-header py-2 px-3" style={{ backgroundColor: colors.primaryDark, color: colors.white }}>
        <div className="container-fluid">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <small>
                <i 
                  data-feather="shield" 
                  style={{ 
                    verticalAlign: 'middle', 
                    marginRight: '5px',
                    width: '14px',
                    height: '14px' 
                  }}
                ></i>
                <span>Agniveer Centralised Data Management System</span>
              </small>
            </div>
            <div>
              <small>Developed by ARC Shillong</small>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
