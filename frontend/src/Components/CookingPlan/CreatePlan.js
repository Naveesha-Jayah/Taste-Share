import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [plans, setPlans] = useState([]);
  const [formData, setFormData] = useState({
    planTitle: '',
    planDescription: '',
    planDuration: '1-week',
    planDifficulty: 'Easy',
    planCategory: 'General',
    meals: {}
  });
  const [editingId, setEditingId] = useState(null);
  const [newMeal, setNewMeal] = useState('');
  const [selectedDay, setSelectedDay] = useState('Monday');

  const durationOptions = [
    { value: '1-week', label: '1 Week (Mon-Fri)' },
    { value: '2-weeks', label: '2 Weeks (Mon-Fri)' },
    { value: '1-month', label: '1 Month (Mon-Fri)' },
    { value: 'custom', label: 'Custom Duration' }
  ];

  const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await axios.get('http://localhost:8081/planing');
      setPlans(response.data);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    if (name === 'planDuration') {
      const initialMeals = {};
      weekDays.forEach(day => {
        initialMeals[day] = formData.meals[day] || [];
      });
      setFormData(prev => ({ ...prev, meals: initialMeals }));
    }
  };

  const handleAddMeal = () => {
    if (newMeal.trim() && selectedDay) {
      setFormData({
        ...formData,
        meals: {
          ...formData.meals,
          [selectedDay]: [...(formData.meals[selectedDay] || []), newMeal.trim()]
        }
      });
      setNewMeal('');
    }
  };

  const handleRemoveMeal = (day, index) => {
    const updatedMeals = {
      ...formData.meals,
      [day]: formData.meals[day].filter((_, i) => i !== index)
    };
    setFormData({ ...formData, meals: updatedMeals });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        meals: Object.entries(formData.meals).flatMap(([day, meals]) => 
          meals.map(meal => `${day}: ${meal}`)
        )
      };

      if (editingId) {
        await axios.put(`http://localhost:8081/planing/${editingId}`, payload);
      } else {
        await axios.post('http://localhost:8081/planing', payload);
      }
      resetForm();
      fetchPlans();
    } catch (error) {
      console.error('Error saving plan:', error);
    }
  };

  const handleEdit = (plan) => {
    const mealsObj = {};
    plan.meals.forEach(mealEntry => {
      const [day, ...mealParts] = mealEntry.split(': ');
      const meal = mealParts.join(': ');
      if (weekDays.includes(day)) {
        mealsObj[day] = [...(mealsObj[day] || []), meal];
      }
    });
    
    setFormData({
      planTitle: plan.planTitle,
      planDescription: plan.planDescription,
      planDuration: plan.planDuration,
      planDifficulty: plan.planDifficulty,
      planCategory: plan.planCategory,
      meals: mealsObj
    });
    setEditingId(plan.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:8081/planing/${id}`);
      fetchPlans();
    } catch (error) {
      console.error('Error deleting plan:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      planTitle: '',
      planDescription: '',
      planDuration: '1-week',
      planDifficulty: 'Easy',
      planCategory: 'General',
      meals: {}
    });
    setEditingId(null);
    setSelectedDay('Monday');
  };

  const displayMeals = (planMeals) => {
    const mealsByDay = {};
    planMeals.forEach(mealEntry => {
      const [day, ...mealParts] = mealEntry.split(': ');
      const meal = mealParts.join(': ');
      if (weekDays.includes(day)) {
        mealsByDay[day] = [...(mealsByDay[day] || []), meal];
      } else {
        mealsByDay['Other'] = [...(mealsByDay['Other'] || []), mealEntry];
      }
    });
    
    return Object.entries(mealsByDay).map(([day, meals]) => (
      <div key={day} style={styles.dayMeals}>
        <h5 style={styles.dayMealsHeader}>{day}:</h5>
        <ul style={styles.mealList}>
          {meals.map((meal, index) => (
            <li key={index} style={styles.mealListItem}>{meal}</li>
          ))}
        </ul>
      </div>
    ));
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
    plansSection: {
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
    daySelector: {
      display: 'flex',
      gap: '10px',
      marginBottom: '15px',
      flexWrap: 'wrap'
    },
    dayBtn: {
      padding: '8px 15px',
      backgroundColor: '#f0f0f0',
      border: 'none',
      borderRadius: '20px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      fontSize: '14px',
      ':hover': {
        backgroundColor: '#e0e0e0'
      }
    },
    activeDayBtn: {
      backgroundColor: '#4ecdc4',
      color: 'white',
      ':hover': {
        backgroundColor: '#3ebbb4'
      }
    },
    mealInputContainer: {
      display: 'flex',
      gap: '10px',
      marginBottom: '20px'
    },
    addMealBtn: {
      padding: '0 20px',
      backgroundColor: '#4ecdc4',
      color: 'white',
      border: 'none',
      borderRadius: '8px',
      cursor: 'pointer',
      transition: 'background-color 0.3s',
      ':hover': {
        backgroundColor: '#3ebbb4'
      }
    },
    dayMealsContainer: {
      backgroundColor: '#f9f9f9',
      padding: '15px',
      borderRadius: '8px',
      marginBottom: '20px'
    },
    dayMealsSection: {
      marginBottom: '15px'
    },
    mealTags: {
      display: 'flex',
      flexWrap: 'wrap',
      gap: '8px',
      marginTop: '8px'
    },
    mealTag: {
      backgroundColor: 'white',
      padding: '5px 10px',
      borderRadius: '15px',
      fontSize: '14px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '5px'
    },
    removeMealBtn: {
      backgroundColor: 'transparent',
      border: 'none',
      color: '#ff6b6b',
      cursor: 'pointer',
      fontSize: '16px',
      padding: '0',
      lineHeight: '1'
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
    plansGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '20px'
    },
    planCard: {
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
    planCardHeader: {
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
    planCardMeta: {
      display: 'flex',
      gap: '10px',
      marginBottom: '15px',
      fontSize: '14px',
      color: '#666'
    },
    planDescription: {
      marginBottom: '15px',
      color: '#444',
      lineHeight: '1.6'
    },
    planMeals: {
      marginTop: '15px',
      paddingTop: '15px',
      borderTop: '1px solid #eee'
    },
    planActions: {
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
    dayMeals: {
      marginBottom: '10px'
    },
    dayMealsHeader: {
      fontSize: '14px',
      marginBottom: '5px',
      color: '#555'
    },
    mealList: {
      listStyle: 'none',
      paddingLeft: '0',
      margin: '0'
    },
    mealListItem: {
      padding: '5px 0',
      borderBottom: '1px dashed #eee',
      fontSize: '14px'
    },
    noPlans: {
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
        <h1 style={{ color: '#292f36', marginBottom: '10px' }}>Meal Planning Platform</h1>
        <p style={{ color: '#666' }}>Organize your cooking plans by day</p>
      </header>

      <div style={styles.contentContainer}>
        <div style={styles.formSection}>
          <h2 style={{ marginBottom: '20px', color: '#292f36' }}>
            {editingId ? 'Edit Plan' : 'Create New Plan'}
          </h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Plan Title</label>
              <input
                type="text"
                name="planTitle"
                value={formData.planTitle}
                onChange={handleInputChange}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Description</label>
              <textarea
                name="planDescription"
                value={formData.planDescription}
                onChange={handleInputChange}
                required
                style={styles.textarea}
              />
            </div>

            <div style={styles.formRow}>
              <div style={{ ...styles.formGroup, flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Duration</label>
                <select
                  name="planDuration"
                  value={formData.planDuration}
                  onChange={handleInputChange}
                  required
                  style={styles.select}
                >
                  {durationOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div style={{ ...styles.formGroup, flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Difficulty</label>
                <select
                  name="planDifficulty"
                  value={formData.planDifficulty}
                  onChange={handleInputChange}
                  style={styles.select}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div style={{ ...styles.formGroup, flex: 1 }}>
                <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Category</label>
                <select
                  name="planCategory"
                  value={formData.planCategory}
                  onChange={handleInputChange}
                  style={styles.select}
                >
                  <option value="General">General</option>
                  <option value="Weight Loss">Weight Loss</option>
                  <option value="Muscle Gain">Muscle Gain</option>
                  <option value="Vegetarian">Vegetarian</option>
                  <option value="Vegan">Vegan</option>
                  <option value="Keto">Keto</option>
                </select>
              </div>
            </div>

            <div style={styles.formGroup}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: '500' }}>Meals by Day</label>
              <div style={styles.daySelector}>
                {weekDays.map(day => (
                  <button
                    type="button"
                    key={day}
                    style={{
                      ...styles.dayBtn,
                      ...(selectedDay === day ? styles.activeDayBtn : {})
                    }}
                    onClick={() => setSelectedDay(day)}
                  >
                    {day}
                  </button>
                ))}
              </div>
              
              <div style={styles.mealInputContainer}>
                <input
                  type="text"
                  value={newMeal}
                  onChange={(e) => setNewMeal(e.target.value)}
                  placeholder={`Add meal for ${selectedDay}`}
                  style={{ ...styles.input, flex: 1, marginTop: 0 }}
                />
                <button type="button" onClick={handleAddMeal} style={styles.addMealBtn}>
                  Add
                </button>
              </div>
              
              <div style={styles.dayMealsContainer}>
                {weekDays.map(day => (
                  <div key={day} style={styles.dayMealsSection}>
                    <h4 style={{ marginBottom: '10px', fontSize: '16px' }}>{day}</h4>
                    <div style={styles.mealTags}>
                      {(formData.meals[day] || []).map((meal, index) => (
                        <span key={index} style={styles.mealTag}>
                          {meal}
                          <button
                            type="button"
                            onClick={() => handleRemoveMeal(day, index)}
                            style={styles.removeMealBtn}
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={styles.formActions}>
              <button type="submit" style={styles.submitBtn}>
                {editingId ? 'Update Plan' : 'Create Plan'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} style={styles.cancelBtn}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div style={styles.plansSection}>
          <h2 style={{ marginBottom: '20px', color: '#292f36' }}>Your Meal Plans</h2>
          {plans.length === 0 ? (
            <p style={styles.noPlans}>No plans created yet. Start by creating one!</p>
          ) : (
            <div style={styles.plansGrid}>
              {plans.map((plan) => (
                <div key={plan.id} style={styles.planCard}>
                  <div style={styles.planCardHeader}>
                    <h3 style={{ margin: 0 }}>{plan.planTitle}</h3>
                    <span style={{
                      ...styles.difficultyBadge,
                      ...(plan.planDifficulty === 'Easy' ? styles.easyBadge : 
                          plan.planDifficulty === 'Medium' ? styles.mediumBadge : styles.hardBadge)
                    }}>
                      {plan.planDifficulty}
                    </span>
                  </div>
                  <div style={styles.planCardMeta}>
                    <span style={styles.duration}>
                      {durationOptions.find(d => d.value === plan.planDuration)?.label || plan.planDuration}
                    </span>
                    <span style={styles.category}>{plan.planCategory}</span>
                  </div>
                  <p style={styles.planDescription}>{plan.planDescription}</p>
                  <div style={styles.planMeals}>
                    <h4 style={{ marginBottom: '10px', fontSize: '16px' }}>Meals by Day:</h4>
                    {displayMeals(plan.meals)}
                  </div>
                  <div style={styles.planActions}>
                    <button onClick={() => handleEdit(plan)} style={styles.editBtn}>
                      Edit
                    </button>
                    <button onClick={() => handleDelete(plan.id)} style={styles.deleteBtn}>
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

export default App;