const moment = require('moment');

// Function to calculate the date based on the period and start date
function calculateDate(period, fromDate = moment().utcOffset('+0545')) {
    let date;
    switch (period) {
        case 'monthly':
            date = fromDate.add(1, 'months');
            break;
        case 'quarterly':
            date = fromDate.add(3, 'months');
            break;
        case 'yearly':
            date = fromDate.add(1, 'years');
            break;
        default:
            throw new Error('Invalid period. Use "monthly", "quarterly", or "yearly".');
    }
    return date.format();
}

// Example usage
const nepalTimeNow = moment().utcOffset('+0545');
console.log('Current Nepal Time:', nepalTimeNow.format());

const monthlyDate = calculateDate('monthly');
console.log('Monthly Date:', monthlyDate);

const quarterlyDate = calculateDate('quarterly');
console.log('Quarterly Date:', quarterlyDate);

const yearlyDate = calculateDate('yearly');
console.log('Yearly Date:', yearlyDate);
