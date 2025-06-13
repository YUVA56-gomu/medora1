// Re-export types from shared schema for consistency
export type {
  User,
  Appointment,
  MedicalRecord,
  Notification,
  Task,
  InsertUser,
  InsertAppointment,
  InsertMedicalRecord,
  InsertNotification,
  InsertTask
} from '@shared/schema';
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