const User = require('../Model/User-model');
const Store = require('../Model/Store-model'); // Import the Store model
require('dotenv').config(); // Load environment variables from .env file

const checkRole = (requiredRole) => {
    return async (req, res, next) => {
        const userID = req.userData.userID;
        const storeID = req.body.storeId || req.query.storeId;
        try {
            // Retrieve the user data
            const user = await User.findById(userID);
            if (!user || !userID) {
                return res.status(401).json({ message: 'User not authenticated' });
            }
            console.log(user);
            // Check if the user email is the bypass email
            if (user.email === process.env.bypassemail) {
                return next();
            }

            // Check if the store exists
            const store = await Store.findById(storeID);
            if (!store) {
                return res.status(404).json({ message: 'Store not found' });
            }

            // Define the role hierarchy
            const roleHierarchy = {
                'Owner': 4,
                'Admin': 3,
                'Staff': 2,
                'Delivery': 1
            };

            // Find the role for the specified store
            const userRoleForStore = user.roles.find(role => role.storeId.toString() === storeID);
            if (userRoleForStore && roleHierarchy[userRoleForStore.role] >= roleHierarchy[requiredRole]) {
                next(); // Allow access
            } else {
                console.log("bad permission");
                return res.status(403).json({ message: 'Access denied' });
            }

        } catch (error) {
            console.error('Error finding user or store:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };
};

module.exports = checkRole;
