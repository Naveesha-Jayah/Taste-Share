import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PlanBrowser = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [durationFilter, setDurationFilter] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('');

  // Mock data - replace with API calls
  const plans = [
    {
      id: 1,
      title: '7-Day Mediterranean Diet',
      description: 'A week of healthy Mediterranean meals',
      duration: 7,
      difficulty: 'medium',
      category: 'health',
      recipes: 21,
      followers: 56,
      image: 'https://via.placeholder.com/300x200?text=Med+Diet'
    },
    {
      id: 2,
      title: 'Vegetarian Week',
      description: 'Meat-free meals for the whole week',
      duration: 7,
      difficulty: 'easy',
      category: 'vegetarian',
      recipes: 21,
      followers: 42,
      image: 'https://via.placeholder.com/300x200?text=Veg+Week'
    },
    {
      id: 3,
      title: 'Quick 30-Minute Meals',
      description: 'Fast and delicious meals for busy weeknights',
      duration: 5,
      difficulty: 'easy',
      category: 'quick',
      recipes: 5,
      followers: 38,
      image: 'https://via.placeholder.com/300x200?text=Quick+Meals'
    },
    {
      id: 4,
      title: 'Keto Meal Prep',
      description: 'Low-carb meals for the keto diet',
      duration: 5,
      difficulty: 'hard',
      category: 'health',
      recipes: 15,
      followers: 29,
      image: 'https://via.placeholder.com/300x200?text=Keto+Prep'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Plans' },
    { id: 'health', name: 'Health & Diet' },
    { id: 'vegetarian', name: 'Vegetarian' },
    { id: 'quick', name: 'Quick Meals' },
    { id: 'family', name: 'Family Friendly' }
  ];

  const filteredPlans = plans.filter(plan => {
    return (
      (activeCategory === 'all' || plan.category === activeCategory) &&
      (searchTerm === '' || plan.title.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (durationFilter === '' || plan.duration <= parseInt(durationFilter)) &&
      (difficultyFilter === '' || plan.difficulty === difficultyFilter)
    );
  });

  const styles = {
    container: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
    },
    title: {
      fontSize: '2rem',
      color: '#333',
    },
    createButton: {
      backgroundColor: '#ff6b6b',
      color: 'white',
      border: 'none',
      padding: '10px 20px',
      borderRadius: '5px',
      cursor: 'pointer',
      fontWeight: 'bold',
    },
    searchContainer: {
      marginBottom: '30px',
    },
    searchInput: {
      width: '100%',
      padding: '12px 20px',
      borderRadius: '30px',
      border: '1px solid #ddd',
      fontSize: '1rem',
      outline: 'none',
      boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
      marginBottom: '15px',
    },
    filtersContainer: {
      display: 'flex',
      gap: '15px',
      marginBottom: '20px',
    },
    filterSelect: {
      padding: '8px 12px',
      borderRadius: '5px',
      border: '1px solid #ddd',
      minWidth: '150px',
    },
    categories: {
      display: 'flex',
      gap: '10px',
      marginBottom: '30px',
      overflowX: 'auto',
      paddingBottom: '10px',
    },
    categoryButton: {
      padding: '8px 16px',
      borderRadius: '20px',
      border: '1px solid #ddd',
      backgroundColor: '#fff',
      cursor: 'pointer',
      whiteSpace: 'nowrap',
      transition: 'all 0.3s ease',
    },
    activeCategory: {
      backgroundColor: '#ff6b6b',
      color: 'white',
      borderColor: '#ff6b6b',
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '25px',
    },
    planCard: {
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s ease',
      cursor: 'pointer',
      '&:hover': {
        transform: 'translateY(-5px)',
      },
    },
    planImage: {
      width: '100%',
      height: '180px',
      objectFit: 'cover',
    },
    planContent: {
      padding: '15px',
    },
    planTitle: {
      fontSize: '1.2rem',
      margin: '0 0 10px',
      fontWeight: '600',
    },
    planDescription: {
      color: '#666',
      fontSize: '0.9rem',
      marginBottom: '15px',
    },
    planMeta: {
      display: 'flex',
      justifyContent: 'space-between',
      color: '#666',
      fontSize: '0.9rem',
    },
    metaItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
    },
    emptyState: {
      textAlign: 'center',
      padding: '50px',
      gridColumn: '1 / -1',
    },
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Cooking Plans</h1>
        <button 
          style={styles.createButton}
          onClick={() => navigate('/plans/new')}
        >
          + Create Plan
        </button>
      </div>

      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Search plans..."
          style={styles.searchInput}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        
        <div style={styles.filtersContainer}>
          <select
            style={styles.filterSelect}
            value={durationFilter}
            onChange={(e) => setDurationFilter(e.target.value)}
          >
            <option value="">Any Duration</option>
            <option value="3">3 days or less</option>
            <option value="7">7 days or less</option>
            <option value="14">14 days or less</option>
          </select>
          
          <select
            style={styles.filterSelect}
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
            <option value="">Any Difficulty</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
        
        <div style={styles.categories}>
          {categories.map(category => (
            <button
              key={category.id}
              style={{
                ...styles.categoryButton,
                ...(activeCategory === category.id ? styles.activeCategory : {})
              }}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </button>
          ))}
        </div>
      </div>

      <div style={styles.grid}>
        {filteredPlans.length > 0 ? (
          filteredPlans.map(plan => (
            <div 
              key={plan.id} 
              style={styles.planCard}
              onClick={() => navigate(`/plans/${plan.id}`)}
            >
              <img src={plan.image} alt={plan.title} style={styles.planImage} />
              <div style={styles.planContent}>
                <h3 style={styles.planTitle}>{plan.title}</h3>
                <p style={styles.planDescription}>{plan.description}</p>
                <div style={styles.planMeta}>
                  <span style={styles.metaItem}>
                    ⏱️ {plan.duration} days
                  </span>
                  <span style={styles.metaItem}>
                    🍽️ {plan.recipes} recipes
                  </span>
                  <span style={styles.metaItem}>
                    👥 {plan.followers}
                  </span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div style={styles.emptyState}>
            <h3>No plans found matching your criteria</h3>
            <p>Try adjusting your filters or create a new plan</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PlanBrowser;