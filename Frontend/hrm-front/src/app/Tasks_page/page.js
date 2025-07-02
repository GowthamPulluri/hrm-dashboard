'use client';
import React, { useState, useEffect } from "react";
import styles from '../../../styles/management_dashboard.module.css';
import { ColourfulText } from "@/components/ui/colourful-text";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconCalendarStats,
  IconChartLine,
  IconUsers, // Not explicitly used in links, but kept if you use it elsewhere
  IconTrash, // Not used in links
  IconArrowLeft,
  IconInfoCircle,
     IconClipboardList,
      IconMessages,
      IconUsersGroup,
      IconDashboard
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

// No direct imports for pages if they are truly separate pages navigated to via href.
// import Project_updates from "../Project_updates/page";
// import About_emp from "../About_Emp/page";


export default function Tasks_page(){
  const router = useRouter(); // Initialize router

  const links = [
    {
      label: "Dashboard",
      href: "/Employee_dashboard",
      icon: <IconDashboard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Group Discussion", // Renamed for clarity, assuming it's for Project Updates
      href: "/Project_updates",
      icon: <IconUsersGroup className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "About",
      href: "/About_Emp", // Corrected to "/About_Emp" as per your file structure
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
  const [tasks, setTasks] = useState([]);

  // Consolidated useEffect to fetch employee and tasks
  useEffect(() => {
    const storedEmployee = localStorage.getItem('loggedInEmployee');
    if (storedEmployee) {
      const emp = JSON.parse(storedEmployee);
      setEmployee(emp);

      // Fetch tasks for logged-in empId
      axios.get(`https://hrm-dashboard-xjqw.onrender.com/task_assigned/${emp.empId}`)
        .then(res => setTasks(res.data))
        .catch(err => {
          console.error("Failed to fetch tasks for employee", emp.empId, err);
          setTasks([]); // Set tasks to empty array on error
        });
    } else {
        // If no employee is logged in, redirect them
        router.push('/');
    }
  }, [router]); // Added router to dependency array to satisfy ESLint

  // Removed redundant useEffects that were duplicated

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

  return(
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

      <div className="relative flex flex-1 flex-col justify-center items-center overflow-hidden">
        <div className={styles.company_name}>
          <motion.img
            src="https://wallpapercave.com/wp/nTwzv3B.jpg"
            className="h-full w-full object-cover absolute inset-0 [mask-image:radial-gradient(circle,transparent,black_80%)] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 1 }}
            alt="Background" // Added alt text for accessibility
          />

          {/* Employee Info Card */}
          {employee && (
            <motion.div
              initial={{ x: 200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="absolute top-4 right-4 bg-white dark:bg-neutral-900 text-black dark:text-white rounded-lg p-4 shadow-xl z-30 min-w-[220px]"
            >
              <h4 className="text-lg font-semibold mb-2">Logged In Employee</h4>
              <p className="text-sm"><strong>Name:</strong> {employee.name}</p>
              <p className="text-sm"><strong>ID:</strong> {employee.empId}</p>
              <p className="text-sm"><strong>Role:</strong> {employee.role || 'Employee'}</p>
            </motion.div>
          )}

          <h1 className="text-2xl md:text-5xl lg:text-7xl font-bold text-center text-white relative z-2 font-sans">
            <ColourfulText text="Mahaveer Solutions" />
          </h1>

          <div className="mt-8 w-full max-w-4xl mx-auto z-10"> {/* Ensure z-index to be above background image mask */}
            <h2 className="text-white text-2xl font-semibold mb-4 text-center">Your Tasks</h2>
            {tasks.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {tasks.filter(task => task.status === "Pending").map((task, index) => (
                  <div key={index} className="bg-white rounded-lg p-4 shadow-md">
                    <h3 className="text-xl font-bold text-black">Task ID: {task.taskId}</h3>
                    <p className="text-sm text-gray-700 mt-2">Task: {task.task}</p>
                    <p className="text-sm text-gray-700 mt-2">Description: {task.description}</p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="text-sm font-medium text-indigo-600">Priority: {task.priority}</span>
                      <span className="text-sm text-gray-500">Assigned on: {task.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-300">No tasks assigned.</p>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

// Logo and LogoIcon components remain the same
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