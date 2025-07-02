const express = require("express");
const axios = require("axios"); // Keeping axios, though not directly used in provided routes
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 3000;

// --- Middleware ---
// 1. CORS middleware: Allows cross-origin requests. Must be early.
app.use(cors());
// 2. JSON body parser: Parses incoming request bodies with JSON payloads.
//    ESSENTIAL and MUST be placed BEFORE any routes that need to read req.body.
app.use(express.json());
// 3. Static files server: Serves static assets from the 'public' directory.
app.use(express.static("public"));


// --- Data Imports ---
// IMPORTANT: Ensure these files export mutable arrays (e.g., via module.exports = [...])
// If they export a 'const' array, in-memory modifications will fail.
let employee_data = require('./employee_data');
let emp_attendance = require('./emp_attendance');
let management_data = require('./management_data');
let task_assigned = require('./task_assigned');


// --- Routes ---

// Employee Data Routes
// Route order is crucial: more specific routes first!

// 1. Get employee data by specific empId (MOST SPECIFIC GET for /employee_data)
app.get('/employee_data/empId/:empId', (req, res) => {
  const emp_ID = req.params.empId.toLowerCase();
  const searched_emp_ID = employee_data.find(emp => emp.empId.toLowerCase() === emp_ID);

  if (searched_emp_ID) {
    res.json(searched_emp_ID);
  } else {
    res.status(404).json({ message: "Employee not found" });
  }
});

// 2. Filter employee data based on role (More specific than general /employee_data)
app.get('/employee_data/:role', (req, res) => {
  const emp_role = req.params.role;
  const filtered_emp_data = employee_data.filter(i => i.role.toLowerCase() === emp_role.toLowerCase());
  if (filtered_emp_data.length > 0) {
    res.json(filtered_emp_data);
  } else {
    res.status(404).json({ message: "No employees found for this role" });
  }
});

// 3. Get all employee data (LEAST SPECIFIC GET for /employee_data)
app.get('/employee_data', (req, res) => {
  res.json(employee_data);
});

// 4. POST: Add a new employee
app.post('/employee_data', (req, res) => {
  console.log('Backend: Received POST request for /employee_data. Body:', req.body);
  const newEmployee = req.body;

  if (!newEmployee.empId || !newEmployee.name || !newEmployee.pass || !newEmployee.mailID || !newEmployee.role || !newEmployee.age) {
    return res.status(400).json({ message: 'Missing required employee fields.' });
  }

  const existingEmployee = employee_data.find(emp => emp.empId === newEmployee.empId);
  if (existingEmployee) {
    return res.status(409).json({ message: 'Employee with this ID already exists.' });
  }

  employee_data.push(newEmployee);
  console.log('Backend: New employee added:', newEmployee);
  res.status(201).json({ message: 'Employee added successfully', employee: newEmployee });
});

// 5. PUT: Update an existing employee
app.put('/employee_data/:empId', (req, res) => {
  console.log(`Backend: Received PUT request for /employee_data/${req.params.empId}. Body:`, req.body);
  const empIdToUpdate = req.params.empId;
  const updatedEmployeeData = req.body;

  const employeeIndex = employee_data.findIndex(emp => emp.empId === empIdToUpdate);

  if (employeeIndex !== -1) {
    if (updatedEmployeeData.empId && updatedEmployeeData.empId !== empIdToUpdate) {
      return res.status(400).json({ message: 'Employee ID cannot be changed.' });
    }

    employee_data[employeeIndex] = { ...employee_data[employeeIndex], ...updatedEmployeeData, empId: empIdToUpdate };
    console.log('Backend: Employee updated:', employee_data[employeeIndex]);
    res.json({ message: 'Employee updated successfully', employee: employee_data[employeeIndex] });
  } else {
    res.status(404).json({ message: 'Employee not found for update.' });
  }
});

