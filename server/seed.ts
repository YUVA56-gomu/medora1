import { db } from "./db";
import { users, appointments, medicalRecords, notifications, tasks } from "@shared/schema";

async function seed() {
  console.log("Seeding database...");

  // Check if users already exist
  const existingUsers = await db.select().from(users);
  if (existingUsers.length > 0) {
    console.log("Database already seeded");
    return;
  }

  // Insert demo users
  const demoUsers = await db.insert(users).values([
    {
      name: 'Admin User',
      email: 'admin@medora.com',
      password: 'demo123',
      role: 'super_admin',
      avatar: null,
      isActive: true,
    },
    {
      name: 'Dr. Sarah Johnson',
      email: 'doctor@medora.com',
      password: 'demo123',
      role: 'doctor',
      avatar: null,
      isActive: true,
    },
    {
      name: 'Nurse Mary Smith',
      email: 'nurse@medora.com',
      password: 'demo123',
      role: 'nurse',
      avatar: null,
      isActive: true,
    },
    {
      name: 'John Doe',
      email: 'patient@medora.com',
      password: 'demo123',
      role: 'patient',
      avatar: null,
      isActive: true,
    },
  ]).returning();

  console.log(`Created ${demoUsers.length} demo users`);

  // Insert some demo appointments
  const demoAppointments = await db.insert(appointments).values([
    {
      patientId: demoUsers[3].id, // John Doe
      doctorId: demoUsers[1].id,  // Dr. Sarah Johnson
      date: '2024-06-15',
      time: '10:00 AM',
      status: 'pending',
      type: 'General Checkup',
      notes: 'Routine health checkup',
    },
    {
      patientId: demoUsers[3].id, // John Doe
      doctorId: demoUsers[1].id,  // Dr. Sarah Johnson
      date: '2024-06-20',
      time: '2:00 PM',
      status: 'approved',
      type: 'Follow-up',
      notes: 'Follow-up appointment for test results',
    },
  ]).returning();

  console.log(`Created ${demoAppointments.length} demo appointments`);

  // Insert demo medical records
  const demoRecords = await db.insert(medicalRecords).values([
    {
      patientId: demoUsers[3].id, // John Doe
      doctorId: demoUsers[1].id,  // Dr. Sarah Johnson
      diagnosis: 'Hypertension',
      treatment: 'Lifestyle changes and medication',
      prescription: 'Lisinopril 10mg daily',
      notes: 'Patient responded well to treatment',
      date: '2024-06-10',
    },
  ]).returning();

  console.log(`Created ${demoRecords.length} demo medical records`);

  // Insert demo notifications
  const demoNotifications = await db.insert(notifications).values([
    {
      userId: demoUsers[3].id, // John Doe
      title: 'Appointment Reminder',
      message: 'You have an upcoming appointment on June 15th at 10:00 AM',
      type: 'info',
      isRead: false,
    },
    {
      userId: demoUsers[1].id, // Dr. Sarah Johnson
      title: 'New Appointment Request',
      message: 'Patient John Doe has requested an appointment',
      type: 'info',
      isRead: false,
    },
  ]).returning();

  console.log(`Created ${demoNotifications.length} demo notifications`);

  // Insert demo tasks
  const demoTasks = await db.insert(tasks).values([
    {
      title: 'Review Patient Charts',
      description: 'Review and update patient charts for morning appointments',
      assignedTo: demoUsers[2].id, // Nurse Mary Smith
      patientId: demoUsers[3].id,  // John Doe
      priority: 'medium',
      status: 'pending',
      dueDate: '2024-06-15',
    },
    {
      title: 'Prepare Examination Room',
      description: 'Prepare room 5 for Dr. Johnson\'s 10 AM appointment',
      assignedTo: demoUsers[2].id, // Nurse Mary Smith
      priority: 'high',
      status: 'in_progress',
      dueDate: '2024-06-15',
    },
  ]).returning();

  console.log(`Created ${demoTasks.length} demo tasks`);

  console.log("Database seeding completed successfully!");
}

seed().catch((error) => {
  console.error("Error seeding database:", error);
  process.exit(1);
});