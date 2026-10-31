export interface VivaQuestion {
  id: number;
  category: 'Overview' | 'Architecture' | 'Python' | 'Java' | 'Security Rules' | 'Limitations';
  question: string;
  answer: string;
  proTip?: string;
}

export const VIVA_QUESTIONS: VivaQuestion[] = [
  {
    id: 1,
    category: 'Overview',
    question: 'What is MedShield, and what is the primary objective of this project?',
    answer:
      'MedShield is an Information Security desktop application built for Al-Shifa Medical Clinic (Gulberg, Sahiwal). Its primary objective is to protect healthcare clinic staff—such as receptionists, nurses, lab technicians, and managers—from falling victim to phishing attacks through two practical features: an email phishing detector and an interactive security training quiz.',
    proTip: 'Mention Al-Shifa Medical Clinic and the target users immediately to show practical relevance.',
  },
  {
    id: 2,
    category: 'Overview',
    question: 'Why did you choose a healthcare clinic specifically for this project?',
    answer:
      'Healthcare staff handle sensitive patient records (EMRs, lab reports, billing information). Attackers frequently exploit healthcare workers because they are busy and under stress, using fake emergency patient reports to trick them into entering passwords or opening malicious links.',
  },
  {
    id: 3,
    category: 'Overview',
    question: 'What are the two core features of MedShield?',
    answer:
      'Feature 1 is the Phishing Email Detector, which checks email sender, subject, and body against 5 rule-based indicators to calculate a risk score out of 9. Feature 2 is the Healthcare Staff Training Quiz, which presents 5 clinic-specific scenarios with instant feedback to train staff.',
  },
  {
    id: 4,
    category: 'Architecture',
    question: 'How do Java and Python communicate in your project?',
    answer:
      'We use Java ProcessBuilder. The Java Swing GUI collects the sender email, subject, and message, and starts the Python process (python medshield_detector.py). The inputs are passed to Python as arguments, and Java reads Python’s analysis output via an InputStream (standard output) and displays it on screen.',
    proTip: 'Emphasize that this is done without heavy web frameworks like Flask or Django.',
  },
  {
    id: 5,
    category: 'Architecture',
    question: 'Why did you use both Java and Python instead of just one language?',
    answer:
      'Java Swing provides a fast, stable, and beginner-friendly desktop graphical user interface (GUI) with buttons, text fields, and tabs. Python is ideal for text manipulation, keyword searching, and string analysis. Combining them through ProcessBuilder demonstrates inter-process communication (IPC) in software engineering.',
  },
  {
    id: 6,
    category: 'Architecture',
    question: 'What is ProcessBuilder in Java?',
    answer:
      'ProcessBuilder is a standard Java class in the java.lang package used to create operating system processes. It allows a Java program to invoke external commands (like running python), pass arguments, and read standard output and error streams.',
  },
  {
    id: 7,
    category: 'Security Rules',
    question: 'What is rule-based detection, and why did you choose it over Machine Learning?',
    answer:
      'Rule-based detection checks text against predefined logic and indicators (such as specific keywords and domain patterns). We chose it because it is lightweight, runs completely offline with zero dependencies, executes in milliseconds, and provides 100% explainable results to the user with no "black box" decisions.',
  },
  {
    id: 8,
    category: 'Security Rules',
    question: 'What are the 5 detection rules and how is the 9-point score calculated?',
    answer:
      '1. Urgent language (2 pts) - e.g., "Urgent", "Immediately", "Act Now".\n2. Login or password requests (2 pts) - e.g., "Login", "Password", "Verify Account".\n3. Suspicious links or link wording (2 pts) - e.g., "http://", "https://", "Click Here", "Link Below".\n4. Threatening deadlines (2 pts) - e.g., "Within 24 Hours", "Account Will Be Disabled".\n5. Unusual digits in sender domain (1 pt) - e.g., "cl1nic-labs.com".\nEach category is counted once, yielding a maximum total score of 9.',
  },
  {
    id: 9,
    category: 'Security Rules',
    question: 'What are the risk levels defined in MedShield?',
    answer:
      'The score out of 9 is divided into three tiers:\n- 0 to 2 points: LOW RISK\n- 3 to 5 points: MEDIUM RISK\n- 6 to 9 points: HIGH RISK',
  },
  {
    id: 10,
    category: 'Security Rules',
    question: 'Why does MedShield say "No obvious warning signs found" instead of "This email is completely safe"?',
    answer:
      'Because no security tool can guarantee 100% safety. Claiming an email is "completely safe" creates false confidence, which is dangerous in cybersecurity. Even clean-looking emails could be targeted spear-phishing.',
  },
  {
    id: 11,
    category: 'Security Rules',
    question: 'What is typo-squatting, and how does your detector identify it?',
    answer:
      'Typo-squatting is when an attacker registers a domain that looks visually almost identical to a legitimate organization, often by replacing letters with digits (e.g., "cl1nic" with numeral 1 instead of letter i, or "h0spital" with numeral 0). Our Python function extract_domain and has_digits_in_domain checks the domain portion for digit characters.',
  },
  {
    id: 12,
    category: 'Python',
    question: 'What Python libraries are required to run medshield_detector.py?',
    answer:
      'Only Python’s built-in sys module. No third-party packages, pip installs, or external libraries are required.',
  },
  {
    id: 13,
    category: 'Python',
    question: 'How does medshield_detector.py handle uppercase vs lowercase letters?',
    answer:
      'It converts both the email subject and email body into lowercase using Python’s .lower() string method before checking for keywords. This ensures detection works regardless of how the sender capitalizes words.',
  },
  {
    id: 14,
    category: 'Java',
    question: 'Which Java Swing components did you use to build the MedShield GUI?',
    answer:
      'JFrame for the main application window, JTabbedPane for the two tabs, JPanel with BorderLayout/BoxLayout/FlowLayout for layouts, JLabel for text, JTextField and JTextArea for inputs, JButton for actions, JRadioButton and ButtonGroup for quiz choices, and JOptionPane for alert dialogs.',
  },
  {
    id: 15,
    category: 'Java',
    question: 'How does Java handle multiline email text without crashing?',
    answer:
      'In Java, JTextArea captures multiline text. ProcessBuilder passes this string directly into the process argument array or stdin stream without invoking an intermediary command shell, preserving newlines and quotes cleanly.',
  },
  {
    id: 16,
    category: 'Java',
    question: 'Where are the quiz questions stored in your program?',
    answer:
      'The quiz questions are stored directly in memory inside an ArrayList of QuizQuestion objects in MedShieldApp.java. This keeps the application simple, self-contained, and database-free.',
  },
  {
    id: 17,
    category: 'Java',
    question: 'What happens if Python is not installed or not in PATH when a user clicks "Analyze Email"?',
    answer:
      'The Java code catches IOException and displays a polite, actionable error message explaining that Python was not found and giving 4 clear troubleshooting steps to verify PATH or install Python.',
  },
  {
    id: 18,
    category: 'Security Rules',
    question: 'Does MedShield connect to live email inboxes or download attachments?',
    answer:
      'No. MedShield operates strictly as an offline inspection tool where staff paste email content. It intentionally does not open links, download attachments, or connect to mail servers, ensuring zero risk of accidental malware execution.',
  },
  {
    id: 19,
    category: 'Limitations',
    question: 'What are the technical limitations of your current MedShield project?',
    answer:
      '1. It uses a fixed keyword and pattern list; novel phishing phrasing without these keywords might bypass detection.\n2. It does not inspect email header routing (DKIM, SPF, DMARC).\n3. It does not sandbox attachments or live URL destinations.\n4. Quiz scores are not permanently stored in a central clinic management database.',
  },
  {
    id: 20,
    category: 'Limitations',
    question: 'What future improvements could you add to MedShield in Phase 2?',
    answer:
      '1. Outlook and Thunderbird mail add-in integration for one-click scanning.\n2. SPF, DKIM, and DMARC DNS record verification.\n3. SQLite database to track staff quiz completion certificates for clinic compliance audits.\n4. Urdu language localized user interface for local clinic staff in Pakistan.',
  },
  {
    id: 21,
    category: 'Overview',
    question: 'How would you demonstrate this project right now to the examiner?',
    answer:
      'First, I open MedShieldApp and show the two tabs. Next, I click "Load Phishing Sample" to show the fake lab report from lab-reports@cl1nic-labs.com. I click "Analyze Email", and explain the 9/9 HIGH RISK score and 5 detected reasons. Then, I load the clean meeting email to show 0/9 LOW RISK. Finally, I switch to Tab 2 and answer a training quiz question to show the instant feedback mechanism.',
  },
  {
    id: 22,
    category: 'Overview',
    question: 'What did you personally learn while building this project?',
    answer:
      'I learned how desktop GUIs are structured with Java Swing, how to implement inter-process communication using ProcessBuilder, how to design modular rule-based security scoring algorithms in Python, and the practical challenges of cybersecurity in healthcare environments.',
  },
];
