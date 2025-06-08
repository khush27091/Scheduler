import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import PublicBooking from './pages/PublicBooking';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';

function PrivateLayout() {
  // This layout shows Navbar + renders child routes via <Outlet />
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}

function App() {
  const user = localStorage.getItem('user');

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <Routes>
      {/* Redirect root */}
      <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />

      {/* Public route */}
      <Route path="/login" element={<Login />} />

      {/* Protected routes */}
      {user && (
        <Route element={<PrivateLayout />}>
          <Route path="/public/:bookingId" element={<PublicBooking />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>
      )}

      {/* Catch all: redirect to login */}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
    </LocalizationProvider>
  );
}

export default App;
