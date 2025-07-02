"use client";
import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
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
    IconReceipt2,       // For Payroll Management
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import { ColourfulText } from "@/components/ui/colourful-text";
import { cn } from "@/lib/utils";
import styles from '../../../styles/management_dashboard.module.css';

export default function Attendance_tracker() {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [searchId, setSearchId] = useState("");

  const links = [
    { label: "Dashboard", href: "Management_dashboard", icon: <IconDashboard className="h-5 w-5" /> },
        {
          label: "Employee Database",
          href: "/Employee_database",
          icon: <IconDatabase className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        },
    { label: "Performance Monitor", href: "Performance_monitor", icon: <IconChartLine className="h-5 w-5" /> },
    { label: "Add / Update details", href: "Add_Update_employee", icon: <IconUserPlus className="h-5 w-5" /> },
    { label: "Group Discussion", href: "Remove_employee", icon: <IconMessages className="h-5 w-5" /> },
        {
          label: "Payroll Management",
          href: "/Payroll_management",
          icon: <IconReceipt2 className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        },
    { label: "About", href: "About_page", icon: <IconInfoCircle className="h-5 w-5" /> },
    { label: "Logout", href: "/", icon: <IconArrowLeft className="h-5 w-5" /> },
  ];

  const formatDateToBackend = (dateObj) => {
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const fetchAttendance = async (dateStr) => {
    try {
      const response = await fetch(`https://hrm-dashboard-xjqw.onrender.com/emp_attendance/${dateStr}`);
      const data = await response.json();
      setAttendanceData(data || []);
    } catch (err) {
      console.error("Error fetching attendance data:", err);
      setAttendanceData([]);
    }
  };

  useEffect(() => {
    const formatted = formatDateToBackend(selectedDate);
    fetchAttendance(formatted);
  }, [selectedDate]);

  const filteredData = attendanceData.filter((emp) =>
    emp.empId.toLowerCase().includes(searchId.toLowerCase())
  );

  return (
    <div className={cn("mx-auto flex w-full max-w-7xl min-h-screen rounded-md border bg-gray-100 md:flex-row dark:bg-neutral-800")}>      
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-1 flex-col overflow-y-auto">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
        </SidebarBody>
      </Sidebar>

      <div className="flex-1 p-8">
        <h1 className="text-4xl font-bold text-center mb-6 text-white">
          <ColourfulText text="Mahaveer Solutions" /> <br></br><br></br>
          Attendance Tracker
        </h1>

        <div className="flex flex-col md:flex-row items-start justify-between gap-4 mb-6">
          <div>
            <label className="text-white mb-2 block">Select Date:</label>
            <DatePicker
              selected={selectedDate}
              onChange={(date) => setSelectedDate(date)}
              dateFormat="dd-MM-yyyy"
              className="px-4 py-2 rounded-md"
            />
          </div>

          <div>
            <label className="text-white mb-2 block">Search by ID:</label>
            <input
              type="text"
              placeholder="Enter Employee ID"
              className="px-4 py-2 rounded-md"
              value={searchId}
              onChange={(e) => setSearchId(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left border-collapse bg-white text-black rounded-md overflow-hidden">
            <thead className="bg-gray-800 text-white">
              <tr>
                <th className="px-4 py-2 border">Name</th>
                <th className="px-4 py-2 border">Employee ID</th>
                <th className="px-4 py-2 border">Login Time</th>
                <th className="px-4 py-2 border">Logout Time</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((emp, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-100">
                    <td className="px-4 py-2 border">{emp.name}</td>
                    <td className="px-4 py-2 border">{emp.empId}</td>
                    <td className="px-4 py-2 border">{emp.login || "-"}</td>
                    <td className="px-4 py-2 border">{emp.logout || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center px-4 py-6 text-gray-600">
                    No records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const Logo = () => (
  <a href="#" className="flex items-center space-x-2 py-1 text-sm text-white">
    <div className="h-5 w-6 bg-white dark:bg-black rounded" />
    <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      Mahaveer Solutions
    </motion.span>
  </a>
);

const LogoIcon = () => (
  <a href="#" className="flex items-center py-1 text-sm text-white">
    <div className="h-5 w-6 bg-white dark:bg-black rounded" />
  </a>
);


const Dashboard = () => {
  return (
    // Make Dashboard fill the remaining horizontal and vertical space
    // and correctly position the background beams
    <div className="relative flex flex-1 flex-col justify-center items-center overflow-hidden">
      {/* BackgroundBeamsWithCollision should be placed here to cover the dashboard area */}
     

      {/* Content for the dashboard */}
      <div className={styles.company_name}>
        <motion.img
          src="https://wallpapercave.com/wp/nTwzv3B.jpg"
          className="h-full w-full object-cover absolute inset-0 [mask-image:radial-gradient(circle,transparent,black_80%)] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1 }}
        />
        <h1 className="text-2xl md:text-5xl lg:text-7xl font-bold text-center text-white relative z-2 font-sans">
          <ColourfulText text="Mahaveer Solutions" />
        </h1>
        <h1>Welcome to Attendance Tracker</h1>
        <h1>Track the attendance of your Employee</h1>
       {/* <AttendanceTableSection /> */}
        
      </div>
    </div>
  );
};