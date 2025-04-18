import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    emailAddress: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('http://localhost:8081/user-register', {
        fullName: formData.fullName,
        emailAddress: formData.emailAddress,
        password: formData.password,
        confirmPassword: formData.confirmPassword
      }, {
        withCredentials: true
      });
      
      localStorage.setItem('user', JSON.stringify(response.data));
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formContainer}>
        <h1 style={styles.title}>TasteShare</h1>
        <h2 style={{...styles.title, fontSize: '1.8rem', marginBottom: '5px'}}>Join Our Community</h2>
        <p style={styles.subtitle}>Share your recipes and culinary adventures</p>
        
        {error && <div style={styles.error}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <input
            name="fullName"
            type="text"
            placeholder="Full Name"
            required
            value={formData.fullName}
            onChange={handleChange}
            style={styles.input}
          />
          <input
            name="emailAddress"
            type="email"
            placeholder="Email"
            required
            value={formData.emailAddress}
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
          <input
            name="confirmPassword"
            type="password"
            placeholder="Confirm Password"
            required
            value={formData.confirmPassword}
            onChange={handleChange}
            style={styles.input}
          />
          
          {formData.password && formData.confirmPassword && (
            <p style={formData.password === formData.confirmPassword ? styles.passwordMatch : styles.passwordMismatch}>
              {formData.password === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {}),
            }}
          >
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p style={{marginTop: '20px', color: '#457b9d'}}>
          Already have an account? 
          <Link to="/user-login" style={styles.link}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
};

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url("https://images.unsplash.com/photo-1546069901-ba9599a7e63c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80")',
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
    marginBottom: '15px',
    fontFamily: '"Pacifico", cursive, sans-serif'
  },
  subtitle: {
    color: '#457b9d',
    marginBottom: '30px',
    fontSize: '1rem'
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
  passwordMatch: {
    color: '#2e7d32',
    fontSize: '0.9rem',
    textAlign: 'left',
    marginTop: '-5px',
    marginBottom: '10px'
  },
  passwordMismatch: {
    color: '#d32f2f',
    fontSize: '0.9rem',
    textAlign: 'left',
    marginTop: '-5px',
    marginBottom: '10px'
  }
};

export default Register;