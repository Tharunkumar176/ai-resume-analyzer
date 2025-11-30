import { Navigate } from 'react-router-dom';
import { isAuthenticated } from '../services/authService';
import Loader from './Loader';

const ProtectedRoute = ({ children }) => {
  const auth = isAuthenticated();

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
