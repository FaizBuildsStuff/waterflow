import { Sidebar } from "@/components/dashboard/sidebar"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-[#0A0A0A]">
      {/* Fixed Sidebar */}
      <Sidebar />

      {/* Main Viewport */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* Your Header could go here if it's shared across all dashboard pages */}
        <main className="flex-1">
          {children}
        </main>
      </div>
    </div>
  )
}