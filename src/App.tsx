import React, { useState, useEffect } from "react";
import { Role, User, Student, Class, Teacher, AttendanceRecord, Homework, HomeworkSubmission, FeeRecord, ProgressReport, Notification, ActivityLog, SchoolSettings } from "./types";
import LoginScreen from "./components/LoginScreen";
import DashboardCards from "./components/DashboardCards";
import AnalyticsCharts from "./components/AnalyticsCharts";
import AdmissionForm from "./components/AdmissionForm";
import DigitalIDCard from "./components/DigitalIDCard";
import PrintableReportCard from "./components/PrintableReportCard";
import AIInsights from "./components/AIInsights";

import {
  Users,
  GraduationCap,
  LayoutDashboard,
  CalendarCheck2,
  BookOpen,
  DollarSign,
  FileCheck2,
  Settings,
  Bell,
  Search,
  LogOut,
  FolderLock,
  Plus,
  UserCheck,
  Building,
  CheckCircle,
  XCircle,
  Clock,
  Send,
  Download,
  FileSpreadsheet,
  Trash2,
  TrendingUp,
  AlertTriangle
} from "lucide-react";

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  
  // App collections
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [admissions, setAdmissions] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [homework, setHomework] = useState<Homework[]>([]);
  const [submissions, setSubmissions] = useState<HomeworkSubmission[]>([]);
  const [fees, setFees] = useState<FeeRecord[]>([]);
  const [progress, setProgress] = useState<ProgressReport[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [settings, setSettings] = useState<SchoolSettings | null>(null);

  // Active view states
  const [activeTab, setActiveTab] = useState("dashboard");
  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [feeFilter, setFeeFilter] = useState("all");

  // Selected entities for drill-down details
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [showAddClass, setShowAddClass] = useState(false);
  const [showAddTeacher, setShowAddTeacher] = useState(false);
  const [showAdmissionForm, setShowAdmissionForm] = useState(false);
  const [showAddHomework, setShowAddHomework] = useState(false);
  const [showPayFee, setShowPayFee] = useState(false);
  const [showProgressForm, setShowProgressForm] = useState(false);

  // Form states
  const [newClassName, setNewClassName] = useState("");
  const [newClassCapacity, setNewClassCapacity] = useState("15");
  const [newClassRoom, setNewClassRoom] = useState("");
  const [newClassTeacher, setNewClassTeacher] = useState("");
  const [newClassAssistant, setNewClassAssistant] = useState("");

  const [newTeacherName, setNewTeacherName] = useState("");
  const [newTeacherEmail, setNewTeacherEmail] = useState("");
  const [newTeacherPhone, setNewTeacherPhone] = useState("");
  const [newTeacherQual, setNewTeacherQual] = useState("");
  const [newTeacherClass, setNewTeacherClass] = useState("");

  const [newHwTitle, setNewHwTitle] = useState("");
  const [newHwClass, setNewHwClass] = useState("");
  const [newHwInst, setNewHwInst] = useState("");
  const [newHwDue, setNewHwDue] = useState("");
  const [newHwMarks, setNewHwMarks] = useState("10");

  const [payFeeAmount, setPayFeeAmount] = useState("");
  const [payFeeMode, setPayFeeMode] = useState<"Cash" | "Card" | "Online" | "UPI">("UPI");

  const [newProgressTerm, setNewProgressTerm] = useState<"Term 1" | "Term 2" | "Term 3">("Term 1");
  const [newProgressMetrics, setNewProgressMetrics] = useState({
    communication: 4, motorSkills: 4, creativity: 4, behaviour: 4, socialSkills: 4,
    learning: 4, reading: 4, writing: 4, speaking: 4, confidence: 4, participation: 4
  });
  const [newProgressRemarks, setNewProgressRemarks] = useState("");

  // Attendance marking states (temporary grid data)
  const [attendanceDate, setAttendanceDate] = useState(new Date().toISOString().split("T")[0]);
  const [attendanceClass, setAttendanceClass] = useState("class-1");
  const [attendanceGrid, setAttendanceGrid] = useState<{ [studentId: string]: "Present" | "Late" | "Leave" | "Holiday" }>({});
  const [attendanceRemarks, setAttendanceRemarks] = useState<{ [studentId: string]: string }>({});

  // Homework submission file upload (simulated)
  const [homeworkUploadFile, setHomeworkUploadFile] = useState<string>("");
  const [homeworkUploadName, setHomeworkUploadName] = useState("");
  const [gradingMarks, setGradingMarks] = useState<{ [subId: string]: string }>({});
  const [gradingFeedback, setGradingFeedback] = useState<{ [subId: string]: string }>({});

  // School General Settings update form
  const [settingsSchoolName, setSettingsSchoolName] = useState("");
  const [settingsEmail, setSettingsEmail] = useState("");
  const [settingsPhone, setSettingsPhone] = useState("");
  const [settingsAddress, setSettingsAddress] = useState("");

  // Announcements broadcasting
  const [announcementTitle, setAnnouncementTitle] = useState("");
  const [announcementMsg, setAnnouncementMsg] = useState("");

  // Load user session on boot
  useEffect(() => {
    const savedUser = localStorage.getItem("intellitots_user");
    const savedToken = localStorage.getItem("intellitots_token");
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  // Fetch collections when user changes / logs in
  useEffect(() => {
    if (user) {
      fetchAllCollections();
    }
  }, [user]);

  const fetchAllCollections = async () => {
    try {
      const endpoints = [
        "students", "classes", "teachers", "admissions", "attendance",
        "homework", "homework/submissions", "fees", "progress",
        "notifications", "activity-logs", "settings"
      ];
      
      const [
        studentsRes, classesRes, teachersRes, admissionsRes, attendanceRes,
        homeworkRes, submissionsRes, feesRes, progressRes,
        notificationsRes, logsRes, settingsRes
      ] = await Promise.all(
        endpoints.map(ep => fetch(`/api/${ep}`).then(res => res.json()))
      );

      setStudents(studentsRes);
      setClasses(classesRes);
      setTeachers(teachersRes);
      setAdmissions(admissionsRes);
      setAttendance(attendanceRes);
      setHomework(homeworkRes);
      setSubmissions(submissionsRes);
      setFees(feesRes);
      setProgress(progressRes);
      setNotifications(notificationsRes);
      setActivityLogs(logsRes);
      setSettings(settingsRes);

      // Pre-fill general setting form fields
      if (settingsRes) {
        setSettingsSchoolName(settingsRes.name);
        setSettingsEmail(settingsRes.email);
        setSettingsPhone(settingsRes.phone);
        setSettingsAddress(settingsRes.address);
      }

      // If logging in as parent, automatically bind selected student to parent's mock child (student-1 Aarav)
      if (user?.role === Role.PARENT && studentsRes.length > 0) {
        const parentChild = studentsRes.find(s => s.id === "student-1");
        if (parentChild) {
          setSelectedStudent(parentChild);
        }
      }
    } catch (e) {
      console.error("Failed to sync databases", e);
    }
  };

  const handleLoginSuccess = (loggedInUser: User, sessionToken: string) => {
    setUser(loggedInUser);
    setToken(sessionToken);
    if (loggedInUser.rememberMe) {
      localStorage.setItem("intellitots_user", JSON.stringify(loggedInUser));
      localStorage.setItem("intellitots_token", sessionToken);
    }
    setActiveTab("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("intellitots_user");
    localStorage.removeItem("intellitots_token");
    setUser(null);
    setToken(null);
    setSelectedStudent(null);
    setSelectedClass(null);
  };

  // ERP CRUD actions
  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClassName.trim()) return;

    try {
      const response = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newClassName,
          capacity: newClassCapacity,
          roomNumber: newClassRoom,
          teacherId: newClassTeacher || undefined,
          assistantTeacherName: newClassAssistant
        }),
      });

      if (response.ok) {
        setNewClassName("");
        setNewClassRoom("");
        setNewClassAssistant("");
        setShowAddClass(false);
        fetchAllCollections();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName.trim() || !newTeacherEmail.trim()) return;

    try {
      const response = await fetch("/api/teachers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newTeacherName,
          email: newTeacherEmail,
          phone: newTeacherPhone,
          qualification: newTeacherQual,
          assignedClassIds: newTeacherClass ? [newTeacherClass] : []
        }),
      });

      if (response.ok) {
        setNewTeacherName("");
        setNewTeacherEmail("");
        setNewTeacherPhone("");
        setNewTeacherQual("");
        setShowAddTeacher(false);
        fetchAllCollections();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdmissionAction = async (id: string, action: "Verified" | "Approved" | "Rejected" | "Enrolled") => {
    try {
      const response = await fetch(`/api/admissions/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: action }),
      });
      if (response.ok) {
        fetchAllCollections();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Sync state for classroom marking
  const loadClassAttendanceMarking = () => {
    const classStudents = students.filter(s => s.classId === attendanceClass);
    const grid: { [studentId: string]: "Present" | "Late" | "Leave" | "Holiday" } = {};
    const rems: { [studentId: string]: string } = {};

    classStudents.forEach(st => {
      // Check if attendance already logged for date
      const logged = attendance.find(a => a.date === attendanceDate && a.studentId === st.id);
      grid[st.id] = logged ? logged.status : "Present";
      rems[st.id] = logged?.remarks || "";
    });

    setAttendanceGrid(grid);
    setAttendanceRemarks(rems);
  };

  // Auto trigger attendance loading when date/class selectors change
  useEffect(() => {
    if (activeTab === "attendance" && students.length > 0) {
      loadClassAttendanceMarking();
    }
  }, [attendanceDate, attendanceClass, activeTab, students]);

  const handleSaveAttendance = async () => {
    const classStudents = students.filter(s => s.classId === attendanceClass);
    const payload = classStudents.map(st => ({
      date: attendanceDate,
      studentId: st.id,
      status: attendanceGrid[st.id] || "Present",
      remarks: attendanceRemarks[st.id] || "",
      markedBy: user?.name || "Teacher"
    }));

    try {
      const response = await fetch("/api/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Attendance saved successfully!");
        fetchAllCollections();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddHomework = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newHwTitle.trim() || !newHwClass) return;

    try {
      const response = await fetch("/api/homework", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          classId: newHwClass,
          title: newHwTitle,
          instructions: newHwInst,
          dueDate: newHwDue,
          totalMarks: newHwMarks,
          createdBy: user?.name
        }),
      });

      if (response.ok) {
        setNewHwTitle("");
        setNewHwInst("");
        setNewHwDue("");
        setShowAddHomework(false);
        fetchAllCollections();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadHomework = async (e: React.FormEvent, hwId: string) => {
    e.preventDefault();
    if (!homeworkUploadName) return;

    try {
      const response = await fetch("/api/homework/submissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          homeworkId: hwId,
          studentId: selectedStudent?.id,
          submittedFileName: homeworkUploadName,
          submittedFile: homeworkUploadFile
        }),
      });

      if (response.ok) {
        alert("Homework uploaded successfully!");
        setHomeworkUploadFile("");
        setHomeworkUploadName("");
        fetchAllCollections();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleGradeSubmission = async (subId: string) => {
    const marks = gradingMarks[subId];
    const feed = gradingFeedback[subId] || "";

    try {
      const response = await fetch(`/api/homework/submissions/${subId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          marksObtained: marks,
          feedback: feed
        }),
      });

      if (response.ok) {
        alert("Submission graded successfully!");
        fetchAllCollections();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePayFeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payFeeAmount || !selectedStudent) return;

    try {
      const response = await fetch("/api/fees/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          amount: payFeeAmount,
          paymentMode: payFeeMode,
          receivedBy: user?.name
        }),
      });

      if (response.ok) {
        setPayFeeAmount("");
        setShowPayFee(false);
        fetchAllCollections();
        alert("Payment logged. Receipt generated successfully.");
      } else {
        const errorMsg = await response.json();
        alert(errorMsg.error || "Payment failed");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleProgressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    try {
      const response = await fetch("/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          studentId: selectedStudent.id,
          term: newProgressTerm,
          metrics: newProgressMetrics,
          remarks: newProgressRemarks,
          teacherId: "teacher-1"
        }),
      });

      if (response.ok) {
        setNewProgressRemarks("");
        setShowProgressForm(false);
        fetchAllCollections();
        alert("Progress metrics compiled!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: settingsSchoolName,
          email: settingsEmail,
          phone: settingsPhone,
          address: settingsAddress
        }),
      });

      if (response.ok) {
        alert("Settings saved!");
        fetchAllCollections();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitle.trim() || !announcementMsg.trim()) return;

    try {
      const response = await fetch("/api/notifications", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: announcementTitle,
          message: announcementMsg,
          type: "Announcement"
        }),
      });

      if (response.ok) {
        setAnnouncementTitle("");
        setAnnouncementMsg("");
        alert("Announcement posted successfully!");
        fetchAllCollections();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const deleteStudent = async (id: string) => {
    if (!confirm("Are you sure you want to delete this student and all their associated records? This is irreversible.")) return;

    try {
      const response = await fetch(`/api/students/${id}`, { method: "DELETE" });
      if (response.ok) {
        setSelectedStudent(null);
        fetchAllCollections();
        alert("Student deleted successfully.");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Local helper calculations
  const totalStudentsCount = students.length;
  const activeStudentsCount = students.filter(s => s.status === "Enrolled").length;
  const inactiveStudentsCount = students.filter(s => s.status !== "Enrolled").length;
  const teachersCount = teachers.length;
  const classesCount = classes.filter(c => c.status !== "Archived").length;
  const pendingAdmissionsCount = admissions.filter(a => a.status === "Applied" || a.status === "Verified").length;

  const feesCollectedSum = fees.reduce((sum, f) => sum + f.paidAmount, 0);
  const pendingFeesSum = fees.reduce((sum, f) => {
    const totalDue = f.baseFee + f.transportFee + f.daycareFee + f.lateFee - f.discount;
    return sum + (totalDue - f.paidAmount);
  }, 0);

  // Global search & filters on Students list
  const filteredStudents = students.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.admissionNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.parentDetails.fatherPhone.includes(searchQuery) ||
      s.parentDetails.motherPhone.includes(searchQuery);

    const matchesClass = classFilter === "all" || s.classId === classFilter;
    const matchesGender = genderFilter === "all" || s.gender === genderFilter;

    let matchesFee = true;
    if (feeFilter !== "all") {
      const studentFee = fees.find((f) => f.studentId === s.id);
      matchesFee = studentFee?.status === feeFilter;
    }

    return matchesSearch && matchesClass && matchesGender && matchesFee;
  });

  // Simulated PDF or CSV Export function
  const handleExportCSV = (type: "students" | "fees" | "attendance") => {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    if (type === "students") {
      csvContent += "ID,Admission No,Roll No,Name,DOB,Gender,Class,Status,Contact\n";
      students.forEach((s) => {
        const clsName = classes.find(c => c.id === s.classId)?.name || "N/A";
        csvContent += `"${s.id}","${s.admissionNumber}","${s.rollNumber}","${s.name}","${s.dob}","${s.gender}","${clsName}","${s.status}","${s.parentDetails.fatherPhone}"\n`;
      });
    } else if (type === "fees") {
      csvContent += "Student Name,Term,Base Fee,Transport,Daycare,Discount,Late Fee,Paid,Status\n";
      fees.forEach((f) => {
        const sName = students.find(st => st.id === f.studentId)?.name || "N/A";
        csvContent += `"${sName}","${f.term}",${f.baseFee},${f.transportFee},${f.daycareFee},${f.discount},${f.lateFee},${f.paidAmount},"${f.status}"\n`;
      });
    } else {
      csvContent += "Date,Student,Status,Marked By,Remarks\n";
      attendance.forEach((a) => {
        const sName = students.find(st => st.id === a.studentId)?.name || "N/A";
        csvContent += `"${a.date}","${sName}","${a.status}","${a.markedBy}","${a.remarks || ""}"\n`;
      });
    }

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${type}_report_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // If not authenticated, render Login Screen
  if (!user || !token) {
    return <LoginScreen onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* Top Header / Branding Bar */}
      <header className="bg-white border-b border-slate-200 flex items-center justify-between px-6 py-4 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-lg font-display">
            FI
          </div>
          <div>
            <h1 className="font-bold text-slate-800 tracking-tight leading-none text-base uppercase font-display">
              {settings?.name || "FirstCry Intellitots Preschool"}
            </h1>
            <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">
              Student Information & ERP System • Session {settings?.academicYear || "2026-2027"}
            </p>
          </div>
        </div>

        {/* User context & switcher */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3 border-l border-slate-200 pl-4">
            <div className="text-right hidden sm:block">
              <span className="font-bold text-slate-800 block text-xs font-display">{user.name}</span>
              <span className="text-[10px] font-bold uppercase bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full inline-block mt-0.5 tracking-wider">
                {user.role}
              </span>
            </div>
            
            <button
              onClick={handleLogout}
              className="p-2 bg-slate-50 hover:bg-rose-50 text-slate-500 hover:text-rose-600 border border-slate-200 hover:border-rose-100 rounded-xl cursor-pointer transition-colors"
              title="Logout session"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Layout Area */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0">
        {/* Sidebar Nav */}
        <nav className="w-full md:w-64 bg-white border-r border-slate-200 flex flex-col p-4 gap-1 shrink-0">
          <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider px-3 mb-2 block font-sans">
            School Navigation
          </span>

          <button
            onClick={() => { setActiveTab("dashboard"); setSelectedStudent(null); }}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium font-display transition-all text-left cursor-pointer ${
              activeTab === "dashboard" ? "bg-indigo-50 text-indigo-700 font-bold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <LayoutDashboard className={`w-4 h-4 ${activeTab === "dashboard" ? "text-indigo-600" : "text-slate-400"}`} />
            Executive Dashboard
          </button>

          {/* Role specific access tabs */}
          {(user.role === Role.SUPER_ADMIN || user.role === Role.ADMIN || user.role === Role.PRINCIPAL || user.role === Role.TEACHER || user.role === Role.RECEPTIONIST || user.role === Role.ACCOUNTANT) && (
            <button
              onClick={() => { setActiveTab("students"); setSelectedStudent(null); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium font-display transition-all text-left cursor-pointer ${
                activeTab === "students" ? "bg-indigo-50 text-indigo-700 font-bold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Users className={`w-4 h-4 ${activeTab === "students" ? "text-indigo-600" : "text-slate-400"}`} />
              Student Directory
            </button>
          )}

          {(user.role === Role.SUPER_ADMIN || user.role === Role.ADMIN || user.role === Role.PRINCIPAL || user.role === Role.RECEPTIONIST) && (
            <button
              onClick={() => { setActiveTab("admissions"); setSelectedStudent(null); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium font-display transition-all text-left cursor-pointer ${
                activeTab === "admissions" ? "bg-indigo-50 text-indigo-700 font-bold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <UserCheck className={`w-4 h-4 ${activeTab === "admissions" ? "text-indigo-600" : "text-slate-400"}`} />
              Admissions queue
            </button>
          )}

          {(user.role === Role.SUPER_ADMIN || user.role === Role.ADMIN || user.role === Role.PRINCIPAL) && (
            <button
              onClick={() => { setActiveTab("classes"); setSelectedStudent(null); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium font-display transition-all text-left cursor-pointer ${
                activeTab === "classes" ? "bg-indigo-50 text-indigo-700 font-bold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <Building className={`w-4 h-4 ${activeTab === "classes" ? "text-indigo-600" : "text-slate-400"}`} />
              Preschool Classrooms
            </button>
          )}

          {(user.role === Role.SUPER_ADMIN || user.role === Role.ADMIN || user.role === Role.TEACHER) && (
            <button
              onClick={() => { setActiveTab("attendance"); setSelectedStudent(null); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium font-display transition-all text-left cursor-pointer ${
                activeTab === "attendance" ? "bg-indigo-50 text-indigo-700 font-bold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <CalendarCheck2 className={`w-4 h-4 ${activeTab === "attendance" ? "text-indigo-600" : "text-slate-400"}`} />
              Daily Attendance Register
            </button>
          )}

          <button
            onClick={() => { setActiveTab("homework"); setSelectedStudent(null); }}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium font-display transition-all text-left cursor-pointer ${
              activeTab === "homework" ? "bg-indigo-50 text-indigo-700 font-bold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
            }`}
          >
            <BookOpen className={`w-4 h-4 ${activeTab === "homework" ? "text-indigo-600" : "text-slate-400"}`} />
            Homework assignments
          </button>

          {(user.role === Role.SUPER_ADMIN || user.role === Role.ADMIN || user.role === Role.ACCOUNTANT || user.role === Role.PARENT) && (
            <button
              onClick={() => { setActiveTab("fees"); setSelectedStudent(null); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium font-display transition-all text-left cursor-pointer ${
                activeTab === "fees" ? "bg-indigo-50 text-indigo-700 font-bold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <DollarSign className={`w-4 h-4 ${activeTab === "fees" ? "text-indigo-600" : "text-slate-400"}`} />
              Financials & Fees
            </button>
          )}

          {(user.role === Role.SUPER_ADMIN || user.role === Role.ADMIN || user.role === Role.TEACHER || user.role === Role.PARENT) && (
            <button
              onClick={() => { setActiveTab("reports"); setSelectedStudent(null); }}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium font-display transition-all text-left cursor-pointer ${
                activeTab === "reports" ? "bg-indigo-50 text-indigo-700 font-bold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              <FileCheck2 className={`w-4 h-4 ${activeTab === "reports" ? "text-indigo-600" : "text-slate-400"}`} />
              Milestone Reports
            </button>
          )}

          {(user.role === Role.SUPER_ADMIN || user.role === Role.ADMIN) && (
            <div className="mt-auto border-t border-slate-100 pt-4 flex flex-col gap-1">
              <span className="text-[10px] font-semibold uppercase text-slate-400 tracking-wider px-3 mb-1 block">
                Security & settings
              </span>
              <button
                onClick={() => { setActiveTab("settings"); setSelectedStudent(null); }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium font-display transition-all text-left cursor-pointer ${
                  activeTab === "settings" ? "bg-indigo-50 text-indigo-700 font-bold" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Settings className={`w-4 h-4 ${activeTab === "settings" ? "text-indigo-600" : "text-slate-400"}`} />
                System Settings
              </button>
            </div>
          )}
        </nav>

        {/* Content Workspace Area */}
        <main className="flex-1 p-6 md:p-8 overflow-y-auto flex flex-col gap-8 min-w-0">
          
          {/* VIEW 1: Dashboard */}
          {activeTab === "dashboard" && (
            <div className="flex flex-col gap-8">
              {/* Dynamic Welcome Heading */}
              <div className="bg-gradient-to-r from-amber-400 to-orange-500 p-6 rounded-3xl text-white shadow-md flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight">
                    Good Day, {user.name}!
                  </h2>
                  <p className="text-xs text-white/95 font-medium mt-1 leading-relaxed">
                    Here's the current operational snapshot for FirstCry Intellitots. Let's make learning memorable today.
                  </p>
                </div>
                {/* Parent view: quick link to print ID */}
                {user.role === Role.PARENT && (
                  <button
                    onClick={() => setActiveTab("reports")}
                    className="px-4 py-2 bg-white text-orange-600 font-bold rounded-xl text-xs shadow-sm hover:bg-slate-50 cursor-pointer transition-transform"
                  >
                    View Child Performance
                  </button>
                )}
                
                {/* Administrator view: trigger new admission */}
                {(user.role === Role.SUPER_ADMIN || user.role === Role.ADMIN || user.role === Role.RECEPTIONIST) && (
                  <button
                    onClick={() => setShowAdmissionForm(true)}
                    className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white font-bold rounded-xl text-xs shadow-md shadow-amber-900/10 hover:bg-slate-800 cursor-pointer transition-all shrink-0"
                  >
                    <Plus className="w-4 h-4 text-amber-400" />
                    New Admission ERP Form
                  </button>
                )}
              </div>

              {/* Stats overview */}
              <DashboardCards
                totalStudents={totalStudentsCount}
                activeStudents={activeStudentsCount}
                inactiveStudents={inactiveStudentsCount}
                teachers={teachersCount}
                classes={classesCount}
                admissionsPending={pendingAdmissionsCount}
                attendancePct={89}
                homeworkCount={homework.length}
                feesCollected={feesCollectedSum}
                pendingFees={pendingFeesSum}
                upcomingBirthdays={1}
              />

              {/* Graphic Charts block */}
              <AnalyticsCharts />

              {/* Double Grid (Announcements + Recent log audits) */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left side announcements */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-4">
                    <h3 className="font-bold text-slate-900 text-sm font-display flex items-center gap-1.5">
                      <Bell className="w-4.5 h-4.5 text-amber-500" />
                      Notice & Bulletins
                    </h3>
                  </div>

                  {/* Add bulletin form for administrators */}
                  {(user.role === Role.SUPER_ADMIN || user.role === Role.ADMIN || user.role === Role.PRINCIPAL) && (
                    <form onSubmit={handlePostAnnouncement} className="flex flex-col gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-200/60 mb-2">
                      <div className="flex flex-col gap-1">
                        <input
                          type="text"
                          required
                          value={announcementTitle}
                          onChange={(e) => setAnnouncementTitle(e.target.value)}
                          placeholder="Bulletin title..."
                          className="w-full bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs outline-none text-slate-800 font-semibold"
                        />
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          required
                          value={announcementMsg}
                          onChange={(e) => setAnnouncementMsg(e.target.value)}
                          placeholder="Message detail..."
                          className="flex-1 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs outline-none text-slate-800"
                        />
                        <button
                          type="submit"
                          className="px-4 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold shrink-0 cursor-pointer"
                        >
                          Broadcast
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="flex flex-col gap-3 divide-y divide-slate-100 max-h-[250px] overflow-y-auto">
                    {notifications.map((notif) => (
                      <div key={notif.id} className="pt-3 flex gap-3">
                        <div className="w-2.5 h-2.5 rounded-full bg-indigo-500 mt-1.5 shrink-0"></div>
                        <div className="flex-1">
                          <h4 className="text-xs font-bold text-slate-800 font-display">{notif.title}</h4>
                          <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{notif.message}</p>
                          <span className="text-[9px] font-mono text-slate-400 mt-1 block">
                            {new Date(notif.timestamp).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right side audit logs */}
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
                  <h3 className="font-bold text-slate-900 text-sm font-display flex items-center gap-1.5 border-b border-slate-100 pb-4">
                    <Clock className="w-4.5 h-4.5 text-indigo-500" />
                    ERP Security Activity Audit Logs
                  </h3>

                  <div className="flex flex-col gap-3.5 max-h-[300px] overflow-y-auto">
                    {activityLogs.map((log) => (
                      <div key={log.id} className="text-xs flex gap-3 items-start">
                        <span className="text-[9px] text-slate-400 font-mono mt-0.5 shrink-0">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                        <div>
                          <span className="font-semibold text-slate-700">{log.userName}</span>{" "}
                          <span className="text-slate-500">({log.role}):</span>{" "}
                          <span className="font-medium text-slate-800">{log.action}</span>{" "}
                          <span className="text-[10px] text-slate-400 block mt-0.5">{log.details}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: Student Directory */}
          {activeTab === "students" && !selectedStudent && (
            <div className="flex flex-col gap-6">
              {/* Toolbar: Search + filter */}
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row gap-4 justify-between items-center">
                <div className="relative w-full sm:max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search name, admission ID, father phone..."
                    className="w-full bg-slate-50 border border-slate-200 focus:bg-white focus:border-amber-400 pl-9 pr-4 py-2.5 rounded-xl text-xs outline-none transition-all text-slate-800 font-medium shadow-inner"
                  />
                </div>

                <div className="flex flex-wrap gap-2 w-full sm:w-auto">
                  <select
                    value={classFilter}
                    onChange={(e) => setClassFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-xs px-3 py-2.5 rounded-xl text-slate-700 font-semibold outline-none cursor-pointer"
                  >
                    <option value="all">All Classes</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>

                  <select
                    value={genderFilter}
                    onChange={(e) => setGenderFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-xs px-3 py-2.5 rounded-xl text-slate-700 font-semibold outline-none cursor-pointer"
                  >
                    <option value="all">All Genders</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>

                  <select
                    value={feeFilter}
                    onChange={(e) => setFeeFilter(e.target.value)}
                    className="bg-slate-50 border border-slate-200 text-xs px-3 py-2.5 rounded-xl text-slate-700 font-semibold outline-none cursor-pointer"
                  >
                    <option value="all">All Fee Status</option>
                    <option value="Paid">Paid Only</option>
                    <option value="Partial">Partial Dues</option>
                    <option value="Unpaid">Unpaid Only</option>
                  </select>

                  <button
                    onClick={() => handleExportCSV("students")}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 text-white hover:bg-slate-800 text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export
                  </button>
                </div>
              </div>

              {/* Grid database representation */}
              <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse text-left text-xs text-slate-600">
                    <thead className="bg-slate-50 border-b border-slate-200/60 font-semibold text-slate-400 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="px-6 py-4">Student</th>
                        <th className="px-6 py-4">Admission ID</th>
                        <th className="px-6 py-4">Class Group</th>
                        <th className="px-6 py-4">Primary Parent</th>
                        <th className="px-6 py-4">Dues Condition</th>
                        <th className="px-6 py-4">Pediatric Hazard</th>
                        <th className="px-6 py-4 text-right">Explore</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {filteredStudents.map((st) => {
                        const sClass = classes.find(c => c.id === st.classId);
                        const sFee = fees.find(f => f.studentId === st.id);
                        return (
                          <tr key={st.id} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 py-4 flex items-center gap-3">
                              {st.profilePhoto ? (
                                <img src={st.profilePhoto} alt={st.name} className="w-9 h-9 object-cover rounded-xl border border-slate-100" referrerPolicy="no-referrer" />
                              ) : (
                                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 font-bold flex items-center justify-center text-xs">
                                  {st.name.split(" ").map(n => n[0]).join("")}
                                </div>
                              )}
                              <div>
                                <span className="font-bold text-slate-800 block text-xs font-display">{st.name}</span>
                                <span className="text-[10px] text-slate-400">Roll: #{st.rollNumber}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 font-mono font-bold tracking-wide text-slate-800 text-[11px]">{st.admissionNumber}</td>
                            <td className="px-6 py-4 font-bold text-slate-700">{sClass?.name || "N/A"}</td>
                            <td className="px-6 py-4">
                              <span className="font-semibold block text-slate-700">{st.parentDetails.fatherName}</span>
                              <span className="text-[10px] text-slate-400">{st.parentDetails.fatherPhone}</span>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase inline-block ${
                                sFee?.status === "Paid" ? "bg-emerald-100 text-emerald-800" :
                                sFee?.status === "Partial" ? "bg-orange-100 text-orange-800" : "bg-rose-100 text-rose-800"
                              }`}>
                                {sFee?.status || "Unpaid"}
                              </span>
                            </td>
                            <td className="px-6 py-4 max-w-[150px] truncate">
                              {st.medicalRecord.allergies.length > 0 ? (
                                <span className="text-rose-600 font-semibold text-[10px] bg-rose-50 px-2 py-0.5 rounded-md">
                                  ⚠️ Allergens: {st.medicalRecord.allergies.join(", ")}
                                </span>
                              ) : (
                                <span className="text-slate-400 font-medium">None declared</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              <button
                                onClick={() => setSelectedStudent(st)}
                                className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-[11px] font-semibold cursor-pointer transition-all"
                              >
                                View File
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 3: Student Profile Detail */}
          {selectedStudent && (
            <div className="flex flex-col gap-6">
              {/* Back to list and print row */}
              <div className="flex justify-between items-center">
                <button
                  onClick={() => {
                    // If parent, keep bound, otherwise clear
                    if (user.role === Role.PARENT) {
                      setActiveTab("dashboard");
                    } else {
                      setSelectedStudent(null);
                    }
                  }}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                >
                  ← Back to Directory
                </button>

                {/* Administrator deletion options */}
                {(user.role === Role.SUPER_ADMIN || user.role === Role.ADMIN) && (
                  <button
                    onClick={() => deleteStudent(selectedStudent.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                  >
                    <Trash2 className="w-4 h-4" />
                    Deregister Student Record
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                
                {/* Left Profile Summary Badge Card */}
                <div className="lg:col-span-4 flex flex-col gap-6">
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col items-center text-center gap-4">
                    {selectedStudent.profilePhoto ? (
                      <img
                        src={selectedStudent.profilePhoto}
                        alt={selectedStudent.name}
                        className="w-28 h-32 object-cover rounded-2xl border-2 border-white shadow-md bg-white"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-28 h-32 rounded-2xl bg-amber-50 text-amber-800 font-black flex flex-col items-center justify-center text-2xl shadow-inner border border-amber-100 font-display">
                        {selectedStudent.name.split(" ").map((n) => n[0]).join("")}
                      </div>
                    )}

                    <div>
                      <h3 className="font-bold text-slate-900 text-base font-display">{selectedStudent.name}</h3>
                      <span className="text-xs text-slate-400 font-semibold block">Admission ID: {selectedStudent.admissionNumber}</span>
                      <span className="text-[10px] text-slate-400 block">Roll Number: #{selectedStudent.rollNumber}</span>
                    </div>

                    <div className="w-full border-t border-slate-100 pt-4 text-xs text-left flex flex-col gap-2.5">
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-semibold">DOB:</span>
                        <span className="font-bold text-slate-700">{selectedStudent.dob}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-semibold">Gender:</span>
                        <span className="font-bold text-slate-700">{selectedStudent.gender}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-semibold">Section:</span>
                        <span className="font-bold text-slate-700">
                          {classes.find(c => c.id === selectedStudent.classId)?.name || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400 font-semibold">Bus Transport:</span>
                        <span className={`font-bold ${selectedStudent.transportRequired ? "text-emerald-600" : "text-slate-500"}`}>
                          {selectedStudent.transportRequired ? "Yes (Active)" : "No (Self-Pickup)"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Digital ID printing module */}
                  <DigitalIDCard
                    student={selectedStudent}
                    classes={classes}
                    schoolName={settings?.name || "Intellitots Preschool"}
                  />
                </div>

                {/* Right detailed metrics cards */}
                <div className="lg:col-span-8 flex flex-col gap-6">
                  {/* Tabs within profile */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-5">
                    <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider font-display border-b border-slate-100 pb-3">
                      Parental Contact Particulars
                    </h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
                      <div className="flex flex-col gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <span className="font-bold text-slate-900 font-display block text-sm border-b border-slate-200/60 pb-1 text-amber-700">Father's Details</span>
                        <div className="flex flex-col gap-1.5 mt-2">
                          <p><strong className="text-slate-400 font-medium">Full Name:</strong> <span className="font-semibold text-slate-700">{selectedStudent.parentDetails.fatherName}</span></p>
                          <p><strong className="text-slate-400 font-medium">Contact Phone:</strong> <span className="font-semibold text-slate-700">{selectedStudent.parentDetails.fatherPhone}</span></p>
                          <p><strong className="text-slate-400 font-medium">Email ID:</strong> <span className="font-semibold text-slate-700">{selectedStudent.parentDetails.fatherEmail}</span></p>
                          <p><strong className="text-slate-400 font-medium">Occupation:</strong> <span className="font-semibold text-slate-700">{selectedStudent.parentDetails.fatherOccupation}</span></p>
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 bg-slate-50 p-4 rounded-2xl border border-slate-100">
                        <span className="font-bold text-slate-900 font-display block text-sm border-b border-slate-200/60 pb-1 text-rose-700">Mother's Details</span>
                        <div className="flex flex-col gap-1.5 mt-2">
                          <p><strong className="text-slate-400 font-medium">Full Name:</strong> <span className="font-semibold text-slate-700">{selectedStudent.parentDetails.motherName}</span></p>
                          <p><strong className="text-slate-400 font-medium">Contact Phone:</strong> <span className="font-semibold text-slate-700">{selectedStudent.parentDetails.motherPhone}</span></p>
                          <p><strong className="text-slate-400 font-medium">Email ID:</strong> <span className="font-semibold text-slate-700">{selectedStudent.parentDetails.motherEmail}</span></p>
                          <p><strong className="text-slate-400 font-medium">Occupation:</strong> <span className="font-semibold text-slate-700">{selectedStudent.parentDetails.motherOccupation}</span></p>
                        </div>
                      </div>

                      <div className="col-span-1 md:col-span-2">
                        <strong className="text-slate-400 font-medium block mb-1">Residential Residence Address:</strong>
                        <p className="bg-slate-50 p-3 rounded-xl border border-slate-100 text-slate-700 font-medium leading-relaxed">
                          {selectedStudent.parentDetails.address}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Medical Clearance File */}
                  <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
                    <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider font-display border-b border-slate-100 pb-3 flex items-center gap-2">
                      <AlertTriangle className="w-4.5 h-4.5 text-emerald-500" />
                      Toddler Medical & Immunization Ledger
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-slate-400 font-semibold block text-[10px] uppercase">Blood Group</span>
                        <span className="font-bold text-slate-800 text-sm font-mono mt-0.5 block">{selectedStudent.medicalRecord.bloodGroup}</span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-slate-400 font-semibold block text-[10px] uppercase">Allergic Risks</span>
                        <span className="font-bold text-rose-600 mt-0.5 block">
                          {selectedStudent.medicalRecord.allergies.join(", ") || "None Declared"}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                        <span className="text-slate-400 font-semibold block text-[10px] uppercase">Pediatrician</span>
                        <span className="font-bold text-slate-800 mt-0.5 block truncate">{selectedStudent.medicalRecord.pediatricianName}</span>
                        <span className="text-[10px] text-slate-400 font-mono">{selectedStudent.medicalRecord.pediatricianPhone}</span>
                      </div>
                    </div>
                  </div>

                  {/* Milestone Reports Card */}
                  {progress.find(p => p.studentId === selectedStudent.id) && (
                    <PrintableReportCard
                      student={selectedStudent}
                      currentClass={classes.find(c => c.id === selectedStudent.classId)}
                      progressReport={progress.find(p => p.studentId === selectedStudent.id)}
                      schoolName={settings?.name || "Intellitots Preschool"}
                    />
                  )}

                  {/* Interactive AI Child Growth Analytics */}
                  {(user.role === Role.SUPER_ADMIN || user.role === Role.ADMIN || user.role === Role.PRINCIPAL || user.role === Role.TEACHER || user.role === Role.PARENT) && (
                    <AIInsights
                      student={selectedStudent}
                      onUpdateStudent={(upSt) => {
                        setSelectedStudent(upSt);
                        // Write changes back to the in-memory array
                        setStudents(prev => prev.map(s => s.id === upSt.id ? upSt : s));
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 4: Admissions Queue */}
          {activeTab === "admissions" && (
            <div className="flex flex-col gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm font-display uppercase tracking-wider">Preschool Admission Queue</h3>
                  <p className="text-xs text-slate-500">Receptionist logs initial files, Principal verifies, and Admin registers Enrolment.</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-100 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="px-5 py-3">Applicant Name</th>
                        <th className="px-5 py-3">Target Class</th>
                        <th className="px-5 py-3">Family Contact</th>
                        <th className="px-5 py-3">Allergies</th>
                        <th className="px-5 py-3">Status Condition</th>
                        <th className="px-5 py-3 text-right">Workflow Clearances</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {admissions.map((adm) => {
                        const targetClsName = classes.find(c => c.id === adm.classId)?.name || "PG";
                        return (
                          <tr key={adm.id} className="hover:bg-slate-50/50">
                            <td className="px-5 py-3.5 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-orange-50 text-orange-800 font-bold flex items-center justify-center text-xs">
                                {adm.name.split(" ").map((n:any) => n[0]).join("")}
                              </div>
                              <div>
                                <span className="font-bold text-slate-800 block text-xs font-display">{adm.name}</span>
                                <span className="text-[10px] text-slate-400">DOB: {adm.dob}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 font-semibold text-slate-700">{targetClsName}</td>
                            <td className="px-5 py-3.5">
                              <span className="font-semibold text-slate-700 block">{adm.parentDetails.fatherName}</span>
                              <span className="text-[10px] text-slate-400 font-mono">{adm.parentDetails.fatherPhone}</span>
                            </td>
                            <td className="px-5 py-3.5">
                              {adm.medicalRecord?.allergies?.length > 0 ? (
                                <span className="text-rose-600 font-semibold text-[10px] bg-rose-50 px-2 py-0.5 rounded">
                                  ⚠️ {adm.medicalRecord.allergies.join(", ")}
                                </span>
                              ) : (
                                <span className="text-slate-400">None</span>
                              )}
                            </td>
                            <td className="px-5 py-3.5">
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase inline-block ${
                                adm.status === "Applied" ? "bg-blue-100 text-blue-800" :
                                adm.status === "Verified" ? "bg-amber-100 text-amber-800" :
                                adm.status === "Approved" ? "bg-emerald-100 text-emerald-800" : "bg-teal-100 text-teal-800"
                              }`}>
                                {adm.status}
                              </span>
                            </td>
                            <td className="px-5 py-3.5 text-right flex justify-end gap-1.5 pt-4">
                              {adm.status === "Applied" && (user.role === Role.RECEPTIONIST || user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN) && (
                                <button
                                  onClick={() => handleAdmissionAction(adm.id, "Verified")}
                                  className="px-2 py-1 bg-amber-500 text-white rounded font-bold text-[10px]"
                                >
                                  Verify Docs
                                </button>
                              )}
                              {adm.status === "Verified" && (user.role === Role.PRINCIPAL || user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN) && (
                                <button
                                  onClick={() => handleAdmissionAction(adm.id, "Approved")}
                                  className="px-2 py-1 bg-emerald-500 text-white rounded font-bold text-[10px]"
                                >
                                  Approve Admit
                                </button>
                              )}
                              {adm.status === "Approved" && (user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN) && (
                                <button
                                  onClick={() => handleAdmissionAction(adm.id, "Enrolled")}
                                  className="px-2 py-1 bg-teal-500 text-white rounded font-bold text-[10px]"
                                >
                                  Complete Enrolment
                                </button>
                              )}
                              {adm.status === "Enrolled" && (
                                <span className="text-slate-400 font-bold italic text-[10px] flex items-center gap-1">
                                  ✓ Registered Student
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 5: Classrooms Directory */}
          {activeTab === "classes" && (
            <div className="flex flex-col gap-6">
              {/* Card headers */}
              <div className="flex justify-between items-center bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm font-display uppercase tracking-wider">Preschool Classrooms Directory</h3>
                  <p className="text-xs text-slate-500">Create Play Group, Nursery or KG sections, set teacher assignments and capacities.</p>
                </div>
                {(user.role === Role.SUPER_ADMIN || user.role === Role.ADMIN) && (
                  <button
                    onClick={() => setShowAddClass(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all"
                  >
                    <Plus className="w-4 h-4 text-amber-400" />
                    New Section
                  </button>
                )}
              </div>

              {/* Grid cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {classes.filter(c => c.status !== "Archived").map((cls) => {
                  const strengthCount = students.filter(s => s.classId === cls.id).length;
                  const assignedTeacherName = teachers.find(t => t.id === cls.teacherId)?.name || "Not Assigned";
                  return (
                    <div key={cls.id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm flex flex-col gap-4 relative overflow-hidden group hover:shadow-md transition-all">
                      <div className="absolute top-0 left-0 w-full h-1.5 bg-amber-400"></div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-bold text-slate-800 text-base font-display">{cls.name}</h4>
                          <span className="text-[10px] text-slate-400 font-semibold font-mono">Room: {cls.roomNumber}</span>
                        </div>
                        <span className="bg-amber-50 text-amber-800 font-extrabold text-[10px] px-2.5 py-0.5 rounded-full font-mono">
                          {strengthCount} / {cls.capacity} Toddlers
                        </span>
                      </div>

                      <div className="text-xs text-slate-600 flex flex-col gap-1.5 border-t border-slate-100 pt-3">
                        <p><strong className="text-slate-400 font-medium">Class Teacher:</strong> <span className="font-semibold text-slate-800">{assignedTeacherName}</span></p>
                        <p><strong className="text-slate-400 font-medium">Assistant Teacher:</strong> <span className="font-semibold text-slate-800">{cls.assistantTeacherName || "None"}</span></p>
                      </div>

                      {/* Promotion/Archival controls */}
                      {(user.role === Role.SUPER_ADMIN || user.role === Role.ADMIN) && (
                        <div className="flex gap-2 border-t border-slate-100 pt-4 mt-2">
                          <button
                            onClick={async () => {
                              if (confirm(`Archive class section ${cls.name}?`)) {
                                const res = await fetch(`/api/classes/${cls.id}`, { method: "DELETE" });
                                if (res.ok) fetchAllCollections();
                              }
                            }}
                            className="px-2.5 py-1 text-[10px] font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-lg cursor-pointer"
                          >
                            Archive
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Add Class Modal */}
              {showAddClass && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                  <form onSubmit={handleAddClass} className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 w-full max-w-md shadow-2xl flex flex-col gap-4">
                    <h4 className="font-bold text-slate-900 text-sm font-display uppercase tracking-wider border-b border-slate-100 pb-2">Add New Class Group Section</h4>
                    <div className="flex flex-col gap-3 text-xs">
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-slate-500">Section/Class Name</label>
                        <input
                          type="text"
                          required
                          value={newClassName}
                          onChange={(e) => setNewClassName(e.target.value)}
                          placeholder="e.g. Junior KG"
                          className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold text-slate-500">Max Capacity</label>
                          <input
                            type="number"
                            required
                            value={newClassCapacity}
                            onChange={(e) => setNewClassCapacity(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold text-slate-500">Room Number</label>
                          <input
                            type="text"
                            required
                            value={newClassRoom}
                            onChange={(e) => setNewClassRoom(e.target.value)}
                            placeholder="e.g. 106"
                            className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-slate-500">Assign Lead Teacher</label>
                        <select
                          value={newClassTeacher}
                          onChange={(e) => setNewClassTeacher(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none"
                        >
                          <option value="">-- Select Academic Teacher --</option>
                          {teachers.map(t => (
                            <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-slate-500">Assistant Teacher Name</label>
                        <input
                          type="text"
                          value={newClassAssistant}
                          onChange={(e) => setNewClassAssistant(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowAddClass(false)}
                        className="px-3.5 py-1.5 border border-slate-200 text-slate-600 rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-amber-500 text-white rounded-xl font-bold"
                      >
                        Save Section
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* VIEW 6: Daily Attendance Register */}
          {activeTab === "attendance" && (
            <div className="flex flex-col gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm font-display uppercase tracking-wider">Attendance Register Dashboard</h3>
                  <p className="text-xs text-slate-500">Take roll call, log lates, or file medical leaves directly with automated parental feeds.</p>
                </div>

                {/* Date & Class selector */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Marking Date</label>
                    <input
                      type="date"
                      value={attendanceDate}
                      onChange={(e) => setAttendanceDate(e.target.value)}
                      className="bg-slate-50 border border-slate-200 focus:bg-white text-xs px-3 py-2 rounded-xl outline-none"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Class Section</label>
                    <select
                      value={attendanceClass}
                      onChange={(e) => setAttendanceClass(e.target.value)}
                      className="bg-slate-50 border border-slate-200 focus:bg-white text-xs px-3 py-2 rounded-xl outline-none cursor-pointer font-bold text-slate-700"
                    >
                      {classes.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={handleSaveAttendance}
                      className="w-full px-4 py-2 bg-slate-900 text-white font-bold text-xs rounded-xl shadow-sm hover:bg-slate-800 transition-all cursor-pointer"
                    >
                      Save Daily Attendance Register
                    </button>
                  </div>
                </div>

                {/* Simple grid list table */}
                <div className="overflow-x-auto border border-slate-100 rounded-2xl mt-3">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-100 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="px-5 py-3">Student</th>
                        <th className="px-5 py-3">Roll ID</th>
                        <th className="px-5 py-3">Status</th>
                        <th className="px-5 py-3">Specific Remark / Illness Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {students.filter(s => s.classId === attendanceClass).map((st) => (
                        <tr key={st.id} className="hover:bg-slate-50/50">
                          <td className="px-5 py-3.5 font-bold text-slate-800 font-display">{st.name}</td>
                          <td className="px-5 py-3.5 font-mono text-slate-500 font-bold">#{st.rollNumber}</td>
                          <td className="px-5 py-3.5 flex gap-1.5">
                            {["Present", "Late", "Leave", "Holiday"].map((stOption) => (
                              <button
                                key={stOption}
                                onClick={() => setAttendanceGrid(prev => ({ ...prev, [st.id]: stOption as any }))}
                                className={`px-2 py-1 rounded-md text-[9px] font-extrabold uppercase transition-all cursor-pointer ${
                                  attendanceGrid[st.id] === stOption
                                    ? stOption === "Present" ? "bg-emerald-500 text-white" :
                                      stOption === "Late" ? "bg-amber-500 text-white" :
                                      stOption === "Leave" ? "bg-rose-500 text-white" : "bg-indigo-500 text-white"
                                    : "bg-slate-50 hover:bg-slate-100 text-slate-400"
                                }`}
                              >
                                {stOption}
                              </button>
                            ))}
                          </td>
                          <td className="px-5 py-3.5">
                            <input
                              type="text"
                              value={attendanceRemarks[st.id] || ""}
                              onChange={(e) => setAttendanceRemarks(prev => ({ ...prev, [st.id]: e.target.value }))}
                              placeholder="e.g. Mild flu / woke up late..."
                              className="w-full bg-slate-50 border border-slate-200 focus:bg-white text-xs px-3 py-1.5 rounded-lg outline-none text-slate-700"
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 7: Homework assignments */}
          {activeTab === "homework" && (
            <div className="flex flex-col gap-6">
              <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm font-display uppercase tracking-wider">Toddler Activity & Homework Hub</h3>
                  <p className="text-xs text-slate-500">Teachers assign simple coordination, vocabulary, or shape tasks. Parents submit photos.</p>
                </div>
                {(user.role === Role.SUPER_ADMIN || user.role === Role.ADMIN || user.role === Role.TEACHER) && (
                  <button
                    onClick={() => setShowAddHomework(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow cursor-pointer transition-all shrink-0"
                  >
                    <Plus className="w-4 h-4 text-amber-400" />
                    New Assignment
                  </button>
                )}
              </div>

              {/* Grid double split */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Active Assignments List */}
                <div className="lg:col-span-6 flex flex-col gap-4">
                  <h4 className="font-extrabold uppercase tracking-widest text-slate-400 text-[10px] font-display">Active School Tasks</h4>
                  <div className="flex flex-col gap-4">
                    {homework.map((hw) => {
                      const hwClass = classes.find(c => c.id === hw.classId);
                      return (
                        <div key={hw.id} className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex flex-col gap-3 relative overflow-hidden">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="bg-amber-100 text-amber-800 font-extrabold text-[9px] uppercase px-2 py-0.5 rounded-full inline-block mb-1 font-mono">
                                Class: {hwClass?.name || "N/A"}
                              </span>
                              <h5 className="font-bold text-slate-800 text-sm font-display leading-tight">{hw.title}</h5>
                            </div>
                            <span className="text-[10px] text-rose-500 font-bold font-mono shrink-0">Due: {hw.dueDate}</span>
                          </div>

                          <p className="text-xs text-slate-500 leading-relaxed italic">"{hw.instructions}"</p>

                          <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold mt-2 border-t border-slate-50 pt-2">
                            <span>Total Score: {hw.totalMarks} Marks</span>
                            <span>Assigned by: {hw.createdBy}</span>
                          </div>

                          {/* Parent file upload interface */}
                          {user.role === Role.PARENT && selectedStudent && (
                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/60 mt-2 flex flex-col gap-3">
                              <span className="font-bold text-[10px] uppercase text-slate-400 block">Submit Child Work Portfolio</span>
                              <div className="flex gap-2 items-center">
                                <input
                                  type="text"
                                  placeholder="Submission description (e.g. solar_paint.jpg)"
                                  value={homeworkUploadName}
                                  onChange={(e) => setHomeworkUploadName(e.target.value)}
                                  className="flex-1 bg-white border border-slate-200 px-3 py-1.5 rounded-lg text-xs outline-none text-slate-800"
                                />
                                <button
                                  onClick={(e) => handleUploadHomework(e, hw.id)}
                                  className="px-3.5 py-1.5 bg-indigo-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                                >
                                  Submit File
                                </button>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Submissions & Evaluations Queue */}
                <div className="lg:col-span-6 flex flex-col gap-4">
                  <h4 className="font-extrabold uppercase tracking-widest text-slate-400 text-[10px] font-display">Evaluation & Submissions Register</h4>
                  <div className="flex flex-col gap-4">
                    {submissions.map((sub) => {
                      const hw = homework.find(h => h.id === sub.homeworkId);
                      const st = students.find(s => s.id === sub.studentId);
                      return (
                        <div key={sub.id} className="bg-white border border-slate-100 p-5 rounded-3xl shadow-sm flex flex-col gap-3">
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-bold text-slate-800 text-xs font-display">{st?.name || "N/A"}</span>
                              <span className="text-[10px] text-slate-400 block truncate">Task: {hw?.title || "N/A"}</span>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                              sub.status === "Graded" ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"
                            }`}>
                              {sub.status}
                            </span>
                          </div>

                          <div className="text-[11px] text-slate-600 font-mono bg-slate-50 p-2 rounded-lg border border-slate-100">
                            📁 File Name: {sub.submittedFileName}
                          </div>

                          {/* Marks or Grading block */}
                          {sub.status === "Submitted" && (user.role === Role.SUPER_ADMIN || user.role === Role.ADMIN || user.role === Role.TEACHER) ? (
                            <div className="flex gap-2 items-center mt-2 pt-2 border-t border-slate-50">
                              <input
                                type="number"
                                placeholder="Marks"
                                value={gradingMarks[sub.id] || ""}
                                onChange={(e) => setGradingMarks(prev => ({ ...prev, [sub.id]: e.target.value }))}
                                className="w-16 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs outline-none text-slate-800"
                              />
                              <input
                                type="text"
                                placeholder="Write feedback remark..."
                                value={gradingFeedback[sub.id] || ""}
                                onChange={(e) => setGradingFeedback(prev => ({ ...prev, [sub.id]: e.target.value }))}
                                className="flex-1 bg-slate-50 border border-slate-200 px-2.5 py-1.5 rounded-lg text-xs outline-none text-slate-800"
                              />
                              <button
                                onClick={() => handleGradeSubmission(sub.id)}
                                className="px-3 py-1.5 bg-emerald-500 text-white rounded-lg text-xs font-bold shrink-0 cursor-pointer"
                              >
                                Grade Work
                              </button>
                            </div>
                          ) : (
                            sub.status === "Graded" && (
                              <div className="bg-emerald-50/50 p-3 rounded-xl border border-emerald-100/50 text-[11px] flex flex-col gap-1 mt-1">
                                <div className="flex justify-between font-bold text-emerald-800">
                                  <span>Marks Awarded:</span>
                                  <span>{sub.marksObtained} / {hw?.totalMarks}</span>
                                </div>
                                <p className="text-slate-500 italic">"Feedback: {sub.feedback}"</p>
                              </div>
                            )
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Add Homework modal */}
              {showAddHomework && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                  <form onSubmit={handleAddHomework} className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 w-full max-w-md shadow-2xl flex flex-col gap-4">
                    <h4 className="font-bold text-slate-900 text-sm font-display uppercase tracking-wider border-b border-slate-100 pb-2">Assign New Coordination Task</h4>
                    <div className="flex flex-col gap-3 text-xs">
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-slate-500">Target Class</label>
                        <select
                          value={newHwClass}
                          onChange={(e) => setNewHwClass(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none"
                        >
                          <option value="">-- Select Target Section --</option>
                          {classes.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-slate-500">Assignment / Task Title</label>
                        <input
                          type="text"
                          required
                          value={newHwTitle}
                          onChange={(e) => setNewHwTitle(e.target.value)}
                          placeholder="e.g. Trace the letter C"
                          className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-slate-500">Detailed Instructions</label>
                        <textarea
                          required
                          value={newHwInst}
                          onChange={(e) => setNewHwInst(e.target.value)}
                          rows={3}
                          placeholder="Instructions to parents on how to assist children..."
                          className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none resize-none"
                        ></textarea>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold text-slate-500">Submission Due Date</label>
                          <input
                            type="date"
                            required
                            value={newHwDue}
                            onChange={(e) => setNewHwDue(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none"
                          />
                        </div>
                        <div className="flex flex-col gap-1">
                          <label className="font-semibold text-slate-500">Total Score Marks</label>
                          <input
                            type="number"
                            required
                            value={newHwMarks}
                            onChange={(e) => setNewHwMarks(e.target.value)}
                            className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none"
                          />
                        </div>
                      </div>
                    </div>
                    <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                      <button
                        type="button"
                        onClick={() => setShowAddHomework(false)}
                        className="px-3.5 py-1.5 border border-slate-200 text-slate-600 rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-amber-500 text-white rounded-xl font-bold"
                      >
                        Publish Task
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* VIEW 8: Financials & Fees */}
          {activeTab === "fees" && (
            <div className="flex flex-col gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm font-display uppercase tracking-wider">Financial Accounts & Fee Ledgers</h3>
                    <p className="text-xs text-slate-500">Track child balances, daycare addons, transport charges, discounts, and issue digital receipts.</p>
                  </div>
                  <button
                    onClick={() => handleExportCSV("fees")}
                    className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold rounded-xl transition-all cursor-pointer shadow-sm"
                  >
                    <Download className="w-3.5 h-3.5" />
                    Export Ledger
                  </button>
                </div>

                {/* Ledger Listing */}
                <div className="overflow-x-auto border border-slate-100 rounded-2xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead className="bg-slate-50 border-b border-slate-100 font-bold text-slate-400 uppercase tracking-wider text-[10px]">
                      <tr>
                        <th className="px-5 py-3">Student Particulars</th>
                        <th className="px-5 py-3">Term Group</th>
                        <th className="px-5 py-3">Base Tuition</th>
                        <th className="px-5 py-3">Bus Transport</th>
                        <th className="px-5 py-3">Daycare Addon</th>
                        <th className="px-5 py-3">Discount</th>
                        <th className="px-5 py-3">Paid Total</th>
                        <th className="px-5 py-3">Outstanding Due</th>
                        <th className="px-5 py-3 text-right">Accounting Clearance</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {fees.map((fee) => {
                        const st = students.find(s => s.id === fee.studentId);
                        const totalDue = fee.baseFee + fee.transportFee + fee.daycareFee + fee.lateFee - fee.discount;
                        const outstanding = totalDue - fee.paidAmount;

                        return (
                          <tr key={fee.id} className="hover:bg-slate-50/50">
                            <td className="px-5 py-3.5 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-800 font-bold flex items-center justify-center text-xs">
                                {st?.name?.split(" ").map((n:any) => n[0]).join("") || "N"}
                              </div>
                              <div>
                                <span className="font-bold text-slate-800 block text-xs font-display">{st?.name || "N/A"}</span>
                                <span className="text-[10px] text-slate-400 font-mono">ID: {st?.admissionNumber}</span>
                              </div>
                            </td>
                            <td className="px-5 py-3.5 font-bold text-slate-600">{fee.term}</td>
                            <td className="px-5 py-3.5 font-mono text-slate-700">₹{fee.baseFee.toLocaleString()}</td>
                            <td className="px-5 py-3.5 font-mono text-slate-700">₹{fee.transportFee.toLocaleString()}</td>
                            <td className="px-5 py-3.5 font-mono text-slate-700">₹{fee.daycareFee.toLocaleString()}</td>
                            <td className="px-5 py-3.5 font-mono text-slate-700">₹{fee.discount.toLocaleString()}</td>
                            <td className="px-5 py-3.5 font-mono text-emerald-600 font-bold">₹{fee.paidAmount.toLocaleString()}</td>
                            <td className="px-5 py-3.5 font-mono text-rose-600 font-bold">₹{outstanding.toLocaleString()}</td>
                            <td className="px-5 py-3.5 text-right flex justify-end gap-1.5 pt-4">
                              {outstanding > 0 && (user.role === Role.ACCOUNTANT || user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN) ? (
                                <button
                                  onClick={() => {
                                    setSelectedStudent(st || null);
                                    setPayFeeAmount(String(outstanding));
                                    setShowPayFee(true);
                                  }}
                                  className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white rounded text-[10px] font-bold cursor-pointer transition-all"
                                >
                                  Collect Fees
                                </button>
                              ) : (
                                <span className="text-emerald-600 font-bold uppercase text-[9px] flex items-center gap-1">
                                  ✓ Cleared Ledger
                                </span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Pay Fee Modal */}
              {showPayFee && selectedStudent && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                  <form onSubmit={handlePayFeeSubmit} className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 w-full max-w-md shadow-2xl flex flex-col gap-4">
                    <h4 className="font-bold text-slate-900 text-sm font-display uppercase tracking-wider border-b border-slate-100 pb-2">Log School Fee Collection</h4>
                    
                    <div className="bg-amber-50 p-3 rounded-xl border border-amber-100 text-xs text-amber-800">
                      Collecting fees for student: <strong className="font-extrabold text-amber-950">{selectedStudent.name}</strong>
                    </div>

                    <div className="flex flex-col gap-3 text-xs">
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-slate-500">Amount to Collect (INR ₹)</label>
                        <input
                          type="number"
                          required
                          value={payFeeAmount}
                          onChange={(e) => setPayFeeAmount(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none text-base font-bold text-slate-800"
                        />
                      </div>

                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-slate-500">Transaction Mode</label>
                        <select
                          value={payFeeMode}
                          onChange={(e: any) => setPayFeeMode(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none"
                        >
                          <option value="UPI">UPI (Google Pay, PhonePe)</option>
                          <option value="Online">Net Banking / Card Link</option>
                          <option value="Cash">Cash Handover</option>
                          <option value="Card">Terminal POS Swiped</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                      <button
                        type="button"
                        onClick={() => { setShowPayFee(false); setSelectedStudent(null); }}
                        className="px-3.5 py-1.5 border border-slate-200 text-slate-600 rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-emerald-500 text-white rounded-xl font-bold"
                      >
                        Approve Payment Receipt
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* VIEW 9: Progress evaluation & Milestones report */}
          {activeTab === "reports" && (
            <div className="flex flex-col gap-6">
              <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-4">
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm font-display uppercase tracking-wider">Milestones Report Card center</h3>
                    <p className="text-xs text-slate-500">Select an enrolled student to generate, compile development score indices, or print official profiles.</p>
                  </div>
                </div>

                {/* Grid checklist list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {students.map((st) => {
                    const stClass = classes.find(c => c.id === st.classId);
                    const reportFiled = progress.find(p => p.studentId === st.id);
                    return (
                      <div
                        key={st.id}
                        className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between h-44 hover:shadow-md ${
                          selectedStudent?.id === st.id
                            ? "border-amber-400 bg-amber-50/20 shadow"
                            : "border-slate-100 bg-white"
                        }`}
                        onClick={() => setSelectedStudent(st)}
                      >
                        <div>
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide font-mono block">Class Section: {stClass?.name || "PG"}</span>
                          <h4 className="font-bold text-slate-800 text-sm font-display tracking-tight mt-1">{st.name}</h4>
                          <p className="text-[10px] text-slate-400 font-medium">Roll Number: #{st.rollNumber}</p>
                        </div>

                        <div className="flex justify-between items-center border-t border-slate-50 pt-3">
                          <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase ${
                            reportFiled ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"
                          }`}>
                            {reportFiled ? "✓ Report Card Compiled" : "✗ Pending Grades"}
                          </span>

                          {(user.role === Role.TEACHER || user.role === Role.ADMIN || user.role === Role.SUPER_ADMIN) && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setSelectedStudent(st);
                                setShowProgressForm(true);
                              }}
                              className="px-2.5 py-1 text-[10px] font-bold bg-slate-900 hover:bg-slate-800 text-white rounded-lg"
                            >
                              Grade milestones
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Progress marking compiler modal */}
              {showProgressForm && selectedStudent && (
                <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                  <form onSubmit={handleProgressSubmit} className="bg-white rounded-3xl border border-slate-100 p-6 sm:p-8 w-full max-w-lg shadow-2xl flex flex-col gap-4 max-h-[85vh] overflow-y-auto">
                    <h4 className="font-bold text-slate-900 text-sm font-display uppercase tracking-wider border-b border-slate-100 pb-2">Compile Toddler Milestones Score</h4>
                    
                    <div className="bg-indigo-50 p-3 rounded-xl border border-indigo-100 text-xs text-indigo-800">
                      Compiling Term 1 evaluation grades for student: <strong className="font-extrabold text-indigo-950">{selectedStudent.name}</strong>
                    </div>

                    <div className="flex flex-col gap-4 text-xs">
                      <div className="flex flex-col gap-1">
                        <label className="font-semibold text-slate-500">Evaluation Academic Term</label>
                        <select
                          value={newProgressTerm}
                          onChange={(e: any) => setNewProgressTerm(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 px-3 py-2 rounded-xl outline-none"
                        >
                          <option value="Term 1">Term 1 Evaluation</option>
                          <option value="Term 2">Term 2 Evaluation</option>
                          <option value="Term 3">Term 3 Evaluation</option>
                        </select>
                      </div>

                      <div className="border-t border-slate-100 pt-3">
                        <span className="font-extrabold text-[10px] text-slate-400 uppercase tracking-wider mb-2 block">Skill Indexes (1-5 Star Score)</span>
                        <div className="grid grid-cols-2 gap-3.5">
                          {Object.keys(newProgressMetrics).map((mKey) => (
                            <div key={mKey} className="flex justify-between items-center bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
                              <span className="font-semibold text-slate-700 capitalize text-[11px]">{mKey.replace(/([A-Z])/g, ' $1')}</span>
                              <select
                                value={(newProgressMetrics as any)[mKey]}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  setNewProgressMetrics(prev => ({ ...prev, [mKey]: val }));
                                }}
                                className="bg-white border border-slate-200 px-1.5 py-0.5 rounded text-xs text-slate-800"
                              >
                                <option value="5">5 - Exceptional</option>
                                <option value="4">4 - Proficient</option>
                                <option value="3">3 - Developing</option>
                                <option value="2">2 - Emerging</option>
                                <option value="1">1 - Needs practice</option>
                              </select>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-col gap-1 mt-2">
                        <label className="font-semibold text-slate-500">Observations / Development Remarks</label>
                        <textarea
                          required
                          value={newProgressRemarks}
                          onChange={(e) => setNewProgressRemarks(e.target.value)}
                          rows={3}
                          placeholder="e.g. Displays splendid fine motor grip during clay moulding, very expressive during verbal story sessions..."
                          className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none resize-none"
                        ></textarea>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
                      <button
                        type="button"
                        onClick={() => { setShowProgressForm(false); setSelectedStudent(null); }}
                        className="px-3.5 py-1.5 border border-slate-200 text-slate-600 rounded-xl"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 bg-emerald-500 text-white rounded-xl font-bold"
                      >
                        Approve Progress Report Card
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>
          )}

          {/* VIEW 10: System General Settings */}
          {activeTab === "settings" && (
            <div className="flex flex-col gap-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* School Profile Updates */}
                <form onSubmit={handleUpdateSettings} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
                  <h3 className="font-bold text-slate-900 text-sm font-display uppercase tracking-wider border-b border-slate-100 pb-3">Preschool General settings</h3>
                  <div className="flex flex-col gap-3 text-xs">
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-slate-500">School Name</label>
                      <input
                        type="text"
                        required
                        value={settingsSchoolName}
                        onChange={(e) => setSettingsSchoolName(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none font-bold text-slate-800"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-slate-500">Admin Email Address</label>
                      <input
                        type="email"
                        required
                        value={settingsEmail}
                        onChange={(e) => setSettingsEmail(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-slate-500">Helpdesk Phone</label>
                      <input
                        type="text"
                        required
                        value={settingsPhone}
                        onChange={(e) => setSettingsPhone(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-1">
                      <label className="font-semibold text-slate-500">Official Street Address</label>
                      <textarea
                        required
                        value={settingsAddress}
                        onChange={(e) => setSettingsAddress(e.target.value)}
                        rows={2}
                        className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl outline-none resize-none"
                      ></textarea>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="mt-2 w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition-colors cursor-pointer"
                  >
                    Save Settings Parameters
                  </button>
                </form>

                {/* Academic Year Timetable */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-4">
                  <h3 className="font-bold text-slate-900 text-sm font-display uppercase tracking-wider border-b border-slate-100 pb-3">Academic Timetable & Calendar</h3>
                  <div className="text-xs text-slate-600 flex flex-col gap-3.5">
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                      <span className="text-slate-400 font-semibold block text-[10px] uppercase">Daily Toddler Hours</span>
                      <span className="font-bold text-slate-800 mt-1 block">{settings?.classTimings || "08:30 AM - 12:30 PM"}</span>
                    </div>

                    <div className="flex flex-col gap-2">
                      <span className="text-slate-400 font-semibold block text-[10px] uppercase border-b border-slate-100 pb-1">Upcoming Holidays Notice</span>
                      <div className="flex flex-col gap-1.5 divide-y divide-slate-100">
                        {settings?.holidayCalendar?.map((h, i) => (
                          <div key={i} className="pt-2 flex justify-between">
                            <span className="font-bold text-slate-700">{h.name}</span>
                            <span className="font-mono text-slate-500 font-bold">{h.date}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Main Full Admissions Overlay Form */}
      {showAdmissionForm && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="w-full max-w-4xl">
            <AdmissionForm
              classes={classes}
              onCancel={() => setShowAdmissionForm(false)}
              onSuccess={() => {
                setShowAdmissionForm(false);
                fetchAllCollections();
                alert("Admission filed successfully! The application is queued under reviewed status.");
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