app.put('/emp_attendance/logout', (req, res) => {
    console.log('Backend: Received PUT request for /emp_attendance/logout. Body:', req.body);
    const { empId, date, logoutTime } = req.body;

    if (!empId || !date || !logoutTime) {
        return res.status(400).json({ message: 'Missing required fields: empId, date, or logoutTime.' });
    }

    // Find the attendance record for the specific employee and date
    const attendanceRecordIndex = emp_attendance.findIndex(
        record => record.empId === empId && record.Date === date
    );

    if (attendanceRecordIndex !== -1) {
        // Update the logout time
        emp_attendance[attendanceRecordIndex].logout = logoutTime;
        console.log('Backend: Attendance record updated successfully:', emp_attendance[attendanceRecordIndex]);
        res.status(200).json({
            message: 'Logout time updated successfully.',
            updatedRecord: emp_attendance[attendanceRecordIndex]
        });
    } else {
        // If no matching record is found for the given empId and date
        // This might happen if login wasn't recorded or date is mismatched
        console.warn(`Backend: No attendance record found for empId: ${empId} on date: ${date} to update logout.`);
        // Optionally, you might want to create a new record here if login was missed
        // For now, we'll return a 404
        res.status(404).json({ message: 'Attendance record not found for today. Ensure login was recorded.' });
    }
});

// Attendance Routes (ensure specific routes come before general ones)
app.get('/emp_attendance/:Date/:empID', (req, res) => {
  const empIDParam = req.params.empID.toLowerCase();
  const dateParam = req.params.Date;

  const matchedRecords = emp_attendance.filter(
    emp => emp.empId.toLowerCase() === empIDParam && emp.Date === dateParam
  );

  if (matchedRecords.length > 0) {
    res.json(matchedRecords);
  } else {
    res.status(404).json({ message: "No attendance found for the given date and employee ID" });
  }
});

app.get('/emp_attendance/:Date/:name', (req, res) => {
  const DateQuery = req.params.Date;
  const nameQuery = req.params.name.toLowerCase();

  const entry = emp_attendance.find(
    emp => emp.Date === DateQuery && emp.name.toLowerCase() === nameQuery
  );

  if (!entry) {
    return res.status(404).json({ error: "No matching record found" });
  }

  res.json(entry);
});

app.get('/emp_attendance',(req,res)=>{
    res.json(emp_attendance);
});

app.get('/emp_attendance/:Date',(req,res)=>{
    const att_date =req.params.Date;
    const filtered_emp_attendance=emp_attendance.filter(i=>i.Date==att_date);
    res.json(filtered_emp_attendance);
});

app.post('/emp_attendance', (req, res) => {
  const newEntry = req.body;

  const exists = emp_attendance.find(e => e.empId === newEntry.empId && e.Date === newEntry.Date);
  if (exists) {
    return res.status(400).json({ message: "Attendance already marked for today." });
  }

  newEntry.logout = "";
  emp_attendance.push(newEntry);

  res.status(201).json({ message: "Attendance marked.", data: newEntry });
});

// Management Data Route
app.get('/management_data', (req, res) => {
  res.json(management_data);
});


// Task Assignment Routes (ensure specific routes come before general ones)
app.get('/task_assigned/:empID', (req, res) => {
  const emp_ID = req.params.empID.toLowerCase();

  const filtered_emp_tasks = task_assigned.filter(task =>
    task.empId.toLowerCase() === emp_ID
  );

  if (filtered_emp_tasks.length === 0) {
    return res.status(404).json({ message: "No tasks found for this Employee ID" });
  }

  res.json(filtered_emp_tasks);
});

app.get('/task_assigned', (req, res) => {
  res.json(task_assigned);
});

app.put('/task_assigned/:taskId', (req, res) => {
  const { taskId } = req.params;
  const { task, date, assignedTime, priority, description } = req.body;

  const index = task_assigned.findIndex(t => t.taskId === taskId);

  if (index === -1) {
    return res.status(404).json({ message: 'Task not found' });
  }

  if (task) task_assigned[index].task = task;
  if (date) task_assigned[index].date = date;
  if (assignedTime) task_assigned[index].assignedTime = assignedTime;
  if (priority) task_assigned[index].priority = priority;
  if (description) task_assigned[index].description = description;

  res.json({ message: 'Task updated successfully', updatedTask: task_assigned[index] });
});

