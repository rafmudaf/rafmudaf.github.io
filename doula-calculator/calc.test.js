const { calcYearOOP, splitPostBirthVisits } = require('./calc');


// --- splitPostBirthVisits ---

test('no due date: all visits fall in Y1', () => {
    const r = splitPostBirthVisits('', 6);
    expect(r.y1).toBe(6);
    expect(r.y2).toBe(0);
    expect(r.dueYear).toBe(new Date().getFullYear());
});

test('due date early in year: all post-birth visits stay in Y1', () => {
    // Jan 1 → ~26 weeks remaining → floor(26/2) = 13 slots
    const r = splitPostBirthVisits('2025-01-01', 6);
    expect(r.y1).toBe(6);
    expect(r.y2).toBe(0);
    expect(r.dueYear).toBe(2025);
});

test('due date late in year: some post-birth visits spill into Y2', () => {
    // Dec 15 → ~16 days left → ~2.3 weeks → floor(2.3/2) = 1 slot
    const r = splitPostBirthVisits('2026-12-15', 4);
    expect(r.y1).toBe(1);
    expect(r.y2).toBe(3);
    expect(r.dueYear).toBe(2026);
});

test('due date Dec 31: no post-birth visits fit in Y1', () => {
    // noon on Dec 31 leaves < 0.5 days → 0 two-week slots
    const r = splitPostBirthVisits('2026-12-31', 3);
    expect(r.y1).toBe(0);
    expect(r.y2).toBe(3);
    expect(r.dueYear).toBe(2026);
});

test('custom weeksBetweenVisits: weekly visits fit more into Y1', () => {
    // Dec 15 → ~2.3 weeks remaining; weekly (1 week apart) → floor(2.3/1) = 2 slots
    const r = splitPostBirthVisits('2026-12-15', 4, 1);
    expect(r.y1).toBe(2);
    expect(r.y2).toBe(2);
});

test('custom weeksBetweenVisits: monthly visits fit fewer into Y1', () => {
    // Dec 1 → ~30 days → ~4.3 weeks; every 4 weeks → floor(4.3/4) = 1 slot
    const r = splitPostBirthVisits('2026-12-01', 4, 4);
    expect(r.y1).toBe(1);
    expect(r.y2).toBe(3);
});


// --- calcYearOOP ---

test('deductible not yet met: patient pays full gross cost', () => {
    // deductibleRemaining equals grossCost → entire amount applied to deductible
    grossCost = 1000;
    visits = 0;
    copay = 0;
    deductibleRemaining = 9999;
    oopMax = 0;
    coinsurancePct = 0;
    const r = calcYearOOP(grossCost, visits, copay, deductibleRemaining, oopMax, coinsurancePct);
    expect(r.patientCost).toBe(1000);
    expect(r.insurancePays).toBe(0);
});

test('deductible fully covers cost', () => {
    // $500 gross, $1000 deductible remaining → patient pays $500, insurance pays $0
    const r = calcYearOOP(500, 0, 0, 1000, 0, 0);
    expect(r.deductibleApplied).toBe(500);
    expect(r.patientCost).toBe(500);
    expect(r.insurancePays).toBe(0);
});

test('deductible partially met, coinsurance applies to remainder', () => {
    // $1000 gross, $400 deductible remaining, 20% coinsurance, no OOP max
    const r = calcYearOOP(1000, 0, 0, 400, 0, 0.2);
    expect(r.deductibleApplied).toBe(400);
    // subject to coinsurance: $600, patient owes 20% = $120
    expect(r.coinsurance).toBe(120);
    expect(r.patientCost).toBe(520);
    expect(r.insurancePays).toBe(480);
});

test('out-of-pocket max caps patient cost', () => {
    // $5000 gross, no deductible remaining, 20% coinsurance, $500 OOP max
    const r = calcYearOOP(5000, 0, 0, 0, 500, 0.2);
    expect(r.oopMaxHit).toBe(true);
    expect(r.patientCost).toBe(500);
    expect(r.insurancePays).toBe(4500);
});

test('copays are counted separately from insurable amount', () => {
    // $600 gross, 2 visits, $50 copay each → $100 copays, $500 insurable
    // $300 deductible remaining, 20% coinsurance
    const r = calcYearOOP(600, 2, 50, 300, 0, 0.2);
    expect(r.copays).toBe(100);
    expect(r.deductibleApplied).toBe(300);
    // subject to coinsurance: $500 - $300 = $200 → 20% = $40
    expect(r.coinsurance).toBe(40);
    expect(r.patientCost).toBe(440);
});

test('deductible already met: only coinsurance applies', () => {
    // $1000 gross, deductible already fully paid (remaining = 0), 20% coinsurance
    const r = calcYearOOP(1000, 0, 0, 0, 0, 0.2);
    expect(r.deductibleApplied).toBe(0);
    expect(r.coinsurance).toBe(200);
    expect(r.patientCost).toBe(200);
    expect(r.insurancePays).toBe(800);
});

test('zero coinsurance: patient pays only deductible portion', () => {
    const r = calcYearOOP(1000, 0, 0, 300, 0, 0);
    expect(r.patientCost).toBe(300);
    expect(r.insurancePays).toBe(700);
});

