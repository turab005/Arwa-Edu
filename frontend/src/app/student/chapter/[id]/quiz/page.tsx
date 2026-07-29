"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchAPI } from "@/lib/api";
import Link from "next/link";

type Question = {
  id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  difficulty: string;
};

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const chapterId = params.id as string;

  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<any>(null);

  useEffect(() => {
    loadQuestions();
  }, [chapterId]);

  const loadQuestions = async () => {
    try {
      const data = await fetchAPI(`/student/quiz/${chapterId}/start`);
      setQuestions(data);
    } catch (err) {
      alert("Failed to load quiz");
      router.push("/student");
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (questionId: number, option: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleSubmit = async () => {
    if (Object.keys(answers).length < questions.length) {
      if (!confirm("You have unanswered questions. Are you sure you want to submit?")) {
        return;
      }
    }

    setSubmitting(true);
    try {
      const submissionFormat = {
        chapter_id: parseInt(chapterId),
        answers: Object.entries(answers).map(([qId, selected_option]) => ({
          question_id: parseInt(qId),
          selected_option,
        }))
      };

      const data = await fetchAPI("/student/quiz/submit", {
        method: "POST",
        body: JSON.stringify(submissionFormat)
      });
      
      setResult(data);
    } catch (err) {
      alert("Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-12 text-center">Loading quiz...</div>;

  if (result) {
    const percentage = Math.round((result.score / result.total_questions) * 100) || 0;
    return (
      <div className="max-w-2xl mx-auto text-center space-y-6 mt-12 animate-fade-in-up">
        <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h1 className="text-4xl font-bold text-slate-900">Quiz Completed!</h1>
        
        <div className="bg-card text-card-foreground p-8 rounded-3xl border border-border shadow-sm mt-8">
          <div className="text-6xl font-extrabold text-blue-600 mb-2">{percentage}%</div>
          <p className="text-slate-500 text-lg">
            You scored {result.score} out of {result.total_questions} questions correct.
          </p>
        </div>

        <div className="pt-8">
          <Link href="/student" className="px-6 py-3 bg-slate-900 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors">
            Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="text-center p-12 glass rounded-3xl border border-border">
        <p className="text-slate-500">No questions available for this chapter yet.</p>
        <Link href="/student" className="inline-block mt-4 text-blue-600 hover:underline">Go Back</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex justify-between items-center bg-card text-card-foreground p-4 rounded-2xl shadow-sm border border-border sticky top-20 z-40">
        <h1 className="font-bold text-slate-900">Quiz in Progress</h1>
        <div className="text-sm font-medium text-slate-500">
          Answered: {Object.keys(answers).length} / {questions.length}
        </div>
      </div>

      <div className="space-y-8">
        {questions.map((q, index) => (
          <div key={q.id} className="bg-card text-card-foreground p-6 rounded-2xl shadow-sm border border-border">
            <h3 className="text-lg font-medium text-slate-900 mb-6">
              <span className="text-blue-500 font-bold mr-2">{index + 1}.</span> 
              {q.question_text}
            </h3>
            
            <div className="space-y-3">
              {[
                { key: 'A', text: q.option_a },
                { key: 'B', text: q.option_b },
                { key: 'C', text: q.option_c },
                { key: 'D', text: q.option_d }
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => handleOptionSelect(q.id, opt.key)}
                  className={`w-full text-left p-4 rounded-xl border transition-all ${
                    answers[q.id] === opt.key 
                    ? "border-primary bg-primary/10 text-primary shadow-sm"
                    : "border-border hover:border-primary hover:bg-muted text-foreground"
                  }`}
                >
                  <span className="inline-block w-6 font-bold opacity-50 mr-2">{opt.key}.</span>
                  {opt.text}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-end pt-4 pb-12">
        <button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-blue-600 text-white px-8 py-3 rounded-xl font-medium text-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/25 disabled:opacity-70"
        >
          {submitting ? "Submitting..." : "Submit Quiz"}
        </button>
      </div>
    </div>
  );
}
