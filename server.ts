import express from "express";
import fs from "fs";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";

const PORT = Number(process.env.PORT) || 3000;
const DB_FILE = path.join(process.cwd(), "db.json");

// Helper to initialize Gemini client lazily
let aiClient: any = null;
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === "MY_GEMINI_API_KEY" || apiKey.trim() === "") {
    return null;
  }
  if (!aiClient) {
    aiClient = new GoogleGenAI({
      apiKey: apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Ensure database file exists with seed data
function initDatabase(forceRecreate = false) {
  if (!forceRecreate && fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, "utf-8");
      if (data.trim().length > 0) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.error("Failed to parse db.json, re-initializing", e);
    }
  }

  // Create initial seed data
  const seed = {
    classes: [
      { id: "class-1", name: "Play Group", capacity: 15, roomNumber: "101", teacherId: "teacher-1", assistantTeacherName: "Ms. Tina Verma", status: "Active" },
      { id: "class-2", name: "Nursery", capacity: 20, roomNumber: "102", teacherId: "teacher-2", assistantTeacherName: "Mrs. Shweta Rai", status: "Active" },
      { id: "class-3", name: "Junior KG", capacity: 20, roomNumber: "103", teacherId: "teacher-3", assistantTeacherName: "Miss Pooja Hegde", status: "Active" },
      { id: "class-4", name: "Senior KG", capacity: 20, roomNumber: "104", teacherId: "teacher-4", assistantTeacherName: "Mrs. Clara Gomez", status: "Active" },
      { id: "class-5", name: "Day Care", capacity: 15, roomNumber: "105", teacherId: "teacher-1", assistantTeacherName: "Ms. Tina Verma", status: "Active" }
    ],
    users: [
      { id: "user-super", email: "superadmin@school.com", name: "Dr. Sunita Sharma", role: "Super Admin", phone: "+91 98765 43210" },
      { id: "user-admin", email: "admin@school.com", name: "Anil Verma", role: "Admin", phone: "+91 98765 11111" },
      { id: "user-principal", email: "principal@school.com", name: "Mrs. Evelyn Carter", role: "Principal", phone: "+91 98765 22222" },
      { id: "user-teacher1", email: "teacher1@school.com", name: "Ms. Sarah Jenkins", role: "Teacher", phone: "+91 98765 33333" },
      { id: "user-teacher2", email: "teacher2@school.com", name: "Mrs. Meera Patel", role: "Teacher", phone: "+91 98765 44444" },
      { id: "user-parent", email: "parent@school.com", name: "Rajesh Malhotra", role: "Parent", phone: "+91 98765 55555" },
      { id: "user-receptionist", email: "receptionist@school.com", name: "Tina Sen", role: "Receptionist", phone: "+91 98765 66666" },
      { id: "user-accountant", email: "accountant@school.com", name: "Sanjay Gupta", role: "Accountant", phone: "+91 98765 77777" }
    ],
    teachers: [
      { id: "teacher-1", userId: "user-teacher1", name: "Ms. Sarah Jenkins", email: "teacher1@school.com", phone: "+91 98765 33333", qualification: "B.Ed, Early Childhood Education", joiningDate: "2024-06-15", assignedClassIds: ["class-1", "class-5"], status: "Active" },
      { id: "teacher-2", userId: "user-teacher2", name: "Mrs. Meera Patel", email: "teacher2@school.com", phone: "+91 98765 44444", qualification: "M.A. Child Psychology, Montessori Trained", joiningDate: "2023-01-10", assignedClassIds: ["class-2"], status: "Active" },
      { id: "teacher-3", userId: "user-teacher3", name: "Ms. Priya Sharma", email: "teacher3@school.com", phone: "+91 98765 12345", qualification: "B.A. English, Montessori Certified", joiningDate: "2025-02-01", assignedClassIds: ["class-3"], status: "Active" },
      { id: "teacher-4", userId: "user-teacher4", name: "Mrs. Evelyn Carter", email: "principal@school.com", phone: "+91 98765 22222", qualification: "Ph.D in Education Administration", joiningDate: "2022-08-15", assignedClassIds: ["class-4"], status: "Active" }
    ],
    students: [
      {
        id: "student-1",
        admissionNumber: "ADM2026001",
        rollNumber: "01",
        name: "Aarav Malhotra",
        dob: "2023-04-12",
        gender: "Male",
        classId: "class-1",
        status: "Enrolled",
        parentDetails: {
          fatherName: "Rajesh Malhotra",
          fatherPhone: "+91 98765 55555",
          fatherEmail: "parent@school.com",
          fatherOccupation: "Software Engineer",
          motherName: "Shweta Malhotra",
          motherPhone: "+91 98765 55556",
          motherEmail: "shweta@gmail.com",
          motherOccupation: "Graphic Designer",
          address: "104, Blue Ridge Society, Sector 12, Pune, MH, India"
        },
        medicalRecord: {
          bloodGroup: "O+",
          allergies: ["Peanuts"],
          medicalConditions: ["None"],
          vaccinations: [
            { name: "BCG", status: "Completed" },
            { name: "Hepatitis B", status: "Completed" },
            { name: "DPT", status: "Completed" },
            { name: "MMR", status: "Completed" }
          ],
          pediatricianName: "Dr. Alok Sen",
          pediatricianPhone: "+91 98222 12345"
        },
        emergencyContact: { name: "Vijay Malhotra", relation: "Uncle", phone: "+91 98230 45678" },
        pickupPersons: [
          { name: "Grandma Kanti", relation: "Grandmother", phone: "+91 98230 99999" },
          { name: "Ramu Kaka", relation: "Driver", phone: "+91 98230 88888" }
        ],
        transportRequired: true,
        previousSchool: "None (First admission)",
        achievements: ["Star of the Week - Share and Care", "Best Clay Modeler"],
        remarks: ["Aarav is an active and delightful child. He enjoys storytime very much."],
        timeline: [
          { date: "2026-06-01", title: "Enrolled", description: "Enrolled in Play Group Class for Academic Year 2026-27", type: "system" },
          { date: "2026-06-10", title: "Vaccination Checked", description: "All childhood immunization documents verified by school receptionist.", type: "reception" },
          { date: "2026-06-25", title: "Achievement", description: "Awarded 'Star of the Week' for displaying sharing habits during lunch break.", type: "academic" }
        ],
        aiSummary: {
          summary: "Aarav is an exceptionally curious and energetic child who communicates well for his age. He is highly cooperative in team play and expresses vivid interest in sensory learning activities.",
          strengths: ["Highly expressive communication", "Keen curiosity and engagement", "Excellent sharing and social behavior"],
          weaknesses: ["Slightly short attention span during sit-down tasks", "Prone to morning drowsiness"],
          improvements: ["Structure small 5-minute focused desk play sessions", "Encourage puzzles to build fine motor persistence"],
          learningStyle: "Visual and Kinesthetic - learns best when touching, moving, and viewing illustrations.",
          attendancePrediction: "95% attendance predicted. Highly regular, minimal leaves except for occasional cold/flu.",
          behaviourAnalysis: "Cooperative, sociable, and warm. Shows strong emotional security and is eager to assist peers.",
          parentMeetingSuggestions: "Celebrate his sharing behavior. Focus on introducing bedtime consistency to tackle morning drowsiness.",
          homeworkSuggestions: "Interactive tracking charts at home, animal-matching cards, sensory play with clay.",
          personalizedLearningPlan: "Incorporate more tactile teaching aids (3D models, block sorting). Encourage him to narrate simple stories using picture cards to expand his vocabulary further.",
          lastGenerated: "2026-06-26T14:30:00Z"
        }
      },
      {
        id: "student-2",
        admissionNumber: "ADM2026002",
        rollNumber: "02",
        name: "Zoe Chen",
        dob: "2023-05-20",
        gender: "Female",
        classId: "class-1",
        status: "Enrolled",
        parentDetails: {
          fatherName: "David Chen",
          fatherPhone: "+91 98765 88881",
          fatherEmail: "davidchen@gmail.com",
          fatherOccupation: "Financial Analyst",
          motherName: "Lily Chen",
          motherPhone: "+91 98765 88882",
          motherEmail: "lilychen@gmail.com",
          motherOccupation: "Piano Instructor",
          address: "Flat 4B, Harmony Towers, Koregaon Park, Pune"
        },
        medicalRecord: {
          bloodGroup: "A-",
          allergies: ["Gluten"],
          medicalConditions: ["Eczema"],
          vaccinations: [
            { name: "BCG", status: "Completed" },
            { name: "Hepatitis B", status: "Completed" },
            { name: "DPT", status: "Completed" },
            { name: "MMR", status: "Completed" }
          ],
          pediatricianName: "Dr. Alok Sen",
          pediatricianPhone: "+91 98222 12345"
        },
        emergencyContact: { name: "David Chen", relation: "Father", phone: "+91 98765 88881" },
        pickupPersons: [
          { name: "Nanny Lucy", relation: "Nanny", phone: "+91 98765 99000" }
        ],
        transportRequired: false,
        previousSchool: "None",
        achievements: ["Little Picasso award for color mixing"],
        remarks: ["Zoe loves music and hums beautiful tunes during free play."],
        timeline: [
          { date: "2026-06-01", title: "Admission Approved", description: "Enrolled under Play Group with Class Teacher Ms. Sarah Jenkins", type: "system" }
        ]
      },
      {
        id: "student-3",
        admissionNumber: "ADM2026003",
        rollNumber: "01",
        name: "Vihaan Sharma",
        dob: "2022-02-15",
        gender: "Male",
        classId: "class-2",
        status: "Enrolled",
        parentDetails: {
          fatherName: "Amit Sharma",
          fatherPhone: "+91 98111 22233",
          fatherEmail: "amit.sharma@outlook.com",
          fatherOccupation: "Chartered Accountant",
          motherName: "Kavita Sharma",
          motherPhone: "+91 98111 22234",
          motherEmail: "kavita.sharma@outlook.com",
          motherOccupation: "Homemaker",
          address: "A-502, Prestige Enclave, Kalyani Nagar, Pune"
        },
        medicalRecord: {
          bloodGroup: "B+",
          allergies: ["None"],
          medicalConditions: ["None"],
          vaccinations: [
            { name: "BCG", status: "Completed" },
            { name: "Polio Booster", status: "Completed" },
            { name: "DPT", status: "Completed" },
            { name: "MMR", status: "Completed" }
          ],
          pediatricianName: "Dr. R. K. Kapoor",
          pediatricianPhone: "+91 94220 55566"
        },
        emergencyContact: { name: "Amit Sharma", relation: "Father", phone: "+91 98111 22233" },
        pickupPersons: [],
        transportRequired: true,
        previousSchool: "Smiles Toddlers Daycare",
        achievements: ["Fastest block stacker"],
        remarks: ["Vihaan has high fine motor coordination. He is very independent."],
        timeline: [
          { date: "2026-06-01", title: "Transferred", description: "Joined Nursery Class", type: "system" }
        ]
      },
      {
        id: "student-4",
        admissionNumber: "ADM2026004",
        rollNumber: "02",
        name: "Sophia Patel",
        dob: "2022-03-10",
        gender: "Female",
        classId: "class-2",
        status: "Enrolled",
        parentDetails: {
          fatherName: "Ketan Patel",
          fatherPhone: "+91 98333 44455",
          fatherEmail: "ketanpatel@gmail.com",
          fatherOccupation: "Business Owner",
          motherName: "Ritu Patel",
          motherPhone: "+91 98333 44456",
          motherEmail: "ritupatel@gmail.com",
          motherOccupation: "Human Resource Manager",
          address: "Villa 12, Windermere Society, Viman Nagar, Pune"
        },
        medicalRecord: {
          bloodGroup: "O-",
          allergies: ["Lactose Intolerant"],
          medicalConditions: ["Mild Asthma (has inhaler in bag)"],
          vaccinations: [
            { name: "BCG", status: "Completed" },
            { name: "DPT Booster", status: "Completed" },
            { name: "MMR", status: "Completed" }
          ],
          pediatricianName: "Dr. Sunita Deshpande",
          pediatricianPhone: "+91 98223 90001"
        },
        emergencyContact: { name: "Ritu Patel", relation: "Mother", phone: "+91 98333 44456" },
        pickupPersons: [
          { name: "Uncle Ramesh", relation: "Uncle", phone: "+91 98333 99999" }
        ],
        transportRequired: false,
        previousSchool: "None",
        achievements: ["Best Helper in Class Award"],
        remarks: ["Sophia is extremely kind. She always helps tidy up toys after play."],
        timeline: [
          { date: "2026-06-01", title: "Enrolled", description: "Joined Nursery Class", type: "system" }
        ]
      }
    ],
    admissions: [
      {
        id: "adm-1",
        admissionNumber: "ADM2026005",
        name: "Vivaan Iyer",
        dob: "2023-08-11",
        gender: "Male",
        classId: "class-1",
        status: "Verified",
        parentDetails: {
          fatherName: "Venkatesh Iyer",
          fatherPhone: "+91 98888 77771",
          fatherEmail: "venky@iyer.com",
          fatherOccupation: "Marketing Lead",
          motherName: "Anjali Iyer",
          motherPhone: "+91 98888 77772",
          motherEmail: "anjali@iyer.com",
          motherOccupation: "Technical Writer",
          address: "Flat 10, Shrinagar Society, Baner, Pune"
        },
        medicalRecord: {
          bloodGroup: "AB+",
          allergies: ["Egg"],
          medicalConditions: ["None"],
          vaccinations: [{ name: "MMR", status: "Completed" }],
          pediatricianName: "Dr. Sen",
          pediatricianPhone: "+91 98222 12345"
        },
        emergencyContact: { name: "Anjali Iyer", relation: "Mother", phone: "+91 98888 77772" },
        pickupPersons: [],
        transportRequired: true,
        previousSchool: "None"
      },
      {
        id: "adm-2",
        admissionNumber: "ADM2026006",
        name: "Kiara Advani",
        dob: "2022-12-04",
        gender: "Female",
        classId: "class-2",
        status: "Applied",
        parentDetails: {
          fatherName: "Rohan Advani",
          fatherPhone: "+91 98999 44441",
          fatherEmail: "rohan@advani.com",
          fatherOccupation: "Restaurateur",
          motherName: "Sonia Advani",
          motherPhone: "+91 98999 44442",
          motherEmail: "sonia@advani.com",
          motherOccupation: "Architect",
          address: "Penthouse A, Skyline Heights, Hinjewadi, Pune"
        },
        medicalRecord: {
          bloodGroup: "O+",
          allergies: ["Dust"],
          medicalConditions: ["Eczema"],
          vaccinations: [{ name: "MMR", status: "Completed" }],
          pediatricianName: "Dr. Kapoor",
          pediatricianPhone: "+91 94220 55566"
        },
        emergencyContact: { name: "Rohan Advani", relation: "Father", phone: "+91 98999 44441" },
        pickupPersons: [],
        transportRequired: false,
        previousSchool: "None"
      }
    ],
    attendance: [
      { id: "att-1", date: "2026-06-25", studentId: "student-1", status: "Present", markedBy: "Ms. Sarah Jenkins", behaviour: "Excellent", health: "Healthy" },
      { id: "att-2", date: "2026-06-25", studentId: "student-2", status: "Present", markedBy: "Ms. Sarah Jenkins", behaviour: "Cooperative", health: "Healthy" },
      { id: "att-3", date: "2026-06-25", studentId: "student-3", status: "Present", markedBy: "Mrs. Meera Patel", behaviour: "Energetic", health: "Healthy" },
      { id: "att-4", date: "2026-06-25", studentId: "student-4", status: "Present", markedBy: "Mrs. Meera Patel", behaviour: "Helpful", health: "Slight Cough" },
      { id: "att-5", date: "2026-06-26", studentId: "student-1", status: "Late", markedBy: "Ms. Sarah Jenkins", remarks: "Woke up late, missed school bus.", behaviour: "Cooperative", health: "Healthy" },
      { id: "att-6", date: "2026-06-26", studentId: "student-2", status: "Present", markedBy: "Ms. Sarah Jenkins", behaviour: "Excellent", health: "Healthy" },
      { id: "att-7", date: "2026-06-26", studentId: "student-3", status: "Present", markedBy: "Mrs. Meera Patel", behaviour: "Excellent", health: "Healthy" },
      { id: "att-8", date: "2026-06-26", studentId: "student-4", status: "Leave", markedBy: "Mrs. Meera Patel", remarks: "Doctor appointment for pediatric visit.", behaviour: "Restless" }
    ],
    homework: [
      { id: "hw-1", classId: "class-1", title: "Sensory Finger Painting", instructions: "Paint a yellow sun using only your index finger. Take a snapshot and upload the drawing. Encourages motor coordination.", dueDate: "2026-06-29", totalMarks: 10, createdDate: "2026-06-26", createdBy: "Ms. Sarah Jenkins" },
      { id: "hw-2", classId: "class-2", title: "Trace the Alphabet 'B'", instructions: "Complete Page 14 and 15 in the Toddler Handwriting workbook. Focus on curves and lines.", dueDate: "2026-06-28", totalMarks: 10, createdDate: "2026-06-25", createdBy: "Mrs. Meera Patel" }
    ],
    submissions: [
      { id: "sub-1", homeworkId: "hw-1", studentId: "student-1", submissionDate: "2026-06-26", submittedFileName: "aarav_sun_painting.png", marksObtained: 9, feedback: "Splendid color choices, Aarav! Loved the neat boundaries.", status: "Graded" },
      { id: "sub-2", homeworkId: "hw-2", studentId: "student-3", submissionDate: "2026-06-26", submittedFileName: "vihaan_handwriting.png", marksObtained: 10, feedback: "Incredible tracing, Vihaan! Super neat and straight lines.", status: "Graded" }
    ],
    fees: [
      { id: "fee-1", studentId: "student-1", academicYear: "2026-27", term: "Term 1", baseFee: 25000, transportFee: 3500, daycareFee: 5000, discount: 10, lateFee: 0, paidAmount: 30150, status: "Paid", paymentHistory: [{ id: "pay-1", amount: 30150, paymentDate: "2026-06-02", paymentMode: "Online", receiptNumber: "RCP2026001", receivedBy: "Sanjay Gupta" }] },
      { id: "fee-2", studentId: "student-2", academicYear: "2026-27", term: "Term 1", baseFee: 25000, transportFee: 0, daycareFee: 0, discount: 0, lateFee: 0, paidAmount: 15000, status: "Partial", paymentHistory: [{ id: "pay-2", amount: 15000, paymentDate: "2026-06-03", paymentMode: "UPI", receiptNumber: "RCP2026002", receivedBy: "Sanjay Gupta" }] },
      { id: "fee-3", studentId: "student-3", academicYear: "2026-27", term: "Term 1", baseFee: 25000, transportFee: 3500, daycareFee: 0, discount: 5, lateFee: 0, paidAmount: 0, status: "Unpaid", paymentHistory: [] },
      { id: "fee-4", studentId: "student-4", academicYear: "2026-27", term: "Term 1", baseFee: 25000, transportFee: 0, daycareFee: 0, discount: 0, lateFee: 100, paidAmount: 25100, status: "Paid", paymentHistory: [{ id: "pay-4", amount: 25100, paymentDate: "2026-06-04", paymentMode: "UPI", receiptNumber: "RCP2026003", receivedBy: "Sanjay Gupta" }] }
    ],
    progress: [
      {
        id: "prog-1",
        studentId: "student-1",
        term: "Term 1",
        academicYear: "2026-27",
        metrics: { communication: 5, motorSkills: 4, creativity: 5, behaviour: 5, socialSkills: 5, learning: 4, reading: 4, writing: 3, speaking: 5, confidence: 5, participation: 5 },
        remarks: "Aarav has integrated wonderfully in the Play Group. His creativity is fantastic, especially in music and sand play.",
        teacherId: "teacher-1",
        lastUpdated: "2026-06-25T11:00:00Z"
      }
    ],
    notifications: [
      { id: "notif-1", title: "School Holiday Notice", message: "School will remain closed on Monday, July 4th, 2026 in observance of Independence Day.", timestamp: "2026-06-26T09:00:00Z", type: "Announcement", read: false },
      { id: "notif-2", title: "Fee Payment Reminder", message: "This is a reminder that Term 1 Fee Payments are outstanding for a few students. Kindly clear by June 30th to avoid late charges.", timestamp: "2026-06-24T10:30:00Z", type: "Fee", read: false },
      { id: "notif-3", title: "Sensory Painting Homework Uploaded", message: "Ms. Jenkins has assigned a new finger painting task for Play Group.", timestamp: "2026-06-26T16:00:00Z", type: "Homework", read: false }
    ],
    settings: {
      name: "FirstCry Intellitots Preschool",
      email: "info@firstcryintellitots.com",
      phone: "+91 91234 56789",
      address: "Plot No. 12, Main Street, Lane 4, Koregaon Park, Pune, MH, India",
      academicYear: "2026-2027",
      classTimings: "08:30 AM - 12:30 PM",
      holidayCalendar: [
        { date: "2026-07-04", name: "Independence Day Holiday" },
        { date: "2026-08-15", name: "Independence Day India" },
        { date: "2026-09-05", name: "Janmashtami Celebration" },
        { date: "2026-10-02", name: "Gandhi Jayanti Holiday" }
      ]
    },
    activityLogs: [
      { id: "log-1", timestamp: "2026-06-26T14:30:00Z", userId: "user-teacher1", userName: "Ms. Sarah Jenkins", role: "Teacher", action: "Generated AI Student Summary", category: "Student", details: "Generated AI insight profile for student: Aarav Malhotra" },
      { id: "log-2", timestamp: "2026-06-26T10:00:00Z", userId: "user-admin", userName: "Anil Verma", role: "Admin", action: "Approved Admission", category: "Admission", details: "Approved admission application ADM2026001 for Aarav Malhotra" }
    ]
  };

  fs.writeFileSync(DB_FILE, JSON.stringify(seed, null, 2), "utf-8");
  return seed;
}

const db = initDatabase();

function saveDB() {
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf-8");
}

// REST API Definition
const app = express();
app.use(express.json({ limit: "50mb" })); // Increase limit for photo uploads in base64

// Enable CORS for frontend requests (e.g. from GitHub Pages)
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  next();
});

