import Navbar from "@/components/Navbar";

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#0B1120] text-white overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#111827] border-r border-gray-800 flex-shrink-0">
        <Navbar />
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-8">
        {children}
      </main>
    </div>
  );
}