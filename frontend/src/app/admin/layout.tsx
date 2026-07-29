"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    
    if (!token || role !== "content_admin") {
      router.push("/auth/admin/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-500 text-slate-900 flex items-center justify-center font-bold">
              AE
            </div>
            <span className="font-bold text-xl tracking-tight">Admin Console</span>
          </div>
          
          <nav className="flex items-center gap-4">
            <Link href="/admin" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
              Manage Content
            </Link>
            <button 
              onClick={handleLogout}
              className="text-sm font-medium text-red-400 hover:bg-red-400/10 px-3 py-1.5 rounded-md transition-colors"
            >
              Log out
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in-up">
        {children}
      </main>
    </div>
  );
}
