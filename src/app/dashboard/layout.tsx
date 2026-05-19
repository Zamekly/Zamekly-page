import type { ReactNode } from "react";
import { ThemeProvider } from "@/components/dashboard/ThemeProvider";
import Sidebar from "@/components/dashboard/Sidebar";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import MfaBanner from "@/components/dashboard/MfaBanner";

export const metadata = {
  title: "Dashboard | Zamekly",
};

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-[#0F172A]">
        <Sidebar />
        <div className="flex flex-1 flex-col overflow-hidden">
          <DashboardHeader />
          <div className="flex-1 overflow-y-auto">
            <MfaBanner />
            <main className="p-6">{children}</main>
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}
