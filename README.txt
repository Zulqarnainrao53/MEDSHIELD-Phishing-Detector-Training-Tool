=============================================================================
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
            cd C:\Users\YourName\Documents\MedShield

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
