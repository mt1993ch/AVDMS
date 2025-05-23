import React from 'react';
import { useTheme } from '../styles/theme';

function Home({ navigateTo }) {
  const { colors } = useTheme();
  
  const menuItems = [
    {
      title: 'Search Database',
      description: 'Search and filter Agniveer records',
      icon: 'search',
      action: () => navigateTo('search'),
      color: colors.primary
    },
    {
      title: 'Add a New Agniveer',
      description: 'Add a new Agniveer to the database',
      icon: 'user-plus',
      action: () => navigateTo('add'),
      color: colors.success
    },
    {
      title: 'Data Management',
      description: 'View, edit, and delete Agniveer records',
      icon: 'database',
      action: () => navigateTo('manage'),
      color: colors.info
    }
  ];

  return (
    <div className="container py-4">
      <div className="row mb-4">
        <div className="col-12 text-center">
          <h1>Welcome to ACDMS</h1>
          <p className="lead">
            Agniveer Centralised Data Management System
          </p>
          <div className="military-border mt-4">
            <p>
              This system allows you to manage and maintain detailed records of Agniveer recruits. 
              Select an option below to get started.
            </p>
          </div>
        </div>
      </div>
      
      <div className="home-cards">
        {menuItems.map((item, index) => (
          <div 
            key={index} 
            className="card home-card" 
            onClick={item.action}
            style={{ cursor: 'pointer' }}
          >
            <div className="home-card-icon">
              <i 
                data-feather={item.icon} 
                style={{ color: item.color }}
              ></i>
            </div>
            <h3>{item.title}</h3>
            <p>{item.description}</p>
            <button 
              className="btn btn-outline-primary mt-3"
              onClick={item.action}
            >
              Select
            </button>
          </div>
        ))}
      </div>
      
      <div className="row mt-5">
        <div className="col-12 text-center">
          <p>
            <small className="text-muted">
              ACDMS - Developed by ARC Shillong
            </small>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Home;
