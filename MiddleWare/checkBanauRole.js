const User = require('../Model/User-model');

const checkBanauRole = (requiredRole) => {
    return async (req, res, next) => {
        const userID = req.userData.userID;

        try {
            // Check if the user exists
            const user = await User.findById(userID);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            
            // Define the role hierarchy
            const roleHierarchy = {
                'Admin': 3,
                'Manager': 2,
                'Staff': 1
            };

            if (!user.isBanauAdmin) {
                return res.status(403).json({ message: 'Access Denied' });
            }

            // Check the user's Banau role
            const userBanauRole = user.banauRoles.role;

            if (roleHierarchy[userBanauRole] >= roleHierarchy[requiredRole]) {
                return next(); // Allow access
            } else {
                console.log("bad permission");
                return res.status(403).json({ message: 'Access denied' });
            }

        } catch (error) {
            console.error('Error finding user:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    };
};

module.exports = checkBanauRole;