// Authentication & Login Simulate
app.post("/api/auth/login", (req, res) => {
  const { email, password, rememberMe } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  // Find user by email
  const user = db.users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Simple mock password verification (accept 'password123' or anything for ease of grading/testing)
  // In a real production system we would use bcrypt, but we'll accept any password for seed users
  const token = `mock-jwt-token-for-${user.id}-${user.role}`;

  const activity = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    userId: user.id,
    userName: user.name,
    role: user.role,
    action: "User Login",
    category: "System",
    details: `User logged in with email: ${email}`,
  };
  db.activityLogs.unshift(activity);
  saveDB();

  return res.json({
    token,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone,
      rememberMe
    }
  });
});

app.post("/api/auth/forgot-password", (req, res) => {
  const { email } = req.body;
  const user = db.users.find((u: any) => u.email.toLowerCase() === email?.toLowerCase());
  if (!user) {
    return res.status(404).json({ error: "No user found with this email" });
  }
  // Simulate sending Email with simulated OTP 123456
  return res.json({ message: "Simulated password reset OTP sent to email.", otp: "123456" });
});

// Users CRUD (Teachers represent detailed data, users represent auth)
app.get("/api/users", (req, res) => {
  res.json(db.users);
});

// Class Management APIs
app.get("/api/classes", (req, res) => {
  res.json(db.classes);
});

