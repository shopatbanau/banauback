// Require necessary modules
const express = require('express');
const router = express.Router();
//middlewares
const checkAuth = require('../MiddleWare/checkAuth');
const checkRole = require('../MiddleWare/checkRole');
const checkBanauRole = require('../MiddleWare/checkBanauRole');
const { getBanau, addEmployee, updateEmployeeRole, deleteEmployee, testMultipleCreation } = require('../Controller/Banau-Controller');
const banauAccessRole = require('../MiddleWare/banauAccessRole');
const checkToBeUpdateIsAdmin = require('../MiddleWare/isBanauAdminCheck');
// Define routes

router.post('/test-route', testMultipleCreation);

//authentication middleware
router.use(checkAuth);
router.use(banauAccessRole);

router.get('/getbanau', getBanau);

router.post('/addemployee', checkBanauRole('Admin'), addEmployee);

router.put('/updateemployee/:id', checkBanauRole('Admin'), checkToBeUpdateIsAdmin, updateEmployeeRole);

router.delete('/deleteemployee/:id', checkBanauRole('Admin'), checkToBeUpdateIsAdmin, deleteEmployee);

// Export the router
module.exports = router; 