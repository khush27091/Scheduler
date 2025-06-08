// src/pages/Login.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  TextField,
  Button,
  Typography,
  Box,
  Paper,
  Link
} from '@mui/material';
import axios from 'axios';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/login', {
        username: email,
        password,
      });

      if (res.status === 200) {
        localStorage.setItem('user', JSON.stringify(res.data.user));
        navigate('/dashboard');
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert('Invalid credentials');
      } else {
        alert('Server error, please try again later.');
      }
    }
  };

  const handleRegister = async () => {
    try {
      const res = await axios.post('http://localhost:5000/api/register', {
        username: email,
        password,
      });

      if (res.status === 201) {
        alert('Registration successful! Please login.');
        setIsRegistering(false);
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        alert('User already exists');
      } else {
        alert('Server error, please try again later.');
      }
    }
  };

  const handleSubmit = () => {
    if (isRegistering) {
      handleRegister();
    } else {
      handleLogin();
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ padding: 4, mt: 10 }}>
        <Typography variant="h4" gutterBottom>
          {isRegistering ? 'Register' : 'Login'}
        </Typography>
        <Box display="flex" flexDirection="column" gap={2}>
          <TextField
            label="Email"
            fullWidth
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button variant="contained" onClick={handleSubmit}>
            {isRegistering ? 'Register' : 'Login'}
          </Button>
          <Typography variant="body2" sx={{ mt: 2 }}>
            {isRegistering ? (
              <>
                Already have an account?{' '}
                <Link component="button" onClick={() => setIsRegistering(false)}>
                  Login here
                </Link>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <Link component="button" onClick={() => setIsRegistering(true)}>
                  Register here
                </Link>
              </>
            )}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;
