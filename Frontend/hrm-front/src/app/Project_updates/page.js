'use client';
import React, { useState, useEffect } from "react";
import styles from '../../../styles/management_dashboard.module.css';
import { ColourfulText } from "@/components/ui/colourful-text";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import GroupDiscussion from "@/components/GroupDiscussion"; // Added import
import axios from "axios"; // Keep axios for logout functionality
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

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
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

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

export default function Project_updates() {
  const router = useRouter(); // Initialize router

  const links = [
    {
      label: "Tasks",
      href: "/Tasks_page", // Absolute path
      icon: <IconClipboardList className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Dashboard",
      href: "/Employee_dashboard", // Absolute path
      icon: <IconDashboard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "About",
      href: "/About_Emp", // Absolute path
      icon: <IconInfoCircle className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Logout",
      href: "#", // Set to '#' as we'll use a custom click handler
      icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
      onClick: true, // Custom prop to indicate it has a click handler
    },
  ];

  const [employee, setEmployee] = useState(null);
  const [open, setOpen] = useState(false);
  const [projectUpdates, setProjectUpdates] = useState([]);
  const [isLoadingUpdates, setIsLoadingUpdates] = useState(true);
  const [errorUpdates, setErrorUpdates] = useState(null);

  // Fetch project updates from backend
  useEffect(() => {
    const fetchProjectUpdates = async () => {
      setIsLoadingUpdates(true);
      setErrorUpdates(null);
      try {
        const response = await fetch("https://hrm-dashboard-xjqw.onrender.com/project_updates"); // Your backend endpoint
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setProjectUpdates(data);
      } catch (error) {
        console.error("Error fetching project updates:", error);
        setErrorUpdates(error.message);
      } finally {
        setIsLoadingUpdates(false);
      }
    };

    fetchProjectUpdates();
  }, []);

  // Fetch employee data from localStorage once on mount
  useEffect(() => {
    const storedEmployee = localStorage.getItem('loggedInEmployee');
    if (storedEmployee) {
      setEmployee(JSON.parse(storedEmployee));
    } else {
      // If no employee is logged in, redirect them
      router.push('/');
    }
  }, [router]); // Added router to dependency array for ESLint

  // Function to handle logout
  const handleLogout = async () => {
    if (!employee || !employee.empId) {
      console.error("No employee logged in or empId missing.");
      localStorage.removeItem('loggedInEmployee'); // Ensure local storage is cleared
      router.push('/'); // Redirect to login page
      return;
    }

    const today = new Date();
    // Use the current date for the attendance record (Vijayawada is IST)
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
    // Use the current time
    const logoutTime = today.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    try {
      // Send the logout request to your backend API
      // Ensure the URL matches your server's address and port
      const response = await axios.put('https://hrm-dashboard-xjqw.onrender.com/emp_attendance/logout', {
        empId: employee.empId,
        date: formattedDate,
        logoutTime: logoutTime,
      });

      console.log('Logout successful:', response.data);

      // Clear local storage and redirect after successful backend update
      localStorage.removeItem('loggedInEmployee');
      router.push('/'); // Redirect to the login page
    } catch (error) {
      console.error('Failed to update logout time on backend:', error.response ? error.response.data : error.message);
      alert(`Logout failed: ${error.response?.data?.message || 'Server error'}. Please try again.`);
      // Depending on your app's logic, you might want to force logout even on error
      // or provide a retry mechanism. For now, showing an alert.
    }
  };

  // Derive userName and userRole for GroupDiscussion
  const currentUserName = employee ? employee.name : "Employee"; // Default to "Employee" if not logged in
  const currentUserID = employee ? (employee.empId || "Employee") : "Employee"; // Use employee's empId as ID for GroupDiscussion

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
                // Conditionally render SidebarLink with onClick if link.onClick is true
                <SidebarLink
                  key={idx}
                  link={link}
                  onClick={link.onClick ? handleLogout : undefined} // Pass handleLogout for logout link
                />
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>

      <div className="relative flex flex-1 flex-col justify-start items-center overflow-auto p-4 dark:bg-neutral-900">

        <div className={cn(styles.company_name, "relative z-10 w-full mb-8")}>
          {/* Removed motion.img as it was commented out in your original snippet for this component */}
          {/* The image and its mask are likely intended for a broader layout or a different component */}
          {/* If you want a background image for this specific area, you'll need to re-add it here */}

          {employee && (
            <div className="absolute top-4 right-4 bg-neutral-800 text-white rounded-lg p-4 shadow-md text-left z-20">
              <h4 className="text-lg font-semibold mb-2 border-b border-neutral-700 pb-1">Logged In</h4>
              <p className="text-sm"><strong>Name:</strong> {employee.name}</p>
              <p className="text-sm"><strong>ID:</strong> {employee.empId}</p>
              <p className="text-sm"><strong>Role:</strong> {employee.role || 'Employee'}</p>
            </div>
          )}

          <h1 className={cn("text-2xl md:text-5xl lg:text-7xl font-bold text-center text-white relative z-2 font-sans", styles.company_name_title)}>
            <ColourfulText text="Mahaveer Solutions" />
          </h1>
          <h1 className="text-xl md:text-3xl font-bold text-center text-white relative z-2 mt-4">Welcome to Group Discussion</h1>
          <h2 className="text-lg md:text-xl text-center text-white relative z-2 mt-2">Stay informed on the latest project developments.</h2>
        </div>

        {/* Group Discussion Section */}
        <div className="relative z-10 w-full md:w-[60%] mx-auto h-[500px] mt-8">
          {/* Ensure GroupDiscussion is a client component if it uses hooks */}
          <GroupDiscussion userName={currentUserName} userRole={currentUserID} />
        </div>
        <br></br><br></br>
        {/* Main Content Area for Project Updates */}
        <div className="w-full md:w-3/5 p-6 bg-neutral-800 rounded-lg shadow-lg text-white">
          <h3 className="text-2xl font-bold mb-4">Latest Updates</h3>
          {isLoadingUpdates && <p className="text-neutral-400">Loading updates...</p>}
          {errorUpdates && <p className="text-red-500">Error: {errorUpdates}</p>}
          {!isLoadingUpdates && !errorUpdates && projectUpdates.length === 0 && (
            <p className="text-neutral-400">No updates available at the moment.</p>
          )}
          {!isLoadingUpdates && !errorUpdates && projectUpdates.length > 0 && (
            <ul className="list-disc list-inside mt-4 space-y-2 text-neutral-300">
              {projectUpdates.map((update, index) => (
                <li key={index}>
                  <strong>{update.title}:</strong> {update.description} (Date: {update.date})
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}