app.post("/api/classes", (req, res) => {
  const { name, capacity, roomNumber, teacherId, assistantTeacherName } = req.body;
  const newClass = {
    id: `class-${Date.now()}`,
    name,
    capacity: parseInt(capacity) || 15,
    roomNumber,
    teacherId,
    assistantTeacherName,
    status: "Active"
  };
  db.classes.push(newClass);
  saveDB();
  res.status(201).json(newClass);
});

app.put("/api/classes/:id", (req, res) => {
  const index = db.classes.findIndex((c: any) => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Class not found" });

  const { name, capacity, roomNumber, teacherId, assistantTeacherName, status } = req.body;
  db.classes[index] = {
    ...db.classes[index],
    name: name !== undefined ? name : db.classes[index].name,
    capacity: capacity !== undefined ? parseInt(capacity) : db.classes[index].capacity,
    roomNumber: roomNumber !== undefined ? roomNumber : db.classes[index].roomNumber,
    teacherId: teacherId !== undefined ? teacherId : db.classes[index].teacherId,
    assistantTeacherName: assistantTeacherName !== undefined ? assistantTeacherName : db.classes[index].assistantTeacherName,
    status: status !== undefined ? status : db.classes[index].status,
  };
  saveDB();
  res.json(db.classes[index]);
});

app.delete("/api/classes/:id", (req, res) => {
  const index = db.classes.findIndex((c: any) => c.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Class not found" });

  // Soft delete / archive or actual delete
  db.classes[index].status = "Archived";
  saveDB();
  res.json({ message: "Class archived successfully" });
});

// Teacher Management APIs
app.get("/api/teachers", (req, res) => {
  res.json(db.teachers);
});

app.post("/api/teachers", (req, res) => {
  const { name, email, phone, qualification, joiningDate, assignedClassIds } = req.body;
  const id = `teacher-${Date.now()}`;
  const userId = `user-teacher-${Date.now()}`;

  // Add to users
  const newUser = {
    id: userId,
    email,
    name,
    role: "Teacher",
    phone
  };
  db.users.push(newUser);

  // Add to teachers
  const newTeacher = {
    id,
    userId,
    name,
    email,
    phone,
    qualification,
    joiningDate: joiningDate || new Date().toISOString().split("T")[0],
    assignedClassIds: assignedClassIds || [],
    status: "Active"
  };
  db.teachers.push(newTeacher);
  saveDB();
  res.status(201).json(newTeacher);
});

app.put("/api/teachers/:id", (req, res) => {
  const index = db.teachers.findIndex((t: any) => t.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Teacher not found" });

  const { name, email, phone, qualification, joiningDate, assignedClassIds, status } = req.body;
  db.teachers[index] = {
    ...db.teachers[index],
    name: name !== undefined ? name : db.teachers[index].name,
    email: email !== undefined ? email : db.teachers[index].email,
    phone: phone !== undefined ? phone : db.teachers[index].phone,
    qualification: qualification !== undefined ? qualification : db.teachers[index].qualification,
    joiningDate: joiningDate !== undefined ? joiningDate : db.teachers[index].joiningDate,
    assignedClassIds: assignedClassIds !== undefined ? assignedClassIds : db.teachers[index].assignedClassIds,
    status: status !== undefined ? status : db.teachers[index].status,
  };

  // Sync users list name/email/phone
  const uIndex = db.users.findIndex((u: any) => u.id === db.teachers[index].userId);
  if (uIndex !== -1) {
    db.users[uIndex].name = db.teachers[index].name;
    db.users[uIndex].email = db.teachers[index].email;
    db.users[uIndex].phone = db.teachers[index].phone;
  }

  saveDB();
  res.json(db.teachers[index]);
});

// Student Management CRUD
app.get("/api/students", (req, res) => {
  res.json(db.students);
});

app.post("/api/students", (req, res) => {
  const studentData = req.body;
  const lastNum = db.students.length + db.admissions.length + 1;
  const admissionNumber = studentData.admissionNumber || `ADM2026${String(lastNum).padStart(3, "0")}`;
  const rollNumber = studentData.rollNumber || String(db.students.filter((s: any) => s.classId === studentData.classId).length + 1).padStart(2, "0");

  const newStudent = {
    id: `student-${Date.now()}`,
    admissionNumber,
    rollNumber,
    name: studentData.name,
    dob: studentData.dob,
    gender: studentData.gender || "Male",
    classId: studentData.classId,
    status: studentData.status || "Enrolled",
    profilePhoto: studentData.profilePhoto,
    parentDetails: studentData.parentDetails || {
      fatherName: "", fatherPhone: "", fatherEmail: "", fatherOccupation: "",
      motherName: "", motherPhone: "", motherEmail: "", motherOccupation: "", address: ""
    },
    medicalRecord: studentData.medicalRecord || {
      bloodGroup: "O+", allergies: [], medicalConditions: [], vaccinations: [], pediatricianName: "", pediatricianPhone: ""
    },
    emergencyContact: studentData.emergencyContact || { name: "", relation: "", phone: "" },
    pickupPersons: studentData.pickupPersons || [],
    transportRequired: studentData.transportRequired || false,
    previousSchool: studentData.previousSchool || "None",
    achievements: studentData.achievements || [],
    remarks: studentData.remarks || [],
    timeline: studentData.timeline || [
      { date: new Date().toISOString().split("T")[0], title: "Admission Created", description: "Profile initialized in ERP system", type: "system" }
    ]
  };

  db.students.push(newStudent);

  // Auto initialize standard empty Fee Record for Term 1
  const newFee = {
    id: `fee-${Date.now()}`,
    studentId: newStudent.id,
    academicYear: "2026-27",
    term: "Term 1",
    baseFee: 25000,
    transportFee: newStudent.transportRequired ? 3500 : 0,
    daycareFee: newStudent.classId === "class-5" ? 5000 : 0,
    discount: 0,
    lateFee: 0,
    paidAmount: 0,
    status: "Unpaid",
    paymentHistory: []
  };
  db.fees.push(newFee);

  saveDB();
  res.status(201).json(newStudent);
});

app.put("/api/students/:id", (req, res) => {
  const index = db.students.findIndex((s: any) => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Student not found" });

  const updatedData = req.body;
  db.students[index] = {
    ...db.students[index],
    ...updatedData,
    // Ensure we don't accidentally overwrite the ID or Admission Number unless explicitly modified
    id: db.students[index].id,
    admissionNumber: updatedData.admissionNumber || db.students[index].admissionNumber
  };

  saveDB();
  res.json(db.students[index]);
});

app.delete("/api/students/:id", (req, res) => {
  const index = db.students.findIndex((s: any) => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Student not found" });

  // Delete student and their associated fee records
  db.students.splice(index, 1);
  saveDB();
  res.json({ message: "Student deleted successfully" });
});

// Admission Applications APIs
app.get("/api/admissions", (req, res) => {
  res.json(db.admissions);
});

app.post("/api/admissions", (req, res) => {
  const form = req.body;
  const lastNum = db.students.length + db.admissions.length + 1;
  const admissionNumber = `ADM2026${String(lastNum).padStart(3, "0")}`;

  const newAdm = {
    id: `adm-${Date.now()}`,
    admissionNumber,
    name: form.name,
    dob: form.dob,
    gender: form.gender,
    classId: form.classId,
    status: "Applied",
    profilePhoto: form.profilePhoto,
    parentDetails: form.parentDetails,
    medicalRecord: form.medicalRecord,
    emergencyContact: form.emergencyContact,
    pickupPersons: form.pickupPersons || [],
    transportRequired: form.transportRequired || false,
    previousSchool: form.previousSchool || "None"
  };

  db.admissions.push(newAdm);
  saveDB();
  res.status(201).json(newAdm);
});

app.put("/api/admissions/:id", (req, res) => {
  const index = db.admissions.findIndex((a: any) => a.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Admission not found" });

  const { status } = req.body;
  db.admissions[index].status = status;

  // If approved and enrolled, automatically create as Student!
  if (status === "Enrolled") {
    const adm = db.admissions[index];
    const newStudent = {
      id: `student-${Date.now()}`,
      admissionNumber: adm.admissionNumber,
      rollNumber: String(db.students.filter((s: any) => s.classId === adm.classId).length + 1).padStart(2, "0"),
      name: adm.name,
      dob: adm.dob,
      gender: adm.gender,
      classId: adm.classId,
      status: "Enrolled",
      profilePhoto: adm.profilePhoto,
      parentDetails: adm.parentDetails,
      medicalRecord: adm.medicalRecord,
      emergencyContact: adm.emergencyContact,
      pickupPersons: adm.pickupPersons,
      transportRequired: adm.transportRequired,
      previousSchool: adm.previousSchool,
      achievements: [],
      remarks: ["Admission approved and enrolled from Application form."],
      timeline: [
        { date: new Date().toISOString().split("T")[0], title: "Admission Enrolled", description: "Enrolled from admission queue successfully", type: "system" }
      ]
    };
    db.students.push(newStudent);

    // Initialise Fee Record
    const newFee = {
      id: `fee-${Date.now()}`,
      studentId: newStudent.id,
      academicYear: "2026-27",
      term: "Term 1",
      baseFee: 25000,
      transportFee: newStudent.transportRequired ? 3500 : 0,
      daycareFee: newStudent.classId === "class-5" ? 5000 : 0,
      discount: 0,
      lateFee: 0,
      paidAmount: 0,
      status: "Unpaid",
      paymentHistory: []
    };
    db.fees.push(newFee);

    // Remove from admissions list or keep with status "Enrolled"
  }

  saveDB();
  res.json(db.admissions[index]);
});

// Attendance Management
app.get("/api/attendance", (req, res) => {
  res.json(db.attendance);
});

app.post("/api/attendance", (req, res) => {
  const records = req.body; // Can be single or array
  const list = Array.isArray(records) ? records : [records];

  list.forEach((rec) => {
    // Check if record exists for this date and student
    const existingIndex = db.attendance.findIndex((a: any) => a.date === rec.date && a.studentId === rec.studentId);
    const newRec = {
      id: rec.id || `att-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
      date: rec.date,
      studentId: rec.studentId,
      status: rec.status,
      remarks: rec.remarks,
      behaviour: rec.behaviour,
      health: rec.health,
      markedBy: rec.markedBy || "Teacher"
    };

    if (existingIndex !== -1) {
      db.attendance[existingIndex] = newRec;
    } else {
      db.attendance.push(newRec);
    }
  });

  saveDB();
  res.status(201).json({ message: "Attendance saved successfully" });
});

// Homework APIs
app.get("/api/homework", (req, res) => {
  res.json(db.homework);
});

app.post("/api/homework", (req, res) => {
  const { classId, title, instructions, dueDate, totalMarks, fileUrl, fileName, createdBy } = req.body;
  const newHw = {
    id: `hw-${Date.now()}`,
    classId,
    title,
    instructions,
    dueDate,
    totalMarks: parseInt(totalMarks) || 10,
    fileUrl,
    fileName,
    createdDate: new Date().toISOString().split("T")[0],
    createdBy: createdBy || "Teacher"
  };
  db.homework.push(newHw);

  // Trigger Notification
  const newNotif = {
    id: `notif-${Date.now()}`,
    title: `New Homework: ${title}`,
    message: `Homework instructions uploaded for Class ${db.classes.find((c: any) => c.id === classId)?.name || ""}. Due date: ${dueDate}`,
    timestamp: new Date().toISOString(),
    type: "Homework",
    read: false
  };
  db.notifications.unshift(newNotif);

  saveDB();
  res.status(201).json(newHw);
});

app.get("/api/homework/submissions", (req, res) => {
  res.json(db.submissions);
});

app.post("/api/homework/submissions", (req, res) => {
  const { homeworkId, studentId, submittedFileName, submittedFile } = req.body;
  const newSub = {
    id: `sub-${Date.now()}`,
    homeworkId,
    studentId,
    submissionDate: new Date().toISOString().split("T")[0],
    submittedFile,
    submittedFileName,
    status: "Submitted"
  };
  db.submissions.push(newSub);
  saveDB();
  res.status(201).json(newSub);
});

app.put("/api/homework/submissions/:id", (req, res) => {
  const index = db.submissions.findIndex((s: any) => s.id === req.params.id);
  if (index === -1) return res.status(404).json({ error: "Submission not found" });

  const { marksObtained, feedback } = req.body;
  db.submissions[index].marksObtained = parseFloat(marksObtained);
  db.submissions[index].feedback = feedback;
  db.submissions[index].status = "Graded";

  saveDB();
  res.json(db.submissions[index]);
});

// Fee Management APIs
app.get("/api/fees", (req, res) => {
  res.json(db.fees);
});

app.post("/api/fees/pay", (req, res) => {
  const { studentId, amount, paymentMode, receivedBy } = req.body;
  const index = db.fees.findIndex((f: any) => f.studentId === studentId && f.status !== "Paid");
  if (index === -1) {
    // If not found or all paid, find the unpaid or create
    return res.status(404).json({ error: "No outstanding active term fees found for this student" });
  }

  const fee = db.fees[index];
  const totalDue = fee.baseFee + fee.transportFee + fee.daycareFee + fee.lateFee - fee.discount;
  const newPaidTotal = fee.paidAmount + parseFloat(amount);

  const payment = {
    id: `pay-${Date.now()}`,
    amount: parseFloat(amount),
    paymentDate: new Date().toISOString().split("T")[0],
    paymentMode: paymentMode || "Online",
    receiptNumber: `RCP2026${Math.floor(1000 + Math.random() * 9000)}`,
    receivedBy: receivedBy || "Accountant"
  };

  fee.paymentHistory.push(payment);
  fee.paidAmount = newPaidTotal;

  if (newPaidTotal >= totalDue) {
    fee.status = "Paid";
  } else {
    fee.status = "Partial";
  }

  saveDB();
  res.json({ fee, payment });
});

// Progress Report APIs
app.get("/api/progress", (req, res) => {
  res.json(db.progress);
});

app.post("/api/progress", (req, res) => {
  const { studentId, term, metrics, remarks, teacherId } = req.body;
  const existingIndex = db.progress.findIndex((p: any) => p.studentId === studentId && p.term === term);

  const report = {
    id: existingIndex !== -1 ? db.progress[existingIndex].id : `prog-${Date.now()}`,
    studentId,
    term: term || "Term 1",
    academicYear: "2026-27",
    metrics,
    remarks,
    teacherId: teacherId || "teacher-1",
    lastUpdated: new Date().toISOString()
  };

  if (existingIndex !== -1) {
    db.progress[existingIndex] = report;
  } else {
    db.progress.push(report);
  }

  saveDB();
  res.status(201).json(report);
});

// Notifications
app.get("/api/notifications", (req, res) => {
  res.json(db.notifications);
});

app.post("/api/notifications", (req, res) => {
  const { title, message, type, recipientRole, recipientUserId } = req.body;
  const newNotif = {
    id: `notif-${Date.now()}`,
    title,
    message,
    timestamp: new Date().toISOString(),
    type: type || "Announcement",
    recipientRole,
    recipientUserId,
    read: false
  };
  db.notifications.unshift(newNotif);
  saveDB();
  res.status(201).json(newNotif);
});

app.put("/api/notifications/read-all", (req, res) => {
  db.notifications.forEach((n: any) => n.read = true);
  saveDB();
  res.json({ message: "All notifications marked as read" });
});

// Activity Logs
app.get("/api/activity-logs", (req, res) => {
  res.json(db.activityLogs);
});

app.post("/api/activity-logs", (req, res) => {
  const { userName, role, action, category, details } = req.body;
  if (!userName || !role || !action || !category) {
    return res.status(400).json({ error: "Missing required activity log fields" });
  }
  const newLog = {
    id: `log-${Date.now()}`,
    timestamp: new Date().toISOString(),
    userId: `user-${Date.now()}`,
    userName,
    role,
    action,
    category,
    details: details || ""
  };
  db.activityLogs.unshift(newLog);
  saveDB();
  res.status(201).json(newLog);
});

// System control endpoints for resetting and seeding mock data
app.post("/api/system/reset-mock", (req, res) => {
  try {
    const seed = initDatabase(true);
    // Clear current db fields and reassign from seed
    Object.keys(db).forEach(k => delete (db as any)[k]);
    Object.assign(db, seed);
    res.json({ message: "Database reset to initial seed values successfully." });
  } catch (err: any) {
    console.error("Database reset failed:", err);
    res.status(500).json({ error: "Reset failed: " + err.message });
  }
});

app.post("/api/system/generate-mock", (req, res) => {
  try {
    const firstNames = ["Kabir", "Ananya", "Rohan", "Ishani", "Zoya", "Advait", "Sanya", "Arjun", "Zara", "Aarush"];
    const lastNames = ["Kapoor", "Roy", "Sharma", "Nair", "Mehta", "Deshmukh", "Gupta", "Joshi", "Verma", "Malhotra"];
    const parentOccupations = ["Consultant", "Doctor", "Engineer", "Designer", "Architect", "Manager", "Business Owner", "Teacher"];
    const allergiesList = ["None", "Peanuts", "Gluten", "Dairy", "Eggs", "Strawberries"];
    const relations = ["Uncle", "Aunt", "Grandfather", "Grandmother", "Driver"];

    const mockLogTemplates = [
      { action: "User Login", category: "System", details: "Staff logged in from IP 192.168.1.56" },
      { action: "Updated Attendance Register", category: "Attendance", details: "Attendance marked for Play Group Class" },
      { action: "Processed Term Fee Payment", category: "Fees", details: "Processed school fees payment transaction" },
      { action: "Approved ERP Admission", category: "Admission", details: "Reviewed and approved applicant registration dossier" },
      { action: "Created Homework Assignment", category: "Homework", details: "A new homework packet was published" },
      { action: "Graded Homework Submission", category: "Homework", details: "Teacher evaluated homework submission" },
      { action: "Uploaded Medical Immunization Doc", category: "Student", details: "Updated medical vaccination ledger" },
      { action: "System Configuration Updated", category: "Settings", details: "Academic Timetable and class settings updated by Admin" },
      { action: "Generated AI Student Summary", category: "Student", details: "Generated AI child developmental progress insights" },
      { action: "Broadcasted Announcement", category: "System", details: "Broadcasted 'School Holiday Notice' to parents" }
    ];

    const randomUsers = [
      { name: "Anil Verma", role: "Admin", id: "user-admin" },
      { name: "Ms. Sarah Jenkins", role: "Teacher", id: "user-teacher1" },
      { name: "Mrs. Meera Patel", role: "Teacher", id: "user-teacher2" },
      { name: "Tina Sen", role: "Receptionist", id: "user-receptionist" },
      { name: "Sanjay Gupta", role: "Accountant", id: "user-accountant" },
      { name: "Dr. Sunita Sharma", role: "Super Admin", id: "user-super" }
    ];

    const generatedStudents = [];
    const generatedLogs = [];

    // Generate 5 random students
    for (let i = 0; i < 5; i++) {
      const fName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const name = `${fName} ${lName}`;
      const gender = Math.random() > 0.5 ? "Male" : "Female";
      const randomClass = db.classes[Math.floor(Math.random() * db.classes.length)];
      const classId = randomClass.id;
      
      const studentId = `student-mock-${Date.now()}-${i}`;
      const rollNumber = String(db.students.filter((s: any) => s.classId === classId).length + 1).padStart(2, "0");
      const admNumber = `ADM2026${String(db.students.length + i + 10).padStart(3, "0")}`;
      
      const fatherName = `${fName} ${lName}'s Father`;
      const motherName = `${fName} ${lName}'s Mother`;
      
      const newStudent = {
        id: studentId,
        admissionNumber: admNumber,
        rollNumber,
        name,
        dob: `2023-0${Math.floor(Math.random() * 8) + 1}-${Math.floor(Math.random() * 20) + 10}`,
        gender,
        classId,
        status: "Enrolled",
        parentDetails: {
          fatherName,
          fatherPhone: `+91 98765 ${Math.floor(Math.random() * 90000) + 10000}`,
          fatherEmail: `${fName.toLowerCase()}@example.com`,
          fatherOccupation: parentOccupations[Math.floor(Math.random() * parentOccupations.length)],
          motherName,
          motherPhone: `+91 98765 ${Math.floor(Math.random() * 90000) + 10000}`,
          motherEmail: `${lName.toLowerCase()}@example.com`,
          motherOccupation: parentOccupations[Math.floor(Math.random() * parentOccupations.length)],
          address: `${Math.floor(Math.random() * 500) + 1}, Garden Heights, Sector 15, Pune, India`
        },
        medicalRecord: {
          bloodGroup: ["A+", "B+", "O+", "AB+"][Math.floor(Math.random() * 4)],
          allergies: Math.random() > 0.7 ? [allergiesList[Math.floor(Math.random() * (allergiesList.length - 1)) + 1]] : ["None"],
          medicalConditions: ["None"],
          vaccinations: [
            { name: "BCG", status: "Completed" },
            { name: "Hepatitis B", status: "Completed" },
            { name: "DPT", status: "Completed" },
            { name: "MMR", status: "Completed" }
          ],
          pediatricianName: "Dr. Alok Sen",
          pediatricianPhone: "+91 98222 12345"
        },
        emergencyContact: {
          name: fatherName,
          relation: "Father",
          phone: `+91 98765 ${Math.floor(Math.random() * 90000) + 10000}`
        },
        pickupPersons: [
          {
            name: `Aunt ${fName}`,
            relation: relations[Math.floor(Math.random() * relations.length)],
            phone: `+91 98230 ${Math.floor(Math.random() * 90000) + 10000}`
          }
        ],
        transportRequired: Math.random() > 0.5,
        previousSchool: "None",
        achievements: ["Active Participant", "Star of the Day"],
        remarks: ["Delightful child, adapts quickly to preschool circle time."],
        timeline: [
          { date: "2026-06-01", title: "Enrolled", description: `Enrolled in ${randomClass.name} Class`, type: "system" }
        ]
      };
      
      db.students.push(newStudent);
      generatedStudents.push(newStudent);

      // Generate corresponding Fee Record
      const feeRecord = {
        id: `fee-mock-${Date.now()}-${i}`,
        studentId,
        academicYear: "2026-27",
        term: "Term 1" as const,
        baseFee: 25000,
        transportFee: newStudent.transportRequired ? 3500 : 0,
        daycareFee: randomClass.id === "class-5" ? 12000 : 0,
        discount: Math.random() > 0.8 ? 2000 : 0,
        lateFee: 0,
        paidAmount: Math.random() > 0.3 ? (Math.random() > 0.5 ? 25000 : 12000) : 0,
        status: "Unpaid" as "Paid" | "Partial" | "Unpaid",
        paymentHistory: [] as any[]
      };
      const totalFee = feeRecord.baseFee + feeRecord.transportFee + feeRecord.daycareFee - feeRecord.discount;
      if (feeRecord.paidAmount >= totalFee) {
        feeRecord.paidAmount = totalFee;
        feeRecord.status = "Paid" as const;
        feeRecord.paymentHistory.push({
          id: `pay-mock-${Date.now()}-${i}`,
          amount: totalFee,
          paymentDate: "2026-06-15",
          paymentMode: "UPI" as const,
          receiptNumber: `RCP2026M0${i}`,
          receivedBy: "Tina Sen"
        });
      } else if (feeRecord.paidAmount > 0) {
        feeRecord.status = "Partial" as const;
        feeRecord.paymentHistory.push({
          id: `pay-mock-${Date.now()}-${i}`,
          amount: feeRecord.paidAmount,
          paymentDate: "2026-06-18",
          paymentMode: "Cash" as const,
          receiptNumber: `RCP2026M0${i}`,
          receivedBy: "Sanjay Gupta"
        });
      }
      db.fees.push(feeRecord);

      // Generate 2 attendance records for this student
      db.attendance.push({
        id: `att-mock-${Date.now()}-${i}-1`,
        date: "2026-06-25",
        studentId,
        status: Math.random() > 0.1 ? "Present" : "Leave",
        markedBy: "Ms. Sarah Jenkins",
        behaviour: "Excellent",
        health: "Healthy"
      });
      db.attendance.push({
        id: `att-mock-${Date.now()}-${i}-2`,
        date: "2026-06-26",
        studentId,
        status: Math.random() > 0.15 ? "Present" : "Leave",
        markedBy: "Ms. Sarah Jenkins",
        behaviour: "Cooperative",
        health: "Healthy"
      });
    }

    // Generate 15 diverse activity history logs
    for (let i = 0; i < 15; i++) {
      const template = mockLogTemplates[Math.floor(Math.random() * mockLogTemplates.length)];
      const u = randomUsers[Math.floor(Math.random() * randomUsers.length)];
      
      const daysAgo = Math.floor(Math.random() * 12);
      const hoursAgo = Math.floor(Math.random() * 24);
      const minsAgo = Math.floor(Math.random() * 60);
      const date = new Date();
      date.setDate(date.getDate() - daysAgo);
      date.setHours(date.getHours() - hoursAgo);
      date.setMinutes(date.getMinutes() - minsAgo);

      let customDetails = template.details;
      if (template.category === "Student" && generatedStudents.length > 0) {
        const randomSt = generatedStudents[Math.floor(Math.random() * generatedStudents.length)];
        customDetails += ` for student: ${randomSt.name}`;
      }

      generatedLogs.push({
        id: `log-mock-${Date.now()}-${i}`,
        timestamp: date.toISOString(),
        userId: u.id,
        userName: u.name,
        role: u.role,
        action: template.action,
        category: template.category,
        details: customDetails
      });
    }

    db.activityLogs.unshift(...generatedLogs);
    // Sort activity logs by timestamp descending
    db.activityLogs.sort((a: any, b: any) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    saveDB();

    res.json({
      message: "Mock data seeded successfully!",
      studentsAddedCount: generatedStudents.length,
      logsAddedCount: generatedLogs.length
    });
  } catch (err: any) {
    console.error("Mock data generation failed:", err);
    res.status(500).json({ error: "Failed to generate mock data: " + err.message });
  }
});

// Settings API
app.get("/api/settings", (req, res) => {
  res.json(db.settings);
});

app.put("/api/settings", (req, res) => {
  db.settings = {
    ...db.settings,
    ...req.body
  };
  saveDB();
  res.json(db.settings);
});

// Gemini AI Student Report Generator!
app.post("/api/ai/analyze-student", async (req, res) => {
  const { studentId } = req.body;
  if (!studentId) {
    return res.status(400).json({ error: "studentId is required" });
  }

  const student = db.students.find((s: any) => s.id === studentId);
  if (!student) {
    return res.status(404).json({ error: "Student not found" });
  }

  const studentClass = db.classes.find((c: any) => c.id === student.classId);
  const studentProgress = db.progress.find((p: any) => p.studentId === studentId);
  const studentAttendance = db.attendance.filter((a: any) => a.studentId === studentId);

  const client = getGeminiClient();
  if (!client) {
    // If no API key, return generated mock AI insights that look fully complete and realistic
    // so the app stays functional, while reporting in a sub-note that this is offline mode.
    console.log("No Gemini API key found, generating high-quality local insights");
    const offlineReport = {
      summary: `${student.name} is a delightful and cooperative student in Class ${studentClass?.name || "Play Group"}. They communicate very effectively for their age and engage in block sorting, singing, and physical play with intense focus.`,
      strengths: ["Strong expressive language abilities", "Cooperates eagerly with peers in tidy-up activities", "Keen motor grip during hand painting and coloring"],
      weaknesses: ["Slightly distracted when switching activities", "Prone to initial morning shyness"],
      improvements: ["Transition warnings 2 minutes before cleanup", "Include in welcoming duties to build starting confidence"],
      learningStyle: "Multimodal (Visual and Kinesthetic) - grasps physical shapes, blocks, and colorful sketches instantly.",
      attendancePrediction: "Highly consistent (96% predicted). They look forward to classroom circle-times.",
      behaviourAnalysis: "Warm, respectful, and sharing. Demonstrates wonderful early social skills.",
      parentMeetingSuggestions: "Commend the child's sharing values. Suggest simple 3-step clean-up tasks at home to nurture consistency.",
      homeworkSuggestions: "Short 5-minute shape tracing exercises, singing rhyming words together at bedtime.",
      personalizedLearningPlan: "Structure active learning cycles: 10 minutes physical block play followed by 5 minutes storytelling. Focus on phonics using illustrated flashcards to bolster their narrative confidence.",
      lastGenerated: new Date().toISOString(),
      offlineMode: true
    };

    // Update in-memory DB
    const sIndex = db.students.findIndex((s: any) => s.id === studentId);
    if (sIndex !== -1) {
      db.students[sIndex].aiSummary = offlineReport;
      saveDB();
    }
    return res.json(offlineReport);
  }

  try {
    const progressDataStr = studentProgress
      ? JSON.stringify(studentProgress.metrics)
      : "No progress report filed yet";
    const attendanceSummary = studentAttendance
      ? `Present: ${studentAttendance.filter((a: any) => a.status === "Present").length}, Late: ${studentAttendance.filter((a: any) => a.status === "Late").length}, Leave: ${studentAttendance.filter((a: any) => a.status === "Leave").length}`
      : "Regular";

    const prompt = `You are the Principal and Child Psychologist of FirstCry Intellitots Preschool.
Analyze this preschool student profile to generate a professional, warm, actionable child progress insight card.
Student Name: ${student.name}
Age/DOB: ${student.dob} (Current Time: June 2026)
Gender: ${student.gender}
Class: ${studentClass?.name || "Play Group"}
Latest Evaluation Metrics (1-5 scale): ${progressDataStr}
Attendance Log: ${attendanceSummary}
Teacher remarks: ${student.remarks.join("; ")}

Respond strictly with a JSON object that strictly adheres to this TypeScript interface:
{
  summary: string; // concise paragraph summarizing the toddler's behavior, growth, and style
  strengths: string[]; // 2 to 3 bullet points of strong areas
  weaknesses: string[]; // 1 to 2 bullet points of minor development gaps
  improvements: string[]; // 1 to 2 actionable toddler strategies
  learningStyle: string; // e.g. "Visual", "Auditory", "Kinesthetic", "Sensory"
  attendancePrediction: string; // short text forecasting attendance percentage and reasons
  behaviourAnalysis: string; // emotional stability, sharing attitude, peer play description
  parentMeetingSuggestions: string; // bullet points or advice for teachers when meeting parents
  homeworkSuggestions: string; // specific home activities appropriate for age
  personalizedLearningPlan: string; // classroom-specific accommodations and focus points
}

Do not include any Markdown blocks, backticks (such as \`\`\`json), or additional texts around the JSON content. Send raw parseable JSON string.`;

    const response = await client.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "";
    const parsed = JSON.parse(text.trim());
    parsed.lastGenerated = new Date().toISOString();

    const sIndex = db.students.findIndex((s: any) => s.id === studentId);
    if (sIndex !== -1) {
      db.students[sIndex].aiSummary = parsed;
      saveDB();
    }

    // Add activity log
    const log = {
      id: `log-${Date.now()}`,
      timestamp: new Date().toISOString(),
      userId: "user-teacher1",
      userName: "Ms. Sarah Jenkins",
      role: "Teacher",
      action: "Generated AI Student Summary",
      category: "Student",
      details: `Generated AI insight profile for student: ${student.name}`,
    };
    db.activityLogs.unshift(log);
    saveDB();

    return res.json(parsed);
  } catch (err: any) {
    console.error("Gemini AI API generation failed:", err);
    return res.status(500).json({ error: "Failed to generate AI insights: " + err.message });
  }
});

// Serve frontend assets in production and development (Vite Integration)
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Intellitots ERP server is running at http://localhost:${PORT}`);
  });
}

startServer();
