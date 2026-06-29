import React, { useState, useEffect } from "react";
import { Student } from "../types";
import { Brain, Sparkles, CheckCircle2, AlertCircle, RefreshCw, Milestone, FileSpreadsheet, Compass } from "lucide-react";

interface AIInsightsProps {
  student: Student;
  onUpdateStudent: (updatedStudent: Student) => void;
}

const LOADING_STEPS = [
  "Retrieving evaluation records & teacher remarks...",
  "Running cognitive milestone comparative analysis...",
  "Structuring behavioral and attendance historical trends...",
  "Formulating personalized learning strategies...",
  "Generating parent meeting recommendations with AI diagnostics...",
  "Wrapping up child development profile..."
];

export default function AIInsights({ student, onUpdateStudent }: AIInsightsProps) {
  const [loading, setLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setCurrentStep((prev) => (prev < LOADING_STEPS.length - 1 ? prev + 1 : prev));
      }, 3500);
    } else {
      setCurrentStep(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  const generateAIInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("/api/ai/analyze-student", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ studentId: student.id }),
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to analyze student");
      }

      const data = await response.json();
      
      // Update local student instance with returned aiSummary
      const updatedStudent: Student = {
        ...student,
        aiSummary: data
      };
      
      onUpdateStudent(updatedStudent);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred while calling the AI student analytics service.");
    } finally {
      setLoading(false);
    }
  };

  const insights = student.aiSummary;

  return (
    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 pb-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-indigo-600 shadow-inner">
            <Brain className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-bold text-slate-900 text-lg font-display">AI Child Growth Analytics</h3>
              <span className="bg-indigo-100 text-indigo-800 text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0.5 rounded-full font-sans">
                Diagnostics Active
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Generates learning insights, behavioral analysis, and specialized school plans.
            </p>
          </div>
        </div>
        
        <button
          onClick={generateAIInsights}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] disabled:opacity-50 text-white rounded-lg text-xs font-semibold cursor-pointer shadow-sm transition-all font-display shrink-0 w-full sm:w-auto justify-center"
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 animate-spin" />
          ) : (
            <Sparkles className="w-4 h-4 animate-bounce" />
          )}
          {insights ? "Re-Generate AI Analysis" : "Generate AI Insights"}
        </button>
      </div>

      {/* Loading Screen */}
      {loading && (
        <div className="py-12 flex flex-col items-center justify-center gap-4 text-center">
          <div className="relative">
            <div className="w-16 h-16 rounded-full border-4 border-indigo-100 border-t-indigo-500 animate-spin"></div>
            <Sparkles className="w-6 h-6 text-indigo-500 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </div>
          <div className="flex flex-col gap-1 max-w-sm">
            <p className="text-sm font-bold text-slate-800 font-display animate-pulse">
              Intellitots AI is thinking...
            </p>
            <p className="text-xs text-indigo-600 font-semibold italic min-h-[1.5rem]">
              "{LOADING_STEPS[currentStep]}"
            </p>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {error && !loading && (
        <div className="bg-rose-50 border border-rose-100 p-4 rounded-2xl flex items-start gap-3 text-rose-800">
          <AlertCircle className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
          <div>
            <h5 className="font-bold text-sm font-display">Generation Interrupted</h5>
            <p className="text-xs text-rose-700 mt-0.5">{error}</p>
            <button
              onClick={generateAIInsights}
              className="text-xs font-bold text-rose-900 underline mt-2 hover:text-rose-950 block"
            >
              Retry Connection
            </button>
          </div>
        </div>
      )}

      {/* Analytics Content */}
      {insights && !loading && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main summary */}
          <div className="md:col-span-3 bg-gradient-to-r from-indigo-50/50 to-purple-50/30 p-5 rounded-2xl border border-indigo-100 flex gap-4 items-start">
            <Compass className="w-6 h-6 text-indigo-600 shrink-0 mt-1" />
            <div>
              <h4 className="font-bold text-slate-900 text-sm font-display uppercase tracking-wider mb-1">
                Development Narrative & Profile Summary
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed italic">
                "{insights.summary}"
              </p>
              {insights.offlineMode && (
                <p className="text-[10px] text-slate-400 mt-2 font-medium">
                  * Generated locally in offline diagnostic mode. Provide a valid API key to activate live analysis.
                </p>
              )}
            </div>
          </div>

          {/* Left Column: Strengths & Weaknesses */}
          <div className="flex flex-col gap-5">
            <div className="bg-emerald-50/30 border border-emerald-100 p-5 rounded-2xl flex flex-col gap-3">
              <h4 className="font-bold text-emerald-800 text-xs uppercase tracking-wider font-display flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                Key Cognitive & Social Strengths
              </h4>
              <ul className="flex flex-col gap-2">
                {insights.strengths?.map((str, i) => (
                  <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{str}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50/30 border border-amber-100 p-5 rounded-2xl flex flex-col gap-3">
              <h4 className="font-bold text-amber-800 text-xs uppercase tracking-wider font-display flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Milestone Opportunities (Weaknesses)
              </h4>
              <ul className="flex flex-col gap-2">
                {insights.weaknesses?.map((weak, i) => (
                  <li key={i} className="text-xs text-slate-700 flex items-start gap-2">
                    <Milestone className="w-4 h-4 text-amber-500 shrink-0 mt-0.5 animate-bounce" />
                    <span>{weak}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Center Column: School & Home Actions */}
          <div className="flex flex-col gap-5">
            <div className="bg-slate-50 border border-slate-100 p-5 rounded-2xl flex flex-col gap-3">
              <h4 className="font-bold text-slate-700 text-xs uppercase tracking-wider font-display">
                Classroom Adaptations
              </h4>
              <ul className="flex flex-col gap-2.5">
                {insights.improvements?.map((imp, i) => (
                  <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                    <span className="text-slate-400 font-bold font-mono shrink-0">0{i+1}.</span>
                    <span>{imp}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-indigo-50/10 border border-indigo-50/60 p-5 rounded-2xl flex flex-col gap-3">
              <h4 className="font-bold text-indigo-800 text-xs uppercase tracking-wider font-display">
                Age-Appropriate Home Tasks
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed font-sans">
                {insights.homeworkSuggestions}
              </p>
            </div>
          </div>

          {/* Right Column: Style, Attendance & Conference */}
          <div className="flex flex-col gap-5">
            <div className="bg-purple-50/10 border border-purple-100 p-5 rounded-2xl flex flex-col gap-2.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-purple-800 font-display">Learning Style</span>
                <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full text-[9px] font-bold">
                  {insights.learningStyle?.split(" ")[0] || "Sensory"}
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                {insights.learningStyle}
              </p>
            </div>

            <div className="bg-sky-50/20 border border-sky-100 p-5 rounded-2xl flex flex-col gap-2.5">
              <h5 className="font-bold text-sky-800 text-xs uppercase tracking-wider font-display">
                Attendance Prediction
              </h5>
              <p className="text-xs text-slate-600 leading-relaxed">
                {insights.attendancePrediction}
              </p>
            </div>
          </div>

          {/* Conference Guidance & Personalised Plan */}
          <div className="md:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-slate-100 pt-6">
            <div className="flex flex-col gap-2">
              <h4 className="font-bold text-slate-800 text-sm font-display flex items-center gap-1.5">
                <FileSpreadsheet className="w-4 h-4 text-purple-600" />
                Parent-Teacher Conference Talking Points
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-100">
                {insights.parentMeetingSuggestions}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              <h4 className="font-bold text-slate-800 text-sm font-display flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Personalized Preschool Curriculum Accommodations
              </h4>
              <p className="text-xs text-slate-600 leading-relaxed bg-amber-50/20 p-4 rounded-xl border border-amber-100/60">
                {insights.personalizedLearningPlan}
              </p>
            </div>
          </div>

          {/* Footer date */}
          <div className="md:col-span-3 text-right text-[10px] text-slate-400 font-mono">
            Last Analysed: {insights.lastGenerated ? new Date(insights.lastGenerated).toLocaleString() : "Never"}
          </div>
        </div>
      )}

      {/* Empty State */}
      {!insights && !loading && (
        <div className="py-12 border-2 border-dashed border-slate-100 rounded-3xl flex flex-col items-center justify-center text-center gap-3">
          <Brain className="w-12 h-12 text-slate-300" />
          <div>
            <h4 className="font-bold text-slate-700 text-sm font-display">No AI insights generated yet</h4>
            <p className="text-xs text-slate-400 max-w-sm mt-1">
              Click the generate button above to activate AI child development diagnostics.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
