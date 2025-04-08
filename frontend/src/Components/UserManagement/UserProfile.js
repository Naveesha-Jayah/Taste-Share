import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (!token || !storedUser) {
      navigate('/login');
      return;
    }

    try {
      const user = JSON.parse(storedUser);
      setUserData(user);
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/login');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      padding: '20px',
    },
    card: {
      width: '100%',
      maxWidth: '600px',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#fff',
    },
    title: {
      fontSize: '2rem',
      marginBottom: '20px',
      textAlign: 'center',
      color: '#333',
    },
    profileHeader: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '30px',
      gap: '20px',
    },
    avatar: {
      width: '100px',
      height: '100px',
      borderRadius: '50%',
      objectFit: 'cover',
      border: '3px solid #ff6b6b',
    },
    userInfo: {
      flex: 1,
    },
    userName: {
      fontSize: '1.5rem',
      margin: '0 0 5px 0',
      color: '#333',
    },
    userEmail: {
      fontSize: '1rem',
      color: '#666',
      margin: '0 0 10px 0',
    },
    details: {
      marginBottom: '20px',
    },
    detailItem: {
      marginBottom: '10px',
      display: 'flex',
    },
    detailLabel: {
      fontWeight: 'bold',
      width: '150px',
      color: '#555',
    },
    detailValue: {
      flex: 1,
    },
    logoutButton: {
      padding: '12px',
      borderRadius: '5px',
      border: 'none',
      backgroundColor: '#ff6b6b',
      color: 'white',
      fontSize: '1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginTop: '20px',
      width: '100%',
      transition: 'background-color 0.3s ease',
    },
    logoutButtonHover: {
      backgroundColor: '#ff5252',
    },
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <p>No user data available. Please log in.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Your Profile</h1>
        
        <div style={styles.profileHeader}>
          <img 
            src={userData.profilePicture || 'https://via.placeholder.com/150'} 
            alt="Profile" 
            style={styles.avatar}
          />
          <div style={styles.userInfo}>
            <h2 style={styles.userName}>{userData.fullName || 'User'}</h2>
            <p style={styles.userEmail}>{userData.emailAddress}</p>
          </div>
        </div>
        
        <div style={styles.details}>
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Email:</span>
            <span style={styles.detailValue}>{userData.emailAddress}</span>
          </div>
          {userData.bio && (
            <div style={styles.detailItem}>
              <span style={styles.detailLabel}>Bio:</span>
              <span style={styles.detailValue}>{userData.bio}</span>
            </div>
          )}
          <div style={styles.detailItem}>
            <span style={styles.detailLabel}>Member Since:</span>
            <span style={styles.detailValue}>
              {new Date(userData.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        
        <button 
          style={styles.logoutButton}
          onClick={handleLogout}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.logoutButtonHover.backgroundColor}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.logoutButton.backgroundColor}
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;