"""
=============================================================================
Project Title : MedShield: Phishing Detector and Training Tool
Organization  : Al-Shifa Medical Clinic
Location      : Gulberg, Sahiwal, Punjab, Pakistan
File Name     : medshield_detector.py
Description   : Beginner-friendly rule-based phishing email detector written in
                pure Python using standard libraries only.
=============================================================================
"""

import sys


def extract_domain(email_address):
    """
    Extracts the domain portion of an email address.
    Example: 'lab-reports@cl1nic-labs.com' -> 'cl1nic-labs.com'
    """
    email_address = email_address.strip()
    if "@" in email_address:
        parts = email_address.split("@")
        return parts[-1].lower()
    return email_address.lower()


def has_digits_in_domain(domain):
    """
    Checks if the domain contains any digits (0-9).
    Phishers often substitute digits for letters, like 'cl1nic-labs.com'.
    """
    for character in domain:
        if character.isdigit():
            return True
    return False


def analyze_email(sender_email, email_subject, email_body):
    """
    Analyzes an email using simple rule-based checks and a 9-point score.
    Returns a formatted text report with risk level, score, detected reasons,
    and a clear healthcare safety recommendation.
    """
    # Convert all inputs to lowercase for case-insensitive keyword matching
    combined_text = (email_subject + " " + email_body).lower()
    sender_clean = sender_email.strip().lower()
    domain = extract_domain(sender_clean)

    score = 0
    reasons = []

    # Rule 1: Urgent or pressure language (2 points)
    urgent_keywords = [
        "urgent",
        "immediately",
        "act now",
        "right away",
        "action required",
        "asap",
        "critical",
    ]
    urgent_found = False
    for keyword in urgent_keywords:
        if keyword in combined_text:
            urgent_found = True
            break

    if urgent_found:
        score += 2
        reasons.append("Urgent or high-pressure language detected (e.g., 'urgent', 'immediately', 'act now').")

    # Rule 2: Login or password requests (2 points)
    login_keywords = [
        "login",
        "log in",
        "password",
        "verify account",
        "sign in",
        "reset password",
        "credentials",
        "verify your",
    ]
    login_found = False
    for keyword in login_keywords:
        if keyword in combined_text:
            login_found = True
            break

    if login_found:
        score += 2
        reasons.append("Login, password, or account verification request detected (credential harvesting risk).")

    # Rule 3: Suspicious links or link-related wording (2 points)
    link_keywords = [
        "http://",
        "https://",
        "click here",
        "link below",
        "follow the link",
        "open link",
        "click the link",
        "visit this link",
    ]
    link_found = False
    for keyword in link_keywords:
        if keyword in combined_text:
            link_found = True
            break

    if link_found:
        score += 2
        reasons.append("Suspicious link or link-related wording detected (e.g., 'link below', 'click here', or web URL).")

    # Rule 4: Threatening deadlines or account suspension (2 points)
    deadline_keywords = [
        "within 24 hours",
        "account will be disabled",
        "access will be disabled",
        "suspended",
        "terminated",
        "within 12 hours",
        "within 48 hours",
        "deactivated",
    ]
    deadline_found = False
    for keyword in deadline_keywords:
        if keyword in combined_text:
            deadline_found = True
            break

    if deadline_found:
        score += 2
        reasons.append("Threatening deadline or account suspension warning detected (e.g., 'within 24 hours' or 'disabled').")

    # Rule 5: Unusual digits in sender domain (1 point)
    if domain and has_digits_in_domain(domain):
        score += 1
        reasons.append(f"Unusual digit(s) found in sender domain '{domain}' (often used in typo-squatting attacks).")

    # Determine Risk Level based on 9-point scale
    # 0 - 2 : LOW RISK
    # 3 - 5 : MEDIUM RISK
    # 6 - 9 : HIGH RISK
    if score >= 6:
        risk_level = "HIGH RISK"
        recommendation = (
            "DANGER: Treat this email as extremely dangerous. Do not click any links, "
            "do not download any attachments, and never enter your clinic passwords. "
            "Immediately report this message to the Al-Shifa IT supervisor."
        )
    elif score >= 3:
        risk_level = "MEDIUM RISK"
        recommendation = (
            "WARNING: This email contains suspicious indicators. Avoid clicking links. "
            "Verify the request in person or by calling the sender on known clinic phone numbers."
        )
    else:
        risk_level = "LOW RISK"
        recommendation = (
            "NOTE: No obvious warning signs were detected in this email. However, no automated "
            "detector can guarantee 100% safety. Always stay vigilant when handling patient data."
        )

    # Build formatted result report
    report_lines = []
    report_lines.append("=" * 60)
    report_lines.append("        MEDSHIELD - PHISHING EMAIL ANALYSIS REPORT")
    report_lines.append("        Al-Shifa Medical Clinic - Gulberg, Sahiwal")
    report_lines.append("=" * 60)
    report_lines.append("")
    report_lines.append(f"Sender Email  : {sender_email.strip() or 'Not provided'}")
    report_lines.append(f"Email Subject : {email_subject.strip() or 'Not provided'}")
    report_lines.append("")
    report_lines.append("-" * 60)
    report_lines.append(f"RISK LEVEL    : {risk_level}")
    report_lines.append(f"TOTAL SCORE   : {score} / 9 Points")
    report_lines.append("-" * 60)
    report_lines.append("")
    report_lines.append("DETECTION REASONS / WARNING SIGNS:")

    if reasons:
        for idx, reason in enumerate(reasons, 1):
            report_lines.append(f"  {idx}. {reason}")
    else:
        report_lines.append("  No obvious warning signs found.")

    report_lines.append("")
    report_lines.append("SAFETY RECOMMENDATION:")
    report_lines.append(f"  {recommendation}")
    report_lines.append("")
    report_lines.append("=" * 60)
    report_lines.append("Notice: This rule-based tool assists clinic staff but does not replace")
    report_lines.append("standard security protocols or caution when handling medical records.")
    report_lines.append("=" * 60)

    return "\n".join(report_lines)


def main():
    """
    Main entry point. Supports both command-line arguments and standard input (stdin)
    so it works seamlessly with Java ProcessBuilder as well as direct command prompt testing.
    """
    sender = ""
    subject = ""
    body = ""

    # Option 1: Arguments passed via command line
    # Usage: python medshield_detector.py "<sender>" "<subject>" "<body>"
    if len(sys.argv) >= 4:
        sender = sys.argv[1]
        subject = sys.argv[2]
        body = sys.argv[3]
    else:
        # Option 2: Read from standard input (stdin)
        # Line 1: sender
        # Line 2: subject
        # Remaining lines: body
        lines = sys.stdin.read().splitlines()
        if len(lines) >= 1:
            sender = lines[0]
        if len(lines) >= 2:
            subject = lines[1]
        if len(lines) >= 3:
            body = "\n".join(lines[2:])

    # Generate and print the analysis report to stdout
    result = analyze_email(sender, subject, body)
    print(result)


if __name__ == "__main__":
    main()
