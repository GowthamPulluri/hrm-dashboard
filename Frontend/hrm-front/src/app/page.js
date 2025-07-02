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
    try {
      const response = await fetch('http://localhost:3000/employee_data');
      const employees = await response.json();

      const matched = employees.find(emp => emp.empId === empId && emp.pass === pass);
      localStorage.setItem('loggedInEmployee', JSON.stringify(matched));

      if (!matched) {
        setError('Invalid Employee ID or Password');
        return;
      }

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

      await fetch('http://localhost:3000/emp_attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attendanceEntry)
      });

      setEmpId('');
      setPassword('');
      setError('');
      router.push('/Employee_dashboard');
    } catch (err) {
      console.error(err);
      setError('Error during employee login');
    }
  };

  const handleManLogin = async () => {
    try {
      const response = await fetch('http://localhost:3000/management_data');
      const managers = await response.json(); // Renamed to 'managers' for clarity

      const matched = managers.find(man => man.manId === manId && man.password === managerPassword); // Use managerPassword

      if (!matched) {
        setManError('Invalid Management ID or Password');
        return;
      }

      setManId('');
      setManagerPassword(''); // Clear manager password state
      setManError('');
      router.push('/Management_dashboard');
    } catch (err) {
      console.error(err);
      setManError('Error during management login');
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
          "text-center" // Center text for responsiveness
        )}
      >
        <ColourfulText text="Mahaveer Solutions" />
      </motion.h1>

      {/* Main Login Container */}
      {/* Use styles.container and styles.overlay here for their specific CSS */}
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        className={cn(
            styles.container, // Keep your original .container styles for layout/z-index
            "relative z-10 w-full max-w-4xl" // Tailwind for max width and z-index positioning
        )}
      >
        <div className={cn(
            styles.overlay, // Keep your original .overlay styles for flex/gap
            "flex-col md:flex-row" // Tailwind for responsiveness (stack on small, row on medium+)
        )}>
          {/* Employee Login Box */}
          <div className={cn(
            styles.loginBox, // Apply core loginBox styles from CSS module
            styles.employerBox, // Apply gradient background from CSS module
            "flex-1" // Tailwind to make it take equal width in flex container
          )}>
            <h2 className="text-white text-center">Employee Login</h2> {/* Text color for heading, text-center for alignment */}
            <input
              type="text"
              placeholder="Enter Employee ID"
              value={empId}
              onChange={(e) => setEmpId(e.target.value)}
              className={cn(
                  styles.inputField, // Apply input field base styles from CSS module
                  "bg-white text-black placeholder-neutral-500", // Ensure white background and black text
                  "focus:outline-none focus:ring-2 focus:ring-blue-300" // Tailwind focus ring
              )}
            />
            <input
              type="password"
              placeholder="Enter Password"
              value={pass}
              onChange={(e) => setPassword(e.target.value)}
              className={cn(
                  styles.inputField, // Apply input field base styles from CSS module
                  "bg-white text-black placeholder-neutral-500", // Ensure white background and black text
                  "focus:outline-none focus:ring-2 focus:ring-blue-300" // Tailwind focus ring
              )}
            />
            <button
              onClick={handleLogin}
              className={cn(
                styles.button, // Apply button base styles from CSS module
                "bg-white text-black hover:bg-gray-200 transition-colors duration-200", // Tailwind for hover and transition
                "focus:outline-none focus:ring-2 focus:ring-blue-300 focus:ring-offset-2 focus:ring-offset-current" // Tailwind focus ring
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
            styles.loginBox, // Apply core loginBox styles from CSS module
            styles.managementBox, // Apply gradient background from CSS module
            "flex-1" // Tailwind to make it take equal width in flex container
          )}>
            <h2 className="text-white text-center">Management Login</h2> {/* Text color for heading, text-center for alignment */}
            <input
              type="text"
              placeholder="Enter Management ID"
              value={manId}
              onChange={(e) => setManId(e.target.value)}
              className={cn(
                  styles.inputField, // Apply input field base styles from CSS module
                  "bg-white text-black placeholder-neutral-500", // Ensure white background and black text
                  "focus:outline-none focus:ring-2 focus:ring-red-300" // Tailwind focus ring (red for management)
              )}
            />
            <input
              type="password"
              placeholder="Enter Password"
              value={managerPassword} // Use managerPassword state
              onChange={(e) => setManagerPassword(e.target.value)}
              className={cn(
                  styles.inputField, // Apply input field base styles from CSS module
                  "bg-white text-black placeholder-neutral-500", // Ensure white background and black text
                  "focus:outline-none focus:ring-2 focus:ring-red-300" // Tailwind focus ring (red for management)
              )}
            />
            <button
              onClick={handleManLogin}
              className={cn(
                styles.button, // Apply button base styles from CSS module
                "bg-white text-black hover:bg-gray-200 transition-colors duration-200", // Tailwind for hover and transition
                "focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 focus:ring-offset-current" // Tailwind focus ring
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