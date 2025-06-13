import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Shield, Stethoscope, Heart, User, ArrowLeft } from 'lucide-react';

interface LoginPageProps {
  role: 'super_admin' | 'doctor' | 'nurse' | 'patient';
}

const LoginPage: React.FC<LoginPageProps> = ({ role }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const getRoleConfig = () => {
    switch (role) {
      case 'super_admin':
        return {
          title: 'Super Admin Login',
          icon: Shield,
          defaultEmail: 'admin@medora.com',
          color: 'teal-700'
        };
      case 'doctor':
        return {
          title: 'Doctor Login',
          icon: Stethoscope,
          defaultEmail: 'doctor@medora.com',
          color: 'emerald-700'
        };
      case 'nurse':
        return {
          title: 'Nurse Login',
          icon: Heart,
          defaultEmail: 'nurse@medora.com',
          color: 'teal-600'
        };
      case 'patient':
        return {
          title: 'Patient Login',
          icon: User,
          defaultEmail: 'patient@medora.com',
          color: 'emerald-600'
        };
    }
  };

  const config = getRoleConfig();
  const IconComponent = config.icon;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(email, password, role);
      if (success) {
        window.location.href = '/dashboard';
      } else {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setEmail(config.defaultEmail);
    setPassword('demo123');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-800 to-emerald-700 text-white flex items-center justify-center p-4">
      {/* Back Button */}
      <button
        onClick={() => window.location.href = '/'}
        className="absolute top-6 left-6 flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Home</span>
      </button>

      {/* Login Container */}
      <div className="bg-white/90 text-teal-900 rounded-xl p-10 shadow-2xl w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="bg-teal-100 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 shadow-inner">
            <IconComponent className="h-10 w-10 text-teal-700" />
          </div>
          <h1 className="text-3xl font-bold font-display mb-2">{config.title}</h1>
          <p className="text-teal-700">Enter your credentials to access the dashboard</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-teal-800 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-teal-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition duration-300"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-teal-800 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-3 rounded-lg border border-teal-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition duration-300"
              placeholder="Enter your password"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <button
              type="button"
              onClick={handleDemoLogin}
              className="font-medium text-teal-700 hover:text-teal-600 transition-colors"
            >
              Use Demo Credentials
            </button>
            <a href="#" className="font-medium text-teal-700 hover:text-teal-600 transition-colors">
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-teal-700 text-white py-3 px-4 rounded-lg hover:bg-teal-800 transition duration-300 font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-teal-700">
            Need help? <a href="#" className="font-medium text-teal-800 hover:text-teal-900 transition-colors">Contact support</a>
          </p>
        </div>

        {/* Demo Credentials Info */}
        <div className="mt-6 p-4 bg-teal-50 rounded-lg">
          <h3 className="font-medium text-teal-800 mb-2">Demo Credentials:</h3>
          <p className="text-sm text-teal-700">
            <strong>Email:</strong> {config.defaultEmail}<br />
            <strong>Password:</strong> demo123
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;