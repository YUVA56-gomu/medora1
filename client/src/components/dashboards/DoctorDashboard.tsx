import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { Calendar, Users, FileText, Clock, Plus, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const DoctorDashboard: React.FC = () => {
  const { appointments, medicalRecords, stats, addMedicalRecord, updateAppointment } = useData();
  const [activeTab, setActiveTab] = useState('overview');

  const doctorAppointments = appointments.filter(apt => apt.doctorId === '2'); // Current doctor ID
  const todaysAppointments = doctorAppointments.filter(apt => apt.date === new Date().toISOString().split('T')[0]);
  const pendingAppointments = doctorAppointments.filter(apt => apt.status === 'pending');

  const statsCards = [
    { title: 'Today\'s Appointments', value: todaysAppointments.length, icon: Calendar, color: 'blue' },
    { title: 'Pending Approvals', value: pendingAppointments.length, icon: Clock, color: 'yellow' },
    { title: 'Total Patients', value: '47', icon: Users, color: 'green' },
    { title: 'Medical Records', value: medicalRecords.length, icon: FileText, color: 'purple' },
  ];

  const handleAppointmentAction = (appointmentId: string, action: 'approved' | 'rejected') => {
    updateAppointment(appointmentId, { status: action });
  };

  const handleAddRecord = () => {
    const newRecord = {
      patientId: '4',
      doctorId: '2',
      patientName: 'John Doe',
      doctorName: 'Dr. Sarah Johnson',
      diagnosis: 'Sample Diagnosis',
      treatment: 'Sample Treatment',
      prescription: 'Sample Prescription',
      date: new Date().toISOString().split('T')[0],
    };
    addMedicalRecord(newRecord);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Good morning, Dr. Johnson!</h2>
        <p className="opacity-90">
          You have {todaysAppointments.length} appointments today and {pendingAppointments.length} pending approvals.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-emerald-500"
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
            {['overview', 'appointments', 'patients', 'records'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-emerald-500 text-emerald-600'
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
              {/* Today's Schedule */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Today's Schedule</h3>
                  <button className="text-emerald-600 hover:text-emerald-700 text-sm font-medium">
                    View All
                  </button>
                </div>
                <div className="space-y-3">
                  {todaysAppointments.length > 0 ? (
                    todaysAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{appointment.patientName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{appointment.time} - {appointment.type}</p>
                        </div>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          appointment.status === 'approved' ? 'bg-green-100 text-green-800' :
                          appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {appointment.status}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">No appointments today</p>
                  )}
                </div>
              </div>

              {/* Pending Approvals */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Pending Approvals</h3>
                <div className="space-y-3">
                  {pendingAppointments.length > 0 ? (
                    pendingAppointments.map((appointment) => (
                      <div key={appointment.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <div>
                            <p className="font-medium text-gray-900 dark:text-white">{appointment.patientName}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {appointment.date} at {appointment.time}
                            </p>
                          </div>
                          <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                            Pending
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{appointment.notes}</p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleAppointmentAction(appointment.id, 'approved')}
                            className="flex items-center space-x-1 px-3 py-1 bg-green-100 text-green-800 rounded-lg hover:bg-green-200 transition-colors text-sm"
                          >
                            <CheckCircle className="w-4 h-4" />
                            <span>Approve</span>
                          </button>
                          <button
                            onClick={() => handleAppointmentAction(appointment.id, 'rejected')}
                            className="flex items-center space-x-1 px-3 py-1 bg-red-100 text-red-800 rounded-lg hover:bg-red-200 transition-colors text-sm"
                          >
                            <XCircle className="w-4 h-4" />
                            <span>Reject</span>
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">No pending approvals</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All Appointments</h3>
                <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2">
                  <Plus className="w-4 h-4" />
                  <span>Schedule Appointment</span>
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Date & Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {doctorAppointments.map((appointment) => (
                      <tr key={appointment.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">{appointment.patientName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">{appointment.date}</div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">{appointment.time}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900 dark:text-white">{appointment.type}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            appointment.status === 'approved' ? 'bg-green-100 text-green-800' :
                            appointment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            appointment.status === 'completed' ? 'bg-blue-100 text-blue-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {appointment.status === 'pending' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleAppointmentAction(appointment.id, 'approved')}
                                className="text-green-600 hover:text-green-900"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleAppointmentAction(appointment.id, 'rejected')}
                                className="text-red-600 hover:text-red-900"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'patients' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">My Patients</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {['John Doe', 'Jane Smith', 'Mike Johnson'].map((patient, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold">
                        {patient.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{patient}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">Patient ID: P00{index + 1}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Last Visit:</span>
                        <span className="text-gray-900 dark:text-white">Dec 20, 2024</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Next Appointment:</span>
                        <span className="text-gray-900 dark:text-white">Dec 25, 2024</span>
                      </div>
                    </div>
                    <button className="w-full mt-4 bg-emerald-600 text-white py-2 rounded-lg hover:bg-emerald-700 transition-colors">
                      View Records
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'records' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Medical Records</h3>
                <button 
                  onClick={handleAddRecord}
                  className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Record</span>
                </button>
              </div>
              
              <div className="space-y-4">
                {medicalRecords.map((record) => (
                  <div key={record.id} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{record.patientName}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{record.date}</p>
                      </div>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
                        {record.diagnosis}
                      </span>
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
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;