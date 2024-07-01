const express = require('express');
const router = express.Router();
const paymentController = require('../Controller/PaymentController')
router.post('/create', paymentController.createPayment);



module.exports = router;
