import { Sidebar } from "@/components/dashboard/sidebar"
import { MobileNav } from "@/components/dashboard/mobile-nav"
import { SubscriptionGuard } from "@/components/dashboard/subscription-guard"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-[#0A0A0A]">
      {/* Fixed Sidebar for Desktop */}
      <Sidebar />

      {/* Mobile Top Bar */}
      <MobileNav />

      {/* Main Viewport */}
      <div className="flex flex-1 flex-col lg:pl-64 overflow-x-hidden pt-16 lg:pt-0">
        <main className="flex-1 flex flex-col overflow-x-hidden">
          <SubscriptionGuard>
            {children}
          </SubscriptionGuard>
        </main>
      </div>
    </div>
  )
}