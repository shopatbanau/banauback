const express = require('express');
const router = express.Router();
const orderController = require('../Controller/Order-Controller');
const checkAuth = require('../MiddleWare/checkAuth');
const checkRole = require('../MiddleWare/checkRole');
const checkStoreDisabled = require('../MiddleWare/isDisabledStoreMiddleWare');





router.use(checkAuth);
//route to create a order
// Route to create a new order for a specific store
router.post('/create/:storeID',checkStoreDisabled, orderController.createOrder);

// Route to get all orders for a specific store (atleast needs to be a staff )
router.get('/get/:storeID', checkRole('Delivery') ,orderController.getOrdersByStore);


// 
// Route to update an existing order
router.put('/update/:storeID/:orderId',checkRole('Delivery') ,orderController.updateOrder);
router.put('/update/:orderId',orderController.updateOrder);

// Route to delete an existing order

module.exports = router;
