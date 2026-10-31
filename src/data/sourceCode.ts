export const PYTHON_SOURCE_CODE = `"""
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

    return "\\n".join(report_lines)


def main():
    sender = ""
    subject = ""
    body = ""

    # Option 1: Arguments passed via command line
    if len(sys.argv) >= 4:
        sender = sys.argv[1]
        subject = sys.argv[2]
        body = sys.argv[3]
    else:
        # Option 2: Read from standard input (stdin)
        lines = sys.stdin.read().splitlines()
        if len(lines) >= 1:
            sender = lines[0]
        if len(lines) >= 2:
            subject = lines[1]
        if len(lines) >= 3:
            body = "\\n".join(lines[2:])

    # Generate and print the analysis report to stdout
    result = analyze_email(sender, subject, body)
    print(result)


if __name__ == "__main__":
    main()
`;

export const JAVA_SOURCE_CODE = `/**
 * =============================================================================
 * Project Title : MedShield: Phishing Detector and Training Tool
 * Organization  : Al-Shifa Medical Clinic
 * Location      : Gulberg, Sahiwal, Punjab, Pakistan
 * File Name     : MedShieldApp.java
 * Description   : Beginner-friendly Java Swing graphical desktop application.
 *                 Connects to Python detector (medshield_detector.py) via
 *                 ProcessBuilder and provides an interactive 5-question
 *                 phishing training quiz for healthcare clinic staff.
 * =============================================================================
 */

import javax.swing.*;
import javax.swing.border.EmptyBorder;
import javax.swing.border.TitledBorder;
import java.awt.*;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

public class MedShieldApp extends JFrame {

    // GUI Components for Tab 1: Phishing Email Detector
    private JTextField senderField;
    private JTextField subjectField;
    private JTextArea bodyTextArea;
    private JTextArea resultTextArea;
    private JLabel statusLabel;
    private JButton analyzeButton;
    private JButton clearButton;
    private JButton samplePhishingButton;
    private JButton sampleCleanButton;

    // GUI Components for Tab 2: Staff Training Quiz
    private JLabel quizProgressLabel;
    private JLabel questionLabel;
    private JRadioButton optionA;
    private JRadioButton optionB;
    private JRadioButton optionC;
    private JRadioButton optionD;
    private ButtonGroup optionGroup;
    private JButton submitAnswerButton;
    private JButton nextQuestionButton;
    private JButton restartQuizButton;
    private JTextArea feedbackArea;
    private JLabel scoreSummaryLabel;

    // Quiz Data & State Variables
    private List<QuizQuestion> quizQuestions;
    private int currentQuestionIndex = 0;
    private int userScore = 0;

    /**
     * Inner class representing a simple multiple-choice quiz question.
     */
    static class QuizQuestion {
        String questionText;
        String[] options;
        int correctIndex; // 0 for A, 1 for B, 2 for C, 3 for D
        String explanation;

        public QuizQuestion(String questionText, String[] options, int correctIndex, String explanation) {
            this.questionText = questionText;
            this.options = options;
            this.correctIndex = correctIndex;
            this.explanation = explanation;
        }
    }

    public MedShieldApp() {
        super("MEDSHIELD - Healthcare Phishing Detector & Training Tool (Al-Shifa Medical Clinic)");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(920, 720);
        setMinimumSize(new Dimension(800, 600));
        setLocationRelativeTo(null);

        initializeQuizQuestions();

        JPanel mainPanel = new JPanel(new BorderLayout(10, 10));
        mainPanel.setBorder(new EmptyBorder(12, 12, 12, 12));

        // 1. Header Banner
        JPanel headerPanel = createHeaderPanel();
        mainPanel.add(headerPanel, BorderLayout.NORTH);

        // 2. Tabbed Pane
        JTabbedPane tabbedPane = new JTabbedPane();
        tabbedPane.setFont(new Font("SansSerif", Font.BOLD, 13));

        JPanel detectorPanel = createDetectorPanel();
        JPanel quizPanel = createQuizPanel();

        tabbedPane.addTab("  1. Phishing Email Detector  ", detectorPanel);
        tabbedPane.addTab("  2. Staff Training Quiz  ", quizPanel);

        mainPanel.add(tabbedPane, BorderLayout.CENTER);

        // 3. Footer status banner
        JPanel footerPanel = createFooterPanel();
        mainPanel.add(footerPanel, BorderLayout.SOUTH);

        setContentPane(mainPanel);
        loadCurrentQuizQuestion();
    }

    private JPanel createHeaderPanel() {
        JPanel headerPanel = new JPanel(new BorderLayout(5, 5));
        headerPanel.setBackground(new Color(24, 76, 120));
        headerPanel.setBorder(new EmptyBorder(14, 18, 14, 18));

        JLabel titleLabel = new JLabel("MEDSHIELD: Phishing Detector & Training Tool");
        titleLabel.setFont(new Font("SansSerif", Font.BOLD, 22));
        titleLabel.setForeground(Color.WHITE);

        JLabel subtitleLabel = new JLabel("Al-Shifa Medical Clinic  •  Gulberg, Sahiwal, Punjab, Pakistan");
        subtitleLabel.setFont(new Font("SansSerif", Font.PLAIN, 13));
        subtitleLabel.setForeground(new Color(220, 235, 252));

        JLabel roleLabel = new JLabel("Target Users: Receptionists, Nurses, Lab Technicians, Billing Staff, Clinic Managers");
        roleLabel.setFont(new Font("SansSerif", Font.ITALIC, 11));
        roleLabel.setForeground(new Color(185, 215, 245));

        JPanel titleBox = new JPanel();
        titleBox.setLayout(new BoxLayout(titleBox, BoxLayout.Y_AXIS));
        titleBox.setOpaque(false);
        titleBox.add(titleLabel);
        titleBox.add(Box.createVerticalStrut(4));
        titleBox.add(subtitleLabel);
        titleBox.add(Box.createVerticalStrut(3));
        titleBox.add(roleLabel);

        headerPanel.add(titleBox, BorderLayout.CENTER);
        return headerPanel;
    }

    private JPanel createDetectorPanel() {
        JPanel detectorPanel = new JPanel(new BorderLayout(10, 10));
        detectorPanel.setBorder(new EmptyBorder(10, 10, 10, 10));

        JPanel inputPanel = new JPanel();
        inputPanel.setLayout(new BoxLayout(inputPanel, BoxLayout.Y_AXIS));
        inputPanel.setBorder(new TitledBorder(" Email Information (Inputs) "));

        JLabel senderLabel = new JLabel("Sender Email Address:");
        senderLabel.setFont(new Font("SansSerif", Font.BOLD, 12));
        senderLabel.setAlignmentX(Component.LEFT_ALIGNMENT);
        senderField = new JTextField();
        senderField.setMaximumSize(new Dimension(Integer.MAX_VALUE, 30));

        JLabel subjectLabel = new JLabel("Email Subject Line:");
        subjectLabel.setFont(new Font("SansSerif", Font.BOLD, 12));
        subjectLabel.setAlignmentX(Component.LEFT_ALIGNMENT);
        subjectField = new JTextField();
        subjectField.setMaximumSize(new Dimension(Integer.MAX_VALUE, 30));

        JLabel bodyLabel = new JLabel("Email Message / Body:");
        bodyLabel.setFont(new Font("SansSerif", Font.BOLD, 12));
        bodyLabel.setAlignmentX(Component.LEFT_ALIGNMENT);
        bodyTextArea = new JTextArea(8, 30);
        bodyTextArea.setLineWrap(true);
        bodyTextArea.setWrapStyleWord(true);
        JScrollPane bodyScrollPane = new JScrollPane(bodyTextArea);
        bodyScrollPane.setAlignmentX(Component.LEFT_ALIGNMENT);

        JPanel buttonPanel = new JPanel(new FlowLayout(FlowLayout.LEFT, 8, 8));
        buttonPanel.setAlignmentX(Component.LEFT_ALIGNMENT);

        analyzeButton = new JButton("Analyze Email");
        analyzeButton.setFont(new Font("SansSerif", Font.BOLD, 12));
        analyzeButton.setBackground(new Color(20, 120, 80));
        analyzeButton.setForeground(Color.WHITE);

        clearButton = new JButton("Clear Fields");
        samplePhishingButton = new JButton("Load Phishing Sample");
        sampleCleanButton = new JButton("Load Clean Sample");

        buttonPanel.add(analyzeButton);
        buttonPanel.add(clearButton);
        buttonPanel.add(samplePhishingButton);
        buttonPanel.add(sampleCleanButton);

        inputPanel.add(senderLabel);
        inputPanel.add(Box.createVerticalStrut(4));
        inputPanel.add(senderField);
        inputPanel.add(Box.createVerticalStrut(8));
        inputPanel.add(subjectLabel);
        inputPanel.add(Box.createVerticalStrut(4));
        inputPanel.add(subjectField);
        inputPanel.add(Box.createVerticalStrut(8));
        inputPanel.add(bodyLabel);
        inputPanel.add(Box.createVerticalStrut(4));
        inputPanel.add(bodyScrollPane);
        inputPanel.add(Box.createVerticalStrut(6));
        inputPanel.add(buttonPanel);

        JPanel resultPanel = new JPanel(new BorderLayout(5, 5));
        resultPanel.setBorder(new TitledBorder(" Python Rule-Based Analysis Result "));

        resultTextArea = new JTextArea();
        resultTextArea.setFont(new Font("Monospaced", Font.PLAIN, 12));
        resultTextArea.setEditable(false);
        resultTextArea.setBackground(new Color(248, 250, 252));
        resultTextArea.setMargin(new Insets(10, 10, 10, 10));
        resultTextArea.setText("Enter email details above and click 'Analyze Email' to test.\\n"
                + "Or click 'Load Phishing Sample' to test the Al-Shifa Clinic demonstration email.");

        JScrollPane resultScrollPane = new JScrollPane(resultTextArea);
        resultPanel.add(resultScrollPane, BorderLayout.CENTER);

        JSplitPane splitPane = new JSplitPane(JSplitPane.HORIZONTAL_SPLIT, inputPanel, resultPanel);
        splitPane.setResizeWeight(0.5);
        splitPane.setDividerLocation(440);

        detectorPanel.add(splitPane, BorderLayout.CENTER);

        analyzeButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                handleEmailAnalysis();
            }
        });

        clearButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                senderField.setText("");
                subjectField.setText("");
                bodyTextArea.setText("");
                resultTextArea.setText("Inputs cleared. Ready for next email analysis.");
                statusLabel.setText("Ready. Status: Idle.");
            }
        });

        samplePhishingButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                senderField.setText("lab-reports@cl1nic-labs.com");
                subjectField.setText("Urgent Patient Lab Report Ready, Verify Now");
                bodyTextArea.setText("Dear Staff,\\n\\n"
                        + "The patient's lab report is ready. Log in through the link below within 24 hours "
                        + "or access will be disabled.\\n\\n"
                        + "Please verify your credentials immediately to avoid clinical delays.");
                statusLabel.setText("Sample phishing email loaded. Click 'Analyze Email' to inspect.");
            }
        });

        sampleCleanButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                senderField.setText("doctor.ahmed@alshifaclinic.com");
                subjectField.setText("Staff Meeting on Tuesday");
                bodyTextArea.setText("Dear team,\\n\\n"
                        + "Please remember our routine weekly staff meeting will be held in conference room B "
                        + "on Tuesday at 10 AM.\\n\\n"
                        + "Regards,\\nDr. Ahmed\\nAl-Shifa Medical Clinic");
                statusLabel.setText("Sample routine clean email loaded. Click 'Analyze Email' to inspect.");
            }
        });

        return detectorPanel;
    }

    private void handleEmailAnalysis() {
        String sender = senderField.getText().trim();
        String subject = subjectField.getText().trim();
        String body = bodyTextArea.getText().trim();

        if (sender.isEmpty() && subject.isEmpty() && body.isEmpty()) {
            JOptionPane.showMessageDialog(this,
                    "Please fill in the email information before analyzing.\\nAll fields cannot be empty.",
                    "Empty Input Warning",
                    JOptionPane.WARNING_MESSAGE);
            return;
        }

        statusLabel.setText("Running Python detector (medshield_detector.py)...");
        resultTextArea.setText("Analyzing email... please wait.\\nCalling Python detector...");

        new Thread(new Runnable() {
            @Override
            public void run() {
                String pythonResult = runPythonDetector(sender, subject, body);

                SwingUtilities.invokeLater(new Runnable() {
                    @Override
                    public void run() {
                        resultTextArea.setText(pythonResult);
                        resultTextArea.setCaretPosition(0);
                        statusLabel.setText("Analysis complete. Review risk score and warning signs above.");
                    }
                });
            }
        }).start();
    }

    private String runPythonDetector(String sender, String subject, String body) {
        String scriptName = "medshield_detector.py";
        File scriptFile = new File(scriptName);
        if (!scriptFile.exists()) {
            File altFile = new File(System.getProperty("user.dir"), scriptName);
            if (altFile.exists()) {
                scriptFile = altFile;
            }
        }

        String[] pythonCommands = {"python", "py", "python3"};
        Exception lastException = null;

        for (String pyCmd : pythonCommands) {
            try {
                ProcessBuilder processBuilder = new ProcessBuilder(
                        pyCmd,
                        scriptFile.getAbsolutePath(),
                        sender,
                        subject,
                        body
                );

                Process process = processBuilder.start();

                BufferedReader reader = new BufferedReader(
                        new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8)
                );
                StringBuilder outputBuilder = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    outputBuilder.append(line).append("\\n");
                }
                reader.close();

                BufferedReader errorReader = new BufferedReader(
                        new InputStreamReader(process.getErrorStream(), StandardCharsets.UTF_8)
                );
                StringBuilder errorBuilder = new StringBuilder();
                while ((line = errorReader.readLine()) != null) {
                    errorBuilder.append(line).append("\\n");
                }
                errorReader.close();

                int exitCode = process.waitFor();

                if (exitCode == 0 && outputBuilder.length() > 0) {
                    return outputBuilder.toString();
                } else if (errorBuilder.length() > 0) {
                    return "Python Error Detected (Exit Code " + exitCode + "):\\n"
                            + errorBuilder.toString()
                            + "\\n\\nPlease ensure medshield_detector.py contains valid Python code.";
                }

            } catch (IOException ioEx) {
                lastException = ioEx;
            } catch (InterruptedException intEx) {
                return "Analysis was interrupted: " + intEx.getMessage();
            }
        }

        return "ERROR: Could not execute Python!\\n\\n"
                + "Reason: " + (lastException != null ? lastException.getMessage() : "Python executable not found") + "\\n\\n"
                + "TROUBLESHOOTING STEPS FOR WINDOWS:\\n"
                + "1. Verify that Python is installed. Open Command Prompt and type: python --version\\n"
                + "2. During Python installation, make sure the checkbox 'Add python.exe to PATH' was checked.\\n"
                + "3. Verify that 'medshield_detector.py' is placed in the exact same folder as 'MedShieldApp.class'.\\n"
                + "4. Current directory searched: " + System.getProperty("user.dir") + "\\n";
    }

    private void initializeQuizQuestions() {
        quizQuestions = new ArrayList<QuizQuestion>();

        quizQuestions.add(new QuizQuestion(
                "Question 1: Fake Patient Lab Report Email\\n\\n"
                + "A clinic receptionist receives an email from 'reports@path0logy-labs.com' stating:\\n"
                + "'Urgent: Patient COVID-19 and Blood chemistry reports attached. Click here to log in to view.'\\n"
                + "What is the safest action for the receptionist to take?",
                new String[]{
                        "A) Click the link immediately to prevent clinical delay for the patient.",
                        "B) Forward the email to all doctors and nurses in the clinic.",
                        "C) Do not click the link; verify with the known pathology lab phone number directly.",
                        "D) Reply to the email asking for the patient's full medical history."
                },
                2,
                "Correct! Phishers frequently send fake urgent laboratory reports to lure clinic staff into "
                + "entering login credentials on phishing websites. Always verify unexpected reports through trusted clinic contacts."
        ));

        quizQuestions.add(new QuizQuestion(
                "Question 2: Identifying Suspicious Sender Domains\\n\\n"
                + "You receive an urgent message from 'admin@al-sh1fa-clinic.com' asking you to update your billing software login.\\n"
                + "What major warning sign is present in this email?",
                new String[]{
                        "A) The sender domain uses the digit '1' instead of the letter 'i' (typo-squatting).",
                        "B) The email contains normal medical terminology.",
                        "C) The email arrived during regular clinic working hours.",
                        "D) The clinic name is written in lowercase letters."
                },
                0,
                "Correct! Attackers frequently create look-alike domains by substituting numbers for letters "
                + "(e.g., '1' for 'i' or '0' for 'o') to trick busy healthcare staff. This technique is called typo-squatting."
        ));

        quizQuestions.add(new QuizQuestion(
                "Question 3: Artificial Deadline & Coercion Tactics\\n\\n"
                + "An email claims that your Al-Shifa Medical Clinic portal access will be permanently disabled within 24 hours\\n"
                + "unless you click a link and re-verify your password. What tactic is being used by the sender?",
                new String[]{
                        "A) Routine software maintenance notification.",
                        "B) High-pressure intimidation and artificial deadline to cause panic and bypass caution.",
                        "C) Legitimate government health regulatory audit.",
                        "D) Standard automated backup reminder."
                },
                1,
                "Correct! Threatening imminent account suspension or disciplinary action within 24 hours is a classic "
                + "social engineering tactic designed to rush victims into making hasty mistakes without thinking."
        ));

        quizQuestions.add(new QuizQuestion(
                "Question 4: Handling Credential & Password Requests\\n\\n"
                + "An email claiming to be from the clinic's internal IT department asks you to reply with your current password\\n"
                + "because the clinic server is being upgraded. How should you respond?",
                new String[]{
                        "A) Send your password immediately so the upgrade does not fail.",
                        "B) Send your username now and your password in a separate follow-up email.",
                        "C) Change your password to '123456' before sending it.",
                        "D) Never share your password; legitimate IT departments will never ask for your password."
                },
                3,
                "Correct! Legitimate IT staff, administrators, and software vendors will NEVER request your personal or clinic password. "
                + "Any email requesting login passwords is an attempt at credential theft."
        ));

        quizQuestions.add(new QuizQuestion(
                "Question 5: Clinic Security Incident Response\\n\\n"
                + "You identify a suspicious phishing email in your clinic inbox. What is the correct first action to protect Al-Shifa Medical Clinic?",
                new String[]{
                        "A) Click the unsubscribe link at the bottom of the email.",
                        "B) Do not click any links; immediately report the email to the clinic IT manager.",
                        "C) Forward the email to your personal email account to inspect it at home.",
                        "D) Delete the email immediately without informing anyone so nobody else sees it."
                },
                1,
                "Correct! Reporting phishing emails immediately enables the clinic IT administrator to block the malicious domain "
                + "and alert other staff members (receptionists, nurses, lab techs) before anyone falls victim."
        ));
    }

    private JPanel createQuizPanel() {
        JPanel quizPanel = new JPanel(new BorderLayout(10, 10));
        quizPanel.setBorder(new EmptyBorder(12, 12, 12, 12));

        JPanel topInfoPanel = new JPanel(new BorderLayout());
        topInfoPanel.setBackground(new Color(235, 243, 250));
        topInfoPanel.setBorder(new EmptyBorder(8, 12, 8, 12));

        quizProgressLabel = new JLabel("Question 1 of 5");
        quizProgressLabel.setFont(new Font("SansSerif", Font.BOLD, 14));
        quizProgressLabel.setForeground(new Color(24, 76, 120));

        scoreSummaryLabel = new JLabel("Current Score: 0 / 5");
        scoreSummaryLabel.setFont(new Font("SansSerif", Font.BOLD, 13));
        scoreSummaryLabel.setForeground(new Color(20, 100, 50));

        topInfoPanel.add(quizProgressLabel, BorderLayout.WEST);
        topInfoPanel.add(scoreSummaryLabel, BorderLayout.EAST);

        quizPanel.add(topInfoPanel, BorderLayout.NORTH);

        JPanel centerPanel = new JPanel();
        centerPanel.setLayout(new BoxLayout(centerPanel, BoxLayout.Y_AXIS));
        centerPanel.setBorder(new EmptyBorder(10, 10, 10, 10));

        questionLabel = new JLabel("<html><b>Loading Question...</b></html>");
        questionLabel.setFont(new Font("SansSerif", Font.PLAIN, 13));
        questionLabel.setAlignmentX(Component.LEFT_ALIGNMENT);

        optionA = new JRadioButton("Option A");
        optionB = new JRadioButton("Option B");
        optionC = new JRadioButton("Option C");
        optionD = new JRadioButton("Option D");

        optionA.setFont(new Font("SansSerif", Font.PLAIN, 12));
        optionB.setFont(new Font("SansSerif", Font.PLAIN, 12));
        optionC.setFont(new Font("SansSerif", Font.PLAIN, 12));
        optionD.setFont(new Font("SansSerif", Font.PLAIN, 12));

        optionA.setAlignmentX(Component.LEFT_ALIGNMENT);
        optionB.setAlignmentX(Component.LEFT_ALIGNMENT);
        optionC.setAlignmentX(Component.LEFT_ALIGNMENT);
        optionD.setAlignmentX(Component.LEFT_ALIGNMENT);

        optionGroup = new ButtonGroup();
        optionGroup.add(optionA);
        optionGroup.add(optionB);
        optionGroup.add(optionC);
        optionGroup.add(optionD);

        centerPanel.add(questionLabel);
        centerPanel.add(Box.createVerticalStrut(12));
        centerPanel.add(optionA);
        centerPanel.add(Box.createVerticalStrut(6));
        centerPanel.add(optionB);
        centerPanel.add(Box.createVerticalStrut(6));
        centerPanel.add(optionC);
        centerPanel.add(Box.createVerticalStrut(6));
        centerPanel.add(optionD);
        centerPanel.add(Box.createVerticalStrut(15));

        feedbackArea = new JTextArea(4, 40);
        feedbackArea.setEditable(false);
        feedbackArea.setLineWrap(true);
        feedbackArea.setWrapStyleWord(true);
        feedbackArea.setFont(new Font("SansSerif", Font.PLAIN, 12));
        feedbackArea.setBackground(new Color(250, 250, 250));
        feedbackArea.setBorder(BorderFactory.createCompoundBorder(
                BorderFactory.createLineBorder(Color.LIGHT_GRAY),
                BorderFactory.createEmptyBorder(6, 6, 6, 6)
        ));
        feedbackArea.setText("Select an option above and click 'Submit Answer' to see explanation.");
        feedbackArea.setAlignmentX(Component.LEFT_ALIGNMENT);

        centerPanel.add(feedbackArea);
        quizPanel.add(centerPanel, BorderLayout.CENTER);

        JPanel quizButtonPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 10));

        submitAnswerButton = new JButton("Submit Answer");
        submitAnswerButton.setFont(new Font("SansSerif", Font.BOLD, 12));
        submitAnswerButton.setBackground(new Color(24, 76, 120));
        submitAnswerButton.setForeground(Color.WHITE);

        nextQuestionButton = new JButton("Next Question >");
        nextQuestionButton.setFont(new Font("SansSerif", Font.BOLD, 12));
        nextQuestionButton.setEnabled(false);

        restartQuizButton = new JButton("Restart Quiz");
        restartQuizButton.setFont(new Font("SansSerif", Font.PLAIN, 12));

        quizButtonPanel.add(restartQuizButton);
        quizButtonPanel.add(submitAnswerButton);
        quizButtonPanel.add(nextQuestionButton);

        quizPanel.add(quizButtonPanel, BorderLayout.SOUTH);

        submitAnswerButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                handleSubmitQuizAnswer();
            }
        });

        nextQuestionButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                currentQuestionIndex++;
                if (currentQuestionIndex < quizQuestions.size()) {
                    loadCurrentQuizQuestion();
                } else {
                    showFinalQuizSummary();
                }
            }
        });

        restartQuizButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                restartQuiz();
            }
        });

        return quizPanel;
    }

    private void loadCurrentQuizQuestion() {
        if (currentQuestionIndex >= quizQuestions.size()) {
            return;
        }

        QuizQuestion q = quizQuestions.get(currentQuestionIndex);

        quizProgressLabel.setText("Question " + (currentQuestionIndex + 1) + " of " + quizQuestions.size());
        scoreSummaryLabel.setText("Current Score: " + userScore + " / " + quizQuestions.size());

        String formattedQuestion = "<html><body style='width: 540px;'>"
                + q.questionText.replace("\\n", "<br>")
                + "</body></html>";
        questionLabel.setText(formattedQuestion);

        optionA.setText(q.options[0]);
        optionB.setText(q.options[1]);
        optionC.setText(q.options[2]);
        optionD.setText(q.options[3]);

        optionGroup.clearSelection();
        optionA.setEnabled(true);
        optionB.setEnabled(true);
        optionC.setEnabled(true);
        optionD.setEnabled(true);

        submitAnswerButton.setEnabled(true);
        nextQuestionButton.setEnabled(false);

        feedbackArea.setBackground(new Color(250, 250, 250));
        feedbackArea.setForeground(Color.DARK_GRAY);
        feedbackArea.setText("Select your answer and click 'Submit Answer'.");
    }

    private void handleSubmitQuizAnswer() {
        int selectedIndex = -1;
        if (optionA.isSelected()) selectedIndex = 0;
        else if (optionB.isSelected()) selectedIndex = 1;
        else if (optionC.isSelected()) selectedIndex = 2;
        else if (optionD.isSelected()) selectedIndex = 3;

        if (selectedIndex == -1) {
            JOptionPane.showMessageDialog(this,
                    "Please select one of the four options before submitting.",
                    "No Answer Selected",
                    JOptionPane.WARNING_MESSAGE);
            return;
        }

        QuizQuestion q = quizQuestions.get(currentQuestionIndex);
        boolean isCorrect = (selectedIndex == q.correctIndex);

        if (isCorrect) {
            userScore++;
            feedbackArea.setBackground(new Color(230, 250, 235));
            feedbackArea.setForeground(new Color(15, 110, 45));
            feedbackArea.setText("CORRECT! Well done!\\n\\n" + q.explanation);
        } else {
            char correctLetter = (char) ('A' + q.correctIndex);
            feedbackArea.setBackground(new Color(255, 235, 235));
            feedbackArea.setForeground(new Color(160, 25, 25));
            feedbackArea.setText("INCORRECT. The correct answer was Option (" + correctLetter + ").\\n\\n" + q.explanation);
        }

        scoreSummaryLabel.setText("Current Score: " + userScore + " / " + quizQuestions.size());

        optionA.setEnabled(false);
        optionB.setEnabled(false);
        optionC.setEnabled(false);
        optionD.setEnabled(false);

        submitAnswerButton.setEnabled(false);
        nextQuestionButton.setEnabled(true);
    }

    private void showFinalQuizSummary() {
        quizProgressLabel.setText("Quiz Completed!");
        scoreSummaryLabel.setText("Final Score: " + userScore + " / " + quizQuestions.size());

        String rating;
        Color ratingColor;
        if (userScore == 5) {
            rating = "EXCELLENT! Complete Phishing Awareness.";
            ratingColor = new Color(15, 110, 45);
        } else if (userScore >= 3) {
            rating = "GOOD. Basic awareness confirmed, but stay alert.";
            ratingColor = new Color(20, 80, 140);
        } else {
            rating = "NEEDS IMPROVEMENT. High risk of falling for phishing scams. Retake the quiz.";
            ratingColor = new Color(170, 30, 30);
        }

        questionLabel.setText("<html><h3>Training Quiz Finished!</h3>"
                + "<b>Staff Member Result:</b> " + userScore + " out of " + quizQuestions.size() + " correct answers.<br>"
                + "<b>Security Rating:</b> " + rating + "</html>");

        optionA.setVisible(false);
        optionB.setVisible(false);
        optionC.setVisible(false);
        optionD.setVisible(false);

        feedbackArea.setBackground(new Color(245, 245, 250));
        feedbackArea.setForeground(ratingColor);
        feedbackArea.setText("FINAL SUMMARY FOR AL-SHIFA MEDICAL CLINIC:\\n"
                + "- Total Questions: 5\\n"
                + "- Correct Answers: " + userScore + "\\n"
                + "- Score Percentage: " + (userScore * 20) + "%\\n"
                + "- Status: " + rating + "\\n\\n"
                + "Click 'Restart Quiz' to practice again.");

        submitAnswerButton.setEnabled(false);
        nextQuestionButton.setEnabled(false);
    }

    private void restartQuiz() {
        currentQuestionIndex = 0;
        userScore = 0;

        optionA.setVisible(true);
        optionB.setVisible(true);
        optionC.setVisible(true);
        optionD.setVisible(true);

        loadCurrentQuizQuestion();
        statusLabel.setText("Quiz restarted. Question 1 loaded.");
    }

    private JPanel createFooterPanel() {
        JPanel footerPanel = new JPanel(new BorderLayout());
        footerPanel.setBorder(new EmptyBorder(4, 4, 4, 4));

        statusLabel = new JLabel("MedShield Ready. Select a tab above to begin.");
        statusLabel.setFont(new Font("SansSerif", Font.PLAIN, 11));
        statusLabel.setForeground(Color.DARK_GRAY);

        JLabel copyrightLabel = new JLabel("University Information Security Project  |  Al-Shifa Clinic  ");
        copyrightLabel.setFont(new Font("SansSerif", Font.PLAIN, 11));
        copyrightLabel.setForeground(Color.GRAY);

        footerPanel.add(statusLabel, BorderLayout.WEST);
        footerPanel.add(copyrightLabel, BorderLayout.EAST);

        return footerPanel;
    }

    public static void main(String[] args) {
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception ignored) {
        }

        SwingUtilities.invokeLater(new Runnable() {
            @Override
            public void run() {
                MedShieldApp app = new MedShieldApp();
                app.setVisible(true);
            }
        });
    }
}
`;

