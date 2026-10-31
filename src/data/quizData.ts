export interface QuizQuestionItem {
  id: number;
  category: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export const QUIZ_QUESTIONS: QuizQuestionItem[] = [
  {
    id: 1,
    category: 'Fake Patient Lab Report',
    question:
      "A clinic receptionist receives an email from 'reports@path0logy-labs.com' stating: 'Urgent: Patient COVID-19 and Blood chemistry reports attached. Click here to log in to view.' What is the safest action for the receptionist to take?",
    options: [
      'A) Click the link immediately to prevent clinical delay for the patient.',
      'B) Forward the email to all doctors and nurses in the clinic.',
      'C) Do not click the link; verify with the known pathology lab phone number directly.',
      "D) Reply to the email asking for the patient's full medical history.",
    ],
    correctIndex: 2,
    explanation:
      'Correct! Phishers frequently send fake urgent laboratory reports to lure clinic staff into entering login credentials on phishing websites. Always verify unexpected reports through trusted clinic contacts.',
  },
  {
    id: 2,
    category: 'Suspicious Sender Domains',
    question:
      "You receive an urgent message from 'admin@al-sh1fa-clinic.com' asking you to update your billing software login. What major warning sign is present in this email?",
    options: [
      "A) The sender domain uses the digit '1' instead of the letter 'i' (typo-squatting).",
      'B) The email contains normal medical terminology.',
      'C) The email arrived during regular clinic working hours.',
      'D) The clinic name is written in lowercase letters.',
    ],
    correctIndex: 0,
    explanation:
      "Correct! Attackers frequently create look-alike domains by substituting numbers for letters (e.g., '1' for 'i' or '0' for 'o') to trick busy healthcare staff. This technique is called typo-squatting.",
  },
  {
    id: 3,
    category: 'Artificial Deadlines',
    question:
      'An email claims that your Al-Shifa Medical Clinic portal access will be permanently disabled within 24 hours unless you click a link and re-verify your password. What tactic is being used by the sender?',
    options: [
      'A) Routine software maintenance notification.',
      'B) High-pressure intimidation and artificial deadline to cause panic and bypass caution.',
      'C) Legitimate government health regulatory audit.',
      'D) Standard automated backup reminder.',
    ],
    correctIndex: 1,
    explanation:
      'Correct! Threatening imminent account suspension or disciplinary action within 24 hours is a classic social engineering tactic designed to rush victims into making hasty mistakes without thinking.',
  },
  {
    id: 4,
    category: 'Credential & Password Requests',
    question:
      "An email claiming to be from the clinic's internal IT department asks you to reply with your current password because the clinic server is being upgraded. How should you respond?",
    options: [
      'A) Send your password immediately so the upgrade does not fail.',
      'B) Send your username now and your password in a separate follow-up email.',
      'C) Change your password to "123456" before sending it.',
      'D) Never share your password; legitimate IT departments will never ask for your password.',
    ],
    correctIndex: 3,
    explanation:
      'Correct! Legitimate IT staff, administrators, and software vendors will NEVER request your personal or clinic password. Any email requesting login passwords is an attempt at credential theft.',
  },
  {
    id: 5,
    category: 'Incident Response & Reporting',
    question:
      'You identify a suspicious phishing email in your clinic inbox. What is the correct first action to protect Al-Shifa Medical Clinic?',
    options: [
      'A) Click the unsubscribe link at the bottom of the email.',
      'B) Do not click any links; immediately report the email to the clinic IT manager.',
      'C) Forward the email to your personal email account to inspect it at home.',
      'D) Delete the email immediately without informing anyone so nobody else sees it.',
    ],
    correctIndex: 1,
    explanation:
      'Correct! Reporting phishing emails immediately enables the clinic IT administrator to block the malicious domain and alert other staff members (receptionists, nurses, lab techs) before anyone falls victim.',
  },
];
