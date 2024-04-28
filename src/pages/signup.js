import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Login from './login';
import supabase from '../config/supabaseClient';
import logo from "../assets/logo.png"

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: ''
  });

  const [signupSuccess, setSignupSuccess] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleChange = (event) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [event.target.name]: event.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            fullName: formData.fullName,
            role: selectedOption // Assuming role will be stored in user data
          }
        }
      });
      
      if (error) {
        throw error;
      } else {
        alert('Signup Success');
        setSignupSuccess(true);
      }
    } catch (error) {
      alert(error.message);
    }
  };

  if (signupSuccess) {
    navigate('/');
  }

  const renderForm = () => {
    return (
      <form style={styles.form} onSubmit={handleSubmit}>
        <input
          placeholder="Full Name"
          name="fullName"
          style={styles.input}
          onChange={handleChange}
          required
        />
        <input
          placeholder="Email"
          name="email"
          style={styles.input}
          type="email"
          onChange={handleChange}
          required
        />
        <input
          placeholder="Password"
          name="password"
          type="password"
          style={styles.input}
          onChange={handleChange}
          required
        />
        <button style={styles.button} type="submit">
          Submit
        </button>
      </form>
    );
  };

  return (
    <div>
      <div style={styles.header}>
        <div style={styles.logoContainer}>
          <Link to="/">
            <img src={logo} alt="Logo" style={styles.logo} />
          </Link>
          <div style={styles.textContainer}>
            <p style={styles.universityName}>Florida Atlantic University</p>
            <p style={styles.systemName}>Graduate Teaching Assistantship Management System</p>
          </div>
        </div>
        <div>
          <h1>Signup as</h1>
        </div>
      
      <div style={styles.container}>
        <div style={styles.card} onClick={() => setSelectedOption('applicant')}>
          <h2>Applicant</h2>
          {selectedOption === 'applicant' && renderForm()}
        </div>
        <div style={styles.card} onClick={() => setSelectedOption('admin')}>
          <h2>Administrator</h2>
          {selectedOption === 'admin' && renderForm()}
        </div>
        <div style={styles.card} onClick={() => setSelectedOption('committee')}>
          <h2>Committee Member</h2>
          {selectedOption === 'committee' && renderForm()}
        </div>
        <div style={styles.card} onClick={() => setSelectedOption('instructor')}>
          <h2>Instructor</h2>
          {selectedOption === 'instructor' && renderForm()}
        </div>
      </div>
      <div style={styles.centeredParagraph}>
        <p>
          Don't have an account? <Link to="/" style={styles.link}>Login</Link> 
        </p>
      </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row', // Change from 'column' to 'row'
    flexWrap: 'wrap', // Allow cards to wrap to the next row if needed
  },
  card: {
    flex: '1', // Make the card flexible to cover extra space
    minWidth: '250px', // Minimum width for the card
    padding: '50px',
    margin: '10px',
    backgroundColor: '#f0f0f0',
    borderRadius: '10px',
    textAlign: 'center',
    cursor: 'pointer',
  },
  form: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  input: {
    display: 'block',
    width: '100%',
    marginBottom: '10px'
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
  },
  centeredParagraph: {
    textAlign: 'center',
    marginTop: '20px',
  },
  link: {
    color: '#007bff'
  },
  header: {
    
    padding: '60px',
    textAlign: 'center',
  },
  logoContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: '250px', // Adjust width as needed
    height: 'auto', // Maintain aspect ratio
    marginRight: '10px',
  },
  textContainer: {
    textAlign: 'left',
  },
  universityName: {
    margin: '0',
    fontWeight: 'bold',
    fontSize: '54px',
  },
  systemName: {
    margin: '0',
    fontSize: '38px',
    color: '#555',
  },
};

export default SignUp;
