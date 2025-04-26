import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
  const [plans, setPlans] = useState([]);
  const [formData, setFormData] = useState({
    planTitle: '',
    planDescription: '',
    planDuration: '1-week', // Changed to select options
    planDifficulty: 'Easy',
    planCategory: 'General',
    meals: {} // Changed to object with day keys
  });
  const [editingId, setEditingId] = useState(null);
  const [newMeal, setNewMeal] = useState('');
  const [selectedDay, setSelectedDay] = useState('Monday'); // Track selected day for meal input

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
    
    // Initialize meals structure when duration changes
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
        // Convert meals object to array for backend compatibility if needed
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
    // Convert array meals back to day-based object
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

  // Helper to display meals in card view
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
      <div key={day} className="day-meals">
        <h5>{day}:</h5>
        <ul>
          {meals.map((meal, index) => (
            <li key={index}>{meal}</li>
          ))}
        </ul>
      </div>
    ));
  };

  return (
    <div className="app-container">
      <header className="app-header">
        <h1>Meal Planning Platform</h1>
        <p>Organize your cooking plans by day</p>
      </header>

      <div className="content-container">
        <div className="form-section">
          <h2>{editingId ? 'Edit Plan' : 'Create New Plan'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Plan Title</label>
              <input
                type="text"
                name="planTitle"
                value={formData.planTitle}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="planDescription"
                value={formData.planDescription}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Duration</label>
                <select
                  name="planDuration"
                  value={formData.planDuration}
                  onChange={handleInputChange}
                  required
                >
                  {durationOptions.map(option => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Difficulty</label>
                <select
                  name="planDifficulty"
                  value={formData.planDifficulty}
                  onChange={handleInputChange}
                >
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>

              <div className="form-group">
                <label>Category</label>
                <select
                  name="planCategory"
                  value={formData.planCategory}
                  onChange={handleInputChange}
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

            <div className="form-group">
              <label>Meals by Day</label>
              <div className="day-selector">
                {weekDays.map(day => (
                  <button
                    type="button"
                    key={day}
                    className={`day-btn ${selectedDay === day ? 'active' : ''}`}
                    onClick={() => setSelectedDay(day)}
                  >
                    {day}
                  </button>
                ))}
              </div>
              
              <div className="meal-input-container">
                <input
                  type="text"
                  value={newMeal}
                  onChange={(e) => setNewMeal(e.target.value)}
                  placeholder={`Add meal for ${selectedDay}`}
                />
                <button type="button" onClick={handleAddMeal} className="add-meal-btn">
                  Add
                </button>
              </div>
              
              <div className="day-meals-container">
                {weekDays.map(day => (
                  <div key={day} className="day-meals-section">
                    <h4>{day}</h4>
                    <div className="meal-tags">
                      {(formData.meals[day] || []).map((meal, index) => (
                        <span key={index} className="meal-tag">
                          {meal}
                          <button
                            type="button"
                            onClick={() => handleRemoveMeal(day, index)}
                            className="remove-meal-btn"
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

            <div className="form-actions">
              <button type="submit" className="submit-btn">
                {editingId ? 'Update Plan' : 'Create Plan'}
              </button>
              {editingId && (
                <button type="button" onClick={resetForm} className="cancel-btn">
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="plans-section">
          <h2>Your Meal Plans</h2>
          {plans.length === 0 ? (
            <p className="no-plans">No plans created yet. Start by creating one!</p>
          ) : (
            <div className="plans-grid">
              {plans.map((plan) => (
                <div key={plan.id} className="plan-card">
                  <div className="plan-card-header">
                    <h3>{plan.planTitle}</h3>
                    <span className={`difficulty-badge ${plan.planDifficulty.toLowerCase()}`}>
                      {plan.planDifficulty}
                    </span>
                  </div>
                  <div className="plan-card-meta">
                    <span className="duration">
                      {durationOptions.find(d => d.value === plan.planDuration)?.label || plan.planDuration}
                    </span>
                    <span className="category">{plan.planCategory}</span>
                  </div>
                  <p className="plan-description">{plan.planDescription}</p>
                  <div className="plan-meals">
                    <h4>Meals by Day:</h4>
                    {displayMeals(plan.meals)}
                  </div>
                  <div className="plan-actions">
                    <button onClick={() => handleEdit(plan)} className="edit-btn">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(plan.id)} className="delete-btn">
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