export const README_SOURCE_CODE = `=============================================================================
                  MEDSHIELD: HEALTHCARE PHISHING DETECTOR
                         & STAFF TRAINING TOOL
               Al-Shifa Medical Clinic (Gulberg, Sahiwal)
=============================================================================

PROJECT OVERVIEW:
MedShield is an Information Security desktop application designed for clinic
receptionists, nurses, lab technicians, and administrative staff at Al-Shifa
Medical Clinic to detect suspicious phishing emails and complete interactive
security awareness training.

FILES IN THIS FOLDER:
1. medshield_detector.py - Python rule-based phishing detection engine.
2. MedShieldApp.java    - Java Swing desktop graphical user interface.
3. README.txt           - Quick setup and run instructions (this file).

PREREQUISITES:
1. Python 3.8 or later installed (ensure 'Add Python to PATH' was checked).
2. Java JDK 8 or later installed (javac and java commands).

HOW TO RUN ON WINDOWS (STEP-BY-STEP):

Step 1: Open Command Prompt
        Press Windows Key + R, type 'cmd', and press Enter.

Step 2: Check Python Installation
        Type:
            python --version
        (You should see Python 3.x.x. If not, download from python.org)

Step 3: Check Java Installation
        Type:
            javac -version
            java -version
        (You should see javac 1.8.x or 11.x or 17.x or 21.x)

Step 4: Navigate to the MedShield project folder
        Example:
            cd C:\\Users\\YourName\\Documents\\MedShield

Step 5: Compile the Java Application
        Type:
            javac MedShieldApp.java

Step 6: Run MedShield
        Type:
            java MedShieldApp

HOW TO TEST:
1. In Tab 1 ("Phishing Email Detector"):
   - Click "Load Phishing Sample" to test the lab report scenario.
   - Click "Analyze Email". The Java app invokes medshield_detector.py
     via ProcessBuilder and displays the 9/9 HIGH RISK score and reasons.
   - Click "Load Clean Sample" and test the routine meeting email (0/9 LOW RISK).
2. In Tab 2 ("Staff Training Quiz"):
   - Answer the 5 healthcare phishing questions one by one.
   - Read the instant feedback explanations.
   - View your final awareness rating.

=============================================================================
Contact / Author: Zulqarnain Rajput
Organization    : Al-Shifa Medical Clinic, Sahiwal, Punjab, Pakistan
=============================================================================
`;

