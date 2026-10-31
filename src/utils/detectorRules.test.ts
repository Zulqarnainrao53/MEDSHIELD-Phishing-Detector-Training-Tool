import test from 'node:test';
import assert from 'node:assert/strict';
import { analyzeEmail, extractDomain, hasDigitsInDomain } from './detectorRules';

test('extractDomain correctly parses email domains', () => {
  assert.equal(extractDomain('lab-reports@cl1nic-labs.com'), 'cl1nic-labs.com');
  assert.equal(extractDomain('USER@DOMAIN.PK'), 'domain.pk');
  assert.equal(extractDomain('invalid-no-at-sign'), 'invalid-no-at-sign');
});

test('hasDigitsInDomain detects digits in typo-squatted domains', () => {
  assert.equal(hasDigitsInDomain('cl1nic-labs.com'), true);
  assert.equal(hasDigitsInDomain('path0logy.org'), true);
  assert.equal(hasDigitsInDomain('clinic-labs.com'), false);
  assert.equal(hasDigitsInDomain('alshifaclinic.com'), false);
});

test('detects high-risk phishing sample with 9/9 points', () => {
  const result = analyzeEmail(
    'lab-reports@cl1nic-labs.com',
    'Urgent Patient Lab Report Ready, Verify Now',
    "Dear Staff, The patient's lab report is ready. Log in through the link below within 24 hours or access will be disabled."
  );

  assert.equal(result.score, 9);
  assert.equal(result.riskLevel, 'HIGH RISK');
  assert.equal(result.detectedReasons.length, 5);
  assert.ok(result.recommendation.includes('DANGER'));
});

test('detects low-risk clean email with 0 points', () => {
  const result = analyzeEmail(
    'doctor.ahmed@alshifaclinic.com',
    'Staff Meeting on Tuesday',
    'Dear team, Please remember our routine weekly staff meeting will be held in conference room B on Tuesday at 10 AM.'
  );

  assert.equal(result.score, 0);
  assert.equal(result.riskLevel, 'LOW RISK');
  assert.equal(result.detectedReasons.length, 0);
  assert.ok(result.formattedReport.includes('No obvious warning signs found.'));
  assert.ok(result.recommendation.includes('NOTE: No obvious warning signs were detected'));
});

test('medium risk scoring works properly (3 to 5 points)', () => {
  // Only urgent language (2) + domain digit (1) = 3 points -> MEDIUM RISK
  const result = analyzeEmail(
    'nurse@h0spital.com',
    'Urgent memo for team',
    'Please read the updated shift schedule posted on the clinic wall.'
  );

  assert.equal(result.score, 3);
  assert.equal(result.riskLevel, 'MEDIUM RISK');
});
