const express = require("express");
const axios = require("axios");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
const PORT = 3000;

mongoose.connect('mongodb+srv://nikhilpulluri7810:1234@nikhilpulluri.g6f9o.mongodb.net/hrm-dashboard?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB successfully!');
});

const { Employee, Attendance, Management, Payroll, Task } = require('./model');

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

app.get('/employee_data/empId/:empId', async (req, res) => {
  try {
    const emp_ID = req.params.empId;
    const searched_emp_ID = await Employee.findOne({ empId: { $regex: new RegExp(`^${emp_ID}$`, 'i') } });
    if (searched_emp_ID) {
      const employeeData = searched_emp_ID.toObject();
      delete employeeData._id;
      delete employeeData.__v;
      delete employeeData.createdAt;
      delete employeeData.updatedAt;
      res.json(employeeData);
    } else {
      res.status(404).json({ message: "Employee not found" });
    }
  } catch (error) {
    console.error('Error fetching employee by ID:', error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/employee_data/:role', async (req, res) => {
  try {
    const emp_role = req.params.role;
    const filtered_emp_data = await Employee.find({ role: { $regex: new RegExp(`^${emp_role}$`, 'i') } });
    if (filtered_emp_data.length > 0) {
      const cleanedData = filtered_emp_data.map(emp => {
        const empData = emp.toObject();
        delete empData._id;
        delete empData.__v;
        delete empData.createdAt;
        delete empData.updatedAt;
        return empData;
      });
      res.json(cleanedData);
    } else {
      res.status(404).json({ message: "No employees found for this role" });
    }
  } catch (error) {
    console.error('Error fetching employees by role:', error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/employee_data', async (req, res) => {
  try {
    const employees = await Employee.find({});
    const cleanedData = employees.map(emp => {
      const empData = emp.toObject();
      delete empData._id;
      delete empData.__v;
      delete empData.createdAt;
      delete empData.updatedAt;
      return empData;
    });
    res.json(cleanedData);
  } catch (error) {
    console.error('Error fetching all employees:', error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post('/employee_data', async (req, res) => {
  try {
    const newEmployee = req.body;
    if (!newEmployee.empId || !newEmployee.name || !newEmployee.pass || !newEmployee.mailID || !newEmployee.role || !newEmployee.age) {
      return res.status(400).json({ message: 'Missing required employee fields.' });
    }
    const existingEmployee = await Employee.findOne({ empId: newEmployee.empId });
    if (existingEmployee) {
      return res.status(409).json({ message: 'Employee with this ID already exists.' });
    }
    const employee = new Employee(newEmployee);
    await employee.save();
    const employeeData = employee.toObject();
    delete employeeData._id;
    delete employeeData.__v;
    delete employeeData.createdAt;
    delete employeeData.updatedAt;
    res.status(201).json({ message: 'Employee added successfully', employee: employeeData });
  } catch (error) {
    console.error('Error adding employee:', error);
    res.status(500).json({ message: "Server error" });
  }
});

app.put('/employee_data/:empId', async (req, res) => {
  try {
    const empIdToUpdate = req.params.empId;
    const updatedEmployeeData = req.body;
    if (updatedEmployeeData.empId && updatedEmployeeData.empId !== empIdToUpdate) {
      return res.status(400).json({ message: 'Employee ID cannot be changed.' });
    }
    const updatedEmployee = await Employee.findOneAndUpdate(
      { empId: empIdToUpdate },
      { ...updatedEmployeeData, empId: empIdToUpdate },
      { new: true }
    );
    if (updatedEmployee) {
      const employeeData = updatedEmployee.toObject();
      delete employeeData._id;
      delete employeeData.__v;
      delete employeeData.createdAt;
      delete employeeData.updatedAt;
      res.json({ message: 'Employee updated successfully', employee: employeeData });
    } else {
      res.status(404).json({ message: 'Employee not found for update.' });
    }
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete('/employee_data/:empId', async (req, res) => {
    try {
        const empIdToDelete = req.params.empId;
        const result = await Employee.deleteOne({ empId: empIdToDelete }); // Use deleteOne for a single match

        if (result.deletedCount === 0) {
            return res.status(404).json({ message: "Employee not found for deletion." });
        }
        res.status(200).json({ message: "Employee deleted successfully.", deletedEmpId: empIdToDelete });
    } catch (error) {
        console.error('Error deleting employee:', error);
        res.status(500).json({ message: "Server error" });
    }
});

app.put('/emp_attendance/logout', async (req, res) => {
  try {
    const { empId, date, logoutTime } = req.body;
    if (!empId || !date || !logoutTime) {
      return res.status(400).json({ message: 'Missing required fields: empId, date, or logoutTime.' });
    }
    const updatedRecord = await Attendance.findOneAndUpdate(
      { empId: empId, Date: date },
      { logout: logoutTime },
      { new: true }
    );
    if (updatedRecord) {
      const attendanceData = updatedRecord.toObject();
      delete attendanceData._id;
      delete attendanceData.__v;
      delete attendanceData.createdAt;
      delete attendanceData.updatedAt;
      res.status(200).json({ message: 'Logout time updated successfully.', updatedRecord: attendanceData });
    } else {
      res.status(404).json({ message: 'Attendance record not found for today. Ensure login was recorded.' });
    }
  } catch (error) {
    console.error('Error updating attendance logout:', error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/emp_attendance/:Date/:empId', async (req, res) => {
  try {
    const empIdParam = req.params.empId;
    const dateParam = req.params.Date;
    const matchedRecords = await Attendance.find({
      empId: { $regex: new RegExp(`^${empIdParam}$`, 'i') },
      Date: dateParam
    });
    if (matchedRecords.length > 0) {
      const cleanedData = matchedRecords.map(record => {
        const recordData = record.toObject();
        delete recordData._id;
        delete recordData.__v;
        delete recordData.createdAt;
        delete recordData.updatedAt;
        return recordData;
      });
      res.json(cleanedData);
    } else {
      res.status(404).json({ message: "No attendance found for the given date and employee ID" });
    }
  } catch (error) {
    console.error('Error fetching attendance by date and empID:', error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/emp_attendance/:Date/:name', async (req, res) => {
  try {
    const DateQuery = req.params.Date;
    const nameQuery = req.params.name;
    const entry = await Attendance.findOne({
      Date: DateQuery,
      name: { $regex: new RegExp(`^${nameQuery}$`, 'i') }
    });
    if (!entry) {
      return res.status(404).json({ error: "No matching record found" });
    }
    const attendanceData = entry.toObject();
    delete attendanceData._id;
    delete attendanceData.__v;
    delete attendanceData.createdAt;
    delete attendanceData.updatedAt;
    res.json(attendanceData);
  } catch (error) {
    console.error('Error fetching attendance by date and name:', error);
    res.status(500).json({ error: "Server error" });
  }
});

app.get('/emp_attendance', async (req, res) => {
  try {
    const attendance = await Attendance.find({});
    const cleanedData = attendance.map(record => {
      const recordData = record.toObject();
      delete recordData._id;
      delete recordData.__v;
      delete recordData.createdAt;
      delete recordData.updatedAt;
      return recordData;
    });
    res.json(cleanedData);
  } catch (error) {
    console.error('Error fetching all attendance:', error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/emp_attendance/:Date', async (req, res) => {
  try {
    const att_date = req.params.Date;
    const filtered_emp_attendance = await Attendance.find({ Date: att_date });
    const cleanedData = filtered_emp_attendance.map(record => {
      const recordData = record.toObject();
      delete recordData._id;
      delete recordData.__v;
      delete recordData.createdAt;
      delete recordData.updatedAt;
      return recordData;
    });
    res.json(cleanedData);
  } catch (error) {
    console.error('Error fetching attendance by date:', error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post('/emp_attendance', async (req, res) => {
  try {
    const newEntry = req.body;
    const exists = await Attendance.findOne({ empId: newEntry.empId, Date: newEntry.Date });
    if (exists) {
      return res.status(400).json({ message: "Attendance already marked for today." });
    }
    newEntry.logout = "";
    const attendance = new Attendance(newEntry);
    await attendance.save();
    const attendanceData = attendance.toObject();
    delete attendanceData._id;
    delete attendanceData.__v;
    delete attendanceData.createdAt;
    delete attendanceData.updatedAt;
    res.status(201).json({ message: "Attendance marked.", data: attendanceData });
  } catch (error) {
    console.error('Error adding attendance:', error);
    res.status(500).json({ message: "Server error" });
  }
});


app.get('/management_data', async (req, res) => {
  try {
    const management = await Management.find({});
    const cleanedData = management.map(mgmt => {
      const mgmtData = mgmt.toObject();
      delete mgmtData._id;
      delete mgmtData.__v;
      delete mgmtData.createdAt;
      delete mgmtData.updatedAt;
      return mgmtData;
    });
    res.json(cleanedData);
  } catch (error) {
    console.error('Error fetching management data:', error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/task_assigned/:empId', async (req, res) => {
  try {
    const emp_ID = req.params.empId;
    const filtered_emp_tasks = await Task.find({
      empId: { $regex: new RegExp(`^${emp_ID}$`, 'i') }
    });
    if (filtered_emp_tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found for this Employee ID" });
    }
    const cleanedData = filtered_emp_tasks.map(task => {
      const taskData = task.toObject();
      delete taskData._id;
      delete taskData.__v;
      delete taskData.createdAt;
      delete taskData.updatedAt;
      return taskData;
    });
    res.json(cleanedData);
  } catch (error) {
    console.error('Error fetching tasks by empID:', error);
    res.status(500).json({ message: "Server error" });
  }
});

app.get('/task_assigned', async (req, res) => {
  try {
    const tasks = await Task.find({});
    const cleanedData = tasks.map(task => {
      const taskData = task.toObject();
      delete taskData._id;
      delete taskData.__v;
      delete taskData.createdAt;
      delete taskData.updatedAt;
      return taskData;
    });
    res.json(cleanedData);
  } catch (error) {
    console.error('Error fetching all tasks:', error);
    res.status(500).json({ message: "Server error" });
  }
});

app.put('/task_assigned/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const { task, date, assignedTime, priority, description } = req.body;
    const updateData = {};
    if (task) updateData.task = task;
    if (date) updateData.date = date;
    if (assignedTime) updateData.assignedTime = assignedTime;
    if (priority) updateData.priority = priority;
    if (description) updateData.description = description;
    const updatedTask = await Task.findOneAndUpdate(
      { taskId: taskId },
      updateData,
      { new: true }
    );
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    const taskData = updatedTask.toObject();
    delete taskData._id;
    delete taskData.__v;
    delete taskData.createdAt;
    delete taskData.updatedAt;
    res.json({ message: 'Task updated successfully', updatedTask: taskData });
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: "Server error" });
  }
});

app.delete('/task_assigned/:task', async (req, res) => {
  try {
    const taskName = req.params.task;
    const result = await Task.deleteMany({
      task: { $regex: new RegExp(`^${taskName}$`, 'i') }
    });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.json({ message: "Task(s) deleted successfully", deletedTask: taskName });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: "Server error" });
  }
});

app.patch('/task_assigned/:taskId', async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const { status } = req.body;
    const updatedTask = await Task.findOneAndUpdate(
      { taskId: taskId },
      { status: status },
      { new: true }
    );
    if (updatedTask) {
      const taskData = updatedTask.toObject();
      delete taskData._id;
      delete taskData.__v;
      delete taskData.createdAt;
      delete taskData.updatedAt;
      res.json(taskData);
    } else {
      res.status(404).json({ message: 'Task not found' });
    }
  } catch (error) {
    console.error('Error updating task status:', error);
    res.status(500).json({ message: "Server error" });
  }
});

app.post('/task_assigned/:empId', async (req, res) => {
  try {
    const empId = req.params.empId;
    const { task, description, date, assignedTime, priority } = req.body;
    if (!task || !description || !date || !assignedTime || !priority) {
      return res.status(400).json({ message: "Missing required fields: task, description, date, assignedTime, priority" });
    }
    const lastTask = await Task.findOne({}, {}, { sort: { 'taskId': -1 } });
    let maxId = 0;
    if (lastTask && lastTask.taskId) {
      maxId = parseInt(lastTask.taskId.replace('T', '')) || 0;
    }
    const newTaskId = `T${(maxId + 1).toString().padStart(3, '0')}`;
    const newTask = new Task({
      taskId: newTaskId,
      empId,
      task,
      description,
      date,
      assignedTime,
      priority,
      status: "Pending"
    });
    await newTask.save();
    const taskData = newTask.toObject();
    delete taskData._id;
    delete taskData.__v;
    delete taskData.createdAt;
    delete taskData.updatedAt;
    res.status(201).json({ message: "Task added successfully", task: taskData });
  } catch (error) {
    console.error('Error adding task:', error);
    res.status(500).json({ message: "Server error" });
  }
});

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

app.get('/payroll_data', async (req, res) => {
  try {
    const payroll = await Payroll.find({});
    const cleanedData = payroll.map(pay => {
      const payData = pay.toObject();
      delete payData._id;
      delete payData.__v;
      delete payData.createdAt;
      delete payData.updatedAt;
      return payData;
    });
    res.json(cleanedData);
  } catch (error) {
    console.error('Error fetching payroll data:', error);
    res.status(500).json({ message: "Server error" });
  }
});

app.patch('/payroll_data/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ message: 'Missing status in request body.' });
    }
    const updatedPayroll = await Payroll.findOneAndUpdate(
      { empId: { $regex: new RegExp(`^${id}$`, 'i') } },
      { status: status },
      { new: true }
    );
    if (updatedPayroll) {
      const payrollData = updatedPayroll.toObject();
      delete payrollData._id;
      delete payrollData.__v;
      delete payrollData.createdAt;
      delete payrollData.updatedAt;
      res.status(200).json({ message: 'Payroll status updated successfully', updatedRecord: payrollData });
    } else {
      res.status(404).json({ message: 'Payroll record not found.' });
    }
  } catch (error) {
    console.error('Error updating payroll:', error);
    res.status(500).json({ message: "Server error" });
  }
});

app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.stack);
  res.status(500).json({ message: 'Something broke on the server!', error: err.message });
});

app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});