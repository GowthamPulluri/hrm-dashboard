"use client";
import React, { useState, useEffect } from "react";
import styles from '../../../styles/management_dashboard.module.css'; // Assuming this has base styles
import { ColourfulText } from "@/components/ui/colourful-text"; // Keep your colourful text
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
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import axios from "axios"; // If you plan to fetch data
import TypewriterEffect from 'typewriter-effect'; // Using `typewriter-effect` npm package


// Logo Components (kept as named exports)
export const Logo = () => {
  return (
    <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black dark:text-white">
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
    <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black dark:text-white">
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};


export default function Management_dashboard() {

  // Placeholder for logged-in admin details (you'll set this from actual auth)
  const [adminInfo, setAdminInfo] = useState({ name: "Admin User", role: "Manager" });

  const links = [

    {
      label: "Attendance Tracker",
      href: "/Attendance_tracker",
      icon: <IconClockHour4 className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />, // More specific icon for attendance
    },
    {
      label: "Employee Database",
      href: "/Employee_database",
      icon: <IconDatabase className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />, // More specific icon for database
    },
    {
      label: "Performance Monitor",
      href: "/Performance_monitor",
      icon: <IconChartLine className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Add / Update Employee", // Changed "details" to "Employee" for clarity
      href: "/Add_Update_employee",
      icon: <IconUserPlus className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />, // Icon for adding/updating user
    },
    {
      label: "Group Discussion",
      href: "/Remove_employee", // Assuming this is your group discussion page
      icon: <IconMessages className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />, // More specific icon for group discussion
    },
    {
      label: "Payroll Management",
      href: "/Payroll_management",
      icon: <IconReceipt2 className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "About",
      href: "/About_page",
      icon: <IconInfoCircle className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Logout",
      href: "/",
      icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },

    
  ];

  const [open, setOpen] = useState(false);
  const [companyNews, setCompanyNews] = useState([]);
  const [latestUpdates, setLatestUpdates] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setCompanyNews([
          { id: 1, title: 'Q2 Performance Exceeds Expectations!', date: 'July 1, 2025', content: 'Our team has shown outstanding dedication, leading to a record-breaking second quarter.' },
          { id: 2, title: 'New Employee Onboarding Program Launched', date: 'June 28, 2025', content: 'Welcome our new hires with an improved and comprehensive onboarding experience.' },
          { id: 3, title: 'Upcoming Holiday Schedule Announced', date: 'June 25, 2025', content: 'Please review the official holiday calendar for the remainder of the year.' },
        ]);

        setLatestUpdates([
          { id: 1, text: 'Dashboard UI Enhancements Deployed.' },
          { id: 2, text: 'System Maintenance Scheduled for Friday.' },
          { id: 3, text: 'New Feature: Performance Trend Analysis Now Available.' },
        ]);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className={cn(
      "mx-auto flex w-full max-w-7xl flex-1 flex-col overflow-hidden rounded-md border border-neutral-200 bg-gray-100 md:flex-row dark:border-neutral-700 dark:bg-neutral-800",
      "min-h-screen",
      "flex flex-row w-full"
    )}>
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

      <div className="relative flex flex-1 flex-col overflow-y-auto p-4 md:p-8">
        {/* Hero Section: Company Name and Typewriter Effect */}
        <div className="relative w-full h-64 md:h-80 flex justify-center items-center rounded-lg overflow-hidden mb-8 shadow-lg bg-black">
          <motion.img
            src="https://wallpapercave.com/wp/nTwzv3B.jpg"
            className="h-full w-full object-cover absolute inset-0 [mask-image:radial-gradient(circle,transparent,black_80%)] opacity-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 1 }}
            alt="Company Background"
          />
          <h1 className="text-3xl md:text-6xl lg:text-8xl font-extrabold text-center text-white relative z-20 font-sans tracking-tight">
            <ColourfulText text="Mahaveer Solutions" />
            <br />
            <span className="block text-xl md:text-3xl lg:text-4xl mt-2 text-neutral-300">
              <TypewriterEffect
                options={{
                  strings: ['Empowering Your Workforce', 'Driving Business Growth', 'Innovative Solutions for Tomorrow'],
                  autoStart: true,
                  loop: true,
                  delay: 50,
                  deleteSpeed: 30,
                  pauseFor: 2000,
                }}
              />
            </span>
          </h1>
        </div>

        {/* Dashboard Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Admin Info Card */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-neutral-800 rounded-lg p-6 shadow-xl border border-neutral-700 col-span-1"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <IconHammer className="h-6 w-6 mr-2 text-indigo-400" /> Admin Info
            </h3>
            {adminInfo ? (
              <>
                <p className="text-lg text-neutral-300">Welcome, <span className="font-medium text-white">{adminInfo.name}</span>!</p>
                <p className="text-sm text-neutral-400">Role: <span className="font-medium text-neutral-300">{adminInfo.role}</span></p>
                <div className="mt-4 pt-4 border-t border-neutral-700">
                  <p className="text-xs text-neutral-500" suppressHydrationWarning>
                    {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
                  </p>
                </div>
              </>
            ) : (
              <p className="text-neutral-400">Loading admin details...</p>
            )}
          </motion.div>

          {/* Quick Actions Card */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="bg-neutral-800 rounded-lg p-6 shadow-xl border border-neutral-700 col-span-1"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <IconActivity className="h-6 w-6 mr-2 text-yellow-400" /> Quick Actions
            </h3>
            <div className="flex flex-col space-y-3">
              <a href="/Attendance_tracker" className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors duration-200">
                < IconClockHour4 className="h-5 w-5 mr-2" /> Attendance Tracker
              </a>
              <a href="/Employee_database" className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors duration-200">
                <IconDatabase className="h-5 w-5 mr-2" /> Employee Database
              </a>
              <a href="/Add_Update_employee" className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors duration-200">
                <IconUserPlus className="h-5 w-5 mr-2" /> Add / Update Employee
              </a>
              <a href="/Project_updates" className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors duration-200">
                <IconMessages className="h-5 w-5 mr-2" /> Group Discussion
              </a>
            </div>
          </motion.div>

          {/* Latest Updates Card */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="bg-neutral-800 rounded-lg p-6 shadow-xl border border-neutral-700 md:col-span-2 lg:col-span-1"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <IconTerminal className="w-6 h-6 mr-2 text-blue-400" /> Latest Updates
            </h3>
            <ul className="space-y-3 text-neutral-300 text-sm">
              {latestUpdates.length > 0 ? (
                latestUpdates.map(update => (
                  <li key={update.id} className="flex items-start">
                    <span className="text-blue-500 mr-2">&bull;</span> {update.text}
                  </li>
                ))
              ) : (
                <p className="text-neutral-400">No recent updates.</p>
              )}
            </ul>
          </motion.div>

          {/* Company News Card (Now spans full width on smaller screens, 2/3 on larger) */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="bg-neutral-800 rounded-lg p-6 shadow-xl border border-neutral-700 col-span-full md:col-span-2"
          >
            <h2 className="text-2xl font-semibold text-white mb-4 flex items-center">
              <IconNews className="w-6 h-6 mr-2 text-green-400" /> Company News
            </h2>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {companyNews.length > 0 ? (
                companyNews.map(news => (
                  <div key={news.id} className="bg-neutral-700 p-4 rounded-md shadow-sm border border-neutral-600">
                    <h3 className="text-lg font-medium text-white mb-1">{news.title}</h3>
                    <p className="text-sm text-neutral-400 mb-2">{news.date}</p>
                    <p className="text-neutral-300 text-sm">{news.content}</p>
                  </div>
                ))
              ) : (
                <p className="text-neutral-400 col-span-full">No news to display.</p>
              )}
            </div>
          </motion.div>

        </div>
        <div className="flex-grow"></div> {/* Pushes content to the top */}
      </div>
    </div>
  );
}