
import React, { useState } from 'react';



function UserProfile({ username }) {
    const [activeTab, setActiveTab] = useState('recipes');
    
    return (
      <div className="profile-page">
        {/* Profile Header */}
        <div className="profile-header">
          <div className="avatar-container">
            <img src={user.avatar} alt={username} className="profile-avatar" />
            {isCurrentUser && <button className="edit-avatar-btn">Edit</button>}
          </div>
          
          <div className="profile-info">
            <h1>{user.name}</h1>
            <p className="bio">{user.bio || 'No bio yet'}</p>
            
            <div className="stats">
              <div className="stat">
                <span className="stat-number">{user.recipeCount}</span>
                <span className="stat-label">Recipes</span>
              </div>
              <div className="stat">
                <span className="stat-number">{user.followers}</span>
                <span className="stat-label">Followers</span>
              </div>
              <div className="stat">
                <span className="stat-number">{user.following}</span>
                <span className="stat-label">Following</span>
              </div>
            </div>
            
            {isCurrentUser ? (
              <button className="edit-profile-btn">Edit Profile</button>
            ) : (
              <button className="follow-btn">
                {isFollowing ? 'Following' : 'Follow'}
              </button>
            )}
          </div>
        </div>
        
        {/* Content Tabs */}
        <div className="profile-tabs">
          <button 
            className={activeTab === 'recipes' ? 'active' : ''}
            onClick={() => setActiveTab('recipes')}
          >
            Recipes
          </button>
          <button 
            className={activeTab === 'plans' ? 'active' : ''}
            onClick={() => setActiveTab('plans')}
          >
            Cooking Plans
          </button>
          <button 
            className={activeTab === 'challenges' ? 'active' : ''}
            onClick={() => setActiveTab('challenges')}
          >
            Challenges
          </button>
          <button 
            className={activeTab === 'social' ? 'active' : ''}
            onClick={() => setActiveTab('social')}
          >
            Following/Followers
          </button>
        </div>
        
        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'recipes' && (
            <RecipeGrid recipes={userRecipes} />
          )}
          
          {activeTab === 'plans' && (
            <PlanList plans={userPlans} />
          )}
          
          {activeTab === 'challenges' && (
            <ChallengeParticipation challenges={userChallenges} />
          )}
          
          {activeTab === 'social' && (
            <SocialConnections 
              followers={userFollowers} 
              following={userFollowing} 
            />
          )}
        </div>
      </div>
    );
  }
  
  export default UserProfile;