app.delete('/task_assigned/:task', (req, res) => {
  const taskName = req.params.task.toLowerCase();

  const initialLength = task_assigned.length;
  const remainingTasks = task_assigned.filter(
    task => task.task.toLowerCase() !== taskName
  );

  if (remainingTasks.length === initialLength) {
    return res.status(404).json({ message: "Task not found" });
  }

  task_assigned.length = 0; // Clear the original array
  task_assigned.push(...remainingTasks); // Push filtered tasks back

  res.json({ message: "Task(s) deleted successfully", deletedTask: taskName });
});

app.patch('/task_assigned/:taskId', (req, res) => {
  const taskId = req.params.taskId;
  const { status } = req.body;

  const taskIndex = task_assigned.findIndex(task => task.taskId === taskId);

  if (taskIndex !== -1) {
    task_assigned[taskIndex] = { ...task_assigned[taskIndex], status: status };
    res.json(task_assigned[taskIndex]);
  } else {
    res.status(404).json({ message: 'Task not found' });
  }
});

app.post('/task_assigned/:empId', (req, res) => {
  const empId = req.params.empId;
  const { task, description, date, assignedTime, priority } = req.body;

  if (!task || !description || !date || !assignedTime || !priority) {
    return res.status(400).json({ message: "Missing required fields: task, description, date, assignedTime, priority" });
  }

  const maxId = task_assigned.reduce((max, t) => {
    const idNum = parseInt(t.taskId?.replace('T', '') || 0);
    return idNum > max ? idNum : max;
  }, 0);

  const newTaskId = `T${(maxId + 1).toString().padStart(3, '0')}`;

  const newTask = {
    taskId: newTaskId,
    empId,
    task,
    description,
    date,
    assignedTime,
    priority,
    status: "Pending"
  };

  task_assigned.push(newTask);
  console.log('Backend: New task assigned:', newTask);
  res.status(201).json({ message: "Task added successfully", task: newTask });
});

// Project Updates Route
const projectUpdatesData = [
  { title: "Sprint Review", description: "Upcoming sprint review on July 5th.", date: "05-07-2025" },
  { title: "Feature Deployment", description: "New feature 'Task Prioritization' deployed to staging.", date: "03-07-2025" },
  { title: "Q3 Planning", description: "Team meeting for Q3 planning scheduled for July 10th.", date: "10-07-2025" },
  { title: "Bug Fixes", description: "Critical bug fixes rolled out in production.", date: "01-07-2025" },
  { title: "New Employee Onboarding", description: "Welcome new team members joining next week!", date: "02-07-2025" },
];
app.get('/project_updates', (req, res) => {
  res.json(projectUpdatesData);
});


// --- Error Handling Middleware ---
// This MUST be the last middleware added to the Express app.
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack);
  res.status(500).json({ message: 'Something broke on the server!', error: err.message });
});


let payroll_data = require('./payroll_data');

// NEW: Payroll Data Routes
app.get('/payroll_data', (req, res) => {
  res.json(payroll_data);
});
app.patch('/payroll_data/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    return res.status(400).json({ message: 'Missing status in request body.' });
  }

  console.log('Received PATCH request for ID:', id);
  console.log('Current payroll_data:', payroll_data); // Add this line

  const payrollIndex = payroll_data.findIndex(p => p.empId.toLowerCase() === id.toLowerCase());

  if (payrollIndex !== -1) {
    payroll_data[payrollIndex].status = status;
    console.log(`Backend: Payroll for ${id} updated to status: ${status}`);
    res.status(200).json({ message: 'Payroll status updated successfully', updatedRecord: payroll_data[payrollIndex] });
  } else {
    res.status(404).json({ message: 'Payroll record not found.' });
  }
});


// --- Start the Server ---
// This MUST be the very last statement in your server.js file.
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
