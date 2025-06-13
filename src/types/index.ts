export interface User {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'doctor' | 'nurse' | 'patient';
  avatar?: string;
  createdAt: string;
  isActive: boolean;
}

export interface Appointment {
  id: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed' | 'cancelled';
  type: string;
  notes?: string;
  createdAt: string;
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  doctorName: string;
  diagnosis: string;
  treatment: string;
  prescription: string;
  notes?: string;
  date: string;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  isRead: boolean;
  createdAt: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  patientId?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
  createdAt: string;
}

export interface DashboardStats {
  totalUsers?: number;
  totalDoctors?: number;
  totalNurses?: number;
  totalPatients?: number;
  totalAppointments?: number;
  pendingAppointments?: number;
  completedAppointments?: number;
  activeAlerts?: number;
  todaysTasks?: number;
  completedTasks?: number;
}