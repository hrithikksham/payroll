const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  addEmployee,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
} = require('../controllers/employeeController');

// Create
router.post('/', auth, addEmployee);

// Read
router.get('/', auth, getAllEmployees);

// Update
router.put('/:id', auth, updateEmployee);

// Delete
router.delete('/:id', auth, deleteEmployee);

module.exports = router;