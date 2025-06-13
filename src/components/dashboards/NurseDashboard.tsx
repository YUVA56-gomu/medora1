import React, { useState } from 'react';
import { useData } from '../../context/DataContext';
import { ClipboardList, Heart, Users, AlertCircle, Plus, CheckCircle2, Clock, Activity } from 'lucide-react';

const NurseDashboard: React.FC = () => {
  const { tasks, appointments, stats, updateTask, addTask } = useData();
  const [activeTab, setActiveTab] = useState('overview');

  const nurseTasks = tasks.filter(task => task.assignedTo === '3'); // Current nurse ID
  const todaysTasks = nurseTasks.filter(task => task.dueDate === new Date().toISOString().split('T')[0]);
  const pendingTasks = nurseTasks.filter(task => task.status === 'pending');
  const completedTasks = nurseTasks.filter(task => task.status === 'completed');

  const statsCards = [
    { title: 'Today\'s Tasks', value: todaysTasks.length, icon: ClipboardList, color: 'blue' },
    { title: 'Pending Tasks', value: pendingTasks.length, icon: Clock, color: 'yellow' },
    { title: 'Completed Tasks', value: completedTasks.length, icon: CheckCircle2, color: 'green' },
    { title: 'Patient Alerts', value: '3', icon: AlertCircle, color: 'red' },
  ];

  const handleTaskStatusUpdate = (taskId: string, status: 'pending' | 'in_progress' | 'completed') => {
    updateTask(taskId, { status });
  };

  const handleAddTask = () => {
    const newTask = {
      title: 'New Patient Assessment',
      description: 'Complete initial assessment for new patient',
      assignedTo: '3',
      patientId: '4',
      priority: 'medium' as const,
      status: 'pending' as const,
      dueDate: new Date().toISOString().split('T')[0],
    };
    addTask(newTask);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-pink-500 to-rose-500 rounded-lg p-6 text-white">
        <h2 className="text-2xl font-bold mb-2">Hello, Nurse Mary!</h2>
        <p className="opacity-90">
          You have {pendingTasks.length} pending tasks and {todaysTasks.length} tasks scheduled for today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsCards.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow border-l-4 border-pink-500"
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
            {['overview', 'tasks', 'patients', 'vitals'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  activeTab === tab
                    ? 'border-pink-500 text-pink-600'
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
              {/* Today's Priority Tasks */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Priority Tasks Today</h3>
                  <button
                    onClick={handleAddTask}
                    className="text-pink-600 hover:text-pink-700 text-sm font-medium"
                  >
                    Add Task
                  </button>
                </div>
                <div className="space-y-3">
                  {todaysTasks.length > 0 ? (
                    todaysTasks.map((task) => (
                      <div key={task.id} className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-gray-900 dark:text-white">{task.title}</h4>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{task.description}</p>
                        <div className="flex items-center justify-between">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {task.status.replace('_', ' ')}
                          </span>
                          {task.status !== 'completed' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleTaskStatusUpdate(task.id, 'in_progress')}
                                className="text-blue-600 hover:text-blue-800 text-sm"
                              >
                                Start
                              </button>
                              <button
                                onClick={() => handleTaskStatusUpdate(task.id, 'completed')}
                                className="text-green-600 hover:text-green-800 text-sm"
                              >
                                Complete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-4">No tasks for today</p>
                  )}
                </div>
              </div>

              {/* Patient Alerts */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Patient Alerts</h3>
                <div className="space-y-3">
                  {[
                    { patient: 'John Doe', alert: 'High blood pressure reading', severity: 'high', time: '10 min ago' },
                    { patient: 'Jane Smith', alert: 'Medication due', severity: 'medium', time: '30 min ago' },
                    { patient: 'Mike Johnson', alert: 'Vitals check needed', severity: 'low', time: '1 hour ago' },
                  ].map((alert, index) => (
                    <div key={index} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 dark:text-white">{alert.patient}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          alert.severity === 'high' ? 'bg-red-100 text-red-800' :
                          alert.severity === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{alert.alert}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-500">{alert.time}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'tasks' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">All Tasks</h3>
                <button 
                  onClick={handleAddTask}
                  className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors flex items-center space-x-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Task</span>
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Task
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Patient
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Priority
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {nurseTasks.map((task) => (
                      <tr key={task.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{task.title}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{task.description}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="text-sm text-gray-900 dark:text-white">
                            {task.patientId ? 'John Doe' : 'General'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                            {task.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                            {task.status.replace('_', ' ')}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {task.dueDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {task.status !== 'completed' && (
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleTaskStatusUpdate(task.id, 'in_progress')}
                                className="text-blue-600 hover:text-blue-900"
                              >
                                Start
                              </button>
                              <button
                                onClick={() => handleTaskStatusUpdate(task.id, 'completed')}
                                className="text-green-600 hover:text-green-900"
                              >
                                Complete
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Patient Care</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                  { name: 'John Doe', room: 'Room 201', condition: 'Stable', lastCheck: '2 hours ago' },
                  { name: 'Jane Smith', room: 'Room 205', condition: 'Recovery', lastCheck: '1 hour ago' },
                  { name: 'Mike Johnson', room: 'Room 210', condition: 'Critical', lastCheck: '30 min ago' },
                ].map((patient, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-pink-600 rounded-full flex items-center justify-center text-white font-bold">
                        {patient.name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{patient.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{patient.room}</p>
                      </div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Condition:</span>
                        <span className={`font-medium ${
                          patient.condition === 'Critical' ? 'text-red-600' :
                          patient.condition === 'Recovery' ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {patient.condition}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Last Check:</span>
                        <span className="text-gray-900 dark:text-white">{patient.lastCheck}</span>
                      </div>
                    </div>
                    <div className="mt-4 flex space-x-2">
                      <button className="flex-1 bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition-colors text-sm">
                        Update Vitals
                      </button>
                      <button className="flex-1 border border-pink-600 text-pink-600 py-2 rounded-lg hover:bg-pink-50 transition-colors text-sm">
                        View Chart
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'vitals' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Patient Vitals</h3>
              <div className="space-y-6">
                {[
                  { 
                    name: 'John Doe', 
                    room: 'Room 201',
                    vitals: {
                      bloodPressure: '120/80',
                      heartRate: '72',
                      temperature: '98.6°F',
                      oxygenSat: '98%'
                    },
                    lastUpdated: '2 hours ago'
                  },
                  { 
                    name: 'Jane Smith', 
                    room: 'Room 205',
                    vitals: {
                      bloodPressure: '130/85',
                      heartRate: '68',
                      temperature: '99.1°F',
                      oxygenSat: '97%'
                    },
                    lastUpdated: '1 hour ago'
                  },
                ].map((patient, index) => (
                  <div key={index} className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium text-gray-900 dark:text-white">{patient.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{patient.room}</p>
                      </div>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Last updated: {patient.lastUpdated}
                      </span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Blood Pressure</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{patient.vitals.bloodPressure}</p>
                      </div>
                      <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Heart Rate</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{patient.vitals.heartRate} bpm</p>
                      </div>
                      <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Temperature</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{patient.vitals.temperature}</p>
                      </div>
                      <div className="text-center p-3 bg-white dark:bg-gray-800 rounded-lg">
                        <p className="text-sm text-gray-600 dark:text-gray-400">Oxygen Sat</p>
                        <p className="text-lg font-semibold text-gray-900 dark:text-white">{patient.vitals.oxygenSat}</p>
                      </div>
                    </div>
                    <button className="w-full mt-4 bg-pink-600 text-white py-2 rounded-lg hover:bg-pink-700 transition-colors">
                      Update Vitals
                    </button>
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

export default NurseDashboard;