const mongoose = require('mongoose');

// Employee Data Schema
const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  empId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  pass: {
    type: String,
    required: true
  },
  mailID: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 100
  },
  imageUrl: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Employee Attendance Schema
const attendanceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  empId: {
    type: String,
    required: true,
    trim: true
  },
  Date: {
    type: String,
    required: true
  },
  login: {
    type: String,
    required: true
  },
  logout: {
    type: String,
    required: null
  }
}, {
  timestamps: true
});

// Create compound index for efficient queries
attendanceSchema.index({ empId: 1, Date: 1 });

// Management Data Schema
const managementSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  manId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  },
  mailID: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  role: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true,
    min: 18,
    max: 100
  },
  imageUrl: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// Payroll Data Schema
const payrollSchema = new mongoose.Schema({
  empId: {
    type: String,
    required: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  basic: {
    type: Number,
    required: true,
    min: 0
  },
  allowance: {
    type: Number,
    required: true,
    min: 0
  },
  deductions: {
    type: Number,
    required: true,
    min: 0
  },
  netPay: {
    type: Number,
    required: true,
    min: 0
  },
  payDate: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Paid', 'Pending', 'Processing', 'Upcoming'],
    default: 'Pending'
  }
}, {
  timestamps: true
});

// Create compound index for efficient queries
payrollSchema.index({ empId: 1, payDate: 1 });

// Task Assigned Schema
const taskSchema = new mongoose.Schema({
  taskId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  status: {
    type: String,
    required: true,
    enum: ['Completed', 'Pending', 'In Progress', 'Cancelled'],
    default: 'Pending'
  },
  empId: {
    type: String,
    required: true,
    trim: true
  },
  task: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,
    required: true
  },
  assignedTime: {
    type: String,
    required: true
  },
  priority: {
    type: String,
    required: true,
    enum: ['High', 'Normal', 'Low'],
    default: 'Normal'
  },
  description: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});

// Create index for efficient queries
taskSchema.index({ empId: 1, status: 1 });

// Create Models
const Employee = mongoose.model('Employee', employeeSchema);
const Attendance = mongoose.model('Attendance', attendanceSchema);
const Management = mongoose.model('Management', managementSchema);
const Payroll = mongoose.model('Payroll', payrollSchema);
const Task = mongoose.model('Task', taskSchema);

module.exports = {
  Employee,
  Attendance,
  Management,
  Payroll,
  Task
};
