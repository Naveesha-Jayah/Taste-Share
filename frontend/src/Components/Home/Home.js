import React from "react";

const TasteShareHome = () => {
  return (
    <div className="homepage">
      {/* Internal CSS */}
      <style>{`
        .homepage {
          font-family: 'Segoe UI', sans-serif;
          color: #333;
          background-color: #fff;
          padding: 0;
          margin: 0;
        }

        .navbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          background-color: #ff7043;
          padding: 1rem 2rem;
          color: #fff;
        }

        .navbar-logo {
          font-size: 1.5rem;
          font-weight: bold;
        }

        .navbar-links a {
          margin-left: 1rem;
          color: #fff;
          text-decoration: none;
        }

        .hero {
          background: url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092') no-repeat center center/cover;
          height: 400px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #fff;
          text-shadow: 1px 1px 4px #000;
          padding: 2rem;
        }

        .hero h1 {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .hero p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
        }

        .cta-buttons button {
          background-color: #ff5722;
          color: #fff;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 20px;
          margin: 0 0.5rem;
          cursor: pointer;
          font-weight: bold;
        }

        .section {
          padding: 2rem;
        }

        .section-title {
          font-size: 1.8rem;
          margin-bottom: 1rem;
        }

        .card-container {
          display: flex;
          gap: 1rem;
          overflow-x: auto;
        }

        .card {
          min-width: 250px;
          border-radius: 10px;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          overflow: hidden;
          background-color: #fafafa;
        }

        .card img {
          width: 100%;
          height: 150px;
          object-fit: cover;
        }

        .card-content {
          padding: 1rem;
        }

        .footer {
          background-color: #333;
          color: #ccc;
          padding: 2rem;
          text-align: center;
        }

        .footer a {
          color: #ff7043;
          margin: 0 1rem;
          text-decoration: none;
        }
      `}</style>

      {/* Navigation */}
      <header className="navbar">
        <div className="navbar-logo">TasteShare 🍽️</div>
        <nav className="navbar-links">
          <a href="#">Home</a>
          <a href="#">Recipes</a>
          <a href="#">Plans</a>
          <a href="#">Challenges</a>
          <a href="#">Community</a>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="hero">
        <h1>Where Passion for Cooking Meets Community</h1>
        <p>Share your recipes, explore cooking plans, and rise to the challenge!</p>
        <div className="cta-buttons">
          <button>🔥 Start Sharing</button>
          <button>👨‍🍳 Explore Recipes</button>
        </div>
      </section>

      {/* Featured Cooking Plans */}
      <section className="section">
        <h2 className="section-title">🍱 Featured Cooking Plans</h2>
        <div className="card-container">
          <div className="card">
            <img src="https://source.unsplash.com/300x150/?vegan" alt="Plan" />
            <div className="card-content">
              <h4>5-Day Vegan Challenge</h4>
              <p>By @ChefAnna</p>
            </div>
          </div>
          <div className="card">
            <img src="https://source.unsplash.com/300x150/?meal" alt="Plan" />
            <div className="card-content">
              <h4>Family Weeknight Dinners</h4>
              <p>By @HomeCookMike</p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Recipes */}
      <section className="section">
        <h2 className="section-title">🥘 Latest Recipes</h2>
        <div className="card-container">
          <div className="card">
            <img src="https://source.unsplash.com/300x150/?pasta" alt="Recipe" />
            <div className="card-content">
              <h4>Spicy Garlic Pasta</h4>
              <p>Likes: 112 • Comments: 8</p>
            </div>
          </div>
          <div className="card">
            <img src="https://source.unsplash.com/300x150/?dessert" alt="Recipe" />
            <div className="card-content">
              <h4>Chocolate Lava Cake</h4>
              <p>Likes: 203 • Comments: 15</p>
            </div>
          </div>
        </div>
      </section>

      {/* Cooking Challenges */}
      <section className="section">
        <h2 className="section-title">🏆 Ongoing Cooking Challenges</h2>
        <div className="card-container">
          <div className="card">
            <img src="https://source.unsplash.com/300x150/?cooking" alt="Challenge" />
            <div className="card-content">
              <h4>Best Pasta Dish</h4>
              <p>Deadline: 3 days left</p>
              <button>Join Challenge</button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <p>&copy; 2025 TasteShare. All rights reserved.</p>
        <p>
          <a href="#">About</a> |
          <a href="#">Contact</a> |
          <a href="#">Terms</a> |
          <a href="#">Privacy</a>
        </p>
      </footer>
    </div>
  );
};

export default TasteShareHome;
