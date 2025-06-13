import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Calendar, FileText, Activity, Clock, Plus, Download, Eye } from 'lucide-react';

const PatientDashboard: React.FC = () => {
  const { appointments, medicalRecords, addAppointment } = useData();
  const [activeTab, setActiveTab] = useState('overview');

  const patientAppointments = appointments.filter(apt => apt.patientId === '4'); // Current patient ID
  const patientRecords = medicalRecords.filter(record => record.patientId === '4');
  const upcomingAppointments = patientAppointments.filter(apt => 
    new Date(apt.date) >= new Date() && apt.status === 'approved'
  );

  const statsCards = [
    { title: 'Upcoming Appointments', value: upcomingAppointments.length, icon: Calendar, color: 'blue' },
    { title: 'Medical Records', value: patientRecords.length, icon: FileText, color: 'green' },
    { title: 'Pending Requests', value: patientAppointments.filter(apt => apt.status === 'pending').length, icon: Clock, color: 'yellow' },
    { title: 'Health Score', value: '85%', icon: Activity, color: 'purple' },
  ];

  const handleBookAppointment = () => {
    const newAppointment = {
      patientId: '4',
      doctorId: '2',
      patientName: 'John Doe',
      doctorName: 'Dr. Sarah Johnson',
      date: '2024-12-30',
      time: '10:00',
      status: 'pending' as const,
      type: 'General Consultation',
      notes: 'Regular checkup appointment',
    };
    addAppointment(newAppointment);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Welcome back, John!</h2>
        <p className="opacity-90">
          You have {upcomingAppointments.length} upcoming appointments and {patientRecords.length} medical records available.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-blue-500"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-full bg-${stat.color}-100`}>
                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {['overview', 'appointments', 'records', 'health'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Upcoming Appointments */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Appointments</h3>
                  <button
                    onClick={handleBookAppointment}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                  >
                    Book New
                  </button>
                </div>
                <div className="space-y-3">
                  {upcomingAppointments.length > 0 ? (
                    upcomingAppointments.map((appointment) => (
                      <div key={appointment.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">{appointment.doctorName}</h4>
                          <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                            {appointment.status}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {appointment.date} at {appointment.time}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.type}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">No upcoming appointments</p>
                  )}
                </div>
              </div>

              {/* Recent Records */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Recent Medical Records</h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {patientRecords.length > 0 ? (
                    patientRecords.slice(0, 3).map((record) => (
                      <div key={record.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">{record.diagnosis}</h4>
                          <span className="text-sm text-gray-500 dark:text-gray-400">{record.date}</span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{record.doctorName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{record.treatment}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">No medical records yet</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">My Appointments</h3>
                <button 
                  onClick={handleBookAppointment}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Book Appointment</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {patientAppointments.map((appointment) => (
                  <div key={appointment.id} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{appointment.doctorName}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.type}</p>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        appointment.status === 'approved' ? 'bg-green-100 text-green-800' :
                        appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {appointment.status}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 mb-1">Date:</p>
                        <p className="text-gray-900 dark:text-white">{appointment.date}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 mb-1">Time:</p>
                        <p className="text-gray-900 dark:text-white">{appointment.time}</p>
                      </div>
                    </div>
                    {appointment.notes && (
                      <div className="mt-4">
                        <p className="text-gray-600 dark:text-gray-400 mb-1">Notes:</p>
                        <p className="text-gray-900 dark:text-white text-sm">{appointment.notes}</p>
                      </div>
                    )}
                    <div className="mt-4 flex space-x-2">
                      <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">
                        Reschedule
                      </button>
                      <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm">
                        Cancel
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'records' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Medical Records</h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Download All</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {patientRecords.map((record) => (
                  <div key={record.id} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{record.diagnosis}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{record.doctorName} • {record.date}</p>
                      </div>
                      <div className="flex space-x-2">
                        <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-100 rounded-lg transition-colors">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 mb-1">Treatment:</p>
                        <p className="text-gray-900 dark:text-white">{record.treatment}</p>
                      </div>
                      <div>
                        <p className="text-gray-600 dark:text-gray-400 mb-1">Prescription:</p>
                        <p className="text-gray-900 dark:text-white">{record.prescription}</p>
                      </div>
                    </div>
                    {record.notes && (
                      <div className="mt-4">
                        <p className="text-gray-600 dark:text-gray-400 mb-1">Notes:</p>
                        <p className="text-gray-900 dark:text-white text-sm">{record.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'health' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Health Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Health Metrics */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Recent Vitals</h4>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Blood Pressure</span>
                      <span className="font-medium text-gray-900 dark:text-white">120/80 mmHg</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Heart Rate</span>
                      <span className="font-medium text-gray-900 dark:text-white">72 bpm</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">Weight</span>
                      <span className="font-medium text-gray-900 dark:text-white">165 lbs</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600 dark:text-gray-400">BMI</span>
                      <span className="font-medium text-gray-900 dark:text-white">24.2</span>
                    </div>
                  </div>
                </div>

                {/* Health Score */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Health Score</h4>
                  <div className="text-center">
                    <div className="relative w-32 h-32 mx-auto mb-4">
                      <div className="w-32 h-32 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-3xl font-bold text-blue-600">85%</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Your health score is based on recent vitals, appointments, and medical history.
                    </p>
                  </div>
                </div>

                {/* Medications */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Current Medications</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Lisinopril</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">10mg daily</p>
                      </div>
                      <span className="text-sm text-green-600">Active</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">Metformin</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">500mg twice daily</p>
                      </div>
                      <span className="text-sm text-green-600">Active</span>
                    </div>
                  </div>
                </div>

                {/* Allergies */}
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Allergies</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-gray-900 dark:text-white">Penicillin</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                      <span className="text-gray-900 dark:text-white">Shellfish</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PatientDashboard;