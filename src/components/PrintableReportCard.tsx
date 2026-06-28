import React, { useRef } from "react";
import { Student, Class, ProgressReport } from "../types";
import { Award, CheckCircle2, User, Printer } from "lucide-react";

interface PrintableReportCardProps {
  student: Student;
  currentClass?: Class;
  progressReport?: ProgressReport;
  schoolName: string;
}

export default function PrintableReportCard({
  student,
  currentClass,
  progressReport,
  schoolName,
}: PrintableReportCardProps) {
  const printRef = useRef<HTMLDivElement>(null);

  const metricLabels: { [key: string]: string } = {
    communication: "Expressive Communication",
    motorSkills: "Fine & Gross Motor Skills",
    creativity: "Creativity & Imagination",
    behaviour: "Classroom Behaviour",
    socialSkills: "Social & Empathy Skills",
    learning: "General Cognitive Learning",
    reading: "Phonics & Word Reading",
    writing: "Pre-Writing / Letter Tracing",
    speaking: "Pronunciation & Vocabulary",
    confidence: "Self Confidence & Independence",
    participation: "Class Activity Participation",
  };

  const getMetricDescription = (score: number) => {
    if (score >= 5) return { grade: "Outstanding (A+)", color: "bg-emerald-500", text: "Demonstrates exceptional age-appropriate maturity and leadership." };
    if (score >= 4) return { grade: "Proficient (A)", color: "bg-teal-500", text: "Consistently performs tasks independently with confidence." };
    if (score >= 3) return { grade: "Developing (B)", color: "bg-amber-500", text: "Progressing nicely; shows good comprehension and active efforts." };
    if (score >= 2) return { grade: "Emerging (C)", color: "bg-orange-500", text: "Beginning to demonstrate skill; benefits from teacher assistance." };
    return { grade: "Needs Support (D)", color: "bg-rose-500", text: "Requires focused, repetitive practice and individual tutoring." };
  };

  const triggerPrint = () => {
    const content = printRef.current?.innerHTML;
    if (content) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Progress Report - ${student.name}</title>
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                body { font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; }
                @media print {
                  body { background: white; }
                  .no-print { display: none; }
                }
              </style>
            </head>
            <body class="bg-white p-8">
              <div class="max-w-4xl mx-auto border-4 border-indigo-100 p-8 rounded-3xl bg-white">
                ${content}
              </div>
              <script>
                window.onload = function() {
                  window.print();
                  setTimeout(() => { window.close(); }, 500);
                }
              </script>
            </body>
          </html>
        `);
        printWindow.document.close();
      }
    }
  };

  if (!progressReport) {
    return (
      <div className="bg-slate-50 border border-dashed border-slate-200 rounded-2xl p-8 text-center flex flex-col items-center justify-center">
        <Award className="w-12 h-12 text-slate-300 mb-2" />
        <p className="text-slate-500 text-sm font-medium">No official progress report is generated for this term yet.</p>
        <p className="text-xs text-slate-400 mt-1">Class teachers can compile grades in the Teacher Dashboard.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Action panel */}
      <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-slate-100 shadow-sm">
        <div>
          <h4 className="text-sm font-bold text-slate-900 font-display">Printable Term Evaluation Report</h4>
          <p className="text-xs text-slate-500">Official preschool report card for {progressReport.term} ({progressReport.academicYear})</p>
        </div>
        <button
          onClick={triggerPrint}
          className="flex items-center gap-2 px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-sm transition-all"
        >
          <Printer className="w-4 h-4" />
          Print Report Card
        </button>
      </div>

      {/* Actual card content */}
      <div
        ref={printRef}
        className="bg-white border-2 border-slate-100 rounded-3xl p-6 sm:p-10 shadow-sm text-slate-800 flex flex-col gap-6"
      >
        {/* Certificate/Report Header */}
        <div className="text-center border-b-2 border-indigo-100 pb-6">
          <div className="flex justify-center items-center gap-2 mb-2">
            <span className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold flex items-center justify-center shadow-sm font-display">
              FT
            </span>
            <span className="text-xl font-bold text-indigo-950 tracking-tight font-display">
              {schoolName}
            </span>
          </div>
          <h2 className="text-lg font-bold uppercase tracking-wider text-slate-700 font-display">
            Toddler Development Profile
          </h2>
          <p className="text-xs text-slate-400 font-medium">Official School Academic Record & Skill Progress Report</p>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-indigo-50/30 p-4 rounded-2xl border border-indigo-100/60">
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Student Name</span>
            <span className="font-bold text-slate-900 font-display">{student.name}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Admission ID</span>
            <span className="font-mono text-slate-800 font-bold">{student.admissionNumber}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Class Group</span>
            <span className="font-bold text-slate-900">{currentClass?.name || "Play Group"}</span>
          </div>
          <div>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider block font-semibold">Term / Year</span>
            <span className="font-bold text-slate-900 font-mono">{progressReport.term}</span>
          </div>
        </div>

        {/* Development Ratings */}
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-4 font-display">
            Development Area Evaluation
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
            {Object.entries(progressReport.metrics).map(([key, value]) => {
              const details = getMetricDescription(value);
              return (
                <div key={key} className="flex flex-col gap-1 border-b border-slate-100 pb-2.5">
                  <div className="flex justify-between items-center text-sm">
                    <span className="font-semibold text-slate-700">{metricLabels[key] || key}</span>
                    <span className="font-bold font-mono text-slate-900">{value} / 5</span>
                  </div>
                  {/* Visual Bar */}
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div className={`${details.color} h-full`} style={{ width: `${(value / 5) * 100}%` }}></div>
                  </div>
                  <div className="flex justify-between items-center text-[10px] text-slate-500 font-medium">
                    <span>{details.grade}</span>
                    <span className="italic shrink-0 max-w-[180px] sm:max-w-none text-right truncate">{details.text}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* General Remarks */}
        <div className="border-t border-slate-100 pt-6">
          <h3 className="text-xs font-bold uppercase tracking-widest text-slate-500 mb-2 font-display">
            Class Teacher's Observations
          </h3>
          <p className="text-sm bg-slate-50 p-4 rounded-xl border border-slate-100 text-slate-600 leading-relaxed italic">
            "{progressReport.remarks || "No teacher remarks recorded."}"
          </p>
        </div>

        {/* Signature Line */}
        <div className="flex justify-between items-end mt-10 pt-8 border-t border-slate-200/60 text-center">
          <div className="flex flex-col items-center">
            <div className="w-32 border-b border-slate-300 pb-1 mb-1.5 font-mono text-[10px] text-slate-400">
              Verified Electronic
            </div>
            <span className="text-xs font-bold text-slate-700 font-display">Ms. Sarah Jenkins</span>
            <span className="text-[10px] text-slate-400">Class Teacher</span>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-32 border-b border-slate-300 pb-1 mb-1.5 font-mono text-[10px] text-slate-400">
              Approved
            </div>
            <span className="text-xs font-bold text-slate-700 font-display">Mrs. Evelyn Carter</span>
            <span className="text-[10px] text-slate-400">School Principal</span>
          </div>
        </div>
      </div>
    </div>
  );
}
