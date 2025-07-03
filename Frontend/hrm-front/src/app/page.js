'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from '../../styles/login.module.css'; // Keep your custom styles here
import { Boxes } from "../components/ui/background-boxes";
import { cn } from "@/lib/utils";
import { ColourfulText } from "@/components/ui/colourful-text";
import { motion } from "framer-motion"; // Import motion for animations

export default function Home() {
    const [empId, setEmpId] = useState('');
    const [pass, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    // Management login states
    const [manId, setManId] = useState('');
    const [managerPassword, setManagerPassword] = useState(''); // Renamed to avoid conflict with 'pass'
    const [manerror, setManError] = useState('');

    const handleLogin = async () => {
        setError(''); // Clear previous errors
        try {
            const employeeResponse = await fetch('https://hrm-dashboard-xjqw.onrender.com/employee_data');
            if (!employeeResponse.ok) {
                throw new Error(`Failed to fetch employee data: ${employeeResponse.status}`);
            }
            const employees = await employeeResponse.json();

            const matched = employees.find(emp => emp.empId === empId && emp.pass === pass);

            if (!matched) {
                setError('Invalid Employee ID or Password');
                return;
            }

            // Store logged-in employee data in localStorage
            localStorage.setItem('loggedInEmployee', JSON.stringify(matched));

            const now = new Date();
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();
            const date = `${day}-${month}-${year}`;

            const loginTime = now.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit'
            });

            const attendanceEntry = {
                name: matched.name,
                empId: matched.empId,
                Date: date,
                login: loginTime
            };

            // Attempt to record attendance
            const attendanceResponse = await fetch('https://hrm-dashboard-xjqw.onrender.com/emp_attendance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(attendanceEntry)
            });

            if (!attendanceResponse.ok) {
                const errorData = await attendanceResponse.json();
                // Check for the specific "Attendance already marked" error
                if (attendanceResponse.status === 400 && errorData.message === "Attendance already marked for today.") {
                    // This is not a critical error, just means attendance was already logged
                    console.warn("Attendance already marked for today. Proceeding to dashboard.");
                    // You might want to show a subtle message to the user here
                } else {
                    // For other attendance-related errors, throw an error
                    throw new Error(errorData.message || `Failed to record attendance: ${attendanceResponse.status}`);
                }
            }

            setEmpId('');
            setPassword('');
            setError(''); // Clear error before redirect
            router.push('/Employee_dashboard');

        } catch (err) {
            console.error("Error during employee login:", err);
            setError(err.message || 'Error during employee login'); // Display the specific error message
        }
    };

    const handleManLogin = async () => {
        setManError(''); // Clear previous errors
        try {
            const response = await fetch('https://hrm-dashboard-xjqw.onrender.com/management_data');
            if (!response.ok) {
                throw new Error(`Failed to fetch management data: ${response.status}`);
            }
            const managers = await response.json();

            const matched = managers.find(man => man.manId === manId && man.password === managerPassword);

            if (!matched) {
                setManError('Invalid Management ID or Password');
                return;
            }

            // Store logged-in management data in localStorage
            localStorage.setItem('loggedInAdmin', JSON.stringify(matched));

            setManId('');
            setManagerPassword('');
            setManError(''); // Clear error before redirect
            router.push('/Management_dashboard');
        } catch (err) {
            console.error("Error during management login:", err);
            setManError(err.message || 'Error during management login'); // Display the specific error message
        }
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden flex flex-col items-center justify-center p-4">
            {/* Background Boxes */}
            <Boxes className="absolute inset-0 z-0" />

            {/* Main Heading */}
            <motion.h1
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={cn(
                    "relative z-10 text-4xl md:text-6xl lg:text-7xl font-extrabold text-white mb-12 drop-shadow-lg",
                    "text-center"
                )}
            >
                <ColourfulText text="Mahaveer Solutions" />
            </motion.h1>

            {/* Main Login Container */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className={cn(
                    styles.container,
                    "relative z-10 w-full max-w-4xl"
                )}
            >
                <div className={cn(
                    styles.overlay,
                    "flex-col md:flex-row"
                )}>
                    {/* Employee Login Box */}
                    <div className={cn(
                        styles.loginBox,
                        styles.employerBox,
                        "flex-1"
                    )}>
                        <h2 className="text-white text-center">Employee Login</h2>
                        <input
                            type="text"
                            placeholder="Enter Employee ID"
                            value={empId}
                            onChange={(e) => setEmpId(e.target.value)}
                            className={cn(
                                styles.inputField,
                                "bg-white text-black placeholder-neutral-500",
                                "focus:outline-none focus:ring-2 focus:ring-blue-300"
                            )}
                        />
                        <input
                            type="password"
                            placeholder="Enter Password"
                            value={pass}
                            onChange={(e) => setPassword(e.target.value)}
                            className={cn(
                                styles.inputField,
                                "bg-white text-black placeholder-neutral-500",
                                "focus:outline-none focus:ring-2 focus:ring-blue-300"
                            )}
                        />
                        <button
                            onClick={handleLogin}
                            className={cn(
                                styles.button,
                                "bg-white text-black hover:bg-gray-200 transition-colors duration-200",
                                "focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-current"
                            )}
                        >
                            Login
                        </button>
                        {error && <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-4 text-sm font-medium text-yellow-300 text-center"
                        >
                            {error}
                        </motion.p>}
                    </div>

                    {/* Management Login Box */}
                    <div className={cn(
                        styles.loginBox,
                        styles.managementBox,
                        "flex-1"
                    )}>
                        <h2 className="text-white text-center">Management Login</h2>
                        <input
                            type="text"
                            placeholder="Enter Management ID"
                            value={manId}
                            onChange={(e) => setManId(e.target.value)}
                            className={cn(
                                styles.inputField,
                                "bg-white text-black placeholder-neutral-500",
                                "focus:outline-none focus:ring-2 focus:ring-red-300"
                            )}
                        />
                        <input
                            type="password"
                            placeholder="Enter Password"
                            value={managerPassword}
                            onChange={(e) => setManagerPassword(e.target.value)}
                            className={cn(
                                styles.inputField,
                                "bg-white text-black placeholder-neutral-500",
                                "focus:outline-none focus:ring-2 focus:ring-red-300"
                            )}
                        />
                        <button
                            onClick={handleManLogin}
                            className={cn(
                                styles.button,
                                "bg-white text-black hover:bg-gray-200 transition-colors duration-200",
                                "focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-current"
                            )}
                        >
                            Login
                        </button>
                        {manerror && <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="mt-4 text-sm font-medium text-yellow-300 text-center"
                        >
                            {manerror}
                        </motion.p>}
                    </div>
                </div>
            </motion.div>
        </div>
    );
}