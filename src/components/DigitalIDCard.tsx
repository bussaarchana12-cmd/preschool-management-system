import React, { useRef } from "react";
import { Student, Class } from "../types";
import { QrCode, Phone, MapPin, Shield, Download } from "lucide-react";

interface DigitalIDCardProps {
  student: Student;
  classes: Class[];
  schoolName: string;
}

export default function DigitalIDCard({ student, classes, schoolName }: DigitalIDCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const currentClass = classes.find((c) => c.id === student.classId);

  // SVG representation of a simulated QR Code containing student data
  const renderSimulatedQR = () => {
    return (
      <svg className="w-16 h-16 text-slate-800" viewBox="0 0 100 100">
        <rect width="100" height="100" fill="white" />
        {/* Corners */}
        <rect x="5" y="5" width="25" height="25" fill="currentColor" />
        <rect x="10" y="10" width="15" height="15" fill="white" />
        <rect x="13" y="13" width="9" height="9" fill="currentColor" />

        <rect x="70" y="5" width="25" height="25" fill="currentColor" />
        <rect x="75" y="10" width="15" height="15" fill="white" />
        <rect x="78" y="13" width="9" height="9" fill="currentColor" />

        <rect x="5" y="70" width="25" height="25" fill="currentColor" />
        <rect x="10" y="75" width="15" height="15" fill="white" />
        <rect x="13" y="78" width="9" height="9" fill="currentColor" />

        {/* Dynamic-looking dots based on student name length */}
        <rect x="35" y="5" width="5" height="15" fill="currentColor" />
        <rect x="45" y="15" width="10" height="5" fill="currentColor" />
        <rect x="60" y="5" width="5" height="25" fill="currentColor" />
        <rect x="35" y="25" width="15" height="5" fill="currentColor" />
        
        <rect x="35" y="40" width="5" height="10" fill="currentColor" />
        <rect x="50" y="45" width="15" height="5" fill="currentColor" />
        <rect x="75" y="45" width="20" height="5" fill="currentColor" />
        
        <rect x="5" y="45" width="15" height="5" fill="currentColor" />
        <rect x="25" y="50" width="5" height="15" fill="currentColor" />
        
        <rect x="35" y="60" width="25" height="5" fill="currentColor" />
        <rect x="45" y="70" width="5" height="15" fill="currentColor" />
        <rect x="55" y="75" width="15" height="5" fill="currentColor" />
        <rect x="75" y="70" width="20" height="5" fill="currentColor" />
        <rect x="85" y="80" width="5" height="15" fill="currentColor" />
        <rect x="35" y="85" width="15" height="5" fill="currentColor" />
      </svg>
    );
  };

  const triggerPrint = () => {
    const printableContent = cardRef.current?.innerHTML;
    const originalContent = document.body.innerHTML;
    if (printableContent) {
      const printWindow = window.open("", "_blank");
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Student ID - ${student.name}</title>
              <script src="https://cdn.tailwindcss.com"></script>
              <style>
                body { font-family: 'Inter', sans-serif; -webkit-print-color-adjust: exact; }
              </style>
            </head>
            <body class="bg-slate-100 flex items-center justify-center min-h-screen py-10">
              <div class="border border-slate-300 rounded-3xl overflow-hidden shadow-2xl bg-white max-w-sm w-full">
                ${printableContent}
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

  return (
    <div className="flex flex-col items-center gap-4 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
      <div
        id={`student-card-${student.id}`}
        ref={cardRef}
        className="w-full max-w-sm bg-gradient-to-br from-indigo-50/50 to-slate-50 border border-indigo-100 rounded-3xl shadow-sm overflow-hidden flex flex-col p-6 text-slate-800"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-indigo-100/60 pb-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold text-xs shadow-sm font-display">
              FT
            </div>
            <div>
              <h4 className="text-xs font-bold tracking-wider text-indigo-800 uppercase font-display">
                Intellitots
              </h4>
              <p className="text-[9px] font-medium text-slate-500">Preschool ERP</p>
            </div>
          </div>
          <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full font-mono">
            2026-27
          </span>
        </div>

        {/* Content Body */}
        <div className="flex gap-4 items-start">
          <div className="relative">
            {student.profilePhoto ? (
              <img
                src={student.profilePhoto}
                alt={student.name}
                className="w-24 h-28 object-cover rounded-2xl border-2 border-white shadow-sm bg-white"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-24 h-28 rounded-2xl border-2 border-white shadow-sm bg-indigo-100/60 flex flex-col items-center justify-center text-indigo-800">
                <span className="text-2xl font-bold font-display">
                  {student.name.split(" ").map((n) => n[0]).join("")}
                </span>
                <span className="text-[9px] mt-1 text-indigo-600 font-medium">No Photo</span>
              </div>
            )}
            <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white rounded-full p-1 border-2 border-white shadow-sm">
              <Shield className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="flex-1 flex flex-col gap-1.5 min-w-0">
            <h3 className="text-base font-bold text-slate-900 leading-tight font-display truncate">
              {student.name}
            </h3>
            
            <div className="grid grid-cols-2 gap-x-2 gap-y-1 mt-1 text-[11px]">
              <div>
                <span className="text-slate-400 font-medium block text-[9px] uppercase tracking-wider">Class</span>
                <span className="font-bold text-slate-700">{currentClass?.name || "N/A"}</span>
              </div>
              <div>
                <span className="text-slate-400 font-medium block text-[9px] uppercase tracking-wider">Roll No</span>
                <span className="font-bold text-slate-700">#{student.rollNumber}</span>
              </div>
              <div className="col-span-2">
                <span className="text-slate-400 font-medium block text-[9px] uppercase tracking-wider">Admission ID</span>
                <span className="font-mono font-bold text-slate-800 tracking-wide text-xs">{student.admissionNumber}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer & QR */}
        <div className="mt-5 border-t border-indigo-100/60 pt-4 flex items-center justify-between gap-4">
          <div className="flex-1 text-[9px] text-slate-500 flex flex-col gap-1">
            <div className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-indigo-500 shrink-0" />
              <span className="truncate">Koregaon Park, Pune, MH</span>
            </div>
            <div className="flex items-center gap-1">
              <Phone className="w-3 h-3 text-indigo-500 shrink-0" />
              <span>+91 91234 56789</span>
            </div>
          </div>
          <div className="border border-indigo-100 p-1.5 bg-white rounded-xl shadow-sm">
            {renderSimulatedQR()}
          </div>
        </div>
      </div>

      <button
        onClick={triggerPrint}
        className="flex items-center gap-2 justify-center w-full max-w-sm px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white text-xs font-semibold rounded-xl shadow-sm transition-all cursor-pointer font-display"
      >
        <Download className="w-4 h-4" />
        Print Student Digital ID
      </button>
    </div>
  );
}
