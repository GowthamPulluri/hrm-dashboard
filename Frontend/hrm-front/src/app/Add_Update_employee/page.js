"use client";
import React, { useState, useEffect } from "react";
import { useSearchParams } from 'next/navigation';
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
  const initialEmpId = searchParams.get('empId');

  const [open, setOpen] = useState(false);
  const [loggedInEmployee, setLoggedInEmployee] = useState(null);

  const [name, setName] = useState('');
  const [empId, setEmpId] = useState(initialEmpId || '');
  const [password, setPassword] = useState('');
  const [mailID, setMailID] = useState('');
  const [role, setRole] = useState('Software Developer');
  const [age, setAge] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [isUpdateMode, setIsUpdateMode] = useState(!!initialEmpId); // Initial state based on URL param presence

  // Log initial component render and state
  useEffect(() => {
    console.log('--- Component Render/Initial State Check ---');
    console.log('URL initialEmpId:', initialEmpId);
    console.log('isUpdateMode (from useState initialiser):', !!initialEmpId);
    console.log('Current empId state:', empId);
    console.log('-------------------------------------------');
  }, [initialEmpId, empId]);

  // Fetch logged-in employee from localStorage
  useEffect(() => {
    const storedEmployee = localStorage.getItem('loggedInEmployee');
    if (storedEmployee) {
      setLoggedInEmployee(JSON.parse(storedEmployee));
    }
  }, []);

  // Effect to fetch employee data if in update mode
  useEffect(() => {
    console.log('--- useEffect for Data Fetching Triggered ---');
    console.log('Inside useEffect. initialEmpId:', initialEmpId);
    console.log('isUpdateMode (current state in useEffect scope):', isUpdateMode);

    if (initialEmpId) {
      console.log(`initialEmpId is present (${initialEmpId}). Attempting to fetch employee data.`);
      const fetchEmployeeData = async () => {
        try {
          const response = await fetch(`http://localhost:3000/employee_data/empId/${initialEmpId}`);
          console.log(`Fetch response status for ${initialEmpId}:`, response.status);

          if (response.ok) {
            const data = await response.json();
            console.log('Employee data fetched successfully:', data);
            setName(data.name || '');
            setPassword(data.pass || '');
            setMailID(data.mailID || '');
            setRole(data.role || 'Software Developer');
            setAge(data.age || '');
            setImageUrl(data.imageUrl || '');
            setIsUpdateMode(true); // Explicitly set to true after successful fetch
            setEmpId(initialEmpId); // Ensure empId state is correctly set from URL
            setStatusMessage('');
            console.log('isUpdateMode set to TRUE after successful data fetch.');
          } else {
            const errorText = await response.text();
            console.error(`Fetch failed with status ${response.status} for ${initialEmpId}:`, errorText);

            if (response.status === 404) {
              setStatusMessage(`Employee with ID ${initialEmpId} not found for update. Switching to Add mode.`);
              setIsUpdateMode(false); // If not found, it's an add operation
              console.log('isUpdateMode set to FALSE (404 Not Found).');
            } else {
              setStatusMessage(`Error fetching employee data: ${response.status} - ${errorText.substring(0, 100)}...`);
              // If it's a server error, we still want to be in update mode if the URL suggests it
              // so the user can retry.
              setIsUpdateMode(true); // Keep update mode if it's a server error, user might retry
              console.log('isUpdateMode remains TRUE (server error during fetch).');
            }
          }
        } catch (error) {
          console.error('Network or parsing error fetching employee data:', error);
          setStatusMessage(`Network error fetching employee data: ${error.message}. Please check server connection.`);
          setIsUpdateMode(false); // If network error, can't update, revert to add mode.
          console.log('isUpdateMode set to FALSE (network/parsing error).');
        }
      };
      fetchEmployeeData();
    } else {
        console.log('initialEmpId is NOT present in URL. Ensuring Add mode.');
        setIsUpdateMode(false); // Explicitly ensure add mode if no empId in URL
    }
    console.log('-------------------------------------------');
  }, [initialEmpId, isUpdateMode]); // <<<--- CORRECTED LINE: Added isUpdateMode to dependencies

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage('Processing...');

    // Log the mode right before submission
    console.log('--- Form Submission Triggered ---');
    console.log('Submitting form. isUpdateMode (at submit time):', isUpdateMode);
    console.log('Submitting empId (from state):', empId);
    console.log('---------------------------------');

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
        response = await fetch(`http://localhost:3000/employee_data/${empId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(employeeData),
        });
      } else {
        console.log('Making POST request to add new employee:', employeeData);
        response = await fetch('http://localhost:3000/employee_data', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(employeeData),
        });
      }

      if (response.ok) {
        setStatusMessage(`Employee ${isUpdateMode ? 'updated' : 'added'} successfully!`);
        if (!isUpdateMode) {
          setName('');
          setEmpId('');
          setPassword('');
          setMailID('');
          setRole('Software Developer');
          setAge('');
          setImageUrl('');
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
              statusMessage.includes("successfully") ? "bg-green-600" : "bg-red-600"
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
                disabled={isUpdateMode} // Disable input in update mode
              />
              {isUpdateMode && (
                <p className="text-neutral-400 text-xs mt-1">Employee ID cannot be changed in update mode.</p>
              )}
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
            >
              {isUpdateMode ? 'Update Employee' : 'Add Employee'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}