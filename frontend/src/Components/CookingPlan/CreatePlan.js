import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [plans, setPlans] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration: 5,
    isPublic: false,
    meals: {}
  });
  const [editingId, setEditingId] = useState(null);
  const [dayInput, setDayInput] = useState('');
  const [recipeInput, setRecipeInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [availableDays, setAvailableDays] = useState(['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']);
  const [activeTab, setActiveTab] = useState('create');
  const [filterDuration, setFilterDuration] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const API_URL = 'http://localhost:8081/plans';

  const durationOptions = [
    { value: 5, label: '5 days (Weekdays)' },
    { value: 7, label: '7 days (Full week)' },
    { value: 14, label: '14 days (2 weeks)' },
    { value: 21, label: '21 days (3 weeks)' },
    { value: 30, label: '30 days (1 month)' }
  ];

  const dayNames = {
    5: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    7: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    14: [
      'Week 1 - Monday', 'Week 1 - Tuesday', 'Week 1 - Wednesday', 'Week 1 - Thursday', 
      'Week 1 - Friday', 'Week 1 - Saturday', 'Week 1 - Sunday',
      'Week 2 - Monday', 'Week 2 - Tuesday', 'Week 2 - Wednesday', 'Week 2 - Thursday', 
      'Week 2 - Friday', 'Week 2 - Saturday', 'Week 2 - Sunday'
    ],
    21: [
      'Week 1 - Monday', 'Week 1 - Tuesday', 'Week 1 - Wednesday', 'Week 1 - Thursday', 
      'Week 1 - Friday', 'Week 1 - Saturday', 'Week 1 - Sunday',
      'Week 2 - Monday', 'Week 2 - Tuesday', 'Week 2 - Wednesday', 'Week 2 - Thursday', 
      'Week 2 - Friday', 'Week 2 - Saturday', 'Week 2 - Sunday',
      'Week 3 - Monday', 'Week 3 - Tuesday', 'Week 3 - Wednesday', 'Week 3 - Thursday', 
      'Week 3 - Friday', 'Week 3 - Saturday', 'Week 3 - Sunday'
    ],
    30: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`)
  };

  const fetchPlans = async () => {
    setIsLoading(true);
    try {
      const response = await axios.get(API_URL);
      setPlans(response.data);
      setErrorMessage('');
    } catch (error) {
      console.error('Error fetching plans:', error);
      setErrorMessage('Failed to load meal plans. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, formData);
        setSuccessMessage('Meal plan updated successfully!');
      } else {
        await axios.post(API_URL, formData);
        setSuccessMessage('Meal plan created successfully!');
      }
      resetForm();
      fetchPlans();
      setActiveTab('view');
    } catch (error) {
      console.error('Error saving plan:', error);
      setErrorMessage('Failed to save meal plan. Please try again.');
    } finally {
      setIsLoading(false);
      setTimeout(() => setSuccessMessage(''), 5000);
      setTimeout(() => setErrorMessage(''), 5000);
    }
  };

  const handleMealAdd = () => {
    if (dayInput && recipeInput) {
      setFormData({
        ...formData,
        meals: {
          ...formData.meals,
          [dayInput]: recipeInput
        }
      });
      setDayInput('');
      setRecipeInput('');
    } else {
      setErrorMessage('Please enter both day and recipe');
      setTimeout(() => setErrorMessage(''), 3000);
    }
  };

  const handleMealRemove = (day) => {
    const newMeals = { ...formData.meals };
    delete newMeals[day];
    setFormData({
      ...formData,
      meals: newMeals
    });
  };

  const handleEdit = (plan) => {
    setFormData({
      title: plan.title,
      description: plan.description,
      duration: plan.duration,
      isPublic: plan.isPublic,
      meals: plan.meals
    });
    setEditingId(plan.id);
    setActiveTab('create');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this meal plan?')) {
      setIsLoading(true);
      try {
        await axios.delete(`${API_URL}/${id}`);
        setSuccessMessage('Meal plan deleted successfully!');
        fetchPlans();
      } catch (error) {
        console.error('Error deleting plan:', error);
        setErrorMessage('Failed to delete meal plan. Please try again.');
      } finally {
        setIsLoading(false);
        setTimeout(() => setSuccessMessage(''), 5000);
        setTimeout(() => setErrorMessage(''), 5000);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      duration: 5,
      isPublic: false,
      meals: {}
    });
    setEditingId(null);
  };

  const closeNotification = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : type === 'number' ? parseInt(value) : value
    });
  };

  const filteredAndSortedPlans = () => {
    let result = [...plans];
    
    // Filter by duration
    if (filterDuration) {
      result = result.filter(plan => plan.duration === parseInt(filterDuration));
    }
    
    // Sort plans
    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
      case 'oldest':
        result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
        break;
      case 'title':
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'duration':
        result.sort((a, b) => a.duration - b.duration);
        break;
      default:
        break;
    }
    
    return result;
  };

  useEffect(() => {
    if (dayNames[formData.duration]) {
      setAvailableDays(dayNames[formData.duration]);
    } else {
      setAvailableDays(Array.from({ length: formData.duration }, (_, i) => `Day ${i + 1}`));
    }
    
    const newMeals = {};
    Object.entries(formData.meals).forEach(([day, recipe]) => {
      if (availableDays.includes(day)) {
        newMeals[day] = recipe;
      }
    });
    setFormData(prev => ({ ...prev, meals: newMeals }));
  }, [formData.duration]);

  useEffect(() => {
    fetchPlans();
  }, []);

  const styles = {
    appContainer: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      backgroundColor: '#f5f7fa',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      minHeight: '100vh'
    },
    heading: {
      color: '#2c3e50',
      marginBottom: '30px',
      fontWeight: '600',
      fontSize: '2rem',
      textAlign: 'center'
    },
    tabsContainer: {
      display: 'flex',
      marginBottom: '20px',
      borderBottom: '1px solid #dfe6e9'
    },
    tab: {
      padding: '12px 24px',
      cursor: 'pointer',
      borderBottom: '3px solid transparent',
      fontWeight: '500',
      transition: 'all 0.3s ease'
    },
    activeTab: {
      borderBottom: '3px solid #3498db',
      color: '#3498db'
    },
    formContainer: {
      backgroundColor: 'white',
      padding: '25px',
      borderRadius: '12px',
      marginBottom: '30px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
    },
    formGroup: {
      marginBottom: '20px'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      fontWeight: '500',
      color: '#34495e',
      fontSize: '0.95rem'
    },
    input: {
      width: '100%',
      padding: '12px',
      border: '1px solid #dfe6e9',
      borderRadius: '8px',
      boxSizing: 'border-box',
      fontSize: '1rem',
      transition: 'border 0.3s ease'
    },
    textarea: {
      width: '100%',
      padding: '12px',
      border: '1px solid #dfe6e9',
      borderRadius: '8px',
      boxSizing: 'border-box',
      height: '120px',
      resize: 'vertical',
      fontSize: '1rem',
      transition: 'border 0.3s ease'
    },
    checkboxContainer: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '15px'
    },
    checkboxInput: {
      marginRight: '10px',
      width: '18px',
      height: '18px',
      cursor: 'pointer'
    },
    mealInputContainer: {
      display: 'flex',
      gap: '10px',
      marginBottom: '15px',
      flexWrap: 'wrap'
    },
    mealsPreview: {
      margin: '20px 0',
      padding: '15px',
      backgroundColor: '#f8f9fa',
      borderRadius: '8px'
    },
    mealsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
      gap: '15px',
      marginTop: '15px'
    },
    mealCard: {
      backgroundColor: 'white',
      padding: '15px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      position: 'relative'
    },
    mealDay: {
      fontWeight: '600',
      color: '#2c3e50',
      marginBottom: '5px'
    },
    mealRecipe: {
      color: '#7f8c8d'
    },
    removeButton: {
      position: 'absolute',
      top: '5px',
      right: '5px',
      background: 'none',
      border: 'none',
      color: '#e74c3c',
      cursor: 'pointer',
      fontSize: '16px'
    },
    formActions: {
      display: 'flex',
      gap: '15px',
      marginTop: '25px'
    },
    button: {
      padding: '12px 24px',
      backgroundColor: '#3498db',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '1rem',
      fontWeight: '500',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    buttonSecondary: {
      backgroundColor: '#95a5a6'
    },
    buttonDanger: {
      backgroundColor: '#e74c3c'
    },
    buttonSuccess: {
      backgroundColor: '#2ecc71'
    },
    plansList: {
      marginTop: '20px'
    },
    planItem: {
      backgroundColor: 'white',
      border: '1px solid #dfe6e9',
      borderRadius: '12px',
      padding: '25px',
      marginBottom: '25px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
      transition: 'transform 0.3s ease, box-shadow 0.3s ease'
    },
    planHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '15px',
      flexWrap: 'wrap',
      gap: '15px'
    },
    planTitle: {
      margin: 0,
      color: '#2c3e50',
      fontSize: '1.5rem',
      fontWeight: '600'
    },
    planActions: {
      display: 'flex',
      gap: '10px'
    },
    planDescription: {
      color: '#7f8c8d',
      marginBottom: '15px',
      lineHeight: '1.6'
    },
    planMeta: {
      display: 'flex',
      gap: '20px',
      marginBottom: '15px'
    },
    metaItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      color: '#34495e'
    },
    planMeals: {
      marginTop: '20px',
      paddingTop: '20px',
      borderTop: '1px solid #eee'
    },
    mealsHeading: {
      color: '#2c3e50',
      marginBottom: '15px',
      fontSize: '1.2rem'
    },
    mealList: {
      listStyle: 'none',
      paddingLeft: 0,
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
      gap: '15px'
    },
    mealListItem: {
      backgroundColor: '#f8f9fa',
      padding: '12px',
      borderRadius: '8px',
      borderLeft: '4px solid #3498db'
    },
    emptyState: {
      textAlign: 'center',
      padding: '40px',
      color: '#7f8c8d',
      backgroundColor: 'white',
      borderRadius: '12px',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
    },
    emptyStateHeading: {
      fontSize: '1.5rem',
      marginBottom: '15px',
      color: '#2c3e50'
    },
    notification: {
      padding: '15px',
      borderRadius: '8px',
      marginBottom: '20px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    successNotification: {
      backgroundColor: '#d5f5e3',
      color: '#27ae60',
      borderLeft: '4px solid #2ecc71'
    },
    errorNotification: {
      backgroundColor: '#fadbd8',
      color: '#e74c3c',
      borderLeft: '4px solid #e74c3c'
    },
    closeNotification: {
      background: 'none',
      border: 'none',
      color: 'inherit',
      cursor: 'pointer',
      fontSize: '18px',
      padding: '0 8px'
    },
    loadingIndicator: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '20px'
    },
    spinner: {
      border: '4px solid rgba(0, 0, 0, 0.1)',
      borderLeftColor: '#3498db',
      borderRadius: '50%',
      width: '30px',
      height: '30px',
      animation: 'spin 1s linear infinite'
    },
    statsContainer: {
      backgroundColor: 'white',
      padding: '20px',
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '15px',
      marginBottom: '25px'
    },
    statItem: {
      textAlign: 'center'
    },
    statValue: {
      fontSize: '24px',
      fontWeight: '600',
      color: '#3498db'
    },
    statLabel: {
      color: '#666',
      fontSize: '14px'
    },
    filtersContainer: {
      backgroundColor: 'white', 
      padding: '15px', 
      borderRadius: '8px',
      boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
      display: 'flex',
      gap: '15px',
      flexWrap: 'wrap',
      marginBottom: '20px'
    },
    filterGroup: {
      flex: 1,
      minWidth: '200px'
    },
    applyButtonContainer: {
      display: 'flex', 
      alignItems: 'flex-end',
      minWidth: '120px'
    }
  };

  return (
    <div style={styles.appContainer}>
      <h1 style={styles.heading}>🍽️ Meal Plan Manager</h1>
      
      {successMessage && (
        <div style={{ ...styles.notification, ...styles.successNotification }}>
          <span>✓ {successMessage}</span>
          <button onClick={closeNotification} style={styles.closeNotification}>×</button>
        </div>
      )}
      
      {errorMessage && (
        <div style={{ ...styles.notification, ...styles.errorNotification }}>
          <span>⚠️ {errorMessage}</span>
          <button onClick={closeNotification} style={styles.closeNotification}>×</button>
        </div>
      )}

      <div style={styles.tabsContainer}>
        <div 
          style={{ ...styles.tab, ...(activeTab === 'create' ? styles.activeTab : {}) }}
          onClick={() => setActiveTab('create')}
        >
          {editingId ? '✏️ Edit Plan' : '➕ Create Plan'}
        </div>
        <div 
          style={{ ...styles.tab, ...(activeTab === 'view' ? styles.activeTab : {}) }}
          onClick={() => setActiveTab('view')}
        >
          📋 View Plans
        </div>
      </div>

      {activeTab === 'create' && (
        <div style={styles.formContainer}>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Plan Title*</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
                placeholder="e.g., Healthy Week Plan"
                style={styles.input}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your meal plan..."
                style={styles.textarea}
              />
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Duration*</label>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                required
                style={styles.input}
              >
                {durationOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            
            <div style={styles.checkboxContainer}>
              <label style={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  name="isPublic"
                  checked={formData.isPublic}
                  onChange={handleInputChange}
                  style={styles.checkboxInput}
                />
                <span>Make this plan public</span>
              </label>
            </div>
            
            <div style={styles.formGroup}>
              <h3 style={{ ...styles.heading, fontSize: '1.2rem', margin: '20px 0 15px' }}>🍳 Add Meals</h3>
              <div style={styles.mealInputContainer}>
                <select
                  value={dayInput}
                  onChange={(e) => setDayInput(e.target.value)}
                  style={{ ...styles.input, flex: 1 }}
                >
                  <option value="">Select a day</option>
                  {availableDays.map(day => (
                    <option 
                      key={day} 
                      value={day}
                      disabled={formData.meals[day]}
                    >
                      {day} {formData.meals[day] ? '(already assigned)' : ''}
                    </option>
                  ))}
                </select>
                <input
                  type="text"
                  placeholder="Recipe (e.g., Chicken Salad)"
                  value={recipeInput}
                  onChange={(e) => setRecipeInput(e.target.value)}
                  style={{ ...styles.input, flex: 1 }}
                />
                <button 
                  type="button" 
                  onClick={handleMealAdd}
                  style={{ ...styles.button, ...styles.buttonSuccess, flex: 'none' }}
                  disabled={!dayInput || !recipeInput}
                >
                  Add Meal
                </button>
              </div>
              
              <div style={styles.mealsPreview}>
                <h4 style={{ margin: '0 0 10px', color: '#2c3e50' }}>
                  Meal Schedule Preview ({Object.keys(formData.meals).length}/{formData.duration} days filled)
                </h4>
                
                {Object.keys(formData.meals).length === 0 ? (
                  <p style={{ color: '#7f8c8d', textAlign: 'center', margin: '20px 0' }}>
                    No meals added yet. Add your first meal above!
                  </p>
                ) : (
                  <div style={styles.mealsGrid}>
                    {availableDays.map(day => (
                      <div key={day} style={styles.mealCard}>
                        <div style={styles.mealDay}>{day}</div>
                        {formData.meals[day] ? (
                          <>
                            <div style={styles.mealRecipe}>{formData.meals[day]}</div>
                            <button
                              type="button"
                              onClick={() => handleMealRemove(day)}
                              style={styles.removeButton}
                              aria-label={`Remove meal for ${day}`}
                            >
                              ×
                            </button>
                          </>
                        ) : (
                          <div style={{ ...styles.mealRecipe, color: '#bdc3c7' }}>No meal assigned</div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <div style={styles.formActions}>
              <button 
                type="submit" 
                style={styles.button}
                disabled={isLoading}
              >
                {isLoading ? (
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={styles.spinner}></span>
                    {editingId ? 'Updating...' : 'Creating...'}
                  </span>
                ) : (
                  editingId ? 'Update Plan' : 'Create Plan'
                )}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={resetForm}
                  style={{ ...styles.button, ...styles.buttonSecondary }}
                  disabled={isLoading}
                >
                  Cancel
                </button>
              )}
              <button 
                type="button" 
                onClick={() => setActiveTab('view')}
                style={{ ...styles.button, ...styles.buttonSecondary }}
                disabled={isLoading}
              >
                View All Plans
              </button>
            </div>
          </form>
        </div>
      )}

      {activeTab === 'view' && (
        <div style={styles.plansList}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '15px' }}>
            <h2 style={{ ...styles.heading, fontSize: '1.8rem', textAlign: 'left', margin: 0 }}>📋 Your Meal Plans</h2>
            <button 
              onClick={() => {
                resetForm();
                setActiveTab('create');
              }}
              style={styles.button}
            >
              ➕ Create New Plan
            </button>
          </div>
          
          {isLoading && plans.length === 0 ? (
            <div style={styles.loadingIndicator}>
              <div style={styles.spinner}></div>
            </div>
          ) : plans.length === 0 ? (
            <div style={styles.emptyState}>
              <h3 style={styles.emptyStateHeading}>No meal plans yet</h3>
              <p>Start by creating your first meal plan to organize your weekly meals!</p>
              <button 
                onClick={() => {
                  resetForm();
                  setActiveTab('create');
                }}
                style={{ ...styles.button, marginTop: '20px' }}
              >
                Create New Plan
              </button>
            </div>
          ) : (
            <>
              <div style={styles.statsContainer}>
                <div style={styles.statItem}>
                  <div style={{ ...styles.statValue, color: '#3498db' }}>{plans.length}</div>
                  <div style={styles.statLabel}>Total Plans</div>
                </div>
                <div style={styles.statItem}>
                  <div style={{ ...styles.statValue, color: '#2ecc71' }}>{plans.filter(p => p.isPublic).length}</div>
                  <div style={styles.statLabel}>Public Plans</div>
                </div>
                <div style={styles.statItem}>
                  <div style={{ ...styles.statValue, color: '#9b59b6' }}>
                    {plans.reduce((sum, plan) => sum + Object.keys(plan.meals).length, 0)}
                  </div>
                  <div style={styles.statLabel}>Total Meals Planned</div>
                </div>
                <div style={styles.statItem}>
                  <div style={{ ...styles.statValue, color: '#e67e22' }}>
                    {plans.reduce((sum, plan) => sum + plan.duration, 0)} days
                  </div>
                  <div style={styles.statLabel}>Total Duration</div>
                </div>
              </div>

              <div style={styles.filtersContainer}>
                <div style={styles.filterGroup}>
                  <label style={styles.label}>Filter by Duration</label>
                  <select
                    style={styles.input}
                    value={filterDuration}
                    onChange={(e) => setFilterDuration(e.target.value)}
                  >
                    <option value="">All Durations</option>
                    {durationOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div style={styles.filterGroup}>
                  <label style={styles.label}>Sort By</label>
                  <select
                    style={styles.input}
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                  >
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="title">Title (A-Z)</option>
                    <option value="duration">Duration (Shortest)</option>
                  </select>
                </div>
                <div style={styles.applyButtonContainer}>
                  <button 
                    style={{ ...styles.button, width: '100%', height: '42px' }}
                    onClick={() => fetchPlans()} // Refreshes with current filters
                  >
                    Apply Filters
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '25px' }}>
                {filteredAndSortedPlans().map((plan) => (
                  <div key={plan.id} style={{ 
                    ...styles.planItem,
                    position: 'relative',
                    overflow: 'hidden',
                    ':hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: '0 10px 20px rgba(0,0,0,0.1)'
                    }
                  }}>
                    {plan.isPublic && (
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '-30px',
                        backgroundColor: '#3498db',
                        color: 'white',
                        padding: '3px 30px',
                        transform: 'rotate(45deg)',
                        fontSize: '12px',
                        fontWeight: '600',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                      }}>
                        PUBLIC
                      </div>
                    )}
                    
                    <div style={styles.planHeader}>
                      <div>
                        <h3 style={styles.planTitle}>{plan.title}</h3>
                        <div style={{ 
                          display: 'flex', 
                          gap: '10px', 
                          alignItems: 'center',
                          marginTop: '5px'
                        }}>
                          <span style={{ 
                            backgroundColor: '#f0f0f0',
                            padding: '3px 8px',
                            borderRadius: '12px',
                            fontSize: '12px',
                            color: '#555'
                          }}>
                            {plan.duration} day{plan.duration !== 1 ? 's' : ''}
                          </span>
                          <span style={{ 
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            fontSize: '14px',
                            color: '#666'
                          }}>
                            {plan.isPublic ? '🌍 Public' : '🔒 Private'}
                          </span>
                        </div>
                      </div>
                      <div style={styles.planActions}>
                        <button 
                          onClick={() => handleEdit(plan)}
                          style={{ 
                            ...styles.button,
                            padding: '8px 15px',
                            fontSize: '14px'
                          }}
                          disabled={isLoading}
                        >
                          ✏️ Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(plan.id)}
                          style={{ 
                            ...styles.button, 
                            ...styles.buttonDanger,
                            padding: '8px 15px',
                            fontSize: '14px'
                          }}
                          disabled={isLoading}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                    
                    {plan.description && (
                      <p style={styles.planDescription}>
                        <strong>Description:</strong> {plan.description}
                      </p>
                    )}
                    
                    <div style={styles.planMeals}>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '15px'
                      }}>
                        <h4 style={styles.mealsHeading}>📅 Meal Schedule</h4>
                        <div style={{ 
                          fontSize: '14px',
                          color: '#666',
                          backgroundColor: '#f5f5f5',
                          padding: '4px 10px',
                          borderRadius: '12px'
                        }}>
                          {Object.keys(plan.meals).length} of {plan.duration} days planned
                        </div>
                      </div>
                      
                      {Object.keys(plan.meals).length === 0 ? (
                        <div style={{ 
                          backgroundColor: '#f9f9f9',
                          padding: '20px',
                          borderRadius: '8px',
                          textAlign: 'center',
                          color: '#888'
                        }}>
                          No meals added to this plan yet
                        </div>
                      ) : (
                        <div style={{ 
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                          gap: '15px'
                        }}>
                          {availableDays.slice(0, plan.duration).map(day => (
                            <div key={day} style={{ 
                              backgroundColor: plan.meals[day] ? '#f8f9fa' : '#fefefe',
                              borderLeft: `4px solid ${plan.meals[day] ? '#3498db' : '#eee'}`,
                              padding: '12px',
                              borderRadius: '6px',
                              position: 'relative',
                              border: '1px solid #eee'
                            }}>
                              <div style={{ 
                                fontWeight: '600',
                                marginBottom: '5px',
                                color: plan.meals[day] ? '#2c3e50' : '#95a5a6'
                              }}>
                                {day}
                              </div>
                              <div style={{ 
                                color: plan.meals[day] ? '#7f8c8d' : '#bdc3c7',
                                fontStyle: plan.meals[day] ? 'normal' : 'italic'
                              }}>
                                {plan.meals[day] || 'No meal planned'}
                              </div>
                              {plan.meals[day] && (
                                <div style={{
                                  position: 'absolute',
                                  top: '8px',
                                  right: '8px',
                                  width: '8px',
                                  height: '8px',
                                  backgroundColor: '#2ecc71',
                                  borderRadius: '50%'
                                }}></div>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                    
                    <div style={{ 
                      marginTop: '20px',
                      paddingTop: '15px',
                      borderTop: '1px solid #eee'
                    }}>
                      <div style={{ 
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '5px'
                      }}>
                        <span style={{ fontSize: '14px', color: '#666' }}>Plan completion:</span>
                        <span style={{ fontWeight: '600' }}>
                          {Math.round((Object.keys(plan.meals).length / plan.duration) * 100)}%
                        </span>
                      </div>
                      <div style={{ 
                        height: '8px',
                        backgroundColor: '#f0f0f0',
                        borderRadius: '4px',
                        overflow: 'hidden'
                      }}>
                        <div style={{ 
                          width: `${(Object.keys(plan.meals).length / plan.duration) * 100}%`,
                          height: '100%',
                          backgroundColor: '#2ecc71',
                          borderRadius: '4px',
                          transition: 'width 0.3s ease'
                        }}></div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default App;