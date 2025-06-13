import React, { createContext, useContext, useState, useEffect } from 'react';
import { Appointment, MedicalRecord, Notification, Task, DashboardStats } from '../types';

interface DataContextType {
  appointments: Appointment[];
  medicalRecords: MedicalRecord[];
  notifications: Notification[];
  tasks: Task[];
  stats: DashboardStats;
  addAppointment: (appointment: Omit<Appointment, 'id' | 'createdAt'>) => void;
  updateAppointment: (id: string, updates: Partial<Appointment>) => void;
  addMedicalRecord: (record: Omit<MedicalRecord, 'id' | 'createdAt'>) => void;
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => void;
  markNotificationRead: (id: string) => void;
  addTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  refreshData: () => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock data
const mockAppointments: Appointment[] = [
  {
    id: '1',
    patientId: '4',
    doctorId: '2',
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Johnson',
    date: '2024-12-25',
    time: '10:00',
    status: 'pending',
    type: 'Consultation',
    notes: 'Regular checkup',
    createdAt: '2024-12-20',
  },
  {
    id: '2',
    patientId: '4',
    doctorId: '2',
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Johnson',
    date: '2024-12-26',
    time: '14:30',
    status: 'approved',
    type: 'Follow-up',
    createdAt: '2024-12-21',
  },
];

const mockMedicalRecords: MedicalRecord[] = [
  {
    id: '1',
    patientId: '4',
    doctorId: '2',
    patientName: 'John Doe',
    doctorName: 'Dr. Sarah Johnson',
    diagnosis: 'Hypertension',
    treatment: 'Lifestyle modifications and medication',
    prescription: 'Lisinopril 10mg daily',
    notes: 'Monitor blood pressure weekly',
    date: '2024-12-20',
    createdAt: '2024-12-20',
  },
];

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Check vitals for Room 201',
    description: 'Monitor blood pressure and heart rate',
    assignedTo: '3',
    patientId: '4',
    priority: 'high',
    status: 'pending',
    dueDate: '2024-12-25',
    createdAt: '2024-12-24',
  },
  {
    id: '2',
    title: 'Administer medication',
    description: 'Give prescribed medication to patient',
    assignedTo: '3',
    priority: 'medium',
    status: 'completed',
    dueDate: '2024-12-24',
    createdAt: '2024-12-24',
  },
];

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [appointments, setAppointments] = useState<Appointment[]>(mockAppointments);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>(mockMedicalRecords);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [stats, setStats] = useState<DashboardStats>({});

  useEffect(() => {
    calculateStats();
  }, [appointments, medicalRecords, tasks]);

  const calculateStats = () => {
    const newStats: DashboardStats = {
      totalUsers: 156,
      totalDoctors: 23,
      totalNurses: 45,
      totalPatients: 88,
      totalAppointments: appointments.length,
      pendingAppointments: appointments.filter(a => a.status === 'pending').length,
      completedAppointments: appointments.filter(a => a.status === 'completed').length,
      activeAlerts: notifications.filter(n => !n.isRead).length,
      todaysTasks: tasks.filter(t => t.dueDate === new Date().toISOString().split('T')[0]).length,
      completedTasks: tasks.filter(t => t.status === 'completed').length,
    };
    setStats(newStats);
  };

  const addAppointment = (appointment: Omit<Appointment, 'id' | 'createdAt'>) => {
    const newAppointment: Appointment = {
      ...appointment,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setAppointments(prev => [...prev, newAppointment]);
  };

  const updateAppointment = (id: string, updates: Partial<Appointment>) => {
    setAppointments(prev => 
      prev.map(appointment => 
        appointment.id === id ? { ...appointment, ...updates } : appointment
      )
    );
  };

  const addMedicalRecord = (record: Omit<MedicalRecord, 'id' | 'createdAt'>) => {
    const newRecord: MedicalRecord = {
      ...record,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setMedicalRecords(prev => [...prev, newRecord]);
  };

  const addNotification = (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [...prev, newNotification]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id ? { ...notification, isRead: true } : notification
      )
    );
  };

  const addTask = (task: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...task,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, ...updates } : task
      )
    );
  };

  const refreshData = () => {
    calculateStats();
  };

  return (
    <DataContext.Provider value={{
      appointments,
      medicalRecords,
      notifications,
      tasks,
      stats,
      addAppointment,
      updateAppointment,
      addMedicalRecord,
      addNotification,
      markNotificationRead,
      addTask,
      updateTask,
      refreshData,
    }}>
      {children}
    </DataContext.Provider>
  );
};

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};