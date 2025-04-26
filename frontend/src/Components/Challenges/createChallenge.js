import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ChallengeApp() {
  const [challenges, setChallenges] = useState([]);
  const [formData, setFormData] = useState({
    challengeTitle: '',
    challengeDescription: '',
    category: 'Fitness',
    difficulty: 'Easy',
    startDate: '',
    endDate: ''
  });
  const [editingId, setEditingId] = useState(null);

  const categoryOptions = ['Fitness', 'Nutrition', 'Mindfulness', 'Productivity', 'Other'];
  const difficultyOptions = ['Easy', 'Medium', 'Hard'];

  useEffect(() => {
    fetchChallenges();
  }, []);

  const fetchChallenges = async () => {
    try {
      const response = await axios.get('http://localhost:8081/challenges');
      setChallenges(response.data);
    } catch (error) {
      console.error('Error fetching challenges:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`http://localhost:8081/challenges/${editingId}`, formData);
      } else {
        await axios.post('http://localhost:8081/challenges', formData);
      }
      resetForm();
      fetchChallenges();
    } catch (error) {
      console.error('Error saving challenge:', error);
    }
  };

  const handleEdit = (challenge) => {
    setFormData({
      challengeTitle: challenge.challengeTitle,
      challengeDescription: challenge.challengeDescription,
      category: challenge.category,
      difficulty: challenge.difficulty,
      startDate: challenge.startDate,
      endDate: challenge.endDate
    });
    setEditingId(challenge.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/challenges/${id}`);
      fetchChallenges();
    } catch (error) {
      console.error('Error deleting challenge:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      challengeTitle: '',
      challengeDescription: '',
      category: 'Fitness',
      difficulty: 'Easy',
      startDate: '',
      endDate: ''
    });
    setEditingId(null);
  };

  // CSS Styles
  const styles = {
    appContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      backgroundColor: '#fafafa',
      minHeight: '100vh'
    },
    appHeader: {
      textAlign: 'center',
      marginBottom: '30px',
      paddingBottom: '20px',
      borderBottom: '1px solid #e1e1e1'
    },
    contentContainer: {
      display: 'flex',
      flexDirection: 'row',
      gap: '30px',
      '@media (max-width: 768px)': {
        flexDirection: 'column'
      }
    },
    formSection: {
      flex: '1',
      backgroundColor: 'white',
      padding: '25px',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      marginBottom: '20px'
    },
    challengesSection: {
      flex: '1',
      marginBottom: '20px'
    },
    formGroup: {
      marginBottom: '20px'
    },
    formRow: {
      display: 'flex',
      gap: '15px',
      marginBottom: '20px',
      '@media (max-width: 600px)': {
        flexDirection: 'column'
      }
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '16px',
      marginTop: '5px',
      transition: 'border 0.3s',
      ':focus': {
        borderColor: '#4ecdc4',
        outline: 'none'
      }
    },
    textarea: {
      width: '100%',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '16px',
      minHeight: '100px',
      marginTop: '5px',
      resize: 'vertical',
      transition: 'border 0.3s',
      ':focus': {
        borderColor: '#4ecdc4',
        outline: 'none'
      }
    },
    select: {
      width: '100%',
      padding: '12px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      fontSize: '16px',
      marginTop: '5px',
      backgroundColor: 'white',
      transition: 'border 0.3s',
      ':focus': {
        borderColor: '#4ecdc4',
        outline: 'none'
      }
    },
    formActions: {
      display: 'flex',
      gap: '10px',
      marginTop: '20px'
    },
    submitBtn: {
      padding: '12px 25px',
      backgroundColor: '#4ecdc4',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      fontWeight: '600',
      transition: 'background-color 0.3s',
      ':hover': {
        backgroundColor: '#3ebbb4'
      }
    },
    cancelBtn: {
      padding: '12px 25px',
      backgroundColor: '#f0f0f0',
      color: '#333',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '16px',
      transition: 'background-color 0.3s',
      ':hover': {
        backgroundColor: '#e0e0e0'
      }
    },
    challengesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px'
    },
    challengeCard: {
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      padding: '20px',
      transition: 'transform 0.3s, box-shadow 0.3s',
      ':hover': {
        transform: 'translateY(-5px)',
        boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
      }
    },
    challengeCardHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '15px'
    },
    difficultyBadge: {
      padding: '5px 10px',
      borderRadius: '15px',
      fontSize: '12px',
      fontWeight: '600',
      textTransform: 'uppercase'
    },
    easyBadge: {
      backgroundColor: '#d1fae5',
      color: '#065f46'
    },
    mediumBadge: {
      backgroundColor: '#fef3c7',
      color: '#92400e'
    },
    hardBadge: {
      backgroundColor: '#fee2e2',
      color: '#991b1b'
    },
    challengeCardMeta: {
      display: 'flex',
      gap: '10px',
      marginBottom: '15px',
      fontSize: '14px',
      color: '#666'
    },
    challengeDescription: {
      marginBottom: '15px',
      color: '#444',
      lineHeight: '1.6'
    },
    challengeDates: {
      marginTop: '15px',
      paddingTop: '15px',
      borderTop: '1px solid #eee',
      fontSize: '14px',
      color: '#555'
    },
    challengeActions: {
      display: 'flex',
      gap: '10px',
      marginTop: '20px'
    },
    editBtn: {
      padding: '8px 15px',
      backgroundColor: '#4ecdc4',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'background-color 0.3s',
      ':hover': {
        backgroundColor: '#3ebbb4'
      }
    },
    deleteBtn: {
      padding: '8px 15px',
      backgroundColor: '#ff6b6b',
      color: 'white',
      border: 'none',
      borderRadius: '5px',
      cursor: 'pointer',
      fontSize: '14px',
      transition: 'background-color 0.3s',
      ':hover': {
        backgroundColor: '#e05a5a'
      }
    },
    noChallenges: {
      textAlign: 'center',
      padding: '40px',
      color: '#888',
      backgroundColor: 'white',
      borderRadius: '10px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    }
  };

  return (
    <div style={styles.appContainer}>
      <header style={styles.appHeader}>
        <h1 style={{ color: '#292f36', marginBottom: '10px' }}>Challenge Management</h1>
        <p style={{ color: '#666' }}>Track and manage your personal challenges</p>
      </header>

      <div style={styles.contentContainer}>
        <div style={styles.formSection}>
          <h2 style={{ marginBottom: '20px', color: '#292f36' }}>
            {editingId ? 'Edit Challenge' : 'Create New Challenge'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Challenge Title</label>
              <input
                type="text"
                name="challengeTitle"
                value={formData.challengeTitle}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Description</label>
              <textarea
                name="challengeDescription"
                value={formData.challengeDescription}
                onChange={handleInputChange}
                required
                style={styles.textarea}
              />
            </div>

            <div style={styles.formRow}>
              <div style={{ ...styles.formGroup, flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  style={styles.select}
                >
                  {categoryOptions.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div style={{ ...styles.formGroup, flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Difficulty</label>
                <select
                  name="difficulty"
                  value={formData.difficulty}
                  onChange={handleInputChange}
                  style={styles.select}
                >
                  {difficultyOptions.map(level => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={styles.formRow}>
              <div style={{ ...styles.formGroup, flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Start Date</label>
                <input
                  type="date"
                  name="startDate"
                  value={formData.startDate}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                />
              </div>

              <div style={{ ...styles.formGroup, flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>End Date</label>
                <input
                  type="date"
                  name="endDate"
                  value={formData.endDate}
                  onChange={handleInputChange}
                  required
                  style={styles.input}
                />
              </div>
            </div>

            <div style={styles.formActions}>
              <button type="submit" style={styles.submitBtn}>
                {editingId ? 'Update Challenge' : 'Create Challenge'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} style={styles.cancelBtn}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div style={styles.challengesSection}>
          <h2 style={{ marginBottom: '20px', color: '#292f36' }}>Your Challenges</h2>
          {challenges.length === 0 ? (
            <p style={styles.noChallenges}>No challenges created yet. Start by creating one!</p>
          ) : (
            <div style={styles.challengesGrid}>
              {challenges.map((challenge) => (
                <div key={challenge.id} style={styles.challengeCard}>
                  <div style={styles.challengeCardHeader}>
                    <h3 style={{ margin: 0 }}>{challenge.challengeTitle}</h3>
                    <span style={{
                      ...styles.difficultyBadge,
                      ...(challenge.difficulty === 'Easy' ? styles.easyBadge : 
                          challenge.difficulty === 'Medium' ? styles.mediumBadge : styles.hardBadge)
                    }}>
                      {challenge.difficulty}
                    </span>
                  </div>
                  <div style={styles.challengeCardMeta}>
                    <span style={styles.category}>{challenge.category}</span>
                  </div>
                  <p style={styles.challengeDescription}>{challenge.challengeDescription}</p>
                  <div style={styles.challengeDates}>
                    <p><strong>Start:</strong> {challenge.startDate}</p>
                    <p><strong>End:</strong> {challenge.endDate}</p>
                  </div>
                  <div style={styles.challengeActions}>
                    <button onClick={() => handleEdit(challenge)} style={styles.editBtn}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(challenge.id)} style={styles.deleteBtn}>
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ChallengeApp;