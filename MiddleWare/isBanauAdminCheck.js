const User = require('../Model/User-model');


const checkToBeUpdateIsAdmin = async (req, res, next) => {
    try {
        const userId = req.params.id;
        if (!userId)
            return res.json({ message: '[+] UserId Is Required' });
        // Check if the user exists
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.isBanauAdmin) {
            return res.status(403).json({ message: 'Is Not A Part Of Team' });
        }
        if (user.banauRoles.role === 'Admin')
            return res.status(403).json({ message: 'Changes Cannot be made to admins' });
        /* If is banau employee allow to pass->to new function*/
        next();

    } catch (error) {
        console.error('Error finding user:', error);
        return res.status(500).json({ message: 'Internal server error' });
    }
};

module.exports = checkToBeUpdateIsAdmin;
