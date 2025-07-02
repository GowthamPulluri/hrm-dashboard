"use client";
import React from "react";
import styles from "../../../styles/management_dashboard.module.css";
import aboutStyles from "./about.module.css";
import Image from 'next/image';

import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconCalendarStats, // Keep for Attendance Tracker if preferred
  IconChartLine,      // Performance Monitor
  IconUsers,          // Add / Update details, or a more general users icon
  IconArrowLeft,
  IconInfoCircle,     // About
  IconNews,           // Company News
  IconTerminal,       // Latest Updates
  IconDashboard,      // For the main Dashboard link
  IconDatabase,       // For Employee Database
  IconUserPlus,       // For Add/Update Employee
  IconMessages,       // For Group Discussion
  IconClockHour4,            // Alternative for Attendance (like clock-in/out)
  IconHammer,         // General management/admin icon
  IconClipboardList,  // Good for tasks/lists
  IconMail,           // For Mail/Announcements (if you add an announcements page)
  IconActivity,       // For Quick Actions
   IconReceipt2,

} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export default function About_page() {
  const links = [
    { label: "Attendance Tracker", href: "/Attendance_tracker", icon: <IconClockHour4 className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> },
    { label: "Employee Database", href: "/Employee_database", icon: <IconDatabase className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> },
    { label: "Performance Monitor", href: "/Performance_monitor", icon: <IconChartLine className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> },
    { label: "Add / Update details", href: "/Add_Update_employee", icon: <IconUserPlus className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> },
    { label: "Group Discussion", href: "/Remove_employee", icon: <IconMessages className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> },
    
    { label: "Dashboard", href: "/Management_dashboard", icon: <IconDashboard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> },
    { label: "Logout", href: "/", icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> },
  ];

  const [open, setOpen] = React.useState(false);

  return (
    <div
      className={cn(
        "mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
        "min-h-screen"
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>

      <Dashboard />
    </div>
  );
}

export const Logo = () => (
  <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
    <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    <span className="font-medium whitespace-pre text-black dark:text-white">Mahaveer Solutions</span>
  </a>
);

export const LogoIcon = () => (
  <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
    <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
  </a>
);

const Dashboard = () => {
  const sectionImages = Array.from({ length: 10 }, (_, i) => `/bg/section${i + 1}.jpg`);

  return (
    <div className="relative flex flex-1 flex-col overflow-y-auto p-4">
      {/* <h1 className="text-3xl font-bold text-center my-8 dark:text-white">About GVK Innovations Pvt. Ltd.</h1> */}


{sectionImages.map((img, index) => (
  <div key={index} className={`${aboutStyles.aspectRatioBox} mb-8 shadow-lg`}> {/* Removed rounded-lg */}
    <img
      src={`/bg/section_${index + 1}.jpg`} // Changed to src as discussed previously
      alt={`Section Image ${index + 1}`} // Added alt attribute
      className="w-full h-full object-cover"
    />
  </div>
))}

      <section className={`${aboutStyles.contactStandalone} mt-8`}>
        <div className={aboutStyles.contactContent}>
          <h2>Contact Us</h2>
          <p><strong>Landline:</strong> +91 40 1234 5678</p>
          <p><strong>Email:</strong> <a href="mailto:contact@gvkinno.com">contact@gvkinno.com</a></p>
          <p>
            <a href="https://linkedin.com/company/gvkinno" target="_blank" rel="noopener noreferrer">LinkedIn</a> |{" "}
            <a href="https://x.com/gvkinno" target="_blank" rel="noopener noreferrer">X (formerly Twitter)</a>
          </p>
          <p className={aboutStyles.copyright}>
            © {new Date().getFullYear()} Mahaveer Solutions Pvt. Ltd. | Excellence. Empowered.
          </p>
        </div>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={aboutStyles.backToTopIconBtn}
          aria-label="Back to Top"
        >
          ↑
        </button>
      </section>
    </div>
  );
};
