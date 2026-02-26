/**
 * FILE: SovereignRegulator.js
 * PURPOSE: Hard-coded safety limits for the Bank's Minting Authority.
 */

const BANK_MASTER_CONFIG = {
    ANCHOR_BLUE_LINE: 10000000, // $10M Sovereign Anchor
    MAX_LOAN_CAP_PERCENT: 0.10, // 10% Red Line Cap ($1M)
    COLLATERAL_RATIO: 1.3333,   // The 1.33x Rule
    LTV_ALLOWED: 0.75           // 75% Loan-to-Value
};

let currentSiloState = {
    activeLoans: 0,            // Total ALI in the field
    publicCollateral: 0,       // Total Token A Locked (The 13.33%)
    feeRevenueW1: 0            // Captured 0.25% Bank Fees
};

export function validateMintRequest(requestAmount) {
    const hardCap = BANK_MASTER_CONFIG.ANCHOR_BLUE_LINE * BANK_MASTER_CONFIG.MAX_LOAN_CAP_PERCENT;
    const requiredCollateral = requestAmount * BANK_MASTER_CONFIG.COLLATERAL_RATIO;

    // RULE 1: Total loans cannot exceed $1M (10% of Anchor)
    if ((currentSiloState.activeLoans + requestAmount) > hardCap) {
        return { approved: false, reason: "EXCEEDS_10_PERCENT_RED_LINE" };
    }

    // RULE 2: Must have 1.33x Collateral compared to the loan
    if (currentSiloState.publicCollateral < requiredCollateral) {
        return { approved: false, reason: "INSUFFICIENT_COLLATERAL_RATIO" };
    }

    currentSiloState.activeLoans += requestAmount;
    return { approved: true, mintAmount: requestAmount };
}
