import React from 'react';
import { Shield, Stethoscope, Heart, User } from 'lucide-react';

const WelcomePage: React.FC = () => {
  const roles = [
    {
      title: 'Super Admin',
      icon: Shield,
      path: '/login/super_admin',
      description: 'System administration and user management'
    },
    {
      title: 'Doctor',
      icon: Stethoscope,
      path: '/login/doctor',
      description: 'Patient care and medical consultations'
    },
    {
      title: 'Nurse',
      icon: Heart,
      path: '/login/nurse',
      description: 'Patient care and daily health monitoring'
    },
    {
      title: 'Patient',
      icon: User,
      path: '/login/patient',
      description: 'Access your health records and appointments'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-800 to-emerald-700 text-white">
      {/* Header Section */}
      <header className="text-center p-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-6xl font-bold font-display mb-6 tracking-tight animate-fade-in">
            Welcome to <span className="text-emerald-300">MEDORA</span>
          </h1>
          <p className="text-2xl font-light opacity-90 mb-10 animate-fade-in">
            Seamless Healthcare Management for Every Role
          </p>
        </div>
      </header>

      {/* Feature Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 px-10 my-12 max-w-7xl mx-auto">
        {roles.map((role, index) => {
          const IconComponent = role.icon;
          return (
            <div
              key={role.title}
              className="bg-white/90 text-teal-900 rounded-xl p-8 text-center shadow-2xl hover:shadow-teal-300/30 hover:-translate-y-2 transition-all duration-300 cursor-pointer animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => window.location.href = role.path}
            >
              <div className="bg-teal-100 w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 shadow-inner">
                <IconComponent className="h-8 w-8 text-teal-700" />
              </div>
              <h2 className="text-2xl font-bold mb-3 font-display">{role.title}</h2>
              <p className="text-teal-700 text-sm opacity-80">{role.description}</p>
            </div>
          );
        })}
      </section>

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-10 py-16">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold font-display mb-4">Comprehensive Healthcare Management</h2>
          <p className="text-xl opacity-90">Everything you need for modern healthcare administration</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="bg-white/20 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4">
              <Shield className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Secure & Compliant</h3>
            <p className="opacity-80">Enterprise-grade security with role-based access control</p>
          </div>
          
          <div className="text-center">
            <div className="bg-white/20 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4">
              <Heart className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Patient-Centered</h3>
            <p className="opacity-80">Streamlined workflows focused on quality patient care</p>
          </div>
          
          <div className="text-center">
            <div className="bg-white/20 w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4">
              <Stethoscope className="h-10 w-10" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Integrated Platform</h3>
            <p className="opacity-80">All healthcare management tools in one unified system</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center p-8 mt-auto bg-teal-900/70 backdrop-blur-sm">
        <p className="text-sm opacity-80 tracking-wide">
          Built with ❤️ for Hackathon 2024 | <span className="font-semibold opacity-100">Team MEDORA</span>
        </p>
      </footer>
    </div>
  );
};

export default WelcomePage;