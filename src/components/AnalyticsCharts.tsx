import React from "react";

export default function AnalyticsCharts() {
  // SVG Custom curved line chart for Monthly Admissions (Jan - June)
  const renderAdmissionsChart = () => {
    const data = [12, 18, 15, 24, 30, 28]; // admissions
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];
    const width = 450;
    const height = 180;
    const padding = 30;

    // Calculate point coordinates
    const points = data.map((val, idx) => {
      const x = padding + (idx * (width - padding * 2)) / (data.length - 1);
      const y = height - padding - (val / 35) * (height - padding * 2);
      return { x, y };
    });

    // Generate SVG path for a smooth cubic bezier curve
    let pathString = `M ${points[0].x} ${points[0].y}`;
    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 2;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (p1.x - p0.x) / 2;
      const cpY2 = p1.y;
      pathString += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }

    return (
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3 flex-1 min-w-[300px]">
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Monthly Admissions Queue</h4>
          <p className="text-xs font-bold text-slate-700">Academic Year 2026-27</p>
        </div>
        <div className="relative w-full overflow-hidden">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto text-indigo-500">
            {/* Grid Lines */}
            {[0, 1, 2, 3].map((g) => {
              const y = padding + (g * (height - padding * 2)) / 3;
              return (
                <line
                  key={g}
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1.5"
                />
              );
            })}

            {/* Area under line */}
            <path
              d={`${pathString} L ${points[points.length - 1].x} ${height - padding} L ${points[0].x} ${height - padding} Z`}
              fill="url(#grad)"
              opacity="0.15"
            />

            {/* The line itself */}
            <path
              d={pathString}
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeLinecap="round"
            />

            {/* Circles at data points */}
            {points.map((pt, i) => (
              <g key={i} className="group cursor-pointer">
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="5"
                  fill="white"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="9"
                  fill="currentColor"
                  opacity="0"
                  className="hover:opacity-10 transition-opacity"
                />
              </g>
            ))}

            {/* X Axis Labels */}
            {months.map((m, idx) => {
              const x = padding + (idx * (width - padding * 2)) / (months.length - 1);
              return (
                <text
                  key={idx}
                  x={x}
                  y={height - 10}
                  textAnchor="middle"
                  className="text-[10px] font-bold fill-slate-400 font-sans"
                >
                  {m}
                </text>
              );
            })}

            {/* Definitions for gradient */}
            <defs>
              <linearGradient id="grad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="currentColor" />
                <stop offset="100%" stopColor="white" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>
    );
  };

  // SVG Bar Chart for Attendance per Class group
  const renderAttendanceChart = () => {
    const data = [92, 88, 95, 91, 85]; // percentages
    const classes = ["PG", "Nursery", "Jr.KG", "Sr.KG", "Daycare"];
    const width = 450;
    const height = 180;
    const padding = 30;

    return (
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3 flex-1 min-w-[300px]">
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Attendance Analytics</h4>
          <p className="text-xs font-bold text-slate-700">Average % Per Section</p>
        </div>
        <div className="relative w-full overflow-hidden">
          <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto text-sky-400">
            {/* Grid Lines */}
            {[0, 1, 2, 3].map((g) => {
              const y = padding + (g * (height - padding * 2)) / 3;
              return (
                <line
                  key={g}
                  x1={padding}
                  y1={y}
                  x2={width - padding}
                  y2={y}
                  stroke="#f1f5f9"
                  strokeWidth="1.5"
                />
              );
            })}

            {/* Bars */}
            {data.map((val, idx) => {
              const barWidth = 32;
              const spacing = (width - padding * 2) / data.length;
              const x = padding + idx * spacing + (spacing - barWidth) / 2;
              const barHeight = (val / 100) * (height - padding * 2);
              const y = height - padding - barHeight;

              return (
                <g key={idx}>
                  <rect
                    x={x}
                    y={y}
                    width={barWidth}
                    height={barHeight}
                    rx="6"
                    fill="currentColor"
                    className="hover:fill-sky-500 transition-colors cursor-pointer"
                  />
                  {/* Floating value text */}
                  <text
                    x={x + barWidth / 2}
                    y={y - 6}
                    textAnchor="middle"
                    className="text-[9px] font-bold fill-slate-500 font-mono"
                  >
                    {val}%
                  </text>
                </g>
              );
            })}

            {/* Labels */}
            {classes.map((cls, idx) => {
              const spacing = (width - padding * 2) / classes.length;
              const x = padding + idx * spacing + spacing / 2;
              return (
                <text
                  key={idx}
                  x={x}
                  y={height - 10}
                  textAnchor="middle"
                  className="text-[10px] font-bold fill-slate-400 font-sans"
                >
                  {cls}
                </text>
              );
            })}
          </svg>
        </div>
      </div>
    );
  };

  // Circular Sector Chart for Fee Collection Status (Paid, Partial, Unpaid)
  const renderFeesPieChart = () => {
    return (
      <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex flex-col gap-3 shrink-0 w-full md:w-80">
        <div>
          <h4 className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Term Ledger Status</h4>
          <p className="text-xs font-bold text-slate-700">Collection Categories</p>
        </div>
        
        <div className="flex items-center gap-6 py-2">
          {/* Custom SVG Doughnut */}
          <div className="relative w-28 h-28 shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {/* Unpaid (25% - dasharray 25 75) - Red */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#fda4af"
                strokeWidth="16"
                strokeDasharray="25 75"
                strokeDashoffset="0"
              />
              {/* Partial (25% - dasharray 25 75) - Orange */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#fed7aa"
                strokeWidth="16"
                strokeDasharray="25 75"
                strokeDashoffset="-25"
              />
              {/* Paid (50% - dasharray 50 50) - Green */}
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="transparent"
                stroke="#a7f3d0"
                strokeWidth="16"
                strokeDasharray="50 50"
                strokeDashoffset="-50"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-base font-black text-slate-700 font-display leading-none">Term 1</span>
              <span className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">80% Recv</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 flex-1 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-emerald-300"></span>
              <div className="flex-1 min-w-0">
                <span className="text-slate-500 font-medium block text-[10px]">Fully Paid</span>
                <span className="font-bold text-slate-800">50% of Ledger</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-orange-200"></span>
              <div className="flex-1 min-w-0">
                <span className="text-slate-500 font-medium block text-[10px]">Partially Paid</span>
                <span className="font-bold text-slate-800">25% of Ledger</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-rose-200"></span>
              <div className="flex-1 min-w-0">
                <span className="text-slate-500 font-medium block text-[10px]">Unpaid Balance</span>
                <span className="font-bold text-slate-800">25% of Ledger</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 w-full">
      {renderAdmissionsChart()}
      {renderAttendanceChart()}
      {renderFeesPieChart()}
    </div>
  );
}
