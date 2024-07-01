const moment = require('moment');

// Function to calculate the date based on the period and start date
function calculateDate(period, fromDate = moment().utcOffset('+0545')) {
    let date = moment(fromDate);
    switch (period) {
        case 'monthly':
            date = date.add(1, 'months');
            break;
        case 'quarterly':
            date = date.add(3, 'months');
            break;
        case 'yearly':
            date = date.add(1, 'years');
            break;
        default:
            throw new Error('Invalid period. Use "monthly", "quarterly", or "yearly".');
    }
    return date.format();
}

// Example usage
const customDate = '2024-06-20T19:28:13.860+00:00';

const monthlyDate = calculateDate('monthly', customDate);
console.log('Monthly Date:', monthlyDate);

const quarterlyDate = calculateDate('quarterly', customDate);
console.log('Quarterly Date:', quarterlyDate);

const yearlyDate = calculateDate('yearly', customDate);
console.log('Yearly Date:', yearlyDate);

// Using the current Nepal time if no fromDate is provided
const monthlyDateCurrent = calculateDate('monthly');
console.log('Monthly Date (Current):', monthlyDateCurrent);

const quarterlyDateCurrent = calculateDate('quarterly');
console.log('Quarterly Date (Current):', quarterlyDateCurrent);

const yearlyDateCurrent = calculateDate('yearly');
console.log('Yearly Date (Current):', yearlyDateCurrent);
