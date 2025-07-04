"use client";
import React, { useState, useEffect, useRef, useCallback } from "react"; // Added useCallback
import { useSearchParams, useRouter } from 'next/navigation';
import styles from '../../../styles/management_dashboard.module.css';

import { ColourfulText } from "@/components/ui/colourful-text";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
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
import { cn } from "@/lib/utils";

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

export default function Add_Update_employee() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const initialEmpIdFromURL = searchParams.get('empId');

    const [open, setOpen] = useState(false);
    const [loggedInEmployee, setLoggedInEmployee] = useState(null);

    const [name, setName] = useState('');
    const [empId, setEmpId] = useState('');
    const [password, setPassword] = useState('');
    const [mailID, setMailID] = useState('');
    const [role, setRole] = useState('Software Developer');
    const [age, setAge] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const [isUpdateMode, setIsUpdateMode] = useState(false);
    const [isLoadingEmpData, setIsLoadingEmpData] = useState(false); // New state for loading

    const isInitialMount = useRef(true);
    const debounceTimeoutRef = useRef(null); // Ref for debounce timer

    // Memoized function to fetch employee data
    const fetchEmployeeData = useCallback(async (idToFetch, source = 'URL') => {
        if (!idToFetch) {
            console.log(`No ID to fetch from ${source}. Clearing form.`);
            setIsUpdateMode(false);
            setName('');
            setEmpId('');
            setPassword('');
            setMailID('');
            setRole('Software Developer');
            setAge('');
            setImageUrl('');
            setStatusMessage('');
            return;
        }

        setIsLoadingEmpData(true);
        setStatusMessage(`Fetching employee data for ID: ${idToFetch}...`);
        try {
            const response = await fetch(`https://hrm-dashboard-xjqw.onrender.com/employee_data/empId/${idToFetch}`);
            console.log(`Fetch response status for ${idToFetch} (from ${source}):`, response.status);

            if (response.ok) {
                const data = await response.json();
                console.log(`Employee data fetched successfully for ${idToFetch} (from ${source}):`, data);
                setName(data.name || '');
                setPassword(data.pass || '');
                setMailID(data.mailID || '');
                setRole(data.role || 'Software Developer');
                setAge(data.age || '');
                setImageUrl(data.imageUrl || '');
                setEmpId(idToFetch); // Ensure empId state matches fetched ID
                setIsUpdateMode(true); // Switch to update mode
                setStatusMessage(`Employee ${idToFetch} loaded successfully.`);
            } else {
                const errorText = await response.text();
                console.error(`Fetch failed with status ${response.status} for ${idToFetch} (from ${source}):`, errorText);

                if (response.status === 404) {
                    setStatusMessage(`Employee with ID ${idToFetch} not found. Ready to Add New Employee.`);
                    // Keep empId as is if user typed it, but switch to add mode
                    setIsUpdateMode(false);
                    setName('');
                    setPassword('');
                    setMailID('');
                    setRole('Software Developer');
                    setAge('');
                    setImageUrl('');
                } else {
                    setStatusMessage(`Error fetching employee data: ${response.status} - ${errorText.substring(0, 100)}...`);
                    // If server error, assume update mode if a valid ID was attempted
                    setIsUpdateMode(true); // Stay in update mode if initial fetch error, user might retry
                }
            }
        } catch (error) {
            console.error(`Network or parsing error fetching employee data for ${idToFetch} (from ${source}):`, error);
            setStatusMessage(`Network error fetching employee data: ${error.message}. Please check server connection.`);
            setIsUpdateMode(false); // Network error, revert to add mode
            setName('');
            setPassword('');
            setMailID('');
            setRole('Software Developer');
            setAge('');
            setImageUrl('');
        } finally {
            setIsLoadingEmpData(false);
            setTimeout(() => setStatusMessage(''), 5000); // Clear status after 5 seconds
        }
    }, []); // Empty dependency array, as it's a utility function

    // Effect for initial load or URL changes
    useEffect(() => {
        console.log('--- useEffect for URL initialEmpIdFromURL Triggered ---');
        console.log('initialEmpIdFromURL:', initialEmpIdFromURL);

        if (initialEmpIdFromURL) {
            fetchEmployeeData(initialEmpIdFromURL, 'URL');
        } else {
            // No empId in URL, ensure add mode and clear fields
            fetchEmployeeData(null); // Call with null to clear form
        }
    }, [initialEmpIdFromURL, fetchEmployeeData]); // Depends on initialEmpIdFromURL and fetchEmployeeData

    // Effect for debouncing empId input and triggering fetch
    useEffect(() => {
        if (isInitialMount.current) {
            isInitialMount.current = false;
            return; // Skip on first render
        }

        // Do not trigger fetch if we are in update mode already based on a valid URL empId
        // or if the empId is coming from the URL and not user input
        if (isUpdateMode && empId === initialEmpIdFromURL) {
            return;
        }

        // Clear previous timeout
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }

        // Set a new timeout to fetch after user stops typing
        if (empId.trim().length > 0) { // Only fetch if empId is not empty
            debounceTimeoutRef.current = setTimeout(() => {
                console.log(`Debounced empId changed to: ${empId}. Attempting fetch.`);
                fetchEmployeeData(empId, 'Input');
                // Also update URL immediately when debounced ID is ready
                const currentUrlEmpId = searchParams.get('empId');
                if (currentUrlEmpId !== empId) {
                    router.replace(`/Add_Update_employee${empId ? `?empId=${empId}` : ''}`);
                }
            }, 500); // 500ms debounce
        } else {
            // If empId is cleared, revert to add mode and clear URL
            fetchEmployeeData(null); // Clear form state
            router.replace('/Add_Update_employee');
        }

        // Cleanup function
        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [empId, fetchEmployeeData, isUpdateMode, initialEmpIdFromURL, router, searchParams]);


    // Fetch logged-in employee from localStorage (remains unchanged)
    useEffect(() => {
        const storedEmployee = localStorage.getItem('loggedInEmployee');
        if (storedEmployee) {
            setLoggedInEmployee(JSON.parse(storedEmployee));
        }
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatusMessage('Processing...');

        if (!name.trim() || !empId.trim() || !password.trim() || !mailID.trim() || !role.trim() || !age) {
            setStatusMessage('Please fill in all required fields.');
            return;
        }

        const employeeData = {
            name,
            empId,
            pass: password,
            mailID,
            role,
            age: parseInt(age),
            imageUrl: imageUrl || `https://placehold.co/150x150/000000/FFFFFF?text=${name.charAt(0)}`,
        };

        try {
            let response;
            if (isUpdateMode) {
                console.log('Making PUT request to update employee:', employeeData);
                response = await fetch(`https://hrm-dashboard-xjqw.onrender.com/employee_data/${empId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(employeeData),
                });
            } else {
                console.log('Making POST request to add new employee:', employeeData);
                response = await fetch('https://hrm-dashboard-xjqw.onrender.com/employee_data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(employeeData),
                });
            }

            if (response.ok) {
                setStatusMessage(`Employee ${isUpdateMode ? 'updated' : 'added'} successfully!`);
                if (!isUpdateMode) {
                    // Force a full refresh/redirect to ensure all
                    // initial states and effects are re-evaluated based on the new URL.
                    window.location.href = `/Add_Update_employee?empId=${empId}`;
                }
            } else {
                const errorText = await response.text();
                console.error(`API response not OK (status ${response.status}):`, errorText);
                let errorMessage = `Failed to ${isUpdateMode ? 'update' : 'add'} employee: ${response.statusText}`;
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = `Failed to ${isUpdateMode ? 'update' : 'add'} employee: ${errorData.message || errorData.error || response.statusText}`;
                } catch (e) {
                    errorMessage = `Failed to ${isUpdateMode ? 'update' : 'add'} employee: Server responded with non-JSON error: ${errorText.substring(0, 100)}...`;
                }
                setStatusMessage(errorMessage);
            }
        } catch (error) {
            console.error(`Network or unexpected error during ${isUpdateMode ? 'update' : 'add'} operation:`, error);
            setStatusMessage(`Network error: ${error.message}. Please check server connection.`);
        }
        setTimeout(() => setStatusMessage(''), 5000);
    };

    const handleDelete = async () => {
        if (!empId) {
            setStatusMessage('No Employee ID specified for deletion.');
            return;
        }

        if (!window.confirm(`Are you sure you want to delete employee with ID: ${empId} (${name})? This action cannot be undone.`)) {
            return;
        }

        setStatusMessage('Deleting employee...');
        try {
            const response = await fetch(`https://hrm-dashboard-xjqw.onrender.com/employee_data/${empId}`, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
            });

            if (response.ok) {
                setStatusMessage('Employee deleted successfully!');
                window.location.href = '/Add_Update_employee';
            } else {
                const errorText = await response.text();
                console.error(`API response not OK (status ${response.status}):`, errorText);
                let errorMessage = `Failed to delete employee: ${response.statusText}`;
                try {
                    const errorData = JSON.parse(errorText);
                    errorMessage = `Failed to delete employee: ${errorData.message || errorData.error || response.statusText}`;
                } catch (e) {
                    errorMessage = `Failed to delete employee: Server responded with non-JSON error: ${errorText.substring(0, 100)}...`;
                }
                setStatusMessage(errorMessage);
            }
        } catch (error) {
            console.error('Network or unexpected error during delete operation:', error);
            setStatusMessage(`Network error: ${error.message}. Please check server connection.`);
        }
        setTimeout(() => setStatusMessage(''), 5000);
    };

    const links = [
        { label: "Attendance Tracker", href: "/Attendance_tracker", icon: <IconClockHour4 className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> },
        { label: "Employee Database", href: "/Employee_database", icon: <IconDatabase className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> },
        { label: "Performance Monitor", href: "/Performance_monitor", icon: <IconChartLine className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> },
        { label: "Dashboard", href: "/Management_dashboard", icon: <IconDashboard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> },
        { label: "Group Discussion", href: "/Remove_employee", icon: <IconMessages className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" /> },
        {
            label: "Payroll Management",
            href: "/Payroll_management",
            icon: <IconReceipt2 className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
        },
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
                <div className={cn("relative z-10 w-full mb-8", styles.company_name)}>
                    <h1 className="text-2xl md:text-5xl lg:text-7xl font-bold text-center text-white relative z-2 font-sans">
                        <ColourfulText text="Mahaveer<br />Solutions" />
                    </h1>
                    <h1 className="text-xl md:text-3xl font-bold text-center text-white relative z-2 mt-4">
                        {isUpdateMode ? 'Update Employee Details' : 'Add New Employee'}
                    </h1>
                    <h2 className="text-lg md:text-xl text-center text-white relative z-2 mt-2">
                        {isUpdateMode ? 'Modify existing employee information.' : 'Register new employees here.'}
                    </h2>
                </div>

                <div className="relative z-10 w-full md:w-2/3 lg:w-1/2 p-6 bg-neutral-800 rounded-lg shadow-lg text-white mb-8">
                    <h3 className="text-2xl font-bold mb-4 border-b border-neutral-600 pb-2">
                        {isUpdateMode ? `Update Details for ${name || 'Employee'}` : 'New Employee Registration'}
                    </h3>

                    {statusMessage && (
                        <div className={cn(
                            "p-3 rounded-md mb-4 text-center",
                            // Changed this line to always apply bg-green-600
                            "bg-green-600"
                        )}>
                            {statusMessage}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-neutral-300 text-sm font-semibold mb-2">Name:</label>
                            <input
                                type="text"
                                id="name"
                                className="w-full px-4 py-2 rounded-md border border-neutral-600 bg-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter employee's full name"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="empId" className="block text-neutral-300 text-sm font-semibold mb-2">Employee ID:</label>
                            <input
                                type="text"
                                id="empId"
                                className="w-full px-4 py-2 rounded-md border border-neutral-600 bg-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Unique Employee ID (e.g., 22A81A1401)"
                                value={empId}
                                onChange={(e) => setEmpId(e.target.value)}
                                required
                                // empId field is ONLY disabled if in update mode AND the empId currently in state
                                // matches the one that came from the URL. This prevents disabling it
                                // when a user is typing a new ID, even if the previous state was 'update'.
                                // disabled={isUpdateMode && empId === initialEmpIdFromURL}
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-neutral-300 text-sm font-semibold mb-2">Password:</label>
                            <input
                                type="password"
                                id="password"
                                className="w-full px-4 py-2 rounded-md border border-neutral-600 bg-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="mailID" className="block text-neutral-300 text-sm font-semibold mb-2">Email ID:</label>
                            <input
                                type="email"
                                id="mailID"
                                className="w-full px-4 py-2 rounded-md border border-neutral-600 bg-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter employee's email address"
                                value={mailID}
                                onChange={(e) => setMailID(e.target.value)}
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="role" className="block text-neutral-300 text-sm font-semibold mb-2">Role:</label>
                            <select
                                id="role"
                                className="w-full px-4 py-2 rounded-md border border-neutral-600 bg-neutral-700 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                required
                            >
                                <option value="Software Developer">Software Developer</option>
                                <option value="Automation Tester">Automation Tester</option>
                                <option value="Project Manager">Project Manager</option>
                                <option value="UI/UX Designer">UI/UX Designer</option>
                                <option value="HR Specialist">HR Specialist</option>
                                <option value="QA Engineer">QA Engineer</option>
                                <option value="DevOps Engineer">DevOps Engineer</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="age" className="block text-neutral-300 text-sm font-semibold mb-2">Age:</label>
                            <input
                                type="number"
                                id="age"
                                className="w-full px-4 py-2 rounded-md border border-neutral-600 bg-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Enter employee's age"
                                value={age}
                                onChange={(e) => setAge(e.target.value)}
                                min="18"
                                max="100"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="imageUrl" className="block text-neutral-300 text-sm font-semibold mb-2">Image URL (Optional):</label>
                            <input
                                type="url"
                                id="imageUrl"
                                className="w-full px-4 py-2 rounded-md border border-neutral-600 bg-neutral-700 text-white placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="e.g., https://example.com/image.jpg"
                                value={imageUrl}
                                onChange={(e) => setImageUrl(e.target.value)}
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200"
                            disabled={isLoadingEmpData} // Disable submit while fetching
                        >
                            {isUpdateMode ? 'Update Employee' : 'Add Employee'}
                        </button>

                        {isUpdateMode && (
                            <button
                                type="button"
                                onClick={handleDelete}
                                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md transition-colors duration-200 mt-4"
                                disabled={isLoadingEmpData} // Disable delete while fetching
                            >
                                Delete Employee
                            </button>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
