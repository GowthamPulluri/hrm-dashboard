'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
// No longer need styles/login.module.css if we're using pure Tailwind for new styles
// import styles from '../styles/login.module.css';
import { Boxes } from "../components/ui/background-boxes";
import { cn } from "@/lib/utils";
import { ColourfulText } from "@/components/ui/colourful-text";
import { motion } from "framer-motion";

export default function Home() {
    const [id, setId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');

        if (!id.trim() || !password.trim()) {
            setError('Please enter ID and Password.');
            return;
        }

        try {
            // --- Attempt Employee Login ---
            const employeeResponse = await fetch('https://hrm-dashboard-xjqw.onrender.com/employee_data');
            if (!employeeResponse.ok) {
                console.error(`Failed to fetch employee data: ${employeeResponse.status}`);
            }
            const employees = employeeResponse.ok ? await employeeResponse.json() : [];

            const matchedEmployee = employees.find(emp => emp.empId === id && emp.pass === password);

            if (matchedEmployee) {
                localStorage.setItem('loggedInEmployee', JSON.stringify(matchedEmployee));

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
                    name: matchedEmployee.name,
                    empId: matchedEmployee.empId,
                    Date: date,
                    login: loginTime
                };

                try {
                    const attendanceResponse = await fetch('https://hrm-dashboard-xjqw.onrender.com/emp_attendance', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(attendanceEntry)
                    });

                    if (!attendanceResponse.ok) {
                        const errorData = await attendanceResponse.json();
                        if (attendanceResponse.status === 400 && errorData.message === "Attendance already marked for today.") {
                            console.warn("Attendance already marked for today. Proceeding to employee dashboard.");
                        } else {
                            console.error(`Failed to record attendance: ${errorData.message || attendanceResponse.status}`);
                        }
                    }
                } catch (attendanceErr) {
                    console.error("Network or parsing error during attendance record:", attendanceErr);
                }

                setId('');
                setPassword('');
                setError('');
                router.push('/Employee_dashboard');
                return;
            }

            // --- If not an Employee, Attempt Management Login ---
            const managementResponse = await fetch('https://hrm-dashboard-xjqw.onrender.com/management_data');
            if (!managementResponse.ok) {
                throw new Error(`Failed to fetch management data: ${managementResponse.status}`);
            }
            const managers = await managementResponse.json();

            const matchedManager = managers.find(man => man.manId === id && man.password === password);

            if (matchedManager) {
                localStorage.setItem('loggedInAdmin', JSON.stringify(matchedManager));

                setId('');
                setPassword('');
                setError('');
                router.push('/Management_dashboard');
                return;
            }

            setError('Invalid ID or Password');

        } catch (err) {
            console.error("Error during login:", err);
            setError(err.message || 'An unexpected error occurred during login.');
        }
    };

    return (
        <div className="relative w-screen h-screen overflow-hidden flex flex-col md:flex-row items-center justify-center p-4">
            {/* Background Boxes */}
            <Boxes className="absolute inset-0 z-0" />

            {/* Company Info (Left/Top on small screens) */}
            <motion.div
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={cn(
                    "relative z-10 flex flex-col items-center md:items-start text-center md:text-left mb-8 md:mb-0 md:mr-16 lg:mr-24",
                    "w-full md:w-1/2 lg:w-2/5 p-4 md:p-8"
                )}
            >
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white drop-shadow-lg mb-4">
                    <ColourfulText text="Mahaveer     Solutions" />
                    
                </h1>
                <p className="text-lg md:text-xl text-neutral-300 max-w-md">
                    Empowering your workforce with intuitive HR solutions for seamless management and a productive environment.
                </p>
            </motion.div>

            {/* Combined Login Container (Right/Bottom on small screens) */}
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                className={cn(
                    "relative z-10 w-full max-w-sm p-8 rounded-2xl", // Increased rounded-ness
                    "bg-gradient-to-br from-blue-900/40 to-purple-900/40", // Subtle gradient background
                    "border border-white/20 shadow-2xl backdrop-blur-md", // Frosted glass effect
                    "group" // For group-hover effects
                )}
            >
                {/* Creative border glow effect */}
                {/* <div className="absolute inset-0 rounded-2xl p-px animate-border-glow">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-400/50 via-purple-400/50 to-pink-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div> */}

                <h2 className="text-white text-3xl font-bold text-center mb-8 relative z-10">Login</h2>
                <form onSubmit={handleLogin} className="space-y-6 relative z-10">
                    <div>
                        <label htmlFor="id" className="sr-only">ID</label>
                        <input
                            type="text"
                            id="id"
                            placeholder="Enter ID (Employee or Management)"
                            value={id}
                            onChange={(e) => setId(e.target.value)}
                            className={cn(
                                "w-full bg-white/10 text-white placeholder-neutral-300 border border-white/20 rounded-lg px-4 py-3 text-lg",
                                "transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400",
                                "hover:border-blue-300" // Subtle hover effect
                            )}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="password" className="sr-only">Password</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Enter Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={cn(
                                "w-full bg-white/10 text-white placeholder-neutral-300 border border-white/20 rounded-lg px-4 py-3 text-lg",
                                "transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400",
                                "hover:border-blue-300" // Subtle hover effect
                            )}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className={cn(
                            "w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold py-3 px-4 rounded-lg text-lg tracking-wide",
                            "shadow-lg transform active:scale-98 transition-all duration-300",
                            "hover:from-blue-700 hover:to-purple-700", // Darker hover effect
                            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
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
                </form>
            </motion.div>
        </div>
    );
}
