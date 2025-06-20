const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const salaryController = require('../controllers/salaryController');

// Create salary
router.post('/', auth, salaryController.calculateSalary);

// Get all salaries
router.get('/', auth, salaryController.getSalaries);

// Download payslip
router.get('/:id/payslip', auth, salaryController.downloadPayslip);

// Update & Delete salary
router.put('/:id', auth, salaryController.updateSalary);
router.delete('/:id', auth, salaryController.deleteSalary);

// ✅ KEEP SPECIFIC ROUTES BEFORE GENERAL ONES:
router.get('/year/:year', auth, salaryController.getSalariesByYear);
router.get('/years', auth, salaryController.getAvailableYears);

// 🔻 LAST: Match by month like "May-2025"
router.get('/:month', auth, salaryController.getSalariesByMonth);

router.get('/net/current-month', auth, salaryController.getCurrentMonthNetTotal);

module.exports = router;