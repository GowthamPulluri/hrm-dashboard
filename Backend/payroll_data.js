let payroll_data = [
  {
    empId: '22A81A1401', // Gowtham
    name: 'Gowtham',
    basic: 45000,
    allowance: 10000,
    deductions: 4500,
    netPay: 50500,
    payDate: '2025-06-31',
    status: 'Paid',
  },
  {
    empId: '22A81A1402', // Varun
    name: 'Varun',
    basic: 48000,
    allowance: 11000,
    deductions: 5000,
    netPay: 54000,
    payDate: '2025-06-31',
    status: 'Paid',
  },
  {
    empId: '22A81A1403', // Dinesh
    name: 'Dinesh',
    basic: 42000,
    allowance: 9000,
    deductions: 3800,
    netPay: 47200,
    payDate: '2025-06-31',
    status: 'Pending',
  },
  {
    empId: '22A81A1404', // Nikhil (Correction from Pullui, based on your employee_data order)
    name: 'Nikhil', // Updated name to match employee_data
    basic: 46000,
    allowance: 10500,
    deductions: 4700,
    netPay: 51800,
    payDate: '2025-06-31',
    status: 'Paid',
  },
  {
    empId: '22A81A1405', // Kumar
    name: 'Kumar',
    basic: 49000,
    allowance: 11500,
    deductions: 5200,
    netPay: 55300,
    payDate: '2025-06-31',
    status: 'Paid',
  },
  {
    empId: '22A81A1406', // Gogulu (Correction from Avada, based on your employee_data order)
    name: 'Gogulu', // Updated name to match employee_data
    basic: 43000,
    allowance: 9200,
    deductions: 3900,
    netPay: 48300,
    payDate: '2025-06-31',
    status: 'Pending',
  },
  // --- NEW DUMMY PAYROLL DATA FOR THE 10 ADDED EMPLOYEES ---
  {
    empId: '22A81A1407', // Suresh - Project Manager
    name: 'Suresh',
    basic: 75000,
    allowance: 18000,
    deductions: 8000,
    netPay: 85000, // 75000 + 18000 - 8000 = 85000
    payDate: '2025-06-31',
    status: 'Paid',
  },
  {
    empId: '22A81A1408', // Priya - UI/UX Designer
    name: 'Priya',
    basic: 60000,
    allowance: 14000,
    deductions: 6000,
    netPay: 68000, // 60000 + 14000 - 6000 = 68000
    payDate: '2025-06-31',
    status: 'Paid',
  },
  {
    empId: '22A81A1409', // Ravi - QA Engineer
    name: 'Ravi',
    basic: 52000,
    allowance: 12000,
    deductions: 5500,
    netPay: 58500, // 52000 + 12000 - 5500 = 58500
    payDate: '2025-06-31',
    status: 'Processing', // Example of another status
  },
  {
    empId: '22A81A1410', // Swathi - DevOps Engineer
    name: 'Swathi',
    basic: 68000,
    allowance: 16000,
    deductions: 7000,
    netPay: 77000, // 68000 + 16000 - 7000 = 77000
    payDate: '2025-06-31',
    status: 'Paid',
  },
  {
    empId: '22A81A1411', // Kishore - Software Developer
    name: 'Kishore',
    basic: 47000,
    allowance: 10800,
    deductions: 4800,
    netPay: 53000, // 47000 + 10800 - 4800 = 53000
    payDate: '2025-06-31',
    status: 'Paid',
  },
  {
    empId: '22A81A1412', // Meena - Automation Tester
    name: 'Meena',
    basic: 44000,
    allowance: 9500,
    deductions: 4000,
    netPay: 49500, // 44000 + 9500 - 4000 = 49500
    payDate: '2025-08-31', // Example of next month's payroll
    status: 'Upcoming', // Example of an upcoming status
  },
  {
    empId: '22A81A1413', // Ajay - UI/UX Designer
    name: 'Ajay',
    basic: 58000,
    allowance: 13500,
    deductions: 5800,
    netPay: 65700, // 58000 + 13500 - 5800 = 65700
    payDate: '2025-06-31',
    status: 'Paid',
  },
  {
    empId: '22A81A1414', // Sindhu - Project Manager
    name: 'Sindhu',
    basic: 72000,
    allowance: 17500,
    deductions: 7800,
    netPay: 81700, // 72000 + 17500 - 7800 = 81700
    payDate: '2025-06-31',
    status: 'Paid',
  },
  {
    empId: '22A81A1415', // Rahul - QA Engineer
    name: 'Rahul',
    basic: 50000,
    allowance: 11800,
    deductions: 5300,
    netPay: 56500, // 50000 + 11800 - 5300 = 56500
    payDate: '2025-08-31',
    status: 'Upcoming',
  },
  {
    empId: '22A81A1416', // Deepika - DevOps Engineer
    name: 'Deepika',
    basic: 65000,
    allowance: 15500,
    deductions: 6800,
    netPay: 73700, // 65000 + 15500 - 6800 = 73700
    payDate: '2025-06-31',
    status: 'Paid',
  }
];

module.exports = payroll_data;