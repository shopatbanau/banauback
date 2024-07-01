const Store = require('../Model/Store-model');
const User = require('../Model/User-model');
const TransactionLogs = require('../Model/logs-model');
const mongoose = require('mongoose');


const getLogsByFilter = async (req, res) => {
    try {
        const searchTerms = req.query.search ? req.query.search.split(',').map(term => term.trim()).filter(Boolean) : [];
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 2;
        const employeename = req.query.employeename ? req.query.employeename.trim() : '';
        const storename = req.query.storename ? req.query.storename.trim() : '';

        let searchConditions = [];
        console.log({ searchTerms, employeename, storename });

        if (searchTerms.length > 0) {
            searchTerms.forEach(term => {
                const termConditions = [
                    { customerName: { $regex: term, $options: 'i' } },
                    { paymentMethod: { $regex: term, $options: 'i' } },
                    { subscriptionStatus: { $regex: term, $options: 'i' } },
                    // Add more fields as needed
                ];

                if (mongoose.Types.ObjectId.isValid(term)) {
                    termConditions.push({ _id: term });
                }

                searchConditions.push({ $or: termConditions });
            });
        }

        // Add employeename to search conditions if provided
        if (employeename) {
            // Find employee IDs by employee name
            const employeeQuery = { name: { $regex: employeename, $options: 'i' } };
            const employees = await User.find(employeeQuery).select('_id').lean();
            const employeeIds = employees.map(employee => employee._id);
            console.log({ employees, employeeIds });
            if (employeeIds.length > 0) {
                searchConditions.push({ employee: { $in: employeeIds } });
            } else {
                // If no employees match the provided employeename, return empty result
                return res.json({ ok: true, logs: [], page, limit, totalCount: 0, hasNextPage: false });
            }
        }
        // Add storename to search conditions if provided
        if (storename) {
            // Find store IDs by store name
            const storeQuery = { name: { $regex: storename, $options: 'i' } };
            const stores = await Store.find(storeQuery).select('_id').lean();
            const storeIds = stores.map(store => store._id);
            console.log({ stores, storeIds });
            if (storeIds.length > 0) {
                searchConditions.push({ store: { $in: storeIds } });
            } else {
                // If no employees match the provided employeename, return empty result
                return res.json({ ok: true, logs: [], page, limit, totalCount: 0, hasNextPage: false });
            }
        }
        // Construct the query
        const query = searchConditions.length > 0 ? { $and: searchConditions } : {};
        console.log(query);

        // Count total number of matching stores
        const totalCount = await TransactionLogs.countDocuments(query);

        // Query the database with pagination
        const logs = await TransactionLogs.find(query, {
            _id: 1,
            employee: 1,
            pendingAmount: 1,
            dueAmount: 1,
            subscriptionStatus: 1,
            paymentReceived: 1,
            paymentGiven: 1,
            logDescription: 1,
            store: 1,
            owner: 1,
            paymentMethod: 1,
            subscriptionExpiry: 1,
        })
            .populate('employee', 'name') // Populate the employee field with User documents, selecting only the name field
            .populate('store', 'name') // Populate the owner field with User documents, selecting only the name field
            .skip((page - 1) * limit)
            .limit(limit)
            .exec();
        console.log({ logs });
        // Return the results with pagination info
        return res.json({
            ok: true,
            logs,
            page,
            limit,
            totalCount,
            hasNextPage: (page * limit) < totalCount
        });

    } catch (error) {
        console.error('Error in getLogsByFilter:', error);
        return res.status(500).json({ ok: false, error: error.message });
    }
};

module.exports = {
    getLogsByFilter
};