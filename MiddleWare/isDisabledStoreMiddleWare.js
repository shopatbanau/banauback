const Store = require("../Model/Store-model");

// storeMiddleware.js


const checkStoreDisabled = async (req, res, next) => {
    try {
        const storeId = req.params.storeID || req.body.storeID;
        console.log({ store: storeId });
        if (!storeId) {
            return res.status(400).json({ message: 'storeId is required' });
        }
        const store = await Store.findById(storeId).select('isDisabled');
        if (!store) {
            return res.status(404).json({ message: 'Store not found' });
        }

        if (store.isDisabled) {
            return res.status(403).json({ message: 'Store is disabled, please contact office' });
        }

        next();
    } catch (error) {
        return res.status(500).json({ message: 'Internal server error', error: error.message });
    }
};

module.exports = checkStoreDisabled;
