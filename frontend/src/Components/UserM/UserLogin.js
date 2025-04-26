import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already logged in via OAuth
    const checkAuth = async () => {
      try {
        const response = await axios.get('http://localhost:8081/oauth2/user', {
          withCredentials: true
        });
        
        if (response.data.authenticated) {
          localStorage.setItem('user', JSON.stringify(response.data));
          navigate('/home');
        }
      } catch (err) {
        console.log('Not authenticated');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post('http://localhost:8081/user-login', {
        emailAddress: formData.email,
        password: formData.password
      }, {
        withCredentials: true
      });

      localStorage.setItem('user', JSON.stringify(response.data));
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:8081/oauth2/authorization/google';
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>TasteShare</h1>
        <h2 style={{...styles.title, fontSize: '1.8rem', marginBottom: '10px'}}>Welcome Back!</h2>
        <p style={{color: '#457b9d', marginBottom: '30px'}}>Share your culinary creations with the world</p>
        
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            name="email"
            type="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
          />
          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {}),
            }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div style={styles.divider}>
          <div style={styles.dividerLine}></div>
          <span style={styles.dividerText}>OR</span>
          <div style={styles.dividerLine}></div>
        </div>

        <button
          onClick={handleGoogleLogin}
          style={styles.googleButton}
        >
          <img 
            src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" 
            alt="Google logo" 
            style={{width: '20px', marginRight: '10px'}}
          />
          Continue with Google
        </button>

        <p style={{marginTop: '20px', color: '#457b9d'}}>
          New to TasteShare? 
          <Link to="/user-register" style={styles.link}>
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px'
  },
  formContainer: {
    maxWidth: '450px',
    width: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: '40px',
    borderRadius: '15px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.2)',
    textAlign: 'center'
  },
  title: {
    color: '#e63946',
    fontSize: '2.2rem',
    fontWeight: '700',
    marginBottom: '30px',
    fontFamily: '"Pacifico", cursive, sans-serif'
  },
  input: {
    width: '100%',
    padding: '12px 15px',
    margin: '10px 0',
    border: '2px solid #f1faee',
    borderRadius: '8px',
    fontSize: '16px',
    backgroundColor: '#f1faee',
    transition: 'all 0.3s',
    outline: 'none'
  },
  button: {
    width: '100%',
    padding: '14px',
    margin: '20px 0',
    backgroundColor: '#e63946',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
  },
  buttonDisabled: {
    opacity: '0.7',
    cursor: 'not-allowed'
  },
  googleButton: {
    width: '100%',
    padding: '12px',
    margin: '10px 0',
    backgroundColor: 'white',
    color: '#333',
    border: '2px solid #f1faee',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  link: {
    color: '#457b9d',
    textDecoration: 'none',
    fontWeight: '600',
    marginLeft: '5px',
    transition: 'all 0.3s'
  },
  error: {
    backgroundColor: '#ffcdd2',
    color: '#d32f2f',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    border: '1px solid #ef9a9a'
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    margin: '20px 0',
    color: '#457b9d'
  },
  dividerLine: {
    flex: '1',
    height: '1px',
    backgroundColor: '#a8dadc'
  },
  dividerText: {
    padding: '0 10px',
    fontSize: '14px'
  }
};

export default Login;