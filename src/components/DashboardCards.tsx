import React from "react";
import { Users, BookOpen, GraduationCap, Calendar, Wallet, Percent, Bell, Clock, Cake } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string; // Tailwind bg color class
  textColor: string; // Tailwind text color class
}

function StatCard({ title, value, subtitle, icon, color, textColor }: StatCardProps) {
  return (
    <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all flex justify-between items-center group cursor-pointer">
      <div className="flex flex-col gap-1 min-w-0">
        <span className="text-slate-400 font-semibold text-[10px] uppercase tracking-wider block font-sans">
          {title}
        </span>
        <span className="text-xl sm:text-2xl font-black text-slate-800 font-display truncate">
          {value}
        </span>
        {subtitle && (
          <span className="text-[10px] font-medium text-slate-500 truncate block">
            {subtitle}
          </span>
        )}
      </div>
      <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${color} ${textColor} shadow-inner group-hover:scale-110 transition-transform shrink-0`}>
        {icon}
      </div>
    </div>
  );
}

interface DashboardCardsProps {
  totalStudents: number;
  activeStudents: number;
  inactiveStudents: number;
  teachers: number;
  classes: number;
  admissionsPending: number;
  attendancePct: number;
  homeworkCount: number;
  feesCollected: number;
  pendingFees: number;
  upcomingBirthdays: number;
}

export default function DashboardCards({
  totalStudents,
  activeStudents,
  inactiveStudents,
  teachers,
  classes,
  admissionsPending,
  attendancePct,
  homeworkCount,
  feesCollected,
  pendingFees,
  upcomingBirthdays,
}: DashboardCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <StatCard
        title="Total Enrollment"
        value={totalStudents}
        subtitle={`${activeStudents} Active | ${inactiveStudents} Inactive`}
        icon={<Users className="w-5 h-5" />}
        color="bg-amber-50"
        textColor="text-amber-500"
      />

      <StatCard
        title="Academic Teachers"
        value={teachers}
        subtitle={`${classes} Managed Classes`}
        icon={<GraduationCap className="w-5 h-5" />}
        color="bg-sky-50"
        textColor="text-sky-500"
      />

      <StatCard
        title="Average Attendance"
        value={`${attendancePct}%`}
        subtitle="Current Academic Month"
        icon={<Percent className="w-5 h-5" />}
        color="bg-emerald-50"
        textColor="text-emerald-500"
      />

      <StatCard
        title="Active Homeworks"
        value={homeworkCount}
        subtitle="Pending evaluation submission"
        icon={<BookOpen className="w-5 h-5" />}
        color="bg-purple-50"
        textColor="text-purple-500"
      />

      <StatCard
        title="Term Fees Collected"
        value={`₹${feesCollected.toLocaleString()}`}
        subtitle="Term 1 Ledger"
        icon={<Wallet className="w-5 h-5" />}
        color="bg-rose-50"
        textColor="text-rose-500"
      />

      <StatCard
        title="Outstanding Fees"
        value={`₹${pendingFees.toLocaleString()}`}
        subtitle="Outstanding balances"
        icon={<Clock className="w-5 h-5" />}
        color="bg-indigo-50"
        textColor="text-indigo-500"
      />

      <StatCard
        title="Admissions Queue"
        value={admissionsPending}
        subtitle="Unreviewed applications"
        icon={<Calendar className="w-5 h-5" />}
        color="bg-orange-50"
        textColor="text-orange-500"
      />

      <StatCard
        title="Upcoming Birthdays"
        value={upcomingBirthdays}
        subtitle="Next 15 days"
        icon={<Cake className="w-5 h-5" />}
        color="bg-teal-50"
        textColor="text-teal-500"
      />
    </div>
  );
}
