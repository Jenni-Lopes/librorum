export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-[#362A67] to-[#15131D] p-4">
      <div>
        {children}
      </div>
    </div>
  );
}
