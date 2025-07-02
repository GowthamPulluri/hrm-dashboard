'use client';
import React, { useState, useEffect, useMemo } from "react";
import styles from '../../../styles/management_dashboard.module.css'; // Your existing CSS modules
import { ColourfulText } from "@/components/ui/colourful-text";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconCalendarStats,
  IconChartLine,
  IconArrowLeft,
  IconInfoCircle,
  IconMail,
  IconBellRinging,
  IconActivity,
  IconUsers, // For logged-in user card
  IconClipboardList,
  IconMessages,
  IconUsersGroup
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import axios from "axios";
import { useRouter } from 'next/navigation';

// Import Recharts components directly for the pie chart
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// --- Components for Typewriter Effect (Assumed to be in components/ui/typewriter-effect.jsx) ---
// If you put this in Employee_dashboard.js directly, keep it here.
// Otherwise, make sure to import it correctly.
const TypewriterEffect = ({ text, className }) => {
  const [displayedText, setDisplayedText] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (index < text.length) {
      const timeoutId = setTimeout(() => {
        setDisplayedText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, 70); // Typing speed in ms
      return () => clearTimeout(timeoutId);
    }
  }, [index, text]);

  return <span className={className}>{displayedText}</span>;
};

// --- Logo Components (kept as named exports) ---
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

