"""
Vercel Serverless Function: Python Backend for MedShield Email Analysis
File: api/analyze.py
"""

from http.server import BaseHTTPRequestHandler
import json
import os
import sys

# Add parent directory to path so we can import medshield_detector if present
parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

try:
    from medshield_detector import analyze_email, extract_domain, has_digits_in_domain
except ImportError:
    # Safe inline fallback with identical logic if imported in an isolated environment
    def extract_domain(email_address):
        clean = email_address.strip()
        if "@" in clean:
            return clean.split("@")[-1].lower()
        return clean.lower()

    def has_digits_in_domain(domain):
        return any(c.isdigit() for c in domain)

    def analyze_email(sender_email, email_subject, email_body):
        combined = (email_subject + " " + email_body).lower()
        domain = extract_domain(sender_email)
        score = 0
        reasons = []

        if any(w in combined for w in ["urgent", "immediately", "act now", "right away", "action required", "asap", "critical"]):
            score += 2
            reasons.append("Urgent or high-pressure language detected (e.g., 'urgent', 'immediately', 'act now').")

        if any(w in combined for w in ["login", "log in", "password", "verify account", "sign in", "reset password", "credentials", "verify your"]):
            score += 2
            reasons.append("Login, password, or account verification request detected (credential harvesting risk).")

        if any(w in combined for w in ["http://", "https://", "click here", "link below", "follow the link", "open link", "click the link", "visit this link"]):
            score += 2
            reasons.append("Suspicious link or link-related wording detected (e.g., 'link below', 'click here', or web URL).")

        if any(w in combined for w in ["within 24 hours", "account will be disabled", "access will be disabled", "suspended", "terminated", "within 12 hours", "within 48 hours", "deactivated"]):
            score += 2
            reasons.append("Threatening deadline or account suspension warning detected (e.g., 'within 24 hours' or 'disabled').")

        if domain and has_digits_in_domain(domain):
            score += 1
            reasons.append(f"Unusual digit(s) found in sender domain '{domain}' (often used in typo-squatting attacks).")

        if score >= 6:
            risk = "HIGH RISK"
            rec = "DANGER: Treat this email as extremely dangerous. Do not click any links, do not download any attachments, and never enter your clinic passwords. Immediately report this message to the Al-Shifa IT supervisor."
        elif score >= 3:
            risk = "MEDIUM RISK"
            rec = "WARNING: This email contains suspicious indicators. Avoid clicking links. Verify the request in person or by calling the sender on known clinic phone numbers."
        else:
            risk = "LOW RISK"
            rec = "NOTE: No obvious warning signs were detected in this email. However, no automated detector can guarantee 100% safety. Always stay vigilant when handling patient data."

        lines = [
            "=" * 60,
            "        MEDSHIELD - PHISHING EMAIL ANALYSIS REPORT",
            "        Al-Shifa Medical Clinic - Gulberg, Sahiwal",
            "=" * 60,
            "",
            f"Sender Email  : {sender_email.strip() or 'Not provided'}",
            f"Email Subject : {email_subject.strip() or 'Not provided'}",
            "",
            "-" * 60,
            f"RISK LEVEL    : {risk}",
            f"TOTAL SCORE   : {score} / 9 Points",
            "-" * 60,
            "",
            "DETECTION REASONS / WARNING SIGNS:",
        ]
        if reasons:
            for idx, r in enumerate(reasons, 1):
                lines.append(f"  {idx}. {r}")
        else:
            lines.append("  No obvious warning signs found.")

        lines.extend([
            "",
            "SAFETY RECOMMENDATION:",
            f"  {rec}",
            "",
            "=" * 60,
            "Notice: This rule-based tool assists clinic staff but does not replace",
            "standard security protocols or caution when handling medical records.",
            "=" * 60
        ])
        return "\n".join(lines)


class handler(BaseHTTPRequestHandler):
    def _set_headers(self, status=200):
        self.send_response(status)
        self.send_header('Content-Type', 'application/json')
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')
        self.end_headers()

    def do_OPTIONS(self):
        self._set_headers(200)

    def do_GET(self):
        self._set_headers(200)
        response_data = {
            "status": "online",
            "service": "MedShield Phishing Detector API",
            "organization": "Al-Shifa Medical Clinic (Sahiwal)",
            "message": "Send a POST request with JSON { sender, subject, body } to analyze an email."
        }
        self.wfile.write(json.dumps(response_data).encode('utf-8'))

    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            
            data = {}
            if post_data:
                data = json.loads(post_data.decode('utf-8'))

            sender = data.get('sender', '')
            subject = data.get('subject', '')
            body = data.get('body', '')

            # Run rule-based analysis
            report = analyze_email(sender, subject, body)

            # Determine score and risk level for JSON response
            combined = (subject + " " + body).lower()
            domain = extract_domain(sender)
            score = 0
            reasons = []

            if any(w in combined for w in ["urgent", "immediately", "act now", "right away", "action required", "asap", "critical"]):
                score += 2
                reasons.append("Urgent or high-pressure language detected (e.g., 'urgent', 'immediately', 'act now').")

            if any(w in combined for w in ["login", "log in", "password", "verify account", "sign in", "reset password", "credentials", "verify your"]):
                score += 2
                reasons.append("Login, password, or account verification request detected (credential harvesting risk).")

            if any(w in combined for w in ["http://", "https://", "click here", "link below", "follow the link", "open link", "click the link", "visit this link"]):
                score += 2
                reasons.append("Suspicious link or link-related wording detected (e.g., 'link below', 'click here', or web URL).")

            if any(w in combined for w in ["within 24 hours", "account will be disabled", "access will be disabled", "suspended", "terminated", "within 12 hours", "within 48 hours", "deactivated"]):
                score += 2
                reasons.append("Threatening deadline or account suspension warning detected (e.g., 'within 24 hours' or 'disabled').")

            if domain and has_digits_in_domain(domain):
                score += 1
                reasons.append(f"Unusual digit(s) found in sender domain '{domain}' (often used in typo-squatting attacks).")

            if score >= 6:
                risk_level = "HIGH RISK"
                recommendation = "DANGER: Treat this email as extremely dangerous. Do not click any links, do not download any attachments, and never enter your clinic passwords. Immediately report this message to the Al-Shifa IT supervisor."
            elif score >= 3:
                risk_level = "MEDIUM RISK"
                recommendation = "WARNING: This email contains suspicious indicators. Avoid clicking links. Verify the request in person or by calling the sender on known clinic phone numbers."
            else:
                risk_level = "LOW RISK"
                recommendation = "NOTE: No obvious warning signs were detected in this email. However, no automated detector can guarantee 100% safety. Always stay vigilant when handling patient data."

            result = {
                "success": True,
                "score": score,
                "maxScore": 9,
                "riskLevel": risk_level,
                "detectedReasons": reasons,
                "recommendation": recommendation,
                "formattedReport": report
            }

            self._set_headers(200)
            self.wfile.write(json.dumps(result).encode('utf-8'))

        except Exception as e:
            self._set_headers(500)
            error_response = {
                "success": False,
                "error": str(e)
            }
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
