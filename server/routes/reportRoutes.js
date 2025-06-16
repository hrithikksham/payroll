const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
  getMonthlyReport,
  getEmployeeReport
} = require('../controllers/reportController');

router.get('/test', (req, res) => {
  res.send('✅ Report routes are working');
});

router.get('/month/:month', auth, getMonthlyReport);
router.get('/employee/:id', auth, getEmployeeReport);

module.exports = router;