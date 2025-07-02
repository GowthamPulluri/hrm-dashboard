"use client";
import React, { useState, useEffect, useMemo } from "react";
import styles from '../../../styles/management_dashboard.module.css';
import { ColourfulText } from "@/components/ui/colourful-text";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import GroupDiscussion from "@/components/GroupDiscussion";

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";

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

// --- Logo Components (kept as named exports) ---
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

// --- Dashboard Component (now receives props from Performance_monitor page) ---
const Dashboard = ({
  filteredTasks,
  empIdSearch,
  setEmpIdSearch,
  employeeInfo,
  pieData,
  COLORS,
  isLoadingTasks,
  isLoadingEmployeeInfo,
  errorTasks,
  errorEmployeeInfo,
  onMarkComplete,
  currentUserName,
  currentUserRole,
  // NEW PROPS FOR FILTERING AND ACCURACY
  taskFilter,
  setTaskFilter,
  employeeAccuracyData,
  isLoadingAllEmployees,
  errorAllEmployees
}) => {
  return (
    <div className="relative flex flex-1 flex-col justify-start items-center overflow-auto p-4 dark:bg-neutral-900">
    

      {/* Company Name and Welcome Message */}
      <div className={cn(styles.company_name, "relative z-10 w-full mb-8")}>
        <motion.img
          src="https://wallpapercave.com/wp/nTwzv3B.jpg"
          className="h-full w-full object-cover absolute inset-0 [mask-image:radial-gradient(circle,transparent,black_80%)] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1 }}
        />
        <h1 className={cn("text-2xl md:text-5xl lg:text-7xl font-bold text-center text-white relative z-2 font-sans", styles.company_name_title)}>
          <ColourfulText text="Mahaveer Solutions" />
        </h1>
        <h1 className="text-xl md:text-3xl font-bold text-center text-white relative z-2 mt-4">Welcome to Performance Monitor</h1>
        <h2 className="text-lg md:text-xl text-center text-white relative z-2 mt-2">Track the performance of your Employees</h2>
      </div>

      {/* Search Bar */}
      <div className="relative z-10 w-full flex justify-center mb-8">
        <input
          type="text"
          placeholder="Search by Employee ID (e.g., 22A81A1401)"
          className="w-full md:w-1/2 lg:w-1/3 px-4 py-2 rounded-md border border-neutral-600 bg-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={empIdSearch}
          onChange={(e) => setEmpIdSearch(e.target.value)}
        />
      </div>

      {/* Loading/Error Messages for Tasks */}
      {isLoadingTasks && <p className="text-white text-center mb-4">Loading tasks...</p>}
      {errorTasks && <p className="text-red-500 text-center mb-4">Error loading tasks: {errorTasks}</p>}

      {/* Pie Chart and Employee Info Container */}
      <div className="relative z-10 w-full flex flex-col md:flex-row justify-center items-center gap-8 mb-8">
        {/* Pie Chart */}
        <div className="w-full md:w-2/5 bg-neutral-800 rounded-lg shadow-lg p-4 flex flex-col items-center">
          <h3 className="text-xl font-bold text-white mb-4">Task Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                dataKey="value"
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Employee Info */}
        {isLoadingEmployeeInfo && <p className="text-white text-center md:w-2/5">Loading employee info...</p>}
        {errorEmployeeInfo && <p className="text-red-500 text-center md:w-2/5">Error loading employee info: {errorEmployeeInfo}</p>}
        {!isLoadingEmployeeInfo && !errorEmployeeInfo && employeeInfo && (
          <div className="w-full md:w-2/5 bg-neutral-800 rounded-lg shadow-lg p-6 text-white">
            <h2 className="text-xl font-semibold mb-4 border-b border-neutral-600 pb-2">Employee Details</h2>
            <p className="mb-2"><strong>ID:</strong> {employeeInfo.empId}</p>
            <p className="mb-2"><strong>Name:</strong> {employeeInfo.name}</p>
            <p className="mb-2"><strong>Role:</strong> {employeeInfo.role}</p>
            <p className="mb-2"><strong>Mail ID:</strong> {employeeInfo.mailID}</p>
          </div>
        )}
        {!isLoadingEmployeeInfo && !errorEmployeeInfo && empIdSearch && !employeeInfo && (
          <div className="w-full md:w-2/5 bg-neutral-800 rounded-lg shadow-lg p-6 text-neutral-400 text-center">
            <p>No employee found with ID: {empIdSearch}</p>
          </div>
        )}
      </div>

      {/* NEW: Container for Tasks Table and Employee Accuracy Side-by-Side */}
      <div className="relative z-10 w-full md:w-[80%] mx-auto flex flex-col md:flex-row justify-center items-start gap-8 mb-8">
        {/* Tasks Table Section (Left Side) */}
        <div className="w-full md:w-3/5 flex flex-col">
          {/* Filter Buttons */}
          <div className="flex justify-start gap-2 mb-4">
            <button
              onClick={() => setTaskFilter('All')}
              className={cn(
                "px-4 py-2 rounded-md font-semibold transition-colors duration-200",
                taskFilter === 'All' ? "bg-blue-600 text-white" : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
              )}
            >
              All Tasks
            </button>
            <button
              onClick={() => setTaskFilter('Completed')}
              className={cn(
                "px-4 py-2 rounded-md font-semibold transition-colors duration-200",
                taskFilter === 'Completed' ? "bg-green-600 text-white" : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
              )}
            >
              Completed
            </button>
            <button
              onClick={() => setTaskFilter('Pending')}
              className={cn(
                "px-4 py-2 rounded-md font-semibold transition-colors duration-200",
                taskFilter === 'Pending' ? "bg-yellow-600 text-white" : "bg-neutral-700 text-neutral-300 hover:bg-neutral-600"
              )}
            >
              Pending
            </button>
          </div>

          {/* Tasks Table */}
          <div className="overflow-auto border border-neutral-700 rounded-lg max-h-[400px] bg-neutral-800 shadow-lg">
            <table className="min-w-full text-sm text-left border-collapse">
              <thead className="bg-neutral-700 text-white sticky top-0 z-20">
                <tr>
                  <th className="p-3 border border-neutral-600">Employee ID</th>
                  <th className="p-3 border border-neutral-600">Task ID</th>
                  <th className="p-3 border border-neutral-600">Task Name</th>
                  <th className="p-3 border border-neutral-600">Date</th>
                  <th className="p-3 border border-neutral-600">Assigned Time</th>
                  <th className="p-3 border border-neutral-600">Priority</th>
                  <th className="p-3 border border-neutral-600">Status</th>
                  <th className="p-3 border border-neutral-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map((task, idx) => (
                  <tr key={idx} className="bg-neutral-800 border-b border-neutral-700 hover:bg-neutral-700 transition-colors duration-200">
                    <td className="p-3 border border-neutral-700 text-neutral-200">{task.empId}</td>
                    <td className="p-3 border border-neutral-700 text-neutral-200">{task.taskId}</td>
                    <td className="p-3 border border-neutral-700 text-neutral-200">{task.task}</td>
                    <td className="p-3 border border-neutral-700 text-neutral-200">{task.date}</td>
                    <td className="p-3 border border-neutral-700 text-neutral-200">{task.assignedTime}</td>
                    <td className="p-3 border border-neutral-700 text-neutral-200">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-semibold",
                        task.priority === "High" ? "bg-red-500 text-white" : "bg-yellow-500 text-black"
                      )}>
                        {task.priority}
                      </span>
                    </td>
                    <td className="p-3 border border-neutral-700 text-neutral-200">
                      <span className={cn(
                        "px-2 py-1 rounded-full text-xs font-semibold",
                        task.status === "Completed" ? "bg-green-500 text-white" : "bg-blue-500 text-white"
                      )}>
                        {task.status}
                      </span>
                    </td>
                    <td className="p-3 border border-neutral-700 text-center">
                      {task.status !== "Completed" ? (
                        <button
                          onClick={() => onMarkComplete(task.taskId, task.empId)}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-3 rounded-md text-xs transition-colors duration-200"
                        >
                          Mark Complete
                        </button>
                      ) : (
                        <span className="text-green-400 text-xs">Done</span>
                      )}
                    </td>
                  </tr>
                ))}
                {filteredTasks.length === 0 && (
                  <tr>
                    <td colSpan="8" className="text-center p-6 text-neutral-400">
                      No tasks found for this employee ID or no tasks assigned.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* NEW: Employee Accuracy Section (Right Side) */}
        <div className="w-full md:w-2/5 p-6 bg-neutral-800 rounded-lg shadow-lg text-white max-h-[500px] overflow-y-auto">
          <h3 className="text-2xl font-bold mb-4 border-b border-neutral-600 pb-2">Employee Accuracy</h3>
          {isLoadingAllEmployees && <p className="text-neutral-400 text-center">Loading employee accuracy...</p>}
          {errorAllEmployees && <p className="text-red-500 text-center">Error: {errorAllEmployees}</p>}
          {!isLoadingAllEmployees && !errorAllEmployees && employeeAccuracyData.length === 0 && (
            <p className="text-neutral-400 text-center">No employee accuracy data available.</p>
          )}
          {!isLoadingAllEmployees && !errorAllEmployees && employeeAccuracyData.length > 0 && (
            <div className="space-y-4">
              {employeeAccuracyData.map((emp, index) => (
                <div key={emp.empId} className="bg-neutral-700 rounded-md p-3">
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-lg">{emp.name} ({emp.empId})</span>
                    <span className="text-xl font-bold text-blue-300">{emp.accuracy.toFixed(0)}%</span>
                  </div>
                  <div className="w-full bg-neutral-600 rounded-full h-2.5">
                    <div
                      className="bg-green-500 h-2.5 rounded-full transition-all duration-500 ease-out"
                      style={{ width: `${emp.accuracy}%` }}
                    ></div>
                  </div>
                  <p className="text-sm text-neutral-400 mt-1">
                    {emp.completedTasks} / {emp.totalTasks} tasks completed
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Group Discussion Section (Below the table and accuracy section)
      <div className="relative z-10 w-full md:w-[60%] mx-auto h-[500px] mt-8">
        <GroupDiscussion employeeInfo={employeeInfo} />
      </div> */}
    </div>
  );
};

// --- Main Performance_monitor Page Component (Default Export) ---
export default function Performance_monitor_page() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [empIdSearch, setEmpIdSearch] = useState("");
  const [employeeInfo, setEmployeeInfo] = useState(null);
  const [isLoadingTasks, setIsLoadingTasks] = useState(true);
  const [errorTasks, setErrorTasks] = useState(null);
  const [isLoadingEmployeeInfo, setIsLoadingEmployeeInfo] = useState(false);
  const [errorEmployeeInfo, setErrorEmployeeInfo] = useState(null);

  // NEW: State for task filter
  const [taskFilter, setTaskFilter] = useState('All'); // 'All', 'Completed', 'Pending'

  // NEW: State for all employees data (for accuracy calculation)
  const [allEmployees, setAllEmployees] = useState([]);
  const [isLoadingAllEmployees, setIsLoadingAllEmployees] = useState(true);
  const [errorAllEmployees, setErrorAllEmployees] = useState(null);


  // Derive currentUserName and currentUserRole after employeeInfo is declared
  const currentUserName = employeeInfo ? employeeInfo.name : "Gowtham";
  const currentUserRole = employeeInfo ? employeeInfo.role : "Manager";


  // Fetch all tasks initially
  useEffect(() => {
    const fetchTasks = async () => {
      setIsLoadingTasks(true);
      setErrorTasks(null);
      try {
        const response = await fetch("https://hrm-dashboard-xjqw.onrender.com/task_assigned");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
        setErrorTasks(error.message);
      } finally {
        setIsLoadingTasks(false);
      }
    };
    fetchTasks();
  }, []);

  // NEW: Fetch all employees for accuracy calculation
  useEffect(() => {
    const fetchAllEmployees = async () => {
      setIsLoadingAllEmployees(true);
      setErrorAllEmployees(null);
      try {
        const response = await fetch("https://hrm-dashboard-xjqw.onrender.com/employee_data"); // Assuming this endpoint returns all employees
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setAllEmployees(data);
      } catch (error) {
        console.error("Error fetching all employees:", error);
        setErrorAllEmployees(error.message);
      } finally {
        setIsLoadingAllEmployees(false);
      }
    };
    fetchAllEmployees();
  }, []); // Runs once on mount

  // Filter tasks based on search ID and new taskFilter
  useEffect(() => {
    const lowerCaseSearchId = empIdSearch.trim().toLowerCase();
    let currentFilteredTasks = tasks; // Start with all tasks

    if (lowerCaseSearchId) {
      currentFilteredTasks = currentFilteredTasks.filter(task =>
        task.empId.toLowerCase().includes(lowerCaseSearchId)
      );

      // Fetch employee info only if a search ID is provided
      const fetchEmployeeInfo = async () => {
        setIsLoadingEmployeeInfo(true);
        setErrorEmployeeInfo(null);
        try {
          const response = await fetch(`https://hrm-dashboard-xjqw.onrender.com/employee_data/empId/${lowerCaseSearchId}`);
          if (!response.ok) {
            if (response.status === 404) {
                setEmployeeInfo(null);
            } else {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
          } else {
            const data = await response.json();
            setEmployeeInfo(data);
          }
        } catch (error) {
          console.error("Error fetching employee info:", error);
          setErrorEmployeeInfo(error.message);
          setEmployeeInfo(null);
        } finally {
          setIsLoadingEmployeeInfo(false);
        }
      };
      fetchEmployeeInfo();

    } else {
      setEmployeeInfo(null); // Clear employee info when search is empty
    }

    // Apply task filter
    if (taskFilter === 'Completed') {
      currentFilteredTasks = currentFilteredTasks.filter(task => task.status === 'Completed');
    } else if (taskFilter === 'Pending') {
      currentFilteredTasks = currentFilteredTasks.filter(task => task.status === 'Pending');
    }

    setFilteredTasks(currentFilteredTasks);
  }, [empIdSearch, tasks, taskFilter]); // Re-run when search ID, all tasks, or task filter change

  // Calculate pie chart data based on filtered tasks
  const pieData = useMemo(() => {
    const completed = filteredTasks.filter(task => task.status === "Completed").length;
    const pending = filteredTasks.filter(task => task.status === "Pending").length;
    const total = completed + pending;

    if (total === 0) {
      return [{ name: "No Tasks", value: 1, fill: "#CCCCCC" }];
    }

    return [
      { name: "Tasks Completed", value: completed },
      { name: "Tasks Pending", value: pending },
    ];
  }, [filteredTasks]);

  const COLORS = ["#4CAF50", "#FFC107"];

  // NEW: Memoized calculation for employee accuracy
  const employeeAccuracyData = useMemo(() => {
    if (!allEmployees.length || !tasks.length) {
      return [];
    }

    const accuracyMap = new Map(); // Map to store { empId: { totalTasks, completedTasks } }

    // Initialize map with all employees
    allEmployees.forEach(emp => {
      accuracyMap.set(emp.empId, { totalTasks: 0, completedTasks: 0, name: emp.name });
    });

    // Populate task counts
    tasks.forEach(task => {
      const empId = task.empId;
      if (accuracyMap.has(empId)) {
        const empStats = accuracyMap.get(empId);
        empStats.totalTasks++;
        if (task.status === "Completed") {
          empStats.completedTasks++;
        }
        accuracyMap.set(empId, empStats);
      }
    });

    // Calculate accuracy percentage
    const calculatedAccuracy = Array.from(accuracyMap.entries()).map(([empId, stats]) => {
      const accuracy = stats.totalTasks > 0 ? (stats.completedTasks / stats.totalTasks) * 100 : 0;
      return {
        empId,
        name: stats.name,
        totalTasks: stats.totalTasks,
        completedTasks: stats.completedTasks,
        accuracy: accuracy
      };
    }).sort((a, b) => b.accuracy - a.accuracy); // Sort by accuracy descending

    return calculatedAccuracy;
  }, [allEmployees, tasks]); // Recalculate when allEmployees or tasks change

  // Function to handle marking a task as complete
  const handleMarkComplete = async (taskId, empId) => {
    // Optimistic UI update
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.taskId === taskId && task.empId === empId
          ? { ...task, status: "Completed" }
          : task
      )
    );

    try {
      const response = await fetch(`https://hrm-dashboard-xjqw.onrender.com/task_assigned/${taskId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: 'Completed' }),
      });

      if (!response.ok) {
        // Revert UI update on failure
        setTasks(prevTasks =>
          prevTasks.map(task =>
            task.taskId === taskId && task.empId === empId
              ? { ...task, status: "Pending" }
              : task
          )
        );
        throw new Error(`Failed to update task status: ${response.statusText}`);
      }
      // If successful, the onSnapshot listener for tasks will eventually re-fetch and confirm
      // For immediate consistency, you might want to re-fetch tasks or update the specific task in state
      // For this example, the optimistic update combined with the dependency array of employeeAccuracyData
      // and filteredTasks should handle updates fairly well.
    } catch (error) {
      console.error("Error marking task as complete:", error);
      // In a real app, use a custom modal/toast instead of alert
      alert(`Failed to mark task ${taskId} as complete: ${error.message}`);
    }
  };

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
      label: "Dashboard",
      href: "/Management_dashboard", // Absolute path
      icon: (
        <IconDashboard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
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
      label: "Group Discussion",
      href: "/Remove_employee", // Absolute path
      icon: (
        <IconMessages className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
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
  const [open, setOpen] = useState(false); // Sidebar open state

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
      <Dashboard
        filteredTasks={filteredTasks}
        empIdSearch={empIdSearch}
        setEmpIdSearch={setEmpIdSearch}
        employeeInfo={employeeInfo}
        pieData={pieData}
        COLORS={COLORS}
        isLoadingTasks={isLoadingTasks}
        isLoadingEmployeeInfo={isLoadingEmployeeInfo}
        errorTasks={errorTasks}
        errorEmployeeInfo={errorEmployeeInfo}
        onMarkComplete={handleMarkComplete}
        currentUserName={currentUserName}
        currentUserRole={currentUserRole}
        // NEW PROPS
        taskFilter={taskFilter}
        setTaskFilter={setTaskFilter}
        employeeAccuracyData={employeeAccuracyData}
        isLoadingAllEmployees={isLoadingAllEmployees}
        errorAllEmployees={errorAllEmployees}
      />
    </div>
  );
}