const express = require('express');
const { getOverview, getTourDetail } = require('../controllers/viewController');

const router = express.Router();

router.get('/overview', getOverview);
router.get('/tour', getTourDetail);

module.exports = router;