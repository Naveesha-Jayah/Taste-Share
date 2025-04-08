import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const SignupPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    emailAddress: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiError, setApiError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.emailAddress.trim()) {
      newErrors.emailAddress = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(formData.emailAddress)) {
      newErrors.emailAddress = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      const response = await fetch('http://localhost:8081/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      const data = await response.json();
      console.log('Registration successful:', data);
      navigate('/registration-success'); // Redirect to success page
    } catch (error) {
      console.error('Registration error:', error);
      setApiError(error.message || 'An error occurred during registration');
    } finally {
      setIsSubmitting(false);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '80vh',
      padding: '20px',
    },
    card: {
      width: '100%',
      maxWidth: '400px',
      padding: '30px',
      borderRadius: '10px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      backgroundColor: '#fff',
    },
    title: {
      fontSize: '2rem',
      marginBottom: '20px',
      textAlign: 'center',
      color: '#333',
    },
    oauthButtons: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
      marginBottom: '25px',
    },
    oauthButton: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      padding: '12px',
      borderRadius: '5px',
      border: '1px solid #ddd',
      backgroundColor: '#fff',
      cursor: 'pointer',
      fontSize: '1rem',
      transition: 'all 0.3s ease',
    },
    oauthButtonHover: {
      backgroundColor: '#f9f9f9',
    },
    divider: {
      display: 'flex',
      alignItems: 'center',
      margin: '20px 0',
      color: '#666',
    },
    dividerLine: {
      flex: 1,
      borderBottom: '1px solid #ddd',
    },
    dividerText: {
      padding: '0 10px',
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '15px',
    },
    inputGroup: {
      display: 'flex',
      flexDirection: 'column',
      gap: '5px',
    },
    label: {
      fontSize: '0.9rem',
      color: '#555',
    },
    input: {
      padding: '12px',
      borderRadius: '5px',
      border: '1px solid #ddd',
      fontSize: '1rem',
    },
    error: {
      color: '#ff5252',
      fontSize: '0.8rem',
      marginTop: '5px',
    },
    submitButton: {
      padding: '12px',
      borderRadius: '5px',
      border: 'none',
      backgroundColor: '#ff6b6b',
      color: 'white',
      fontSize: '1rem',
      fontWeight: 'bold',
      cursor: 'pointer',
      marginTop: '10px',
      transition: 'background-color 0.3s ease',
    },
    submitButtonHover: {
      backgroundColor: '#ff5252',
    },
    submitButtonDisabled: {
      backgroundColor: '#ccc',
      cursor: 'not-allowed',
    },
    footer: {
      marginTop: '20px',
      textAlign: 'center',
      color: '#666',
    },
    link: {
      color: '#ff6b6b',
      textDecoration: 'none',
      fontWeight: '500',
    },
    linkHover: {
      textDecoration: 'underline',
    },
    apiError: {
      color: '#ff5252',
      textAlign: 'center',
      marginBottom: '15px',
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.title}>Join Our Platform</h1>
        
        {apiError && <div style={styles.apiError}>{apiError}</div>}
        
        <div style={styles.oauthButtons}>
          <button 
            style={styles.oauthButton}
            onClick={() => console.log('Google signup')}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.oauthButtonHover.backgroundColor}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.oauthButton.backgroundColor}
          >
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg" 
              alt="Google logo" 
              width="20" 
              height="20"
            />
            Continue with Google
          </button>
          <button 
            style={styles.oauthButton}
            onClick={() => console.log('Facebook signup')}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.oauthButtonHover.backgroundColor}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.oauthButton.backgroundColor}
          >
            <img 
              src="https://upload.wikimedia.org/wikipedia/commons/5/51/Facebook_f_logo_%282019%29.svg" 
              alt="Facebook logo" 
              width="20" 
              height="20"
            />
            Continue with Facebook
          </button>
        </div>
        
        <div style={styles.divider}>
          <div style={styles.dividerLine}></div>
          <div style={styles.dividerText}>or</div>
          <div style={styles.dividerLine}></div>
        </div>
        
        <form style={styles.form} onSubmit={handleSubmit} noValidate>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.fullName && <div style={styles.error}>{errors.fullName}</div>}
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input
              type="email"
              name="emailAddress"
              value={formData.emailAddress}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.emailAddress && <div style={styles.error}>{errors.emailAddress}</div>}
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.password && <div style={styles.error}>{errors.password}</div>}
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={styles.input}
            />
            {errors.confirmPassword && <div style={styles.error}>{errors.confirmPassword}</div>}
          </div>
          
          <button 
            type="submit" 
            style={{
              ...styles.submitButton,
              ...(isSubmitting ? styles.submitButtonDisabled : {}),
            }}
            disabled={isSubmitting}
            onMouseOver={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = styles.submitButtonHover.backgroundColor)}
            onMouseOut={(e) => !isSubmitting && (e.currentTarget.style.backgroundColor = styles.submitButton.backgroundColor)}
          >
            {isSubmitting ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div style={styles.footer}>
          <p>
            Already have an account?{' '}
            <Link 
              to="/login" 
              style={styles.link}
              onMouseOver={(e) => e.currentTarget.style.textDecoration = styles.linkHover.textDecoration}
              onMouseOut={(e) => e.currentTarget.style.textDecoration = 'none'}
            >
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;