export const VERCEL_JSON_CODE = `{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": "vite",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    },
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
`;

export const API_ANALYZE_PY_CODE = `"""
Vercel Serverless Function: Python Backend for MedShield Email Analysis
File: api/analyze.py
"""

from http.server import BaseHTTPRequestHandler
import json
import os
import sys

parent_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)

try:
    from medshield_detector import analyze_email, extract_domain, has_digits_in_domain
except ImportError:
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

        return f"Risk Level: {risk}\\nScore: {score}/9\\nRecommendation: {rec}"


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
        self.wfile.write(json.dumps({"status": "online", "service": "MedShield API"}).encode('utf-8'))

    def do_POST(self):
        try:
            content_length = int(self.headers.get('Content-Length', 0))
            post_data = self.rfile.read(content_length)
            data = json.loads(post_data.decode('utf-8')) if post_data else {}
            
            sender = data.get('sender', '')
            subject = data.get('subject', '')
            body = data.get('body', '')

            report = analyze_email(sender, subject, body)
            self._set_headers(200)
            self.wfile.write(json.dumps({"success": True, "formattedReport": report}).encode('utf-8'))
        except Exception as e:
            self._set_headers(500)
            self.wfile.write(json.dumps({"success": False, "error": str(e)}).encode('utf-8'))
`;

