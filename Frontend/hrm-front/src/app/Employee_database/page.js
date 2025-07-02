"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from 'next/navigation'; // Import useRouter
import styles from '../../../styles/management_dashboard.module.css';
import { ColourfulText } from "@/components/ui/colourful-text";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import Image from 'next/image';

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
import axios from "axios";

export default function Employee_database() {
  const router = useRouter(); // Initialize useRouter

  const links = [
    {
      label: "Attendance Tracker",
      href: "/Attendance_tracker",
      icon: <IconClockHour4 className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Dashboard",
      href: "Management_dashboard",
      icon: (
        <IconDashboard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Performance Monitor",
      href: "/Performance_monitor",
      icon: <IconChartLine className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Add / Update details",
      href: "/Add_Update_employee",
      icon: <IconUserPlus className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Group Discussion",
      href: "/Remove_employee",
      icon: <IconMessages className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
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

  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [filteredEmployees, setFilteredEmployees] = useState([]);
  const [open, setOpen] = useState(false);
  const [loggedInEmployee, setLoggedInEmployee] = useState(null); // State for logged-in employee

  useEffect(() => {
    const fetchAllEmployees = async () => {
      try {
        const res = await axios.get('http://localhost:3000/employee_data');
        setEmployees(res.data);
        setFilteredEmployees(res.data);
      } catch (error) {
        console.error('Error fetching data', error);
      }
    };
    fetchAllEmployees();

    // Fetch logged-in employee from localStorage
    const storedEmployee = localStorage.getItem('loggedInEmployee');
    if (storedEmployee) {
      setLoggedInEmployee(JSON.parse(storedEmployee));
    }
  }, []);

  useEffect(() => {
    let data = [...employees];
    if (search) {
      data = data.filter(emp => emp.empId.toLowerCase().includes(search.toLowerCase()) || emp.name.toLowerCase().includes(search.toLowerCase()));
    }
    if (roleFilter) {
      data = data.filter(emp => emp.role.toLowerCase() === roleFilter.toLowerCase());
    }
    setFilteredEmployees(data);
  }, [search, roleFilter, employees]);

  // Function to handle card click and navigate to assign task page
  const handleCardClick = (empId) => {
    router.push(`/Assign_task?empId=${empId}`);
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
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>

      <div className="relative flex flex-1 flex-col justify-start items-center overflow-auto p-4 dark:bg-neutral-900">
        

        {/* Company Name and Welcome Message */}
        <div className={cn(styles.company_name, "relative z-10 w-full mb-8")}>
          {/* <motion.img
            src="https://wallpapercave.com/wp/nTwzv3B.jpg"
            className="h-full w-full object-cover absolute inset-0 [mask-image:radial-gradient(circle,transparent,black_80%)] pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            transition={{ duration: 1 }}
          /> */}
          {loggedInEmployee && (
            <div className="absolute top right-1 bg-neutral-800 text-white rounded-lg p-4 shadow-md text-left z-20">
              <h4 className="text-lg font-semibold mb-2 border-b border-neutral-700 pb-1">Logged In</h4>
              <p className="text-sm"><strong>Name:</strong> {loggedInEmployee.name}</p>
              <p className="text-sm"><strong>ID:</strong> {loggedInEmployee.empId}</p>
              <p className="text-sm"><strong>Role:</strong> {loggedInEmployee.role || 'Employee'}</p>
            </div>
          )}
          <h1 className="text-2xl md:text-5xl lg:text-7xl font-bold text-center text-white relative z-2 font-sans">
            <ColourfulText text="Mahaveer Solutions" /> 
          </h1>
          <h1 className="text-xl md:text-3xl font-bold text-center text-white relative z-2 mt-4">Employee Directory</h1>
          <h2 className="text-lg md:text-xl text-center text-white relative z-2 mt-2">Manage your employees here</h2>
        </div>

        {/* Controls (Search and Filter) */}
        <div className="relative z-10 w-full md:w-[80%] mx-auto flex flex-col md:flex-row justify-center items-center gap-4 mb-8 p-4 bg-neutral-800 rounded-lg shadow-lg">
          <input
            className="w-full md:flex-1 px-4 py-2 rounded-md border border-neutral-600 bg-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            type="text"
            placeholder="Search by ID or Name..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <select
            className="w-full md:w-auto px-4 py-2 rounded-md border border-neutral-600 bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={e => setRoleFilter(e.target.value)}
            value={roleFilter}
          >
            <option value="">All Roles</option>
            <option value="Software Developer">Software Developer</option>
            <option value="Automation Tester">Automation Tester</option>
            <option value="Project Manager">Project Manager</option>
            <option value="UI/UX Designer">UI/UX Designer</option>
            {/* <option value="HR Specialist">HR Specialist</option> */}
            <option value="QA Engineer">QA Engineer</option>
            <option value="DevOps Engineer">DevOps Engineer</option>
          </select>
        </div>

        {/* Employee Cards Container */}
        <div className="relative z-10 w-full md:w-[80%] mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-4">
          {filteredEmployees.length > 0 ? (
            filteredEmployees.map(emp => (
              <div
                className="relative group bg-neutral-800 rounded-lg shadow-lg overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-xl"
                key={emp.empId}
                onClick={() => handleCardClick(emp.empId)}
              >
                <img
                  src={emp.imageUrl || `https://placehold.co/150x150/000000/FFFFFF?text=${emp.name.charAt(0)}`}
                  alt={emp.name}
                  className="w-full h-40 object-cover"
                  onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/150x150/000000/FFFFFF?text=${emp.name.charAt(0)}`; }}
                />
                <div className="p-4 text-white">
                  <h2 className="text-xl font-semibold mb-1">{emp.name}</h2>
                  <p className="text-sm text-neutral-300"><strong>ID:</strong> {emp.empId}</p>
                  <p className="text-sm text-neutral-300"><strong>Email:</strong> {emp.mailID}</p>
                  <p className="text-sm text-neutral-300"><strong>Role:</strong> {emp.role}</p>
                  <p className="text-sm text-neutral-300"><strong>Age:</strong> {emp.age}</p>
                </div>
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-70 flex items-center justify-center opacity-0 group-hover:opacity-70 transition-opacity duration-300">
                  <span className="text-white text-lg font-bold text-center">Assign any task</span>
                </div>
              </div>
            ))
          ) : (
            <p className="text-neutral-400 text-center col-span-full py-8">No employees found matching your criteria.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export const Logo = () => {
  return (
    <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
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
    <a href="#" className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black">
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-black dark:bg-white" />
    </a>
  );
};
