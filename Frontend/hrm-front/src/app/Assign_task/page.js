"use client";
import React, { useState, useEffect, Suspense } from 'react'; // Import Suspense
import { useSearchParams, useRouter } from 'next/navigation';
import { cn } from "@/lib/utils";
import { ColourfulText } from "@/components/ui/colourful-text";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import styles from '../../../styles/management_dashboard.module.css';
import {
    IconCalendarStats,
    IconChartLine,
    IconUsers,
    IconArrowLeft,
    IconInfoCircle,
    IconNews,
    IconTerminal,
    IconDashboard,
    IconDatabase,
    IconUserPlus,
    IconMessages,
    IconClockHour4,
    IconHammer,
    IconClipboardList,
    IconMail,
    IconActivity,
    IconReceipt2,
} from "@tabler/icons-react";
import { motion } from "framer-motion";

// Re-using Logo components from Employee_database for consistency
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

// Create a separate component that uses useSearchParams directly
function AssignTaskContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const employeeId = searchParams.get('empId');
    const [employeeName, setEmployeeName] = useState('Loading...');
    const [taskName, setTaskName] = useState(''); // New state for Task Name
    const [taskDescription, setTaskDescription] = useState(''); // Existing state for Description
    const [taskPriority, setTaskPriority] = useState('Normal');
    const [assignDate, setAssignDate] = useState('');
    const [assignTime, setAssignTime] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [open, setOpen] = useState(false); // Sidebar open state
    const [loggedInEmployee, setLoggedInEmployee] = useState(null); // For logged-in user display

    // Fetch logged-in employee from localStorage
    useEffect(() => {
        const storedEmployee = localStorage.getItem('loggedInEmployee');
        if (storedEmployee) {
            setLoggedInEmployee(JSON.parse(storedEmployee));
        }
    }, []);

    // Auto-set current date and time on component mount
    useEffect(() => {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');

        setAssignDate(`${year}-${month}-${day}`);
        setAssignTime(`${hours}:${minutes}`);
    }, []);

    // Fetch employee name based on ID
    useEffect(() => {
        if (employeeId) {
            const fetchEmployeeName = async () => {
                try {
                    const response = await fetch(`https://hrm-dashboard-xjqw.onrender.com/employee_data/empId/${employeeId}`);
                    if (response.ok) {
                        const data = await response.json();
                        setEmployeeName(data.name || 'Unknown Employee');
                    } else {
                        setEmployeeName('Employee Not Found');
                        console.error('Failed to fetch employee name');
                    }
                } catch (error) {
                    setEmployeeName('Error fetching employee');
                    console.error('Error fetching employee name:', error);
                }
            };
            fetchEmployeeName();
        } else {
            setEmployeeName('No Employee Selected');
        }
    }, [employeeId]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage('Assigning task...');

        if (!employeeId) {
            setStatusMessage('Error: No employee selected.');
            return;
        }
        // Validate both taskName and taskDescription
        if (!taskName.trim() || !taskDescription.trim() || !assignDate || !assignTime) {
            setStatusMessage('Please fill in all task details (Task Name, Description, Date, and Time).');
            return;
        }

        // Construct the task object to send to the backend
        // The backend expects 'task', 'description', 'date', 'assignedTime', 'priority' in the body.
        // 'taskId' and 'empId' are handled by the backend (taskId generated, empId from URL param).
        const taskDataToSend = {
            task: taskName, // This is the 'task' field for the backend (now Task Name)
            description: taskDescription, // New 'description' field for the backend
            date: assignDate,
            assignedTime: assignTime,
            priority: taskPriority,
        };

        try {
            // Use the backend endpoint: POST /task_assigned/:empId
            const response = await fetch(`https://hrm-dashboard-xjqw.onrender.com/task_assigned/${employeeId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(taskDataToSend),
            });

            if (response.ok) {
                setStatusMessage('Task assigned successfully!');
                // Clear form fields after successful submission
                setTaskName(''); // Clear new task name field
                setTaskDescription('');
                setTaskPriority('Normal');
                // Date and time are auto-set, so no need to clear them, they will update to current
                // setAssignDate('');
                // setAssignTime('');
                // Optionally, redirect back to performance monitor or employee database
                // setTimeout(() => router.push('/Performance_monitor'), 2000);
            } else {
                const errorData = await response.json();
                setStatusMessage(`Failed to assign task: ${errorData.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Error assigning task:', error);
            setStatusMessage(`Error assigning task: ${error.message}`);
        }
        setTimeout(() => setStatusMessage(''), 3000); // Clear status message after 3 seconds
    };

    const links = [
        { label: "Dashboard", href: "/Management_dashboard", icon: <IconDashboard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> },
        { label: "Attendance Tracker", href: "/Attendance_tracker", icon: <IconClockHour4 className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> },
        { label: "Employee Database", href: "/Employee_database", icon: <IconDatabase className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> },
        { label: "Performance Monitor", href: "/Performance_monitor", icon: <IconChartLine className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> },
        { label: "Add / Update details", href: "/Add_Update_employee", icon: <IconUserPlus className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> },
        { label: "Payroll Management", href: "/Payroll_management", icon: <IconReceipt2 className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> },
        { label: "Group Discussion", href: "/Remove_employee", icon: <IconMessages className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> },
        { label: "About", href: "/About_page", icon: <IconInfoCircle className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> },
        { label: "Logout", href: "/", icon: <IconArrowLeft className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> },
    ];

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

            <div className="relative flex flex-1 flex-col justify-start items-center overflow-auto p-4 dark:bg-neutral-900">
                {/* Background Beams */}
                {/* <BackgroundBeamsWithCollision /> Uncomment if you want beams here */}

                {/* Company Name and Welcome Message */}
                <div className={cn("relative z-10 w-full mb-8", styles.company_name)}>
                    {/* <motion.img
                        src="https://wallpapercave.com/wp/nTwzv3B.jpg"
                        className="h-full w-full object-cover absolute inset-0 [mask-image:radial-gradient(circle,transparent,black_80%)] pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        transition={{ duration: 1 }}
                    /> */}
                    {loggedInEmployee && (
                        <div className="absolute top-4 right-4 bg-neutral-800 text-white rounded-lg p-4 shadow-md text-left z-20">
                            <h4 className="text-lg font-semibold mb-2 border-b border-neutral-700 pb-1">Logged In</h4>
                            <p className="text-sm"><strong>Name:</strong> {loggedInEmployee.name}</p>
                            <p className="text-sm"><strong>ID:</strong> {loggedInEmployee.empId}</p>
                            <p className="text-sm"><strong>Role:</strong> {loggedInEmployee.role || 'Employee'}</p>
                        </div>
                    )}
                    <h1 className="text-2xl md:text-5xl lg:text-7xl font-bold text-center text-white relative z-2 font-sans">
                        <ColourfulText text="Mahaveer Solutions" />
                    </h1>
                    <h1 className="text-xl md:text-3xl font-bold text-center text-white relative z-2 mt-4">Assign Task</h1>
                    <h2 className="text-lg md:text-xl text-center text-white relative z-2 mt-2">Assign tasks to employees efficiently.</h2>
                </div>

                {/* Assign Task Form */}
                <div className="relative z-10 w-full md:w-2/3 lg:w-1/2 p-6 bg-neutral-800 rounded-lg shadow-lg text-white">
                    <h3 className="text-2xl font-bold mb-4 border-b border-neutral-600 pb-2">Assign Task to: {employeeName} (ID: {employeeId || 'N/A'})</h3>

                    {statusMessage && (
                        <div className={cn(
                            "p-3 rounded-md mb-4 text-center",
                            statusMessage.includes("successfully") ? "bg-green-600" : "bg-red-600"
                        )}>
                            {statusMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="taskName" className="block text-neutral-300 text-sm font-semibold mb-2">Task Name:</label>
                            <input
                                type="text"
                                id="taskName"
                                className="w-full px-4 py-2 rounded-md border border-neutral-600 bg-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter task name (e.g., Design UI)"
                                value={taskName}
                                onChange={(e) => setTaskName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="taskDescription" className="block text-neutral-300 text-sm font-semibold mb-2">Task Description:</label>
                            <textarea
                                id="taskDescription"
                                className="w-full px-4 py-2 rounded-md border border-neutral-600 bg-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows="4"
                                placeholder="Provide a detailed description of the task..."
                                value={taskDescription}
                                onChange={(e) => setTaskDescription(e.target.value)}
                                required
                            ></textarea>
                        </div>
                        <div>
                            <label htmlFor="taskPriority" className="block text-neutral-300 text-sm font-semibold mb-2">Priority:</label>
                            <select
                                id="taskPriority"
                                className="w-full px-4 py-2 rounded-md border border-neutral-600 bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={taskPriority}
                                onChange={(e) => setTaskPriority(e.target.value)}
                            >
                                <option value="High">High</option>
                                <option value="Normal">Normal</option>
                                <option value="Low">Low</option>
                            </select>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="assignDate" className="block text-neutral-300 text-sm font-semibold mb-2">Assign Date:</label>
                                <input
                                    type="date"
                                    id="assignDate"
                                    className="w-full px-4 py-2 rounded-md border border-neutral-600 bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={assignDate}
                                    onChange={(e) => setAssignDate(e.target.value)}
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor="assignTime" className="block text-neutral-300 text-sm font-semibold mb-2">Assigned Time:</label>
                                <input
                                    type="time"
                                    id="assignTime"
                                    className="w-full px-4 py-2 rounded-md border border-neutral-600 bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    value={assignTime}
                                    onChange={(e) => setAssignTime(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
                        >
                            Assign Task
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}

// The default export for the page should wrap the main content in Suspense
export default function Assign_task_PageWrapper() {
    return (
        <Suspense fallback={<div>Loading task assignment form...</div>}>
            <AssignTaskContent />
        </Suspense>
    );
}