export enum Role {
  SUPER_ADMIN = "Super Admin",
  ADMIN = "Admin",
  PRINCIPAL = "Principal",
  TEACHER = "Teacher",
  PARENT = "Parent",
  RECEPTIONIST = "Receptionist",
  ACCOUNTANT = "Accountant"
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  avatarUrl?: string;
  phone?: string;
  rememberMe?: boolean;
}

export interface Teacher {
  id: string;
  userId: string;
  name: string;
  email: string;
  phone: string;
  qualification: string;
  joiningDate: string;
  assignedClassIds: string[];
  status: "Active" | "Inactive";
}

export interface Class {
  id: string;
  name: string;
  capacity: number;
  roomNumber: string;
  teacherId?: string; // Assigned Main Teacher
  assistantTeacherName?: string;
  status: "Active" | "Archived";
}

export interface ParentDetails {
  fatherName: string;
  fatherPhone: string;
  fatherEmail: string;
  fatherOccupation: string;
  motherName: string;
  motherPhone: string;
  motherEmail: string;
  motherOccupation: string;
  address: string;
}

export interface MedicalRecord {
  bloodGroup: string;
  allergies: string[];
  medicalConditions: string[];
  vaccinations: { name: string; status: "Completed" | "Pending" }[];
  pediatricianName: string;
  pediatricianPhone: string;
}

export interface PickupPerson {
  name: string;
  relation: string;
  phone: string;
  photoUrl?: string;
}

export interface Student {
  id: string;
  admissionNumber: string;
  rollNumber: string;
  name: string;
  dob: string;
  gender: "Male" | "Female" | "Other";
  classId: string;
  status: "Enrolled" | "Applied" | "Enquiry" | "Verified" | "Approved" | "Rejected";
  profilePhoto?: string;
  parentDetails: ParentDetails;
  medicalRecord: MedicalRecord;
  emergencyContact: { name: string; relation: string; phone: string };
  pickupPersons: PickupPerson[];
  transportRequired: boolean;
  previousSchool?: string;
  achievements: string[];
  remarks: string[];
  timeline: { date: string; title: string; description: string; type: string }[];
  aiSummary?: {
    summary: string;
    strengths: string[];
    weaknesses: string[];
    improvements: string[];
    learningStyle: string;
    attendancePrediction: string;
    behaviourAnalysis: string;
    parentMeetingSuggestions: string;
    homeworkSuggestions: string;
    personalizedLearningPlan: string;
    lastGenerated: string;
    offlineMode?: boolean;
  };
}

export interface AttendanceRecord {
  id: string;
  date: string; // YYYY-MM-DD
  studentId: string;
  status: "Present" | "Late" | "Leave" | "Holiday";
  remarks?: string;
  behaviour?: string; // e.g. "Excellent", "Cooperative", "Restless"
  health?: string; // e.g. "Healthy", "Mild Cough", "Slight Fever"
  markedBy: string; // Teacher/Admin name
}

export interface Homework {
  id: string;
  classId: string;
  title: string;
  instructions: string;
  dueDate: string;
  totalMarks: number;
  fileUrl?: string;
  fileName?: string;
  createdDate: string;
  createdBy: string;
}

export interface HomeworkSubmission {
  id: string;
  homeworkId: string;
  studentId: string;
  submissionDate: string;
  submittedFile?: string;
  submittedFileName?: string;
  marksObtained?: number;
  feedback?: string;
  status: "Submitted" | "Graded" | "Pending";
}

export interface PaymentHistory {
  id: string;
  amount: number;
  paymentDate: string;
  paymentMode: "Cash" | "Card" | "Online" | "UPI";
  receiptNumber: string;
  receivedBy: string;
}

export interface FeeRecord {
  id: string;
  studentId: string;
  academicYear: string;
  term: "Term 1" | "Term 2" | "Term 3";
  baseFee: number;
  transportFee: number;
  daycareFee: number;
  discount: number; // percentage or fixed
  lateFee: number;
  paidAmount: number;
  status: "Paid" | "Partial" | "Unpaid";
  paymentHistory: PaymentHistory[];
}

export interface ProgressReport {
  id: string;
  studentId: string;
  term: "Term 1" | "Term 2" | "Term 3";
  academicYear: string;
  metrics: {
    communication: number; // 1-5
    motorSkills: number; // 1-5
    creativity: number; // 1-5
    behaviour: number; // 1-5
    socialSkills: number; // 1-5
    learning: number; // 1-5
    reading: number; // 1-5
    writing: number; // 1-5
    speaking: number; // 1-5
    confidence: number; // 1-5
    participation: number; // 1-5
  };
  remarks: string;
  teacherId: string;
  lastUpdated: string;
}

export interface SchoolSettings {
  logoUrl?: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  academicYear: string;
  classTimings: string;
  holidayCalendar: { date: string; name: string }[];
}

export interface ActivityLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  role: Role;
  action: string;
  category: string; // "Student", "Admission", "Attendance", "Fees", "Homework", "Settings"
  details: string;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: "Announcement" | "Fee" | "Homework" | "Attendance" | "System" | "Birthday";
  recipientRole?: Role; // If general role announcement
  recipientUserId?: string; // If specific user
  read: boolean;
}
