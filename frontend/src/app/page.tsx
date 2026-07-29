import Link from 'next/link';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 lg:p-24 relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/20 blur-[100px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/20 blur-[100px] -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="z-10 w-full max-w-5xl flex flex-col items-center gap-12 animate-fade-in-up">
        
        <div className="text-center space-y-6">
          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-primary to-blue-600">
            Arwa Edu
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto">
            The most secure, guardian-controlled learning platform for students in Bangladesh. 
            Empowering education for Class 6-10.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-4xl mt-12">
          
          {/* Guardian Card */}
          <Link href="/auth/guardian/login" className="group glass p-8 rounded-3xl hover-lift border border-border flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-2 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground">For Guardians</h2>
            <p className="text-muted-foreground text-sm">Create accounts for your children, track progress, and manage access securely.</p>
            <span className="mt-4 text-primary font-medium text-sm group-hover:underline">Guardian Login &rarr;</span>
          </Link>

          {/* Student Card */}
          <Link href="/auth/student/login" className="group glass p-8 rounded-3xl hover-lift border border-border flex flex-col items-center text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-blue-500/10 flex items-center justify-center text-blue-500 mb-2 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground">For Students</h2>
            <p className="text-muted-foreground text-sm">Take quizzes, view your results, and improve your knowledge.</p>
            <span className="mt-4 text-blue-500 font-medium text-sm group-hover:underline">Student Login &rarr;</span>
          </Link>

          {/* Admin Card */}
          <Link href="/auth/admin/login" className="group glass p-8 rounded-3xl hover-lift border border-border flex flex-col items-center text-center gap-4 md:col-span-2 lg:col-span-1">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-2 group-hover:scale-110 transition-transform">
              <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <h2 className="text-2xl font-bold text-foreground">For Content Admins</h2>
            <p className="text-muted-foreground text-sm">Manage curriculum, subjects, chapters, and multiple-choice questions.</p>
            <span className="mt-4 text-emerald-500 font-medium text-sm group-hover:underline">Admin Login &rarr;</span>
          </Link>
          
        </div>
      </div>
    </main>
  );
}
