// Middleware to set the custom property to skip the check
const skipDisabledCheck = (req, res, next) => {
    console.log('[+] skipDisabledCheck was hit: ');
    req.skipDisabledCheck = true;
    next();
};

module.exports = {
    skipDisabledCheck
};