import React, { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { useAuth } from '../../context/AuthContext';
import { Shield, Stethoscope, Heart, User, ArrowLeft } from 'lucide-react';

interface RegisterPageProps {
  role: 'super_admin' | 'doctor' | 'nurse' | 'patient';
}

const RegisterPage: React.FC<RegisterPageProps> = ({ role }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [, setLocation] = useLocation();

  const getRoleConfig = () => {
    switch (role) {
      case 'super_admin':
        return {
          title: 'Super Admin Registration',
          icon: Shield,
          color: 'teal-700',
          description: 'Create an admin account to manage the system'
        };
      case 'doctor':
        return {
          title: 'Doctor Registration',
          icon: Stethoscope,
          color: 'emerald-700',
          description: 'Join as a healthcare provider'
        };
      case 'nurse':
        return {
          title: 'Nurse Registration',
          icon: Heart,
          color: 'teal-600',
          description: 'Register to provide patient care'
        };
      case 'patient':
        return {
          title: 'Patient Registration',
          icon: User,
          color: 'emerald-600',
          description: 'Create an account to manage your health'
        };
    }
  };

  const config = getRoleConfig();
  const IconComponent = config.icon;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: role,
          isActive: true
        }),
      });

      if (response.ok) {
        // Auto-login after registration
        const loginResponse = await fetch('/api/auth/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            role: role
          }),
        });

        if (loginResponse.ok) {
          setLocation('/dashboard');
        } else {
          setLocation(`/login/${role}`);
        }
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-800 to-emerald-700 text-white flex items-center justify-center p-4">
      {/* Back Button */}
      <button
        onClick={() => setLocation('/')}
        className="absolute top-6 left-6 flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Back to Home</span>
      </button>

      {/* Registration Container */}
      <div className="bg-white/90 text-teal-900 rounded-xl p-10 shadow-2xl w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="bg-teal-100 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4 shadow-inner">
            <IconComponent className="h-10 w-10 text-teal-700" />
          </div>
          <h1 className="text-3xl font-bold font-display mb-2">{config.title}</h1>
          <p className="text-teal-700">{config.description}</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm font-medium text-teal-800 mb-1">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-teal-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition duration-300"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-teal-800 mb-1">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
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
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-teal-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition duration-300"
              placeholder="Create a password"
            />
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-teal-800 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 rounded-lg border border-teal-300 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition duration-300"
              placeholder="Confirm your password"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-teal-700 text-white py-3 px-4 rounded-lg hover:bg-teal-800 transition duration-300 font-semibold shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-teal-700">
            Already have an account?{' '}
            <Link 
              to={`/login/${role}`} 
              className="font-medium text-teal-800 hover:text-teal-900 transition-colors"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Role Information */}
        <div className="mt-6 p-4 bg-teal-50 rounded-lg">
          <h3 className="font-medium text-teal-800 mb-2">Account Type: {role.replace('_', ' ').toUpperCase()}</h3>
          <p className="text-sm text-teal-700">
            You are registering as a {role.replace('_', ' ')}. This will determine your access level and dashboard features.
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;