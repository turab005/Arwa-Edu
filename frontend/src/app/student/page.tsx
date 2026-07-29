"use client";

import { useEffect, useState } from "react";
import { fetchAPI } from "@/lib/api";
import Link from "next/link";

type Chapter = {
  id: number;
  subject_id: number;
  name: string;
  order_index: number;
};

type Subject = {
  id: number;
  name: string;
  subject_class: number;
  chapters?: Chapter[];
};

export default function StudentDashboard() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const subs = await fetchAPI("/student/subjects");
      // Fetch chapters for each subject
      const subsWithChapters = await Promise.all(
        subs.map(async (sub: Subject) => {
          const chaps = await fetchAPI(`/student/subjects/${sub.id}/chapters`);
          return { ...sub, chapters: chaps };
        })
      );
      setSubjects(subsWithChapters);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-slate-900 tracking-tight">My Subjects</h1>
        <p className="text-slate-500 mt-1">Select a chapter to start your quiz.</p>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">Loading...</div>
      ) : subjects.length === 0 ? (
        <div className="text-center p-12 glass rounded-3xl border border-border shadow-sm">
          <p className="text-slate-500">No subjects available for your class yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {subjects.map((subject) => (
            <div key={subject.id} className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border">
              <h2 className="text-2xl font-bold text-slate-900 mb-4">{subject.name}</h2>
              
              {subject.chapters && subject.chapters.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {subject.chapters.map((chapter) => (
                    <div key={chapter.id} className="p-4 rounded-xl border border-border bg-muted flex flex-col justify-between hover:border-primary hover:bg-muted/80 transition-colors">
                      <h3 className="font-semibold text-slate-800">{chapter.name}</h3>
                      <Link 
                        href={`/student/chapter/${chapter.id}/quiz`}
                        className="mt-4 text-center w-full py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                      >
                        Start Quiz &rarr;
                      </Link>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-500">No chapters available.</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
