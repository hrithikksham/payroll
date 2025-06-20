const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getMonthlyReport,
  getEmployeeReport,
  downloadMonthlyReportPDF
} = require('../controllers/reportController');

// Test route (optional)
router.get('/test', (req, res) => {
  res.send('✅ Report routes are working');
});

// ✅ Monthly salary PDF download
router.get('/report/:month/pdf', auth, downloadMonthlyReportPDF);

// Other report endpoints
router.get('/month/:month', auth, getMonthlyReport);
router.get('/employee/:id', auth, getEmployeeReport);


module.exports = router;