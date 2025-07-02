'use client';
import React, { useState, useEffect } from "react";
import styles from '../../../styles/management_dashboard.module.css'; // Your existing base styles
import payrollStyles from './payroll.module.css';// Import payroll-specific styles
import { ColourfulText } from "@/components/ui/colourful-text";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconChartLine,
  IconArrowLeft,
  IconInfoCircle,
  IconDashboard,
  IconDatabase,
  IconUserPlus,
  IconMessages,
  IconClockHour4,
  IconHammer,
  IconActivity,
  IconWallet, // Icon for Payroll
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import axios from "axios"; // Make sure axios is imported
import { useRouter } from 'next/navigation';
import jsPDF from 'jspdf'; // Import jspdf for PDF generation

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

// Removed initialPayroll as it will be fetched from backend

export default function Payroll_management() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Payroll specific states
  const [selected, setSelected] = useState(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [payMonth, setPayMonth] = useState('2025-07');
  const [data, setData] = useState([]); // This will now store fetched data
  const [payrollId, setPayrollId] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true); // New loading state
  const [error, setError] = useState(null); // New error state

  // Fetch payroll data from backend on component mount
  useEffect(() => {
    const fetchPayrollData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await axios.get('http://localhost:3000/payroll_data');
        setData(response.data);
      } catch (err) {
        console.error("Error fetching payroll data:", err);
        setError("Failed to load payroll data.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchPayrollData();
  }, []); // Empty dependency array means it runs once on mount

  // Removed localStorage.setItem for data, as backend handles persistence

  // Corrected: Use empId for validation
  const isValidId = data.some(e => e.empId.toLowerCase() === payrollId.toLowerCase());

  const filtered = data.filter((emp) => {
    // Corrected: Use empId for search
    const matchSearch = emp.name.toLowerCase().includes(search.toLowerCase()) || emp.empId.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'All' || emp.status === statusFilter;
    const matchMonth = emp.payDate.startsWith(payMonth);
    return matchSearch && matchStatus && matchMonth;
  });

  const handleGenerate = async () => { // Made async
    if (!payrollId.trim()) {
      setToastMessage('⚠ Please enter an Employee ID');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    // Corrected: Use empId to find the employee
    const empToUpdate = data.find(e => e.empId.toLowerCase() === payrollId.toLowerCase());
    if (!empToUpdate) {
      setToastMessage('❌ Employee ID not found');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    // Optimistic UI update
    setData(prevData => prevData.map(emp =>
      // Corrected: Use empId for optimistic update
      emp.empId.toLowerCase() === payrollId.toLowerCase() ? { ...emp, status: 'Paid' } : emp
    ));

    try {
      // Corrected: Use empId in the API path
      const response = await axios.patch(`http://localhost:3000/payroll_data/${empToUpdate.empId}`, { status: 'Paid' });
      setToastMessage(`✅ Payroll generated for ${empToUpdate.empId}`);
      setPayrollId('');
      // If backend sends updated data, you might want to use response.data to update state
      // setData(prevData => prevData.map(emp => emp.empId === response.data.empId ? response.data : emp));
    } catch (err) {
      console.error("Error generating payroll on backend:", err);
      setToastMessage(`❌ Failed to generate payroll: ${err.response?.data?.message || err.message}`);
      // Revert optimistic update on error
      setData(prevData => prevData.map(emp =>
        // Corrected: Use empId for reverting optimistic update
        emp.empId.toLowerCase() === payrollId.toLowerCase() ? { ...emp, status: 'Pending' } : emp
      ));
    } finally {
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const handleDownloadPDF = (emp) => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(`Payslip for ${emp.name}`, 20, 20);
    doc.setFontSize(12);
    // Corrected: Use empId for PDF
    doc.text(`Employee ID: ${emp.empId}`, 20, 40);
    doc.text(`Basic: ₹${emp.basic}`, 20, 50);
    doc.text(`Allowances: ₹${emp.allowance}`, 20, 60);
    doc.text(`Deductions: ₹${emp.deductions}`, 20, 70);
    doc.text(`Net Pay: ₹${emp.netPay}`, 20, 80);
    doc.text(`Pay Date: ${emp.payDate}`, 20, 90);
    doc.text(`Status: ${emp.status}`, 20, 100);
    // Corrected: Use empId for PDF filename
    doc.save(`${emp.empId}_Payslip.pdf`);
  };

  const handlePrint = () => {
    if (selected) {
      const content = document.getElementById('printArea').innerHTML;
      const printWindow = window.open('', '', 'width=600,height=600');
      printWindow.document.write('<html><head><title>Payslip</title>');
      // Optional: Include your payroll.module.css styles for print
      // This path might need adjustment depending on your Next.js build output
      printWindow.document.write('<link rel="stylesheet" href="/_next/static/css/payroll.module.css" type="text/css" />');
      printWindow.document.write('</head><body>');
      printWindow.document.write(content);
      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  };

  const links = [

    {
      label: "Attendance Tracker",
      href: "/Attendance_tracker",
      icon: <IconClockHour4 className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Employee Database",
      href: "/Employee_database",
      icon: <IconDatabase className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Performance Monitor",
      href: "/Performance_monitor",
      icon: <IconChartLine className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Add / Update Employee",
      href: "/Add_Update_employee",
      icon: <IconUserPlus className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Group Discussion",
      href: "/Remove_employee", // Assuming this is the correct path for group discussion
      icon: <IconMessages className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
    },
    {
      label: "Dashboard",
      href: "/Management_dashboard", // Link back to the management dashboard
      icon: <IconDashboard className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />,
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

      <div className="relative flex flex-1 flex-col overflow-y-auto p-4 md:p-8">
        <div className={payrollStyles.container}>
          <h1 className={payrollStyles.title}>Payroll Management</h1>

          <div className={payrollStyles.controls}>
            <input type="text" placeholder="Search by name or ID..." value={search} onChange={(e) => setSearch(e.target.value)} className={payrollStyles.searchBox} />
            <input type="month" value={payMonth} onChange={(e) => setPayMonth(e.target.value)} className={payrollStyles.datePicker} />
            <input type="text" placeholder="Enter Employee ID to generate..." value={payrollId} onChange={(e) => setPayrollId(e.target.value)} className={payrollStyles.searchBox} />
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={payrollStyles.filterSelect}>
              <option value="All">All</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
            </select>
            <button className={payrollStyles.generateBtn} onClick={handleGenerate} disabled={!isValidId}>Generate Payroll</button>
          </div>

          {isLoading ? (
            <p className={payrollStyles.loadingMessage}>Loading payroll data...</p>
          ) : error ? (
            <p className={payrollStyles.errorMessage}>{error}</p>
          ) : (
            <table className={payrollStyles.table}>
              <thead>
                <tr>
                  <th>Employee ID</th>
                  <th>Name</th>
                  <th>Basic</th>
                  <th>Allowances</th>
                  <th>Deductions</th>
                  <th>Net Pay</th>
                  <th>Pay Date</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((emp) => (
                  // Corrected: Use empId as key for table rows
                  <tr key={emp.empId}>
                    <td>{emp.empId}</td>
                    <td>{emp.name}</td>
                    <td>₹{emp.basic}</td>
                    <td>₹{emp.allowance}</td>
                    <td>₹{emp.deductions}</td>
                    <td>₹{emp.netPay}</td>
                    <td>{emp.payDate}</td>
                    <td className={emp.status === 'Paid' ? payrollStyles.paid : payrollStyles.pending}>{emp.status}</td>
                    <td>
                      <button className={payrollStyles.viewBtn} onClick={() => setSelected(emp)}>View</button>
                      <button className={payrollStyles.viewBtn} onClick={() => handleDownloadPDF(emp)}>Download</button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                    <tr>
                        <td colSpan="9" className={payrollStyles.noDataMessage}>No payroll records found matching your criteria.</td>
                    </tr>
                )}
              </tbody>
            </table>
          )}

          {selected && (
            <div className={payrollStyles.modal} onClick={() => setSelected(null)}>
              <div className={payrollStyles.modalContent} onClick={(e) => e.stopPropagation()}>
                <div id="printArea">
                  <h2>Payslip - {selected.name}</h2>
                  {/* Corrected: Use empId in modal display */}
                  <p><strong>Employee ID:</strong> {selected.empId}</p>
                  <p><strong>Basic:</strong> ₹{selected.basic}</p>
                  <p><strong>Allowances:</strong> ₹{selected.allowance}</p>
                  <p><strong>Deductions:</strong> ₹{selected.deductions}</p>
                  <p><strong>Net Pay:</strong> ₹{selected.netPay}</p>
                  <p><strong>Pay Date:</strong> {selected.payDate}</p>
                  <p><strong>Status:</strong> {selected.status}</p>
                </div>
                <button className={payrollStyles.generateBtn} onClick={handlePrint}>Print</button>
                <button className={payrollStyles.closeBtn} onClick={() => setSelected(null)}>Close</button>
              </div>
            </div>
          )}

          {showToast && (
            <div className={payrollStyles.toast}>{toastMessage}</div>
          )}
        </div>
      </div>
    </div>
  );
}