"use client";

import { useState } from "react";
import { fetchAPI } from "@/lib/api";

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

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Content Management</h1>
        <p className="text-slate-500 mt-1">Add and manage curriculum data.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* ADD SUBJECT */}
        <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center">1</span> 
            Add Subject
          </h2>
          <form onSubmit={handleAddSubject} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Subject Name</label>
              <input type="text" required value={subjectName} onChange={e=>setSubjectName(e.target.value)} className="w-full p-2 border rounded-xl" placeholder="e.g. Mathematics" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Class (6-10)</label>
              <select value={subjectClass} onChange={e=>setSubjectClass(e.target.value)} className="w-full p-2 border rounded-xl bg-background">
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
            <span className="w-8 h-8 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center">2</span> 
            Add Chapter
          </h2>
          <form onSubmit={handleAddChapter} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Subject ID</label>
              <input type="number" required value={chapterSubId} onChange={e=>setChapterSubId(e.target.value)} className="w-full p-2 border rounded-xl" placeholder="1" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Chapter Name</label>
              <input type="text" required value={chapterName} onChange={e=>setChapterName(e.target.value)} className="w-full p-2 border rounded-xl" placeholder="Algebra Basics" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Order / Chapter Number</label>
              <input type="number" required value={chapterOrder} onChange={e=>setChapterOrder(e.target.value)} className="w-full p-2 border rounded-xl" placeholder="1" />
            </div>
            <button type="submit" className="w-full py-2 btn-premium btn-premium-emerald rounded-xl font-medium">Create Chapter</button>
          </form>
        </div>

        {/* ADD QUESTION */}
        <div className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border lg:col-span-2">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span className="w-8 h-8 rounded bg-emerald-100 text-emerald-600 flex items-center justify-center">3</span> 
            Add MCQ Question
          </h2>
          <form onSubmit={handleAddQuestion} className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Chapter ID</label>
              <input type="number" required value={qChapId} onChange={e=>setQChapId(e.target.value)} className="w-full p-2 border rounded-xl max-w-[200px]" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Question Text</label>
              <textarea required value={qText} onChange={e=>setQText(e.target.value)} className="w-full p-2 border rounded-xl" rows={3}></textarea>
            </div>
            
            <div><label className="block text-sm font-medium mb-1">Option A</label><input type="text" required value={optA} onChange={e=>setOptA(e.target.value)} className="w-full p-2 border rounded-xl" /></div>
            <div><label className="block text-sm font-medium mb-1">Option B</label><input type="text" required value={optB} onChange={e=>setOptB(e.target.value)} className="w-full p-2 border rounded-xl" /></div>
            <div><label className="block text-sm font-medium mb-1">Option C</label><input type="text" required value={optC} onChange={e=>setOptC(e.target.value)} className="w-full p-2 border rounded-xl" /></div>
            <div><label className="block text-sm font-medium mb-1">Option D</label><input type="text" required value={optD} onChange={e=>setOptD(e.target.value)} className="w-full p-2 border rounded-xl" /></div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Correct Option</label>
              <select value={correct} onChange={e=>setCorrect(e.target.value)} className="w-full p-2 border rounded-xl bg-background">
                <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Difficulty</label>
              <select value={difficulty} onChange={e=>setDifficulty(e.target.value)} className="w-full p-2 border rounded-xl bg-background">
                <option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Hard</option>
              </select>
            </div>

            <div className="md:col-span-2 mt-4">
              <button type="submit" className="w-full py-3 btn-premium btn-premium-emerald rounded-xl font-medium">Add Question to Bank</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
