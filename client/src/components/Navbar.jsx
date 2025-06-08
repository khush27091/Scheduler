import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { NavLink, useNavigate } from 'react-router-dom';

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // MUI theme primary light color for active background
  const activeButtonStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
  };

  return (
    <AppBar position="static" color="primary" elevation={3}>
      <Toolbar>
        <Typography variant="h6" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
          🗓️ SchedulerApp
        </Typography>

        {/* Wrap buttons inside Box with spacing */}
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
    

          <NavLink
            to="/dashboard"
            style={({ isActive }) => (isActive ? activeButtonStyle : undefined)}
          >
            <Button color="inherit" variant="text" sx={{ textTransform: 'none' }}>
              Dashboard
            </Button>
          </NavLink>

                {/* <NavLink
            to="/publicbooking"
            end
            style={({ isActive }) => (isActive ? activeButtonStyle : undefined)}
          >
            <Button color="inherit" variant="text" sx={{ textTransform: 'none' }}>
              PublicBooking
            </Button>
          </NavLink> */}

          <Button
            color="inherit"
            variant="text"
            sx={{ textTransform: 'none' }}
            onClick={handleLogout}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
