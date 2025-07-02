"use client";
import React, { useState, useEffect } from "react"; // Added useEffect
import styles from '../../../styles/management_dashboard.module.css';

import { ColourfulText } from "@/components/ui/colourful-text";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import GroupDiscussion from "@/components/GroupDiscussion"; // Import GroupDiscussion

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
   IconReceipt2,      // For Payroll Management
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const Logo = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
      >
        Mahaveer Solutions
      </motion.span>
    </a>
  );
};

export const LogoIcon = () => {
  return (
    <a
      href="#"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};

// Dashboard component now accepts employeeInfo prop
const Dashboard = ({ employeeInfo }) => {
  return (
    <div className="relative flex flex-1 flex-col justify-start items-center overflow-auto p-4 dark:bg-neutral-900">


      <div className={cn(styles.company_name, "relative z-10 w-full mb-8")}>
        <motion.img
          src="https://wallpapercave.com/wp/nTwzv3B.jpg"
          className="h-full w-full object-cover absolute inset-0 [mask-image:radial-gradient(circle,transparent,black_80%)] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1 }}
        />
        {/* Employee Info Display - Added from Project_updates as it's useful */}
        {/* {employeeInfo && (
            <div className="absolute top-4 right-4 bg-neutral-800 text-white rounded-lg p-4 shadow-md text-left z-20">
              <h4 className="text-lg font-semibold mb-2 border-b border-neutral-700 pb-1">Logged In</h4>
              <p className="text-sm"><strong>Name:</strong> {employeeInfo.name}</p>
              <p className="text-sm"><strong>ID:</strong> {employeeInfo.empId}</p>
              <p className="text-sm"><strong>Role:</strong> {employeeInfo.role || 'Employee'}</p>
            </div>
          )} */}
        <h1 className="text-2xl md:text-5xl lg:text-7xl font-bold text-center text-white relative z-2 font-sans">
          <ColourfulText text="Mahaveer Solutions" />
        </h1>
        <h1 className="text-xl md:text-3xl font-bold text-center text-white relative z-2 mt-4">Welcome to Group Discussion</h1>
        <h2 className="text-lg md:text-xl text-center text-white relative z-2 mt-2">Stay informed on the latest project developments.</h2>
      </div>

      {/* Main Content Area for Employee Removal Form (Placeholder)
      <div className="relative z-10 w-full md:w-[60%] mx-auto p-6 bg-neutral-800 rounded-lg shadow-lg text-white mb-8">
        <h3 className="text-2xl font-bold mb-4">Remove Employee</h3>
        <p className="text-neutral-300 mb-4">
          Enter the Employee ID below to remove an employee from the system.
          This action is irreversible.
        </p>
        <form className="flex flex-col gap-4">
          <input
            type="text"
            placeholder="Employee ID (e.g., 22A81A1401)"
            className="w-full px-4 py-2 rounded-md border border-neutral-600 bg-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <button
            type="submit"
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
          >
            Remove Employee
          </button>
        </form>
      </div> */}

      {/* Group Discussion Section - Now included here */}
      <div className="relative z-10 w-full md:w-[60%] mx-auto h-[500px] mt-8">
        {/* Pass employeeInfo directly to GroupDiscussion */}
        <GroupDiscussion employeeInfo={employeeInfo} />
      </div>
    </div>
  );
};


export default function Remove_employee() {
  const links = [
    {
      label: "Attendance Tracker",
      href: "/Attendance_tracker", // Absolute path
      icon: (
        <IconClockHour4 className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Employee Database",
      href: "/Employee_database",
      icon: <IconDatabase className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Performance Monitor",
      href: "/Performance_monitor", // Absolute path
      icon: (
        <IconChartLine className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Add / Update details",
      href: "/Add_Update_employee", // Absolute path
      icon: (
        <IconUserPlus className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Dashboard",
      href: "/Management_dashboard", // Absolute path
      icon: (
        <IconDashboard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> // Changed from IconTrash as it's a database link
      ),
    },
        {
          label: "Payroll Management",
          href: "/Payroll_management",
          icon: <IconReceipt2 className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        },
    {
      label: "About",
      href: "/About_page", // Absolute path
      icon: (
        <IconInfoCircle className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Logout",
      href: "/", // Absolute path to home/login
      icon: (
        <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  const [open, setOpen] = useState(false);
  const [employee, setEmployee] = useState(null); // State to hold logged-in employee info

  // Fetch employee data from localStorage once on mount
  useEffect(() => {
    const storedEmployee = localStorage.getItem('loggedInEmployee');
    if (storedEmployee) {
      setEmployee(JSON.parse(storedEmployee));
    }
  }, []);

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
      {/* Pass the fetched employeeInfo to the Dashboard component */}
      <Dashboard employeeInfo={employee} />
    </div>
  );
}
