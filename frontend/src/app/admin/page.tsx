"use client";

import { useState } from "react";
import { fetchAPI } from "@/lib/api";
import { Trash2, Edit2, Search, AlertTriangle } from "lucide-react";

export default function AdminDashboard() {
  const [subjectName, setSubjectName] = useState("");
  const [subjectClass, setSubjectClass] = useState("6");
  
  const [chapterSubId, setChapterSubId] = useState("");
  const [chapterName, setChapterName] = useState("");
  const [chapterOrder, setChapterOrder] = useState("1");
  
  const [qChapId, setQChapId] = useState("");
  const [qText, setQText] = useState("");
  const [optA, setOptA] = useState("");
  const [optB, setOptB] = useState("");
  const [optC, setOptC] = useState("");
  const [optD, setOptD] = useState("");
  const [correct, setCorrect] = useState("A");
  const [difficulty, setDifficulty] = useState("easy");

  // Manage Questions State
  const [fetchChapterId, setFetchChapterId] = useState("");
  const [questions, setQuestions] = useState<any[]>([]);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [editModal, setEditModal] = useState<any>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<any>(null);

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchAPI("/admin/subjects", {
        method: "POST",
        body: JSON.stringify({ name: subjectName, subject_class: parseInt(subjectClass) })
      });
      alert("Subject created!");
      setSubjectName("");
    } catch (err) { alert("Failed to add subject"); }
  };

  const handleAddChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchAPI("/admin/chapters", {
        method: "POST",
        body: JSON.stringify({ 
          subject_id: parseInt(chapterSubId),
          name: chapterName, 
          order_index: parseInt(chapterOrder) 
        })
      });
      alert("Chapter created!");
      setChapterName("");
    } catch (err) { alert("Failed to add chapter"); }
  };

  const handleAddQuestion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchAPI("/admin/questions", {
        method: "POST",
        body: JSON.stringify({ 
          chapter_id: parseInt(qChapId),
          question_text: qText,
          option_a: optA,
          option_b: optB,
          option_c: optC,
          option_d: optD,
          correct_option: correct,
          difficulty: difficulty
        })
      });
      alert("Question created!");
      setQText(""); setOptA(""); setOptB(""); setOptC(""); setOptD("");
    } catch (err) { alert("Failed to add question"); }
  };

  // Manage Questions Handlers
  const handleFetchQuestions = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!fetchChapterId) return;
    setLoadingQuestions(true);
    try {
      const data = await fetchAPI(`/admin/chapters/${fetchChapterId}/questions`);
      setQuestions(data);
    } catch (err) {
      alert("Failed to fetch questions");
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetchAPI(`/admin/questions/${editModal.id}`, {
        method: "PUT",
        body: JSON.stringify({
          question_text: editModal.question_text,
          option_a: editModal.option_a,
          option_b: editModal.option_b,
          option_c: editModal.option_c,
          option_d: editModal.option_d,
          correct_option: editModal.correct_option,
          difficulty: editModal.difficulty
        })
      });
      setEditModal(null);
      handleFetchQuestions();
    } catch (err) { alert("Failed to update question"); }
  };

  const executeDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await fetchAPI(`/admin/questions/${deleteConfirm.id}`, { method: "DELETE" });
      setDeleteConfirm(null);
      handleFetchQuestions();
    } catch (err) { alert("Failed to delete question"); }
  };

  return (
    <div className="space-y-8 relative">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight dark:text-slate-100">Content Management</h1>
        <p className="text-slate-500 mt-1 dark:text-slate-400">Add and manage curriculum data.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ADD SUBJECT */}
        <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded bg-emerald-500/20 text-emerald-500 flex items-center justify-center">1</span> 
            Add Subject
          </h2>
          <form onSubmit={handleAddSubject} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Subject Name</label>
              <input type="text" required value={subjectName} onChange={e=>setSubjectName(e.target.value)} className="w-full p-2 border border-border bg-background rounded-xl focus:border-primary outline-none" placeholder="e.g. Mathematics" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Class (6-10)</label>
              <select value={subjectClass} onChange={e=>setSubjectClass(e.target.value)} className="w-full p-2 border border-border bg-background rounded-xl focus:border-primary outline-none">
                <option value="6">Class 6</option>
                <option value="7">Class 7</option>
                <option value="8">Class 8</option>
                <option value="9">Class 9</option>
                <option value="10">Class 10</option>
              </select>
            </div>
            <button type="submit" className="w-full py-2 btn-premium btn-premium-emerald rounded-xl font-medium">Create Subject</button>
          </form>
        </div>

        {/* ADD CHAPTER */}
        <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded bg-emerald-500/20 text-emerald-500 flex items-center justify-center">2</span> 
            Add Chapter
          </h2>
          <form onSubmit={handleAddChapter} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Subject ID</label>
              <input type="number" required value={chapterSubId} onChange={e=>setChapterSubId(e.target.value)} className="w-full p-2 border border-border bg-background rounded-xl focus:border-primary outline-none" placeholder="1" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Chapter Name</label>
              <input type="text" required value={chapterName} onChange={e=>setChapterName(e.target.value)} className="w-full p-2 border border-border bg-background rounded-xl focus:border-primary outline-none" placeholder="Algebra Basics" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Order / Chapter Number</label>
              <input type="number" required value={chapterOrder} onChange={e=>setChapterOrder(e.target.value)} className="w-full p-2 border border-border bg-background rounded-xl focus:border-primary outline-none" placeholder="1" />
            </div>
            <button type="submit" className="w-full py-2 btn-premium btn-premium-emerald rounded-xl font-medium">Create Chapter</button>
          </form>
        </div>

        {/* ADD QUESTION */}
        <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border lg:col-span-2">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded bg-emerald-500/20 text-emerald-500 flex items-center justify-center">3</span> 
            Add MCQ Question
          </h2>
          <form onSubmit={handleAddQuestion} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Chapter ID</label>
              <input type="number" required value={qChapId} onChange={e=>setQChapId(e.target.value)} className="w-full p-2 border border-border bg-background rounded-xl max-w-[200px] focus:border-primary outline-none" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Question Text</label>
              <textarea required value={qText} onChange={e=>setQText(e.target.value)} className="w-full p-2 border border-border bg-background rounded-xl focus:border-primary outline-none" rows={3}></textarea>
            </div>
            
            <div><label className="block text-sm font-medium mb-1">Option A</label><input type="text" required value={optA} onChange={e=>setOptA(e.target.value)} className="w-full p-2 border border-border bg-background rounded-xl focus:border-primary outline-none" /></div>
            <div><label className="block text-sm font-medium mb-1">Option B</label><input type="text" required value={optB} onChange={e=>setOptB(e.target.value)} className="w-full p-2 border border-border bg-background rounded-xl focus:border-primary outline-none" /></div>
            <div><label className="block text-sm font-medium mb-1">Option C</label><input type="text" required value={optC} onChange={e=>setOptC(e.target.value)} className="w-full p-2 border border-border bg-background rounded-xl focus:border-primary outline-none" /></div>
            <div><label className="block text-sm font-medium mb-1">Option D</label><input type="text" required value={optD} onChange={e=>setOptD(e.target.value)} className="w-full p-2 border border-border bg-background rounded-xl focus:border-primary outline-none" /></div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Correct Option</label>
              <select value={correct} onChange={e=>setCorrect(e.target.value)} className="w-full p-2 border border-border bg-background rounded-xl focus:border-primary outline-none">
                <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Difficulty</label>
              <select value={difficulty} onChange={e=>setDifficulty(e.target.value)} className="w-full p-2 border border-border bg-background rounded-xl focus:border-primary outline-none">
                <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
              </select>
            </div>

            <div className="md:col-span-2 mt-4">
              <button type="submit" className="w-full py-3 btn-premium btn-premium-emerald rounded-xl font-medium">Add Question to Bank</button>
            </div>
          </form>
        </div>

        {/* MANAGE QUESTIONS */}
        <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border lg:col-span-2">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded bg-emerald-500/20 text-emerald-500 flex items-center justify-center">4</span> 
            Manage Questions
          </h2>
          <form onSubmit={handleFetchQuestions} className="flex gap-4 mb-6">
            <input type="number" required value={fetchChapterId} onChange={e=>setFetchChapterId(e.target.value)} className="w-full max-w-[200px] p-2 border border-border bg-background rounded-xl focus:border-primary outline-none" placeholder="Chapter ID" />
            <button type="submit" className="px-6 py-2 btn-premium btn-premium-emerald rounded-xl font-medium flex items-center gap-2">
              <Search size={18} /> Fetch
            </button>
          </form>

          {loadingQuestions ? (
            <div className="p-4 text-slate-500">Loading...</div>
          ) : questions.length > 0 ? (
            <div className="overflow-x-auto rounded-xl border border-border">
              <table className="w-full text-left border-collapse bg-background">
                <thead className="bg-muted">
                  <tr className="border-b border-border">
                    <th className="p-3 font-semibold text-sm">ID</th>
                    <th className="p-3 font-semibold text-sm w-1/2">Question Text</th>
                    <th className="p-3 font-semibold text-sm">Difficulty</th>
                    <th className="p-3 font-semibold text-sm text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.map((q) => (
                    <tr key={q.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                      <td className="p-3 font-mono text-sm">{q.id}</td>
                      <td className="p-3 max-w-[200px] truncate" title={q.question_text}>{q.question_text}</td>
                      <td className="p-3 capitalize">
                        <span className={`px-2 py-1 text-xs rounded-md ${q.difficulty === 'easy' ? 'bg-green-500/10 text-green-600' : q.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-600' : 'bg-red-500/10 text-red-600'}`}>{q.difficulty}</span>
                      </td>
                      <td className="p-3 text-right flex justify-end gap-3">
                        <button onClick={() => setEditModal(q)} className="text-blue-500 hover:text-blue-600 hover:bg-blue-500/10 p-2 rounded-lg transition-colors" title="Edit Question"><Edit2 size={16} /></button>
                        <button onClick={() => setDeleteConfirm(q)} className="text-red-500 hover:text-red-600 hover:bg-red-500/10 p-2 rounded-lg transition-colors" title="Delete Question"><Trash2 size={16} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : fetchChapterId ? (
             <div className="p-6 text-muted-foreground border border-dashed border-border rounded-xl bg-background/50 text-center">No questions found.</div>
          ) : null}
        </div>
      </div>

      {/* EDIT MODAL */}
      {editModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card text-card-foreground rounded-3xl p-8 max-w-2xl w-full shadow-2xl border border-border animate-fade-in-up max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2"><Edit2 size={20} className="text-blue-500" /> Edit Question (ID: {editModal.id})</h2>
            <form onSubmit={handleEditSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1">Question Text</label>
                <textarea required value={editModal.question_text} onChange={e=>setEditModal({...editModal, question_text: e.target.value})} className="w-full p-2 border border-border bg-background rounded-xl focus:border-primary outline-none" rows={3}></textarea>
              </div>
              
              <div><label className="block text-sm font-medium mb-1">Option A</label><input type="text" required value={editModal.option_a} onChange={e=>setEditModal({...editModal, option_a: e.target.value})} className="w-full p-2 border border-border bg-background rounded-xl focus:border-primary outline-none" /></div>
              <div><label className="block text-sm font-medium mb-1">Option B</label><input type="text" required value={editModal.option_b} onChange={e=>setEditModal({...editModal, option_b: e.target.value})} className="w-full p-2 border border-border bg-background rounded-xl focus:border-primary outline-none" /></div>
              <div><label className="block text-sm font-medium mb-1">Option C</label><input type="text" required value={editModal.option_c} onChange={e=>setEditModal({...editModal, option_c: e.target.value})} className="w-full p-2 border border-border bg-background rounded-xl focus:border-primary outline-none" /></div>
              <div><label className="block text-sm font-medium mb-1">Option D</label><input type="text" required value={editModal.option_d} onChange={e=>setEditModal({...editModal, option_d: e.target.value})} className="w-full p-2 border border-border bg-background rounded-xl focus:border-primary outline-none" /></div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Correct Option</label>
                <select value={editModal.correct_option} onChange={e=>setEditModal({...editModal, correct_option: e.target.value})} className="w-full p-2 border border-border bg-background rounded-xl focus:border-primary outline-none">
                  <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-1">Difficulty</label>
                <select value={editModal.difficulty} onChange={e=>setEditModal({...editModal, difficulty: e.target.value})} className="w-full p-2 border border-border bg-background rounded-xl focus:border-primary outline-none">
                  <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
                </select>
              </div>

              <div className="md:col-span-2 flex gap-3 mt-6 pt-4 border-t border-border">
                <button type="button" onClick={() => setEditModal(null)} className="flex-1 py-2.5 border border-border rounded-xl font-medium hover:bg-muted transition-colors">Cancel</button>
                <button type="submit" className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/25">Save Changes</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM MODAL */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-card text-card-foreground rounded-3xl p-8 max-w-sm w-full shadow-2xl border border-border animate-fade-in-up">
            <div className="w-14 h-14 rounded-full flex items-center justify-center mb-6 ring-8 bg-destructive/20 text-destructive ring-destructive/10">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold mb-2">Delete Question?</h2>
            <p className="text-sm text-muted-foreground mb-8">
              Are you sure you want to delete question #{deleteConfirm.id}? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 rounded-xl border border-border font-medium hover:bg-muted transition-colors">Cancel</button>
              <button onClick={executeDelete} className="flex-1 px-4 py-2.5 rounded-xl font-medium text-white transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 bg-gradient-to-r from-red-500 to-destructive shadow-red-500/25">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
