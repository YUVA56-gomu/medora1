import { Router, Route, Switch, Redirect } from 'wouter';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Layout from './components/common/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import WelcomePage from './components/auth/WelcomePage';
import LoginPage from './components/auth/LoginPage';
import SuperAdminDashboard from './components/dashboards/SuperAdminDashboard';
import DoctorDashboard from './components/dashboards/DoctorDashboard';
import NurseDashboard from './components/dashboards/NurseDashboard';
import PatientDashboard from './components/dashboards/PatientDashboard';

const DashboardRouter: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return <Redirect to="/" />;
  }

  switch (user.role) {
    case 'super_admin':
      return <SuperAdminDashboard />;
    case 'doctor':
      return <DoctorDashboard />;
    case 'nurse':
      return <NurseDashboard />;
    case 'patient':
      return <PatientDashboard />;
    default:
      return <Redirect to="/" />;
  }
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Switch>
            {/* Public Routes */}
            <Route path="/">
              <WelcomePage />
            </Route>
            <Route path="/login/super_admin">
              <LoginPage role="super_admin" />
            </Route>
            <Route path="/login/doctor">
              <LoginPage role="doctor" />
            </Route>
            <Route path="/login/nurse">
              <LoginPage role="nurse" />
            </Route>
            <Route path="/login/patient">
              <LoginPage role="patient" />
            </Route>

            {/* Protected Dashboard Route */}
            <Route path="/dashboard">
              <ProtectedRoute>
                <Layout>
                  <DashboardRouter />
                </Layout>
              </ProtectedRoute>
            </Route>

            {/* Role-specific protected routes */}
            <Route path="/users">
              <ProtectedRoute allowedRoles={['super_admin']}>
                <Layout>
                  <SuperAdminDashboard />
                </Layout>
              </ProtectedRoute>
            </Route>

            <Route path="/appointments">
              <ProtectedRoute allowedRoles={['doctor', 'nurse']}>
                <Layout>
                  <DoctorDashboard />
                </Layout>
              </ProtectedRoute>
            </Route>

            <Route path="/my-appointments">
              <ProtectedRoute allowedRoles={['patient']}>
                <Layout>
                  <PatientDashboard />
                </Layout>
              </ProtectedRoute>
            </Route>

            {/* Catch all route */}
            <Route>
              <Redirect to="/" />
            </Route>
          </Switch>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
};

export default App;