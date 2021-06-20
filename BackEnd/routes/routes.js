const express = require('express'),
    tourRoutes = require('./tours');

var router = express.Router();

router.get('/tours', tourRoutes.getTours);
router.get('/tours/:tour_id', tourRoutes.getTour);
router.post('/tour', tourRoutes.createTour);
//router.post('/guide', guideRoutes.createGuide);
router.put('/tours/:tour_id', tourRoutes.updateTour);
router.put('/sites/:tour_id', tourRoutes.createSiteInPath); 
router.delete('/sites/:site_id/:tour_id', tourRoutes.deleteSite);
router.delete('/tours/:tour_id', tourRoutes.deleteTour);

module.exports = router;