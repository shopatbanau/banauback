const moment = require('moment');

// Function to calculate the date based on the period and start date
function calculateDate(period, fromDate = moment().utcOffset('+0545')) {
    let date;
    switch (period) {
        case 'Monthly':
            date = fromDate.add(1, 'months');
            break;
        case 'Quarterly':
            date = fromDate.add(3, 'months');
            break;
        case 'Yearly':
            date = fromDate.add(1, 'years');
            break;
        default:
            return '';
    }
    return date.format();
}


// Function to calculate the date based on the period and start date
function calculateDatev1(period, fromDate = moment().utcOffset('+0545')) {
    let date = moment(fromDate);
    switch (period) {
        case 'Monthly':
            date = date.add(1, 'months');
            break;
        case 'Quarterly':
            date = date.add(3, 'months');
            break;
        case 'Yearly':
            date = date.add(1, 'years');
            break;
        default:
            throw new Error('Invalid period. Use "monthly", "quarterly", or "yearly".');
    }
    return date.format();
}
function getCurrentDateTime() {
    const nepalTimeNow = moment().utcOffset('+0545');
    return nepalTimeNow.format();
}
module.exports = {
    calculateDate,
    calculateDatev1,
    getCurrentDateTime,

};

