// Require necessary modules
const express = require('express');
const router = express.Router();
const storeController = require('../Controller/Store-Controller');
//middlewares
const checkAuth = require('../MiddleWare/checkAuth');
const checkRole = require('../MiddleWare/checkRole');
const checkBanauRole = require('../MiddleWare/checkBanauRole');
const { skipDisabledCheck } = require('../MiddleWare/skipDisabledCheck');
// Define routes


//authentication middleware
router.use(checkAuth);
router.post('/create', storeController.createStore);

router.get('/get/:storeName', storeController.getStore);

router.get('/getStore/:storeName', storeController.getStoreByName);

router.get('/getactiveTheme/:storeID', storeController.getActiveTheme);

router.patch('/update/:id', storeController.updateStore);
router.put('/update/dashboard/:storeID', storeController.updateDashboardStore);
router.patch('/upgrade/storeSubscription/:transactionID', storeController.updateSubscription);
router.patch('/upgrade/storeSkin/:transactionID', storeController.updateSkin);
router.get('/get/graph/sales', storeController.getStoreStats);
router.put('/update/dashboard/banau/:storeID', checkBanauRole('Admin'), storeController.updateDashboardStoreAdminBanau);

router.post('/update/dashboard/banau/paymenttostore/:storeID', checkBanauRole('Admin'), storeController.payStoreNow);
router.patch('/duepay/:storeID', storeController.payDueAmount);
router.patch('/payDue/:orderId', storeController.updateDueAmount);

router.put('/disable/store/:storeID',skipDisabledCheck, checkBanauRole('Admin'), storeController.disableStore);
router.put('/activate/store/:storeID',skipDisabledCheck, checkBanauRole('Admin'), storeController.activateStore);

router.post('/update/dashboard/banau/paymenttostore/:storeID', checkBanauRole('Admin'), storeController.payStoreNow);



router.get('/getstorebyfilter', storeController.getStoreByFilter);
//store delete
router.put('/delete/:storeId', checkRole('owner'), storeController.deleteStore);
// Export the router
module.exports = router; 