
if (typeof module !== 'undefined') {
    module.exports = { calcYearOOP, splitPostBirthVisits };
}

/**
 * Splits post-birth visits across calendar years based on the due date.
 * Any visits that extend past December 31st are counted in the following year,
 * when the insurance deductible resets.
 *
 * @param {string} dueDateStr - Due date in YYYY-MM-DD format, or empty string to skip splitting.
 * @param {number} postBirth - Total number of post-birth visits.
 * @param {number} [weeksBetweenVisits=2] - Number of weeks between each post-birth visit.
 * @returns {{ y1: number, y2: number, dueYear: number }}
 *   y1: visits in the due-date year, y2: visits in the following year,
 *   dueYear: the calendar year of the due date (current year if dueDateStr is empty).
 */
function splitPostBirthVisits(dueDateStr, postBirth, weeksBetweenVisits) {
    if (weeksBetweenVisits === undefined) weeksBetweenVisits = 2;
    if (!dueDateStr) return { y1: postBirth, y2: 0, dueYear: new Date().getFullYear() };
    var dueDate = new Date(dueDateStr + 'T12:00:00');
    var dueYear = dueDate.getFullYear();
    var dec31 = new Date(dueYear, 11, 31);
    var daysRemaining = Math.max(0, (dec31 - dueDate) / (1000 * 60 * 60 * 24));
    var weeksRemaining = daysRemaining / 7;
    var y1 = Math.min(postBirth, Math.floor(weeksRemaining / weeksBetweenVisits));
    return { y1: y1, y2: postBirth - y1, dueYear: dueYear };
}


/**
 * Calculates the patient's out-of-pocket cost for a single calendar year.
 *
 * @param {number} grossCost - Total amount billed this year (copays + insurable charges).
 * @param {number} visits - Number of visits occurring this year.
 * @param {number} copay - Fixed copay amount per visit.
 * @param {number} deductibleRemaining - How much of the deductible has yet to be met.
 * @param {number} oopMax - Annual out-of-pocket maximum (0 to disable).
 * @param {number} coinsurancePct - Patient's coinsurance share as a decimal (e.g. 0.2 for 20%).
 * @returns {{
 *   grossCost: number,
 *   visits: number,
 *   copays: number,
 *   deductibleApplied: number,
 *   coinsurance: number,
 *   rawPatient: number,
 *   patientCost: number,
 *   insurancePays: number,
 *   oopMaxHit: boolean
 * }}
 */
function calcYearOOP(grossCost, visits, copay, deductibleRemaining, oopMax, coinsurancePct) {
    var copays = visits * copay;
    var insurable = Math.max(0, grossCost - copays);
    var deductibleApplied = Math.min(insurable, deductibleRemaining);
    var afterDeductible = insurable - deductibleApplied;
    var coinsuranceRaw = afterDeductible * coinsurancePct;

    var rawPatient = copays + deductibleApplied + coinsuranceRaw;
    var patientCost = (oopMax > 0) ? Math.min(rawPatient, oopMax) : rawPatient;

    // Actual coinsurance paid after OOP
    var coinsuranceActual = Math.max(0, patientCost - copays - deductibleApplied);

    return {
        grossCost: grossCost,
        visits: visits,
        copays: copays,
        deductibleApplied: deductibleApplied,
        coinsurance: coinsuranceActual,
        rawPatient: rawPatient,
        patientCost: patientCost,
        insurancePays: Math.max(0, grossCost - patientCost),
        oopMaxHit: (oopMax > 0) && (rawPatient >= oopMax)
    };
}

