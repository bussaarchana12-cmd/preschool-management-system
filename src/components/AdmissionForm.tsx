import React, { useState } from "react";
import { Class } from "../types";
import { Camera, Save, User, ShieldAlert, Heart, Truck, X } from "lucide-react";

interface AdmissionFormProps {
  classes: Class[];
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AdmissionForm({ classes, onSuccess, onCancel }: AdmissionFormProps) {
  const [photo, setPhoto] = useState<string>("");
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState<"Male" | "Female" | "Other">("Male");
  const [classId, setClassId] = useState(classes[0]?.id || "");
  const [transportRequired, setTransportRequired] = useState(false);
  const [previousSchool, setPreviousSchool] = useState("");

  // Parents
  const [fatherName, setFatherName] = useState("");
  const [fatherPhone, setFatherPhone] = useState("");
  const [fatherEmail, setFatherEmail] = useState("");
  const [fatherOccupation, setFatherOccupation] = useState("");
  const [motherName, setMotherName] = useState("");
  const [motherPhone, setMotherPhone] = useState("");
  const [motherEmail, setMotherEmail] = useState("");
  const [motherOccupation, setMotherOccupation] = useState("");
  const [address, setAddress] = useState("");

  // Medical
  const [bloodGroup, setBloodGroup] = useState("O+");
  const [allergies, setAllergies] = useState("");
  const [medicalConditions, setMedicalConditions] = useState("");
  const [pediatricianName, setPediatricianName] = useState("");
  const [pediatricianPhone, setPediatricianPhone] = useState("");

  // Emergency Contact
  const [emergencyName, setEmergencyName] = useState("");
  const [emergencyRelation, setEmergencyRelation] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");

  // Pickup Authorized Persons (max 2)
  const [pickup1Name, setPickup1Name] = useState("");
  const [pickup1Relation, setPickup1Relation] = useState("");
  const [pickup1Phone, setPickup1Phone] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Simple file to base64 converter for student photo
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("Student Name is required");
      return;
    }
    if (!dob) {
      setError("Date of Birth is required");
      return;
    }

    setLoading(true);
    setError(null);

    const payload = {
      name,
      dob,
      gender,
      classId,
      profilePhoto: photo || undefined,
      transportRequired,
      previousSchool,
      parentDetails: {
        fatherName, fatherPhone, fatherEmail, fatherOccupation,
        motherName, motherPhone, motherEmail, motherOccupation, address
      },
      medicalRecord: {
        bloodGroup,
        allergies: allergies ? allergies.split(",").map(a => a.trim()) : [],
        medicalConditions: medicalConditions ? medicalConditions.split(",").map(m => m.trim()) : [],
        vaccinations: [
          { name: "BCG", status: "Completed" },
          { name: "MMR", status: "Completed" },
          { name: "Polio Booster", status: "Pending" }
        ],
        pediatricianName,
        pediatricianPhone
      },
      emergencyContact: {
        name: emergencyName,
        relation: emergencyRelation,
        phone: emergencyPhone
      },
      pickupPersons: pickup1Name ? [{ name: pickup1Name, relation: pickup1Relation, phone: pickup1Phone }] : []
    };

    try {
      const response = await fetch("/api/admissions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to file admission application");
      }

