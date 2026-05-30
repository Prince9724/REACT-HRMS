import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './app/store';
import Login from './pages/Login';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import ProtectedRoute from './components/Common/ProtectedRoute';

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/employee" element={
            <ProtectedRoute allowedRoles={['employee']}>
              <EmployeeDashboard />
            </ProtectedRoute>
          } />
          <Route path="/manager/*" element={
            <ProtectedRoute allowedRoles={['manager']}>
              <ManagerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;