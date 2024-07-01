// Require necessary modules
const express = require('express');
const router = express.Router();
const logsController = require('../Controller/Logs-Controller');
//middlewares
const checkAuth = require('../MiddleWare/checkAuth');
const checkRole = require('../MiddleWare/checkRole');
const checkBanauRole = require('../MiddleWare/checkBanauRole');
// Define routes


//authentication middleware
router.use(checkAuth);

router.get('/getlogsbyfilter', logsController.getLogsByFilter);

// Export the router
module.exports = router; 