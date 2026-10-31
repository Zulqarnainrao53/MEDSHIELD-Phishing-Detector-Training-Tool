/**
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

    // -------------------------------------------------------------
    // GUI Components for Tab 1: Phishing Email Detector
    // -------------------------------------------------------------
    private JTextField senderField;
    private JTextField subjectField;
    private JTextArea bodyTextArea;
    private JTextArea resultTextArea;
    private JLabel statusLabel;
    private JButton analyzeButton;
    private JButton clearButton;
    private JButton samplePhishingButton;
    private JButton sampleCleanButton;

    // -------------------------------------------------------------
    // GUI Components for Tab 2: Staff Training Quiz
    // -------------------------------------------------------------
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

    /**
     * Constructor: Initializes and builds the MedShield GUI window.
     */
    public MedShieldApp() {
        // Set window title and default close behavior
        super("MEDSHIELD - Healthcare Phishing Detector & Training Tool (Al-Shifa Medical Clinic)");
        setDefaultCloseOperation(JFrame.EXIT_ON_CLOSE);
        setSize(920, 720);
        setMinimumSize(new Dimension(800, 600));
        setLocationRelativeTo(null); // Center window on screen

        // Initialize quiz questions
        initializeQuizQuestions();

        // Main layout container
        JPanel mainPanel = new JPanel(new BorderLayout(10, 10));
        mainPanel.setBorder(new EmptyBorder(12, 12, 12, 12));

        // 1. Header Banner
        JPanel headerPanel = createHeaderPanel();
        mainPanel.add(headerPanel, BorderLayout.NORTH);

        // 2. Tabbed Pane containing the two main modules
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

        // Load the first question into the quiz tab
        loadCurrentQuizQuestion();
    }

    /**
     * Creates the top header panel with project, clinic, and location branding.
     */
    private JPanel createHeaderPanel() {
        JPanel headerPanel = new JPanel(new BorderLayout(5, 5));
        headerPanel.setBackground(new Color(24, 76, 120)); // Professional medical navy blue
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

    /**
     * Creates Tab 1: Phishing Email Detector interface.
     */
    private JPanel createDetectorPanel() {
        JPanel detectorPanel = new JPanel(new BorderLayout(10, 10));
        detectorPanel.setBorder(new EmptyBorder(10, 10, 10, 10));

        // Left / Input Form Panel
        JPanel inputPanel = new JPanel();
        inputPanel.setLayout(new BoxLayout(inputPanel, BoxLayout.Y_AXIS));
        inputPanel.setBorder(new TitledBorder(" Email Information (Inputs) "));

        // Sender Field
        JLabel senderLabel = new JLabel("Sender Email Address:");
        senderLabel.setFont(new Font("SansSerif", Font.BOLD, 12));
        senderLabel.setAlignmentX(Component.LEFT_ALIGNMENT);
        senderField = new JTextField();
        senderField.setMaximumSize(new Dimension(Integer.MAX_VALUE, 30));
        senderField.setToolTipText("Enter full email address (e.g., lab-reports@cl1nic-labs.com)");

        // Subject Field
        JLabel subjectLabel = new JLabel("Email Subject Line:");
        subjectLabel.setFont(new Font("SansSerif", Font.BOLD, 12));
        subjectLabel.setAlignmentX(Component.LEFT_ALIGNMENT);
        subjectField = new JTextField();
        subjectField.setMaximumSize(new Dimension(Integer.MAX_VALUE, 30));
        subjectField.setToolTipText("Enter email subject line");

        // Message Body Area
        JLabel bodyLabel = new JLabel("Email Message / Body:");
        bodyLabel.setFont(new Font("SansSerif", Font.BOLD, 12));
        bodyLabel.setAlignmentX(Component.LEFT_ALIGNMENT);
        bodyTextArea = new JTextArea(8, 30);
        bodyTextArea.setLineWrap(true);
        bodyTextArea.setWrapStyleWord(true);
        JScrollPane bodyScrollPane = new JScrollPane(bodyTextArea);
        bodyScrollPane.setAlignmentX(Component.LEFT_ALIGNMENT);

        // Buttons Panel
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

        // Assemble Left Input Panel
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

        // Right / Results Panel
        JPanel resultPanel = new JPanel(new BorderLayout(5, 5));
        resultPanel.setBorder(new TitledBorder(" Python Rule-Based Analysis Result "));

        resultTextArea = new JTextArea();
        resultTextArea.setFont(new Font("Monospaced", Font.PLAIN, 12));
        resultTextArea.setEditable(false);
        resultTextArea.setBackground(new Color(248, 250, 252));
        resultTextArea.setMargin(new Insets(10, 10, 10, 10));
        resultTextArea.setText("Enter email details above and click 'Analyze Email' to test.\n"
                + "Or click 'Load Phishing Sample' to test the Al-Shifa Clinic demonstration email.");

        JScrollPane resultScrollPane = new JScrollPane(resultTextArea);
        resultPanel.add(resultScrollPane, BorderLayout.CENTER);

        // Split pane to allow flexible resizing between input and results
        JSplitPane splitPane = new JSplitPane(JSplitPane.HORIZONTAL_SPLIT, inputPanel, resultPanel);
        splitPane.setResizeWeight(0.5);
        splitPane.setDividerLocation(440);

        detectorPanel.add(splitPane, BorderLayout.CENTER);

        // -------------------------------------------------------------
        // Action Listeners for Tab 1
        // -------------------------------------------------------------

        // 1. Analyze Email Button Click
        analyzeButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                handleEmailAnalysis();
            }
        });

        // 2. Clear Fields Button Click
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

        // 3. Load Sample Phishing Email Button Click (Demonstration)
        samplePhishingButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                senderField.setText("lab-reports@cl1nic-labs.com");
                subjectField.setText("Urgent Patient Lab Report Ready, Verify Now");
                bodyTextArea.setText("Dear Staff,\n\n"
                        + "The patient's lab report is ready. Log in through the link below within 24 hours "
                        + "or access will be disabled.\n\n"
                        + "Please verify your credentials immediately to avoid clinical delays.");
                statusLabel.setText("Sample phishing email loaded. Click 'Analyze Email' to inspect.");
            }
        });

        // 4. Load Sample Clean Email Button Click
        sampleCleanButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                senderField.setText("doctor.ahmed@alshifaclinic.com");
                subjectField.setText("Staff Meeting on Tuesday");
                bodyTextArea.setText("Dear team,\n\n"
                        + "Please remember our routine weekly staff meeting will be held in conference room B "
                        + "on Tuesday at 10 AM.\n\n"
                        + "Regards,\nDr. Ahmed\nAl-Shifa Medical Clinic");
                statusLabel.setText("Sample routine clean email loaded. Click 'Analyze Email' to inspect.");
            }
        });

        return detectorPanel;
    }

    /**
     * Executes the Python detector via ProcessBuilder with proper error handling.
     */
    private void handleEmailAnalysis() {
        String sender = senderField.getText().trim();
        String subject = subjectField.getText().trim();
        String body = bodyTextArea.getText().trim();

        // 1. Validate inputs
        if (sender.isEmpty() && subject.isEmpty() && body.isEmpty()) {
            JOptionPane.showMessageDialog(this,
                    "Please fill in the email information before analyzing.\nAll fields cannot be empty.",
                    "Empty Input Warning",
                    JOptionPane.WARNING_MESSAGE);
            return;
        }

        statusLabel.setText("Running Python detector (medshield_detector.py)...");
        resultTextArea.setText("Analyzing email... please wait.\nCalling Python detector...");

        // Run Python process in a lightweight background thread to prevent UI freezing
        new Thread(new Runnable() {
            @Override
            public void run() {
                String pythonResult = runPythonDetector(sender, subject, body);

                // Update UI on Swing Event Dispatch Thread
                SwingUtilities.invokeLater(new Runnable() {
                    @Override
                    public void run() {
                        resultTextArea.setText(pythonResult);
                        resultTextArea.setCaretPosition(0); // Scroll to top
                        statusLabel.setText("Analysis complete. Review risk score and warning signs above.");
                    }
                });
            }
        }).start();
    }

    /**
     * Connects Java and Python using ProcessBuilder.
     * Tries 'python', 'py' (Windows Python Launcher), and 'python3'.
     */
    private String runPythonDetector(String sender, String subject, String body) {
        String scriptName = "medshield_detector.py";

        // Check if medshield_detector.py exists in the working directory
        File scriptFile = new File(scriptName);
        if (!scriptFile.exists()) {
            // Check relative to current running class location
            File altFile = new File(System.getProperty("user.dir"), scriptName);
            if (altFile.exists()) {
                scriptFile = altFile;
            }
        }

        // List of candidate python commands for cross-platform and Windows compatibility
        String[] pythonCommands = {"python", "py", "python3"};
        Exception lastException = null;

        for (String pyCmd : pythonCommands) {
            try {
                // Prepare ProcessBuilder with command and arguments
                ProcessBuilder processBuilder = new ProcessBuilder(
                        pyCmd,
                        scriptFile.getAbsolutePath(),
                        sender,
                        subject,
                        body
                );

                // Start the process
                Process process = processBuilder.start();

                // Read output from Python
                BufferedReader reader = new BufferedReader(
                        new InputStreamReader(process.getInputStream(), StandardCharsets.UTF_8)
                );
                StringBuilder outputBuilder = new StringBuilder();
                String line;
                while ((line = reader.readLine()) != null) {
                    outputBuilder.append(line).append("\n");
                }
                reader.close();

                // Read any error messages from Python stderr
                BufferedReader errorReader = new BufferedReader(
                        new InputStreamReader(process.getErrorStream(), StandardCharsets.UTF_8)
                );
                StringBuilder errorBuilder = new StringBuilder();
                while ((line = errorReader.readLine()) != null) {
                    errorBuilder.append(line).append("\n");
                }
                errorReader.close();

                int exitCode = process.waitFor();

                if (exitCode == 0 && outputBuilder.length() > 0) {
                    return outputBuilder.toString();
                } else if (errorBuilder.length() > 0) {
                    return "Python Error Detected (Exit Code " + exitCode + "):\n"
                            + errorBuilder.toString()
                            + "\n\nPlease ensure medshield_detector.py contains valid Python code.";
                }

            } catch (IOException ioEx) {
                lastException = ioEx;
                // Continue loop to try next python command ('py' or 'python3')
            } catch (InterruptedException intEx) {
                return "Analysis was interrupted: " + intEx.getMessage();
            }
        }

        // If loop completes without success, return beginner-friendly troubleshooting steps
        return "ERROR: Could not execute Python!\n\n"
                + "Reason: " + (lastException != null ? lastException.getMessage() : "Python executable not found") + "\n\n"
                + "TROUBLESHOOTING STEPS FOR WINDOWS:\n"
                + "1. Verify that Python is installed. Open Command Prompt and type: python --version\n"
                + "2. During Python installation, make sure the checkbox 'Add python.exe to PATH' was checked.\n"
                + "3. Verify that 'medshield_detector.py' is placed in the exact same folder as 'MedShieldApp.class'.\n"
                + "4. Current directory searched: " + System.getProperty("user.dir") + "\n";
    }

    /**
     * Initializes the 5 healthcare-focused phishing quiz questions directly in Java code.
     */
    private void initializeQuizQuestions() {
        quizQuestions = new ArrayList<QuizQuestion>();

        // Question 1: Fake Patient Lab Report
        quizQuestions.add(new QuizQuestion(
                "Question 1: Fake Patient Lab Report Email\n\n"
                + "A clinic receptionist receives an email from 'reports@path0logy-labs.com' stating:\n"
                + "'Urgent: Patient COVID-19 and Blood chemistry reports attached. Click here to log in to view.'\n"
                + "What is the safest action for the receptionist to take?",
                new String[]{
                        "A) Click the link immediately to prevent clinical delay for the patient.",
                        "B) Forward the email to all doctors and nurses in the clinic.",
                        "C) Do not click the link; verify with the known pathology lab phone number directly.",
                        "D) Reply to the email asking for the patient's full medical history."
                },
                2, // Index 2 is Option C
                "Correct! Phishers frequently send fake urgent laboratory reports to lure clinic staff into "
                + "entering login credentials on phishing websites. Always verify unexpected reports through trusted clinic contacts."
        ));

        // Question 2: Suspicious Sender Domain
        quizQuestions.add(new QuizQuestion(
                "Question 2: Identifying Suspicious Sender Domains\n\n"
                + "You receive an urgent message from 'admin@al-sh1fa-clinic.com' asking you to update your billing software login.\n"
                + "What major warning sign is present in this email?",
                new String[]{
                        "A) The sender domain uses the digit '1' instead of the letter 'i' (typo-squatting).",
                        "B) The email contains normal medical terminology.",
                        "C) The email arrived during regular clinic working hours.",
                        "D) The clinic name is written in lowercase letters."
                },
                0, // Index 0 is Option A
                "Correct! Attackers frequently create look-alike domains by substituting numbers for letters "
                + "(e.g., '1' for 'i' or '0' for 'o') to trick busy healthcare staff. This technique is called typo-squatting."
        ));

        // Question 3: Threatening Deadlines
        quizQuestions.add(new QuizQuestion(
                "Question 3: Artificial Deadline & Coercion Tactics\n\n"
                + "An email claims that your Al-Shifa Medical Clinic portal access will be permanently disabled within 24 hours\n"
                + "unless you click a link and re-verify your password. What tactic is being used by the sender?",
                new String[]{
                        "A) Routine software maintenance notification.",
                        "B) High-pressure intimidation and artificial deadline to cause panic and bypass caution.",
                        "C) Legitimate government health regulatory audit.",
                        "D) Standard automated backup reminder."
                },
                1, // Index 1 is Option B
                "Correct! Threatening imminent account suspension or disciplinary action within 24 hours is a classic "
                + "social engineering tactic designed to rush victims into making hasty mistakes without thinking."
        ));

        // Question 4: Password Requests
        quizQuestions.add(new QuizQuestion(
                "Question 4: Handling Credential & Password Requests\n\n"
                + "An email claiming to be from the clinic's internal IT department asks you to reply with your current password\n"
                + "because the clinic server is being upgraded. How should you respond?",
                new String[]{
                        "A) Send your password immediately so the upgrade does not fail.",
                        "B) Send your username now and your password in a separate follow-up email.",
                        "C) Change your password to '123456' before sending it.",
                        "D) Never share your password; legitimate IT departments will never ask for your password."
                },
                3, // Index 3 is Option D
                "Correct! Legitimate IT staff, administrators, and software vendors will NEVER request your personal or clinic password. "
                + "Any email requesting login passwords is an attempt at credential theft."
        ));

        // Question 5: Reporting Procedure
        quizQuestions.add(new QuizQuestion(
                "Question 5: Clinic Security Incident Response\n\n"
                + "You identify a suspicious phishing email in your clinic inbox. What is the correct first action to protect Al-Shifa Medical Clinic?",
                new String[]{
                        "A) Click the unsubscribe link at the bottom of the email.",
                        "B) Do not click any links; immediately report the email to the clinic IT manager.",
                        "C) Forward the email to your personal email account to inspect it at home.",
                        "D) Delete the email immediately without informing anyone so nobody else sees it."
                },
                1, // Index 1 is Option B
                "Correct! Reporting phishing emails immediately enables the clinic IT administrator to block the malicious domain "
                + "and alert other staff members (receptionists, nurses, lab techs) before anyone falls victim."
        ));
    }

    /**
     * Creates Tab 2: Healthcare Staff Training Quiz interface.
     */
    private JPanel createQuizPanel() {
        JPanel quizPanel = new JPanel(new BorderLayout(10, 10));
        quizPanel.setBorder(new EmptyBorder(12, 12, 12, 12));

        // Top quiz progress banner
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

        // Center: Question text + Radio buttons
        JPanel centerPanel = new JPanel();
        centerPanel.setLayout(new BoxLayout(centerPanel, BoxLayout.Y_AXIS));
        centerPanel.setBorder(new EmptyBorder(10, 10, 10, 10));

        questionLabel = new JLabel("<html><b>Loading Question...</b></html>");
        questionLabel.setFont(new Font("SansSerif", Font.PLAIN, 13));
        questionLabel.setAlignmentX(Component.LEFT_ALIGNMENT);

        // Options Radio Buttons
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

        // Feedback Text Area
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

        // Bottom Controls: Buttons
        JPanel quizButtonPanel = new JPanel(new FlowLayout(FlowLayout.RIGHT, 10, 10));

        submitAnswerButton = new JButton("Submit Answer");
        submitAnswerButton.setFont(new Font("SansSerif", Font.BOLD, 12));
        submitAnswerButton.setBackground(new Color(24, 76, 120));
        submitAnswerButton.setForeground(Color.WHITE);

        nextQuestionButton = new JButton("Next Question >");
        nextQuestionButton.setFont(new Font("SansSerif", Font.BOLD, 12));
        nextQuestionButton.setEnabled(false); // Enabled after submitting answer

        restartQuizButton = new JButton("Restart Quiz");
        restartQuizButton.setFont(new Font("SansSerif", Font.PLAIN, 12));

        quizButtonPanel.add(restartQuizButton);
        quizButtonPanel.add(submitAnswerButton);
        quizButtonPanel.add(nextQuestionButton);

        quizPanel.add(quizButtonPanel, BorderLayout.SOUTH);

        // -------------------------------------------------------------
        // Action Listeners for Tab 2
        // -------------------------------------------------------------

        // 1. Submit Answer
        submitAnswerButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                handleSubmitQuizAnswer();
            }
        });

        // 2. Next Question
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

        // 3. Restart Quiz
        restartQuizButton.addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                restartQuiz();
            }
        });

        return quizPanel;
    }

    /**
     * Loads the current question onto the quiz panel.
     */
    private void loadCurrentQuizQuestion() {
        if (currentQuestionIndex >= quizQuestions.size()) {
            return;
        }

        QuizQuestion q = quizQuestions.get(currentQuestionIndex);

        quizProgressLabel.setText("Question " + (currentQuestionIndex + 1) + " of " + quizQuestions.size());
        scoreSummaryLabel.setText("Current Score: " + userScore + " / " + quizQuestions.size());

        // Format question with HTML line breaks for neat multi-line display
        String formattedQuestion = "<html><body style='width: 540px;'>"
                + q.questionText.replace("\n", "<br>")
                + "</body></html>";
        questionLabel.setText(formattedQuestion);

        // Set radio button texts
        optionA.setText(q.options[0]);
        optionB.setText(q.options[1]);
        optionC.setText(q.options[2]);
        optionD.setText(q.options[3]);

        // Clear previous selections and enable buttons
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

    /**
     * Checks the selected answer, updates score, and provides immediate explanation.
     */
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
            feedbackArea.setText("CORRECT! Well done!\n\n" + q.explanation);
        } else {
            char correctLetter = (char) ('A' + q.correctIndex);
            feedbackArea.setBackground(new Color(255, 235, 235));
            feedbackArea.setForeground(new Color(160, 25, 25));
            feedbackArea.setText("INCORRECT. The correct answer was Option (" + correctLetter + ").\n\n" + q.explanation);
        }

        scoreSummaryLabel.setText("Current Score: " + userScore + " / " + quizQuestions.size());

        // Lock radio buttons to prevent modifying answer
        optionA.setEnabled(false);
        optionB.setEnabled(false);
        optionC.setEnabled(false);
        optionD.setEnabled(false);

        submitAnswerButton.setEnabled(false);
        nextQuestionButton.setEnabled(true);
    }

    /**
     * Displays the final score and clinic certification rating after all 5 questions.
     */
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
        feedbackArea.setText("FINAL SUMMARY FOR AL-SHIFA MEDICAL CLINIC:\n"
                + "- Total Questions: 5\n"
                + "- Correct Answers: " + userScore + "\n"
                + "- Score Percentage: " + (userScore * 20) + "%\n"
                + "- Status: " + rating + "\n\n"
                + "Click 'Restart Quiz' to practice again.");

        submitAnswerButton.setEnabled(false);
        nextQuestionButton.setEnabled(false);
    }

    /**
     * Resets the quiz to the first question with score 0.
     */
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

    /**
     * Creates the bottom footer status bar.
     */
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

    /**
     * Main method: Application entry point.
     * Starts the Java Swing GUI using EventQueue.
     */
    public static void main(String[] args) {
        // Use system look and feel if available for a native, clean appearance
        try {
            UIManager.setLookAndFeel(UIManager.getSystemLookAndFeelClassName());
        } catch (Exception ignored) {
            // Default look and feel is used if system look and feel fails
        }

        // Launch GUI on the Swing Event Dispatch Thread (standard Java practice)
        SwingUtilities.invokeLater(new Runnable() {
            @Override
            public void run() {
                MedShieldApp app = new MedShieldApp();
                app.setVisible(true);
            }
        });
    }
}
