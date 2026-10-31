/**
 * Pure rule-based detection logic matching medshield_detector.py 1:1.
 */

export interface AnalysisResult {
  score: number;
  maxScore: number;
  riskLevel: 'LOW RISK' | 'MEDIUM RISK' | 'HIGH RISK';
  detectedReasons: string[];
  recommendation: string;
  domain: string;
  hasDomainDigit: boolean;
  formattedReport: string;
}

export function extractDomain(emailAddress: string): string {
  const clean = emailAddress.trim();
  if (clean.includes('@')) {
    const parts = clean.split('@');
    return parts[parts.length - 1].toLowerCase();
  }
  return clean.toLowerCase();
}

export function hasDigitsInDomain(domain: string): boolean {
  return /[0-9]/.test(domain);
}

export function analyzeEmail(senderEmail: string, emailSubject: string, emailBody: string): AnalysisResult {
  const combinedText = `${emailSubject} ${emailBody}`.toLowerCase();
  const domain = extractDomain(senderEmail);
  const domainHasDigit = hasDigitsInDomain(domain);

  let score = 0;
  const reasons: string[] = [];

  // Rule 1: Urgent or pressure language (2 points)
  const urgentKeywords = [
    'urgent',
    'immediately',
    'act now',
    'right away',
    'action required',
    'asap',
    'critical',
  ];
  if (urgentKeywords.some((kw) => combinedText.includes(kw))) {
    score += 2;
    reasons.push("Urgent or high-pressure language detected (e.g., 'urgent', 'immediately', 'act now').");
  }

  // Rule 2: Login or password requests (2 points)
  const loginKeywords = [
    'login',
    'log in',
    'password',
    'verify account',
    'sign in',
    'reset password',
    'credentials',
    'verify your',
  ];
  if (loginKeywords.some((kw) => combinedText.includes(kw))) {
    score += 2;
    reasons.push('Login, password, or account verification request detected (credential harvesting risk).');
  }

  // Rule 3: Suspicious links or link-related wording (2 points)
  const linkKeywords = [
    'http://',
    'https://',
    'click here',
    'link below',
    'follow the link',
    'open link',
    'click the link',
    'visit this link',
  ];
  if (linkKeywords.some((kw) => combinedText.includes(kw))) {
    score += 2;
    reasons.push("Suspicious link or link-related wording detected (e.g., 'link below', 'click here', or web URL).");
  }

  // Rule 4: Threatening deadlines or account suspension (2 points)
  const deadlineKeywords = [
    'within 24 hours',
    'account will be disabled',
    'access will be disabled',
    'suspended',
    'terminated',
    'within 12 hours',
    'within 48 hours',
    'deactivated',
  ];
  if (deadlineKeywords.some((kw) => combinedText.includes(kw))) {
    score += 2;
    reasons.push("Threatening deadline or account suspension warning detected (e.g., 'within 24 hours' or 'disabled').");
  }

  // Rule 5: Unusual digits in sender domain (1 point)
  if (domain && domainHasDigit) {
    score += 1;
    reasons.push(`Unusual digit(s) found in sender domain '${domain}' (often used in typo-squatting attacks).`);
  }

  // Determine Risk Level
  let riskLevel: 'LOW RISK' | 'MEDIUM RISK' | 'HIGH RISK' = 'LOW RISK';
  let recommendation = '';

  if (score >= 6) {
    riskLevel = 'HIGH RISK';
    recommendation =
      'DANGER: Treat this email as extremely dangerous. Do not click any links, do not download any attachments, and never enter your clinic passwords. Immediately report this message to the Al-Shifa IT supervisor.';
  } else if (score >= 3) {
    riskLevel = 'MEDIUM RISK';
    recommendation =
      'WARNING: This email contains suspicious indicators. Avoid clicking links. Verify the request in person or by calling the sender on known clinic phone numbers.';
  } else {
    riskLevel = 'LOW RISK';
    recommendation =
      'NOTE: No obvious warning signs were detected in this email. However, no automated detector can guarantee 100% safety. Always stay vigilant when handling patient data.';
  }

  // Formatted report string
  const lines: string[] = [
    '============================================================',
    '        MEDSHIELD - PHISHING EMAIL ANALYSIS REPORT',
    '        Al-Shifa Medical Clinic - Gulberg, Sahiwal',
    '============================================================',
    '',
    `Sender Email  : ${senderEmail.trim() || 'Not provided'}`,
    `Email Subject : ${emailSubject.trim() || 'Not provided'}`,
    '',
    '------------------------------------------------------------',
    `RISK LEVEL    : ${riskLevel}`,
    `TOTAL SCORE   : ${score} / 9 Points`,
    '------------------------------------------------------------',
    '',
    'DETECTION REASONS / WARNING SIGNS:',
  ];

  if (reasons.length > 0) {
    reasons.forEach((r, idx) => {
      lines.push(`  ${idx + 1}. ${r}`);
    });
  } else {
    lines.push('  No obvious warning signs found.');
  }

  lines.push('');
  lines.push('SAFETY RECOMMENDATION:');
  lines.push(`  ${recommendation}`);
  lines.push('');
  lines.push('============================================================');
  lines.push('Notice: This rule-based tool assists clinic staff but does not replace');
  lines.push('standard security protocols or caution when handling medical records.');
  lines.push('============================================================');

  return {
    score,
    maxScore: 9,
    riskLevel,
    detectedReasons: reasons,
    recommendation,
    domain,
    hasDomainDigit: domainHasDigit,
    formattedReport: lines.join('\n'),
  };
}