      onSuccess();
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex justify-between items-center bg-slate-50 border-b border-slate-100 p-6">
        <div>
          <h3 className="font-bold text-slate-900 text-lg font-display">New Student ERP Admission</h3>
          <p className="text-xs text-slate-500">Compiles child registration parameters, medical records, and clearances.</p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          className="p-1.5 hover:bg-slate-200 rounded-full transition-colors cursor-pointer text-slate-400"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="p-6 md:p-8 flex flex-col gap-8 max-h-[70vh] overflow-y-auto">
        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-800 p-4 rounded-xl text-xs font-semibold">
            {error}
          </div>
        )}

        {/* Section 1: Child Details */}
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider font-display border-b border-slate-100 pb-2 flex items-center gap-2">
            <User className="w-4 h-4 text-indigo-600" />
            1. Child Personal Information
          </h4>

          <div className="flex flex-col md:flex-row gap-6 items-start">
            {/* Base64 upload photo */}
            <div className="relative group shrink-0">
              <label className="cursor-pointer flex flex-col items-center justify-center w-28 h-32 border-2 border-dashed border-slate-200 hover:border-indigo-500 rounded-2xl bg-slate-50 overflow-hidden shadow-sm transition-all text-slate-400 hover:text-indigo-600">
                {photo ? (
                  <img src={photo} alt="Preview" className="w-full h-full object-cover" />
                ) : (
                  <>
                    <Camera className="w-6 h-6 mb-1 text-slate-400 group-hover:animate-bounce" />
                    <span className="text-[10px] font-bold uppercase tracking-wider text-center px-2">Photo Upload</span>
                  </>
                )}
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
              {photo && (
                <button
                  type="button"
                  onClick={() => setPhoto("")}
                  className="absolute -top-1.5 -right-1.5 bg-rose-500 hover:bg-rose-600 text-white p-1 rounded-full shadow-sm cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
              <div>
                <label className="text-xs text-slate-500 font-semibold block mb-1">Full Student Name *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Aarav Malhotra"
                  className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white text-xs px-3 py-2.5 rounded-xl outline-none transition-all text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 font-semibold block mb-1">Date of Birth *</label>
                <input
                  type="date"
                  required
                  value={dob}
                  onChange={(e) => setDob(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white text-xs px-3 py-2.5 rounded-xl outline-none transition-all text-slate-800"
                />
              </div>

              <div>
                <label className="text-xs text-slate-500 font-semibold block mb-1">Gender *</label>
                <select
                  value={gender}
                  onChange={(e) => setGender(e.target.value as any)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white text-xs px-3 py-2.5 rounded-xl outline-none transition-all text-slate-800"
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="text-xs text-slate-500 font-semibold block mb-1">Class Group Selection *</label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white text-xs px-3 py-2.5 rounded-xl outline-none transition-all text-slate-800"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-500 font-semibold block mb-1">Previous Preschool Attended</label>
              <input
                type="text"
                value={previousSchool}
                onChange={(e) => setPreviousSchool(e.target.value)}
                placeholder="e.g. None / Daycare name"
                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white text-xs px-3 py-2.5 rounded-xl outline-none transition-all text-slate-800"
              />
            </div>

            <div className="flex items-center gap-2 h-full pt-5">
              <input
                type="checkbox"
                id="transport"
                checked={transportRequired}
                onChange={(e) => setTransportRequired(e.target.checked)}
                className="w-4 h-4 rounded text-indigo-600 border-slate-300 focus:ring-indigo-500"
              />
              <label htmlFor="transport" className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 cursor-pointer">
                <Truck className="w-4 h-4 text-slate-400" />
                School Transport Bus Facility Required
              </label>
            </div>
          </div>
        </div>

        {/* Section 2: Parent Details */}
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider font-display border-b border-slate-100 pb-2 flex items-center gap-2">
            <Heart className="w-4 h-4 text-rose-500" />
            2. Family & Parent Particulars
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-slate-500 font-semibold block mb-1">Father's Full Name</label>
              <input
                type="text"
                value={fatherName}
                onChange={(e) => setFatherName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white text-xs px-3 py-2.5 rounded-xl outline-none transition-all text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 font-semibold block mb-1">Father's Contact Phone</label>
              <input
                type="text"
                value={fatherPhone}
                onChange={(e) => setFatherPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white text-xs px-3 py-2.5 rounded-xl outline-none transition-all text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 font-semibold block mb-1">Father's Email Address</label>
              <input
                type="email"
                value={fatherEmail}
                onChange={(e) => setFatherEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white text-xs px-3 py-2.5 rounded-xl outline-none transition-all text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 font-semibold block mb-1">Father's Occupation</label>
              <input
                type="text"
                value={fatherOccupation}
                onChange={(e) => setFatherOccupation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white text-xs px-3 py-2.5 rounded-xl outline-none transition-all text-slate-800"
              />
            </div>

            <div className="col-span-1 sm:col-span-2 border-t border-dashed border-slate-100 my-2"></div>

            <div>
              <label className="text-xs text-slate-500 font-semibold block mb-1">Mother's Full Name</label>
              <input
                type="text"
                value={motherName}
                onChange={(e) => setMotherName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white text-xs px-3 py-2.5 rounded-xl outline-none transition-all text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 font-semibold block mb-1">Mother's Contact Phone</label>
              <input
                type="text"
                value={motherPhone}
                onChange={(e) => setMotherPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white text-xs px-3 py-2.5 rounded-xl outline-none transition-all text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 font-semibold block mb-1">Mother's Email Address</label>
              <input
                type="email"
                value={motherEmail}
                onChange={(e) => setMotherEmail(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white text-xs px-3 py-2.5 rounded-xl outline-none transition-all text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 font-semibold block mb-1">Mother's Occupation</label>
              <input
                type="text"
                value={motherOccupation}
                onChange={(e) => setMotherOccupation(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white text-xs px-3 py-2.5 rounded-xl outline-none transition-all text-slate-800"
              />
            </div>

            <div className="col-span-1 sm:col-span-2">
              <label className="text-xs text-slate-500 font-semibold block mb-1">Residential Address</label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows={2}
                placeholder="Complete street address, sector, landmark, city"
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white text-xs px-3 py-2.5 rounded-xl outline-none transition-all text-slate-800 resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        {/* Section 3: Medical Info */}
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider font-display border-b border-slate-100 pb-2 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-emerald-500" />
            3. Pediatric & Medical Records
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-500 font-semibold block mb-1">Blood Group</label>
              <select
                value={bloodGroup}
                onChange={(e) => setBloodGroup(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white text-xs px-3 py-2.5 rounded-xl outline-none transition-all text-slate-800"
              >
                <option value="A+">A+</option>
                <option value="A-">A-</option>
                <option value="B+">B+</option>
                <option value="B-">B-</option>
                <option value="O+">O+</option>
                <option value="O-">O-</option>
                <option value="AB+">AB+</option>
                <option value="AB-">AB-</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-500 font-semibold block mb-1">Allergies (comma separated)</label>
              <input
                type="text"
                value={allergies}
                onChange={(e) => setAllergies(e.target.value)}
                placeholder="e.g. Peanuts, Gluten"
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white text-xs px-3 py-2.5 rounded-xl outline-none transition-all text-slate-800"
              />
            </div>

            <div>
              <label className="text-xs text-slate-500 font-semibold block mb-1">Medical Conditions</label>
              <input
                type="text"
                value={medicalConditions}
                onChange={(e) => setMedicalConditions(e.target.value)}
                placeholder="e.g. Asthma, Eczema"
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white text-xs px-3 py-2.5 rounded-xl outline-none transition-all text-slate-800"
              />
            </div>

            <div>
              <label className="text-xs text-slate-500 font-semibold block mb-1">Family Pediatrician</label>
              <input
                type="text"
                value={pediatricianName}
                onChange={(e) => setPediatricianName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white text-xs px-3 py-2.5 rounded-xl outline-none transition-all text-slate-800"
              />
            </div>

            <div>
              <label className="text-xs text-slate-500 font-semibold block mb-1">Pediatrician Emergency Phone</label>
              <input
                type="text"
                value={pediatricianPhone}
                onChange={(e) => setPediatricianPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white text-xs px-3 py-2.5 rounded-xl outline-none transition-all text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Emergency Contacts & Clearances */}
        <div className="flex flex-col gap-4">
          <h4 className="font-bold text-slate-800 text-sm uppercase tracking-wider font-display border-b border-slate-100 pb-2 flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-rose-500" />
            4. Emergency Details & Pickup Clearances
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs text-slate-500 font-semibold block mb-1">Emergency Contact Name</label>
              <input
                type="text"
                value={emergencyName}
                onChange={(e) => setEmergencyName(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white text-xs px-3 py-2.5 rounded-xl outline-none transition-all text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 font-semibold block mb-1">Relation to Child</label>
              <input
                type="text"
                value={emergencyRelation}
                onChange={(e) => setEmergencyRelation(e.target.value)}
                placeholder="e.g. Uncle, Grandmother"
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white text-xs px-3 py-2.5 rounded-xl outline-none transition-all text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 font-semibold block mb-1">Emergency Phone Number</label>
              <input
                type="text"
                value={emergencyPhone}
                onChange={(e) => setEmergencyPhone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white text-xs px-3 py-2.5 rounded-xl outline-none transition-all text-slate-800"
              />
            </div>

            <div className="col-span-1 sm:col-span-3 border-t border-dashed border-slate-100 my-1"></div>

            <div>
              <label className="text-xs text-slate-500 font-semibold block mb-1">Authorized Pickup Person</label>
              <input
                type="text"
                value={pickup1Name}
                onChange={(e) => setPickup1Name(e.target.value)}
                placeholder="e.g. Grandma Kanti"
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white text-xs px-3 py-2.5 rounded-xl outline-none transition-all text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 font-semibold block mb-1">Relation to Child</label>
              <input
                type="text"
                value={pickup1Relation}
                onChange={(e) => setPickup1Relation(e.target.value)}
                placeholder="e.g. Grandmother"
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white text-xs px-3 py-2.5 rounded-xl outline-none transition-all text-slate-800"
              />
            </div>
            <div>
              <label className="text-xs text-slate-500 font-semibold block mb-1">Authorized Pickup Phone</label>
              <input
                type="text"
                value={pickup1Phone}
                onChange={(e) => setPickup1Phone(e.target.value)}
                className="w-full bg-slate-50 border border-slate-200 focus:border-amber-400 focus:bg-white text-xs px-3 py-2.5 rounded-xl outline-none transition-all text-slate-800"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Action Footer */}
      <div className="bg-slate-50 border-t border-slate-100 p-6 flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-slate-200 hover:bg-slate-100 text-slate-600 rounded-xl text-xs font-semibold cursor-pointer transition-all"
        >
          Cancel Application
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow-sm cursor-pointer transition-all"
        >
          <Save className="w-4 h-4" />
          {loading ? "Submitting Registration..." : "File Admission Application"}
        </button>
      </div>
    </form>
  );
}
