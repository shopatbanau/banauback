const User = require('../Model/User-model');


const banauAccessRole = async (req, res, next) => {
    // TODO -> But I dont remember what
    const userID = req.userData.userID;
    console.log(`[+] Banau Access Role Hit`);
    try {
        // Check if the user exists
        const user = await User.findById(userID);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.isBanauAdmin) {
            return res.status(403).json({ message: 'Access Denied' });
        }
        /* If is banau employee allow to pass->to new function*/
        next();

    } catch (error) {
        console.error('Error finding user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = banauAccessRole;
