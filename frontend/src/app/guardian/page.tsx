"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import { Copy, Check, Trash2, AlertTriangle, KeyRound } from "lucide-react";

type Student = {
  id: number;
  name: string;
  username: string;
  student_class: number;
};

export default function GuardianDashboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create/Reset Student Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [newName, setNewName] = useState("");
  const [newClass, setNewClass] = useState("6");
  const [createdStudent, setCreatedStudent] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Confirm Modal State
  const [confirmModal, setConfirmModal] = useState<{type: 'delete' | 'reset', student: Student} | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const data = await fetchAPI("/guardian/students");
      setStudents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = await fetchAPI("/guardian/students", {
        method: "POST",
        body: JSON.stringify({ name: newName, student_class: parseInt(newClass) })
      });
      setCreatedStudent({ ...data, isReset: false });
      loadStudents();
    } catch (err) {
      alert("Failed to create student");
    }
  };

  const executeConfirmAction = async () => {
    if (!confirmModal) return;
    setIsProcessing(true);
    const studentId = confirmModal.student.id;
    
    try {
      if (confirmModal.type === 'delete') {
        await fetchAPI(`/guardian/students/${studentId}`, { method: "DELETE" });
        loadStudents();
        setConfirmModal(null);
      } else if (confirmModal.type === 'reset') {
        const data = await fetchAPI(`/guardian/students/${studentId}/reset-password`, { method: "POST" });
        setCreatedStudent({ username: confirmModal.student.username, temp_password: data.temp_password, isReset: true });
        setConfirmModal(null);
        setShowAddModal(true); // Reuse the modal for showing new password
      }
    } catch (err) {
      alert("Action failed");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (createdStudent) {
      navigator.clipboard.writeText(`Username: ${createdStudent.username}\nPassword: ${createdStudent.temp_password}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Your Students</h1>
          <p className="text-muted-foreground mt-1">Manage and track your children's progress.</p>
        </div>
        <button 
          onClick={() => { setCreatedStudent(null); setShowAddModal(true); }}
          className="btn-premium btn-premium-emerald px-5 py-2.5 rounded-xl font-medium"
        >
          + Add Student
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">Loading...</div>
      ) : students.length === 0 ? (
        <div className="text-center p-12 glass rounded-3xl border border-border shadow-sm">
          <p className="text-muted-foreground">You haven't added any students yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {students.map((student) => (
            <div key={student.id} className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold">{student.name}</h3>
                  <span className="inline-block px-2.5 py-1 bg-primary/10 text-primary text-xs font-semibold rounded-md mt-2">
                    Class {student.student_class}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 mt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Username:</span>
                  <span className="font-mono font-medium">{student.username}</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
                <button 
                  onClick={() => setConfirmModal({ type: 'delete', student })}
                  className="text-sm font-medium flex items-center gap-1.5 text-destructive hover:opacity-80 transition-opacity"
                >
                  <Trash2 size={16} /> Delete
                </button>
                <button 
                  onClick={() => setConfirmModal({ type: 'reset', student })}
                  className="text-sm font-medium flex items-center gap-1.5 text-amber-500 hover:opacity-80 transition-opacity"
                >
                  <KeyRound size={16} /> Reset Password
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Show Credentials Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card text-card-foreground rounded-3xl p-8 max-w-md w-full shadow-2xl border border-border animate-fade-in-up">
            {!createdStudent ? (
              <>
                <h2 className="text-2xl font-bold mb-6">Add New Student</h2>
                <form onSubmit={handleAddStudent} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Full Name</label>
                    <input
                      type="text"
                      required
                      value={newName}
                      onChange={(e) => setNewName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border outline-none focus:border-primary bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Class</label>
                    <select
                      value={newClass}
                      onChange={(e) => setNewClass(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-border outline-none focus:border-primary bg-background"
                    >
                      <option value="6">Class 6</option>
                      <option value="7">Class 7</option>
                      <option value="8">Class 8</option>
                      <option value="9">Class 9</option>
                      <option value="10">Class 10</option>
                    </select>
                  </div>
                  <div className="flex gap-3 mt-8">
                    <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 px-4 py-2.5 rounded-xl border border-border font-medium hover:bg-muted transition-colors">Cancel</button>
                    <button type="submit" className="flex-1 px-4 py-2.5 rounded-xl btn-premium btn-premium-emerald font-medium">Create</button>
                  </div>
                </form>
              </>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4 ring-8 ring-emerald-500/10">
                  <Check className="w-8 h-8" strokeWidth={3} />
                </div>
                <h2 className="text-2xl font-bold">{createdStudent.isReset ? "Password Reset!" : "Student Created!"}</h2>
                <p className="text-sm text-muted-foreground">Please save these credentials securely. The student will use them to log in.</p>
                
                <div className="bg-muted p-5 rounded-2xl border border-border mt-6 text-left space-y-4 relative group">
                  <button 
                    onClick={handleCopy}
                    className="absolute top-4 right-4 p-2 bg-background rounded-lg border border-border shadow-sm hover:scale-105 transition-transform text-muted-foreground hover:text-foreground"
                    title="Copy Credentials"
                  >
                    {copied ? <Check size={16} className="text-emerald-500" /> : <Copy size={16} />}
                  </button>
                  
                  <div>
                    <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Username</span> 
                    <div className="font-mono font-bold text-lg mt-1">{createdStudent.username}</div>
                  </div>
                  <div>
                    <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Password</span> 
                    <div className="font-mono font-bold text-lg mt-1 text-primary">{createdStudent.temp_password}</div>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    setShowAddModal(false);
                    setCreatedStudent(null);
                    setNewName("");
                  }}
                  className="w-full mt-6 px-4 py-3 rounded-xl btn-premium btn-premium-emerald font-medium text-lg"
                >
                  Done
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Confirm Modal */}
      {confirmModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card text-card-foreground rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-border animate-fade-in-up">
            <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 ring-8 ${confirmModal.type === 'delete' ? 'bg-destructive/20 text-destructive ring-destructive/10' : 'bg-amber-500/20 text-amber-500 ring-amber-500/10'}`}>
              {confirmModal.type === 'delete' ? <Trash2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
            </div>
            
            <h2 className="text-xl font-bold mb-2">
              {confirmModal.type === 'delete' ? "Delete Student?" : "Reset Password?"}
            </h2>
            <p className="text-sm text-muted-foreground mb-8">
              {confirmModal.type === 'delete' 
                ? `Are you sure you want to delete ${confirmModal.student.name}? All their progress will be permanently lost.`
                : `Are you sure you want to generate a new temporary password for ${confirmModal.student.name}?`}
            </p>
            
            <div className="flex gap-3">
              <button 
                disabled={isProcessing}
                onClick={() => setConfirmModal(null)} 
                className="flex-1 px-4 py-2.5 rounded-xl border border-border font-medium hover:bg-muted transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                disabled={isProcessing}
                onClick={executeConfirmAction} 
                className={`flex-1 px-4 py-2.5 rounded-xl font-medium text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50 disabled:transform-none ${
                  confirmModal.type === 'delete' ? 'bg-gradient-to-r from-red-500 to-destructive shadow-red-500/25' : 'bg-gradient-to-r from-amber-400 to-amber-500 shadow-amber-500/25'
                }`}
              >
                {isProcessing ? "Processing..." : confirmModal.type === 'delete' ? "Delete" : "Reset"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
