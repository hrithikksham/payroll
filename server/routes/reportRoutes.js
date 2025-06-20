const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getMonthlyReport,
  getEmployeeReport,
  downloadMonthlyReportPDF // ✅ Import this correctly
} = require('../controllers/reportController');

// Test route
router.get('/test', (req, res) => {
  res.send('✅ Report routes are working');
});

// ✅ Correct route for monthly PDF download
router.get('/report/:month/pdf', auth, downloadMonthlyReportPDF);

router.get('/month/:month', auth, getMonthlyReport);
router.get('/employee/:id', auth, getEmployeeReport);

module.exports = router;