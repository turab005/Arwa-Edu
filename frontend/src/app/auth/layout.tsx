export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden bg-slate-50">
      {/* Abstract Background Shapes */}
      <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px] -z-10 animate-pulse"></div>
      <div className="absolute bottom-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/10 blur-[120px] -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>
      
      <div className="w-full max-w-md animate-fade-in-up">
        {children}
      </div>
    </div>
  );
}
