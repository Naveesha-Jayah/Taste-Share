import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

function DisplayChallenges() {
  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchChallenges = async () => {
      try {
        const response = id 
          ? await axios.get(`http://localhost:8081/challenges/${id}`)
          : await axios.get('http://localhost:8081/challenges');
        
        const data = id ? [response.data] : response.data;
        setChallenges(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchChallenges();
  }, [id]);

  if (loading) return <div style={styles.loading}>Loading challenges...</div>;
  if (error) return <div style={styles.error}>Error: {error}</div>;

  return (
    <div style={styles.container}>
      <h1 style={styles.mainTitle}>{id ? 'Challenge Details' : 'All Challenges'}</h1>
      
      <div style={styles.challengesGrid}>
        {challenges.map((challenge) => (
          <div key={challenge.id} style={styles.challengeCard}>
            {challenge.coverImg && (
              <div style={styles.imageContainer}>
                <img 
                  src={`http://localhost:8081/uploads/${challenge.coverImg}`} 
                  alt={challenge.challengeTitle} 
                  style={styles.challengeImage}
                />
              </div>
            )}
            
            <div style={styles.cardContent}>
              <h2 style={styles.challengeTitle}>{challenge.challengeTitle}</h2>
              
              <div style={styles.dateContainer}>
                <span style={styles.dateLabel}>Starts:</span>
                <span style={styles.date}>{new Date(challenge.startDate).toLocaleDateString()}</span>
                
                <span style={styles.dateLabel}>Ends:</span>
                <span style={styles.date}>{new Date(challenge.endDate).toLocaleDateString()}</span>
              </div>
              
              <p style={styles.challengeDetails}>{challenge.challengeDetails}</p>
              
              <div style={styles.statusBadge}>
                {new Date(challenge.endDate) > new Date() 
                  ? <span style={styles.activeBadge}>Active</span>
                  : <span style={styles.completedBadge}>Completed</span>
                }
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '30px 20px',
    fontFamily: "'Poppins', sans-serif",
  },
  mainTitle: {
    textAlign: 'center',
    color: '#e67e22',
    fontSize: '2.5rem',
    marginBottom: '40px',
    fontWeight: '600',
    fontFamily: "'Playfair Display', serif",
    position: 'relative',
    paddingBottom: '15px',
  },
  challengesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '30px',
    marginTop: '20px',
  },
  challengeCard: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
    transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
    ':hover': {
      transform: 'translateY(-5px)',
      boxShadow: '0 15px 35px rgba(0,0,0,0.12)',
    },
  },
  imageContainer: {
    height: '200px',
    overflow: 'hidden',
    position: 'relative',
  },
  challengeImage: {
    width: '100%',
    height: '100%',
    objectFit: 'cover',
    transition: 'transform 0.5s ease',
    ':hover': {
      transform: 'scale(1.05)',
    },
  },
  cardContent: {
    padding: '25px',
    flex: '1',
    display: 'flex',
    flexDirection: 'column',
  },
  challengeTitle: {
    fontSize: '1.5rem',
    margin: '0 0 15px 0',
    color: '#333',
    fontWeight: '600',
  },
  challengeDetails: {
    color: '#555',
    lineHeight: '1.6',
    margin: '0 0 20px 0',
    flex: '1',
  },
  dateContainer: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '15px',
    marginBottom: '20px',
    alignItems: 'center',
  },
  dateLabel: {
    fontWeight: '600',
    color: '#e67e22',
    fontSize: '0.9rem',
  },
  date: {
    backgroundColor: '#f9f2e8',
    padding: '5px 10px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    marginRight: '10px',
  },
  statusBadge: {
    marginTop: 'auto',
    alignSelf: 'flex-start',
  },
  activeBadge: {
    backgroundColor: '#2ecc71',
    color: 'white',
    padding: '5px 15px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  completedBadge: {
    backgroundColor: '#e74c3c',
    color: 'white',
    padding: '5px 15px',
    borderRadius: '20px',
    fontSize: '0.85rem',
    fontWeight: '600',
  },
  loading: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#666',
    padding: '50px',
  },
  error: {
    textAlign: 'center',
    fontSize: '1.2rem',
    color: '#e74c3c',
    padding: '50px',
  },
};

export default DisplayChallenges;