// --- Custom Label Component for Pie Chart ---
const CustomPieChartLabel = ({ cx, cy, midAngle, outerRadius, percent, name, value }) => {
  const RADIAN = Math.PI / 180;
  // Calculate the position of the label
  const radius = outerRadius * 1.2; // Increase radius to move labels further out
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  // Determine text anchor based on angle to place text on left or right
  const textAnchor = x > cx ? 'start' : 'end';

  // Offset for better visual separation
  const offsetX = x > cx ? 10 : -10;

  return (
    <text
      x={x + offsetX}
      y={y}
      fill="#fff" // Label color
      textAnchor={textAnchor}
      dominantBaseline="central"
      fontSize="12px"
      fontWeight="bold"
    >
      {`${name}: ${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


export default function Employee_dashboard() {
  const router = useRouter();

  const links = [
    {
      label: "Tasks",
      href: "/Tasks_page",
      icon: <IconClipboardList className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Group Discussion",
      href: "/Project_updates", // Assuming project updates also functions as group discussion
      icon: <IconUsersGroup className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "About",
      href: "/About_Emp",
      icon: <IconInfoCircle className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Logout",
      href: "#",
      icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
      onClick: true, // Custom prop to indicate it has a click handler
    },
  ];

  const [employee, setEmployee] = useState(null);
  const [open, setOpen] = useState(false); // Sidebar open state
  const [announcements, setAnnouncements] = useState([]);
  const [isLoadingAnnouncements, setIsLoadingAnnouncements] = useState(true);
  const [errorAnnouncements, setErrorAnnouncements] = useState(null);

  // NEW: States for fetching tasks specific to the logged-in employee
  const [tasks, setTasks] = useState([]);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [errorTasks, setErrorTasks] = useState(null);

  // Colors for the pie chart
  const COLORS = ["#4CAF50", "#FFC107"]; // Green for completed, Yellow for pending

  useEffect(() => {
    const storedEmployee = localStorage.getItem('loggedInEmployee');
    if (storedEmployee) {
      const emp = JSON.parse(storedEmployee);
      setEmployee(emp);

      // --- Fetch Employee's Tasks ---
      const fetchEmployeeTasks = async (empId) => {
        setIsLoadingTasks(true);
        setErrorTasks(null);
        try {
          // Fetch tasks for the specific employee
          const response = await fetch(`http://localhost:3000/task_assigned/${empId}`);
          if (!response.ok) {
            // Handle 404 or other errors
            if (response.status === 404) {
                console.warn(`No tasks found for employee ID: ${empId}`);
                setTasks([]);
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
          } else {
            const data = await response.json();
            // Ensure the data is an array before setting state
            if (Array.isArray(data)) {
                setTasks(data);
            } else {
                console.warn("API response for employee tasks was not an array:", data);
                setTasks([]); // Set to empty array if response is not as expected
            }
          }
        } catch (error) {
          console.error("Error fetching employee tasks:", error);
          setErrorTasks(error.message);
          setTasks([]);
        } finally {
          setIsLoadingTasks(false);
        }
      };

      fetchEmployeeTasks(emp.empId);

    } else {
      router.push('/'); // Redirect if no employee is logged in
    }

    // --- Fetch Announcements ---
    const fetchAnnouncements = async () => {
      setIsLoadingAnnouncements(true);
      setErrorAnnouncements(null);
      try {
        const response = await fetch("http://localhost:3000/project_updates");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAnnouncements(data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
        setErrorAnnouncements(error.message);
      } finally {
        setIsLoadingAnnouncements(false);
      }
    };

    fetchAnnouncements();
  }, [router]); // Re-run effect if router changes (e.g., on initial load)

  // Memoized calculation for pie chart data
  const pieData = useMemo(() => {
    const completed = tasks.filter(task => task.status === "Completed").length;
    const pending = tasks.filter(task => task.status === "Pending").length;
    const total = completed + pending;

    if (total === 0) {
      // If no tasks, provide a single slice to show "No Tasks"
      return [{ name: "No Tasks", value: 1, fill: "#CCCCCC" }];
    }

    return [
      { name: "Completed", value: completed },
      { name: "Pending", value: pending },
    ];
  }, [tasks]); // Recalculate when tasks change

  const handleLogout = async () => {
    if (!employee || !employee.empId) {
      console.error("No employee logged in or empId missing.");
      localStorage.removeItem('loggedInEmployee');
      router.push('/');
      return;
    }

    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}-${String(today.getMonth() + 1).padStart(2, '0')}-${today.getFullYear()}`;
    const logoutTime = today.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });

    try {
      const response = await axios.put('http://localhost:3000/emp_attendance/logout', {
        empId: employee.empId,
        date: formattedDate,
        logoutTime: logoutTime,
      });

      console.log('Logout successful:', response.data);
      localStorage.removeItem('loggedInEmployee');
      router.push('/');
    } catch (error) {
      console.error('Failed to update logout time on backend:', error.response ? error.response.data : error.message);
      alert(`Logout failed: ${error.response?.data?.message || 'Server error'}. Please try again.`);
    }
  };

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
                <SidebarLink
                  key={idx}
                  link={link}
                  onClick={link.onClick ? handleLogout : undefined}
                />
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>

      <div className="relative flex flex-1 flex-col items-center overflow-auto p-4 md:p-8 dark:bg-neutral-900 z-0">
        <motion.img
          src="https://wallpapercave.com/wp/nTwzv3B.jpg"
          className="absolute inset-0 h-full w-full object-cover opacity-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          transition={{ duration: 1 }}
          alt="Background"
        />

        {/* Header and Employee Info Card */}
        <div className="w-full max-w-5xl relative z-10 flex flex-col md:flex-row justify-between items-start mb-8 p-4 bg-transparent">
          <div className="text-center md:text-left mb-8 md:mb-0">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-2">
              <ColourfulText text="Mahaveer Solutions" />
            </h1>
            <h2 className="text-2xl md:text-4xl font-semibold text-white mt-4">
              {employee && (
                <TypewriterEffect
                  text={`Welcome, ${employee.name}!`}
                  className="text-white relative z-2 mt-4"
                />
              )}
            </h2>
            <p className="text-neutral-300 text-lg mt-2">Your employee dashboard.</p>
          </div>

          {employee && (
            <motion.div
              initial={{ x: 200, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.5 }}
              className="bg-neutral-800 text-white rounded-lg p-6 shadow-xl z-30 min-w-[280px] border border-neutral-700 flex flex-col items-center md:items-start"
            >
              <h4 className="text-xl font-semibold mb-3 border-b border-neutral-700 pb-2 w-full text-center md:text-left">
                <IconUsers className="inline-block mr-2 h-6 w-6 text-indigo-400" /> Logged In
              </h4>
              <p className="text-base mb-1"><strong>Name:</strong> {employee.name}</p>
              <p className="text-base mb-1"><strong>ID:</strong> {employee.empId}</p>
              <p className="text-base"><strong>Role:</strong> {employee.role || 'Employee'}</p>
            </motion.div>
          )}
        </div>

        {/* Dashboard Content Grids */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">

          {/* Daily Announcements Card */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="bg-neutral-800 rounded-lg p-6 shadow-xl border border-neutral-700"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <IconBellRinging className="h-6 w-6 mr-2 text-yellow-400" /> Daily Announcements
            </h3>
            {isLoadingAnnouncements && <p className="text-neutral-400">Loading announcements...</p>}
            {errorAnnouncements && <p className="text-red-500">Error: {errorAnnouncements}</p>}
            {!isLoadingAnnouncements && !errorAnnouncements && announcements.length === 0 && (
              <p className="text-neutral-400">No new announcements today.</p>
            )}
            {!isLoadingAnnouncements && !errorAnnouncements && announcements.length > 0 && (
              <ul className="space-y-3 text-neutral-300 text-sm">
                {announcements.slice(0, 3).map((announcement, idx) => (
                  <li key={idx} className="bg-neutral-700 p-3 rounded-md border border-neutral-600">
                    <p className="font-medium text-white">{announcement.title}</p>
                    <p className="text-xs text-neutral-400">{announcement.description}</p>
                    <p className="text-xs text-neutral-500 mt-1">{announcement.date}</p>
                  </li>
                ))}
              </ul>
            )}
            {announcements.length > 3 && (
              <p className="text-sm text-neutral-500 mt-4">
                <a href="/Project_updates" className="text-indigo-400 hover:underline">View all announcements &rarr;</a>
              </p>
            )}
          </motion.div>

          {/* Quick Links Card (Example) */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.9 }}
            className="bg-neutral-800 rounded-lg p-6 shadow-xl border border-neutral-700"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <IconActivity className="h-6 w-6 mr-2 text-green-400" /> Quick Actions
            </h3>
            <div className="flex flex-col space-y-3">
              <a href="/Tasks_page" className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors duration-200">
                <IconCalendarStats className="h-5 w-5 mr-2" /> View My Tasks
              </a>
              {/* <a href="/Mail_page" className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors duration-200">
                <IconMail className="h-5 w-5 mr-2" /> Check My Mail
              </a> */}
              <a href="/Project_updates" className="flex items-center text-indigo-400 hover:text-indigo-300 transition-colors duration-200">
                <IconUsersGroup className="h-5 w-5 mr-2" /> Group Discussion
              </a>
            </div>
          </motion.div>

          {/* Employee Performance Snapshot Card (Now with Pie Chart) */}
          <motion.div
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 1.0 }}
            className="bg-neutral-800 rounded-lg p-6 shadow-xl border border-neutral-700 md:col-span-2 lg:col-span-1"
          >
            <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
              <IconChartLine className="h-6 w-6 mr-2 text-blue-400" /> Performance Snapshot
            </h3>
            {isLoadingTasks && <p className="text-neutral-400">Loading performance data...</p>}
            {errorTasks && <p className="text-red-500">Error: {errorTasks}</p>}
            {!isLoadingTasks && !errorTasks && (
              <div className="w-full h-auto">
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      dataKey="value"
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      labelLine={false} // Disable default label lines
                      label={CustomPieChartLabel} // Use the custom label component
                    >
                      {pieData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none', borderRadius: '5px', color: '#fff' }} />
                    {/* The legend can stay if you like, or be removed if labels are sufficient */}
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
                {/* Display a message if there are no tasks for the pie chart */}
                {pieData.length === 1 && pieData[0].name === "No Tasks" && (
                    <p className="text-neutral-400 text-center mt-2">No tasks assigned or recorded yet.</p>
                )}
                {pieData.length > 1 && (
                     <p className="text-xs text-neutral-500 text-center mt-2">Data based on your assigned tasks.</p>
                )}
              </div>
            )}
          </motion.div>

        </div>
      </div>
    </div>
  );
}