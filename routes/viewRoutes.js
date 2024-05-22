const express = require('express');
const { getOverview, getTourDetail } = require('../controllers/viewController');

const router = express.Router();

router.get('/overview', getOverview);
router.get('/tours/:tourId', getTourDetail);

module.exports = router;