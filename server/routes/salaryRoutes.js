const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  calculateSalary,
  getSalaries,
  getSalariesByMonth,
  downloadPayslip
} = require('../controllers/salaryController');


// Order matters!
router.post('/', auth, calculateSalary);
router.get('/', auth, getSalaries);
router.get('/:id/payslip', auth, downloadPayslip);  // Must be before :month
router.get('/:month', auth, getSalariesByMonth);

module.exports = router;