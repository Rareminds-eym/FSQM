export interface Question {
  id: number;
  caseFile: string;
  violationOptions: string[];
  correctViolation: string;
  rootCauseOptions: string[];
  correctRootCause: string;
  solutionOptions: string[];
  correctSolution: string;
  innovationWhatIf?: string;
  innovationChallenge?: string;
  innovationBorrow?: string;
}

export const hackathonData: Question[] = [
  {
    "id": 1,
    "caseFile": "During a BMR review, it was noted that several entries were written in pencil and later erased and rewritten in blue ink. No cross-outs were visible.",
    "violationOptions": [
      "Equipment Qualification",
      "Personnel Hygiene",
      "Documentation Practices",
      "Storage Conditions"
    ],
    "correctViolation": "Documentation Practices",
    "rootCauseOptions": [
      "Operator unaware of permanent ink usage policy",
      "Expired ink pen",
      "Training material not laminated",
      "Delayed deviation closure"
    ],
    "correctRootCause": "Operator unaware of permanent ink usage policy",
    "solutionOptions": [
      "Introduce black pen SOP",
      "Retrain all operators on GDP",
      "Use invisible ink",
      "Replace documentation team"
    ],
  "correctSolution": "Retrain all operators on GDP",
  "innovationWhatIf": "What if the process for 'Documentation Practices' was completely changed — how would you redesign it to avoid this issue?",
  "innovationChallenge": "How would you handle 'Documentation Practices' if you had to remove one key step from the current process?",
  "innovationBorrow": "What idea from another industry could you adapt to solve 'Documentation Practices' in this scenario?"
  },
  {
    "id": 2,
    "caseFile": "During a routine check, the storage area for finished products showed a temperature of 30\u00b0C for 8 hours, above the allowed 25\u00b0C. No alert was raised.",
    "violationOptions": [
      "Temperature Control",
      "Water Testing",
      "Vendor Qualification",
      "Product Labeling"
    ],
    "correctViolation": "Temperature Control",
    "rootCauseOptions": [
      "Sensor battery failure",
      "Fire alarm malfunction",
      "Power outage in canteen",
      "Staff didn't wear gloves"
    ],
    "correctRootCause": "Sensor battery failure",
    "solutionOptions": [
      "Freeze all batches",
      "Add manual logbook",
      "Install dual-alert sensor with auto-SMS",
      "Change thermometer color"
    ],
  "correctSolution": "Install dual-alert sensor with auto-SMS",
  "innovationWhatIf": "What if the process for 'Temperature Control' was completely changed — how would you redesign it to avoid this issue?",
  "innovationChallenge": "How would you handle 'Temperature Control' if you had to remove one key step from the current process?",
  "innovationBorrow": "What idea from another industry could you adapt to solve 'Temperature Control' in this scenario?"
  },
  {
    "id": 3,
    "caseFile": "Two APIs with similar names were kept adjacent in the dispensing area. A batch was found to contain the wrong API.",
    "violationOptions": [
      "Cross-contamination",
      "Dispensing & Material Handling",
      "Packaging Control",
      "Vendor Audit"
    ],
    "correctViolation": "Dispensing & Material Handling",
    "rootCauseOptions": [
      "Look-alike packaging with poor labeling",
      "Warehouse humidity",
      "Wrong barcoding",
      "No insect traps"
    ],
    "correctRootCause": "Look-alike packaging with poor labeling",
    "solutionOptions": [
      "Purchase new raw material",
      "Change vendor",
      "Physically separate and relabel materials",
      "Rotate raw materials monthly"
    ],
  "correctSolution": "Physically separate and relabel materials",
  "innovationWhatIf": "What if the process for 'Dispensing & Material Handling' was completely changed — how would you redesign it to avoid this issue?",
  "innovationChallenge": "How would you handle 'Dispensing & Material Handling' if you had to remove one key step from the current process?",
  "innovationBorrow": "What idea from another industry could you adapt to solve 'Dispensing & Material Handling' in this scenario?"
  },
  {
    "id": 4,
    "caseFile": "CCTV footage revealed an operator entered a Grade B area wearing a lab coat instead of coveralls.",
    "violationOptions": [
      "Gowning SOP Violation",
      "Pest Control",
      "Label Control",
      "Drainage Maintenance"
    ],
    "correctViolation": "Gowning SOP Violation",
    "rootCauseOptions": [
      "Lack of visual signage at entry point",
      "Late lunch breaks",
      "Footwear misplacement",
      "Temperature fluctuations"
    ],
    "correctRootCause": "Lack of visual signage at entry point",
    "solutionOptions": [
      "Suspend the operator",
      "Paste area-specific gowning visuals + retrain",
      "Change gown vendor",
      "Build new changing room"
    ],
  "correctSolution": "Paste area-specific gowning visuals + retrain",
  "innovationWhatIf": "What if the process for 'Gowning SOP Violation' was completely changed — how would you redesign it to avoid this issue?",
  "innovationChallenge": "How would you handle 'Gowning SOP Violation' if you had to remove one key step from the current process?",
  "innovationBorrow": "What idea from another industry could you adapt to solve 'Gowning SOP Violation' in this scenario?"
  },
  {
    "id": 5,
    "caseFile": "An internal audit revealed that 15 SOPs had not been reviewed in the last 2 years. Last review dates were expired.",
    "violationOptions": [
      "Change Control",
      "SOP Review & Documentation",
      "Lab Equipment Validation",
      "Line Clearance"
    ],
    "correctViolation": "SOP Review & Documentation",
    "rootCauseOptions": [
      "No SOP tracking calendar",
      "Printer was slow",
      "SOPs were hard to understand",
      "SOP font was too small"
    ],
    "correctRootCause": "No SOP tracking calendar",
    "solutionOptions": [
      "Archive old SOPs",
      "Digital SOP tracker with auto-alerts",
      "Create SOPs in Hindi",
      "Hire SOP manager"
    ],
  "correctSolution": "Digital SOP tracker with auto-alerts",
  "innovationWhatIf": "What if the process for 'SOP Review & Documentation' was completely changed — how would you redesign it to avoid this issue?",
  "innovationChallenge": "How would you handle 'SOP Review & Documentation' if you had to remove one key step from the current process?",
  "innovationBorrow": "What idea from another industry could you adapt to solve 'SOP Review & Documentation' in this scenario?"
  },
  {
    "id": 6,
    "caseFile": "Microbial count in purified water exceeded limits in 3 batches. Investigation revealed irregular sanitization.",
    "violationOptions": [
      "Water System Monitoring",
      "Vendor Qualification",
      "Stability Testing",
      "Microbial Testing Kit"
    ],
    "correctViolation": "Water System Monitoring",
    "rootCauseOptions": [
      "Sanitization not scheduled weekly",
      "RO system overloaded",
      "Filter had algae",
      "No gloves worn during testing"
    ],
    "correctRootCause": "Sanitization not scheduled weekly",
    "solutionOptions": [
      "Conduct final rinse",
      "Lock access to tanks",
      "Schedule auto-sanitization every 7 days",
      "Use UV stickers"
    ],
  "correctSolution": "Schedule auto-sanitization every 7 days",
  "innovationWhatIf": "What if the process for 'Water System Monitoring' was completely changed — how would you redesign it to avoid this issue?",
  "innovationChallenge": "How would you handle 'Water System Monitoring' if you had to remove one key step from the current process?",
  "innovationBorrow": "What idea from another industry could you adapt to solve 'Water System Monitoring' in this scenario?"
  },
  {
    "id": 7,
    "caseFile": "A batch was shipped with old artwork \u2014 the new regulatory update was missed on the label.",
    "violationOptions": [
      "Artwork Management",
      "Visual Inspection",
      "Expiry Date Validation",
      "Calibration"
    ],
    "correctViolation": "Artwork Management",
    "rootCauseOptions": [
      "Artwork change not updated in master copy",
      "HR didn\u2019t inform warehouse",
      "Stock was too high",
      "New label font unreadable"
    ],
    "correctRootCause": "Artwork change not updated in master copy",
    "solutionOptions": [
      "Lock the print room",
      "Link artwork tracker to change control system",
      "Color-code label reels",
      "Use QR stickers"
    ],
  "correctSolution": "Link artwork tracker to change control system",
  "innovationWhatIf": "What if the process for 'Artwork Management' was completely changed — how would you redesign it to avoid this issue?",
  "innovationChallenge": "How would you handle 'Artwork Management' if you had to remove one key step from the current process?",
  "innovationBorrow": "What idea from another industry could you adapt to solve 'Artwork Management' in this scenario?"
  },
  {
    "id": 8,
    "caseFile": "Same deviation recurred 4 times in 2 months. CAPA was marked as 'closed' each time.",
    "violationOptions": [
      "Ineffective CAPA Management",
      "SOP Duplication",
      "Internal Audit",
      "Product Sampling"
    ],
    "correctViolation": "Ineffective CAPA Management",
    "rootCauseOptions": [
      "CAPA just copied from previous incident",
      "Operator changed",
      "Vendor delayed raw material",
      "SOP was misplaced"
    ],
    "correctRootCause": "CAPA just copied from previous incident",
    "solutionOptions": [
      "Force RCA to change every time",
      "Review CAPA effectiveness after 15 days",
      "Track via WhatsApp",
      "Add graphics to CAPA forms"
    ],
  "correctSolution": "Review CAPA effectiveness after 15 days",
  "innovationWhatIf": "What if the process for 'Ineffective CAPA Management' was completely changed — how would you redesign it to avoid this issue?",
  "innovationChallenge": "How would you handle 'Ineffective CAPA Management' if you had to remove one key step from the current process?",
  "innovationBorrow": "What idea from another industry could you adapt to solve 'Ineffective CAPA Management' in this scenario?"
  },
  {
    "id": 9,
    "caseFile": "An operator performed equipment cleaning without undergoing training for the new model.",
    "violationOptions": [
      "Personnel Training",
      "Area Qualification",
      "Equipment Hold Time",
      "Raw Material Sampling"
    ],
    "correctViolation": "Personnel Training",
    "rootCauseOptions": [
      "Training matrix not updated",
      "Forgot password",
      "Overlapping shift",
      "Toolbox missing"
    ],
    "correctRootCause": "Training matrix not updated",
    "solutionOptions": [
      "Suspend operator",
      "Link training to equipment ID",
      "Move training to HR",
      "Create stickers on machines"
    ],
  "correctSolution": "Link training to equipment ID",
  "innovationWhatIf": "What if the process for 'Personnel Training' was completely changed — how would you redesign it to avoid this issue?",
  "innovationChallenge": "How would you handle 'Personnel Training' if you had to remove one key step from the current process?",
  "innovationBorrow": "What idea from another industry could you adapt to solve 'Personnel Training' in this scenario?"
  },
  {
    "id": 10,
    "caseFile": "Two different product batches were processed in the same mix tank with insufficient cleaning time between.",
    "violationOptions": [
      "Cleaning Validation",
      "Glassware SOP",
      "Shift Handover",
      "Gowning Room Entry"
    ],
    "correctViolation": "Cleaning Validation",
    "rootCauseOptions": [
      "Cleaning cycle time reduced to meet dispatch",
      "Foam detergent used",
      "Wrong pH",
      "Label fell off"
    ],
    "correctRootCause": "Cleaning cycle time reduced to meet dispatch",
    "solutionOptions": [
      "Introduce digital cleaning logs with checklists",
      "Color the tank lid",
      "Label with emojis",
      "Reduce cleaning steps"
    ],
  "correctSolution": "Introduce digital cleaning logs with checklists",
  "innovationWhatIf": "What if the process for 'Cleaning Validation' was completely changed — how would you redesign it to avoid this issue?",
  "innovationChallenge": "How would you handle 'Cleaning Validation' if you had to remove one key step from the current process?",
  "innovationBorrow": "What idea from another industry could you adapt to solve 'Cleaning Validation' in this scenario?"
  },
  {
    "id": 11,
    "caseFile": "During line clearance, remnants of previous batch material were found on the floor.",
    "violationOptions": [
      "Line Clearance",
      "Change Control",
      "Batch Review",
      "Pest Control"
    ],
    "correctViolation": "Line Clearance",
    "rootCauseOptions": [
      "Poor visual inspection",
      "Batch release delayed",
      "Untrained QA",
      "Late cleaning crew"
    ],
    "correctRootCause": "Poor visual inspection",
    "solutionOptions": [
      "Reinforce visual line clearance training",
      "Assign janitor to QA",
      "Color code dustbins",
      "Freeze line movement"
    ],
  "correctSolution": "Reinforce visual line clearance training",
  "innovationWhatIf": "What if the process for 'Line Clearance' was completely changed — how would you redesign it to avoid this issue?",
  "innovationChallenge": "How would you handle 'Line Clearance' if you had to remove one key step from the current process?",
  "innovationBorrow": "What idea from another industry could you adapt to solve 'Line Clearance' in this scenario?"
  },
  {
    "id": 12,
    "caseFile": "A weighing balance showed inconsistent readings across shifts.",
    "violationOptions": [
      "Calibration",
      "Cleaning",
      "Temperature Control",
      "Sampling"
    ],
    "correctViolation": "Calibration",
    "rootCauseOptions": [
      "Balance not calibrated per schedule",
      "Operator leaned on table",
      "Wrong voltage",
      "Humidity too high"
    ],
    "correctRootCause": "Balance not calibrated per schedule",
    "solutionOptions": [
      "Implement monthly calibration tracker",
      "Replace balance",
      "Label balances with stickers",
      "Shift balance to new room"
    ],
  "correctSolution": "Implement monthly calibration tracker",
  "innovationWhatIf": "What if the process for 'Calibration' was completely changed — how would you redesign it to avoid this issue?",
  "innovationChallenge": "How would you handle 'Calibration' if you had to remove one key step from the current process?",
  "innovationBorrow": "What idea from another industry could you adapt to solve 'Calibration' in this scenario?"
  },
  {
    "id": 13,
    "caseFile": "QA found a broken thermometer in the storage area during a routine inspection.",
    "violationOptions": [
      "Equipment Maintenance",
      "Storage Practices",
      "Glassware Handling",
      "Change Control"
    ],
    "correctViolation": "Equipment Maintenance",
    "rootCauseOptions": [
      "No preventive maintenance log",
      "No SOP for glass handling",
      "Broken by cleaner",
      "Overloaded racks"
    ],
    "correctRootCause": "No preventive maintenance log",
    "solutionOptions": [
      "Set reminder for preventive maintenance",
      "Use digital thermometer",
      "Add SOP for glass check",
      "Increase shelf spacing"
    ],
  "correctSolution": "Set reminder for preventive maintenance",
  "innovationWhatIf": "What if the process for 'Equipment Maintenance' was completely changed — how would you redesign it to avoid this issue?",
  "innovationChallenge": "How would you handle 'Equipment Maintenance' if you had to remove one key step from the current process?",
  "innovationBorrow": "What idea from another industry could you adapt to solve 'Equipment Maintenance' in this scenario?"
  },
  {
    "id": 14,
    "caseFile": "Labels were found detached from containers due to humidity.",
    "violationOptions": [
      "Labeling and Packaging",
      "Storage Practices",
      "Hygiene",
      "Vendor Compliance"
    ],
    "correctViolation": "Labeling and Packaging",
    "rootCauseOptions": [
      "Wrong adhesive for environment",
      "Staff error",
      "Label text was long",
      "Warehouse too bright"
    ],
    "correctRootCause": "Wrong adhesive for environment",
    "solutionOptions": [
      "Use environment-tested adhesive labels",
      "Change storage room",
      "Laminate labels",
      "Print smaller labels"
    ],
  "correctSolution": "Use environment-tested adhesive labels",
  "innovationWhatIf": "What if the process for 'Labeling and Packaging' was completely changed — how would you redesign it to avoid this issue?",
  "innovationChallenge": "How would you handle 'Labeling and Packaging' if you had to remove one key step from the current process?",
  "innovationBorrow": "What idea from another industry could you adapt to solve 'Labeling and Packaging' in this scenario?"
  },
  {
    "id": 15,
    "caseFile": "A new batch of raw materials was used before receiving QC approval.",
    "violationOptions": [
      "Material Management",
      "Sampling",
      "CAPA",
      "Water Quality"
    ],
    "correctViolation": "Material Management",
    "rootCauseOptions": [
      "No physical quarantine system",
      "QC forgot entry",
      "Material expired",
      "System auto-released"
    ],
    "correctRootCause": "No physical quarantine system",
    "solutionOptions": [
      "Implement red-tag quarantine area",
      "Send reminder to QC",
      "Use color bins",
      "Check expiry dates weekly"
    ],
  "correctSolution": "Implement red-tag quarantine area",
  "innovationWhatIf": "What if the process for 'Material Management' was completely changed — how would you redesign it to avoid this issue?",
  "innovationChallenge": "How would you handle 'Material Management' if you had to remove one key step from the current process?",
  "innovationBorrow": "What idea from another industry could you adapt to solve 'Material Management' in this scenario?"
  },
  {
    "id": 16,
    "caseFile": "A power failure during a critical mixing step was not documented.",
    "violationOptions": [
      "Deviation Management",
      "Utility Monitoring",
      "Production Logging",
      "Preventive Maintenance"
    ],
    "correctViolation": "Deviation Management",
    "rootCauseOptions": [
      "No awareness about reporting deviations",
      "Power alert failed",
      "Utility SOP was unclear",
      "Back-up generator missing"
    ],
    "correctRootCause": "No awareness about reporting deviations",
    "solutionOptions": [
      "Create Deviation Awareness Campaign",
      "Set up deviation hotline",
      "Auto-log power fluctuations",
      "Install UPS"
    ],
  "correctSolution": "Create Deviation Awareness Campaign",
  "innovationWhatIf": "What if the process for 'Deviation Management' was completely changed — how would you redesign it to avoid this issue?",
  "innovationChallenge": "How would you handle 'Deviation Management' if you had to remove one key step from the current process?",
  "innovationBorrow": "What idea from another industry could you adapt to solve 'Deviation Management' in this scenario?"
  },
  {
    "id": 17,
    "caseFile": "Operators were seen bypassing metal detector in the packaging line.",
    "violationOptions": [
      "Process Compliance",
      "Equipment Usage",
      "In-Process Checks",
      "Safety Protocols"
    ],
    "correctViolation": "Process Compliance",
    "rootCauseOptions": [
      "Metal detector alarm was disabled",
      "SOP unclear",
      "Operator fatigue",
      "Loose schedule"
    ],
    "correctRootCause": "Metal detector alarm was disabled",
    "solutionOptions": [
      "Install auto-lock on metal detector alarm",
      "Retrain all line operators",
      "Add sensor-linked buzzer",
      "Use colored floor arrows"
    ],
  "correctSolution": "Install auto-lock on metal detector alarm",
  "innovationWhatIf": "What if the process for 'Process Compliance' was completely changed — how would you redesign it to avoid this issue?",
  "innovationChallenge": "How would you handle 'Process Compliance' if you had to remove one key step from the current process?",
  "innovationBorrow": "What idea from another industry could you adapt to solve 'Process Compliance' in this scenario?"
  },
  {
    "id": 18,
    "caseFile": "Drain near production line was clogged, causing pooling of water for 2 hours.",
    "violationOptions": [
      "Facility Maintenance",
      "Hygiene Control",
      "Cleaning SOP",
      "Pest Control"
    ],
    "correctViolation": "Facility Maintenance",
    "rootCauseOptions": [
      "Drain cleaning frequency was reduced",
      "No drain trap",
      "Improper floor slope",
      "Cleaning team missed schedule"
    ],
    "correctRootCause": "Drain cleaning frequency was reduced",
    "solutionOptions": [
      "Set fixed weekly drain cleaning schedule",
      "Label all drain exits",
      "Train team on GMP facility maps",
      "Use high-pressure flush"
    ],
  "correctSolution": "Set fixed weekly drain cleaning schedule",
  "innovationWhatIf": "What if the process for 'Facility Maintenance' was completely changed — how would you redesign it to avoid this issue?",
  "innovationChallenge": "How would you handle 'Facility Maintenance' if you had to remove one key step from the current process?",
  "innovationBorrow": "What idea from another industry could you adapt to solve 'Facility Maintenance' in this scenario?"
  },
  {
    "id": 19,
    "caseFile": "The same gloves were used to handle two different product batches.",
    "violationOptions": [
      "Personal Hygiene",
      "Cross Contamination",
      "Batch Handling",
      "Sterility Assurance"
    ],
    "correctViolation": "Cross Contamination",
    "rootCauseOptions": [
      "Lack of glove-changing SOP",
      "Staff forgot",
      "No disposal bin",
      "Washing station far"
    ],
    "correctRootCause": "Lack of glove-changing SOP",
    "solutionOptions": [
      "Install visual glove change reminders",
      "Retrain on glove change points",
      "Add glove log sheet",
      "Label gloves by color"
    ],
  "correctSolution": "Install visual glove change reminders",
  "innovationWhatIf": "What if the process for 'Cross Contamination' was completely changed — how would you redesign it to avoid this issue?",
  "innovationChallenge": "How would you handle 'Cross Contamination' if you had to remove one key step from the current process?",
  "innovationBorrow": "What idea from another industry could you adapt to solve 'Cross Contamination' in this scenario?"
  },
  {
    "id": 20,
    "caseFile": "Rejected materials were seen stored next to approved raw materials.",
    "violationOptions": [
      "Material Segregation",
      "Vendor Management",
      "Pest Control",
      "Audit Failure"
    ],
    "correctViolation": "Material Segregation",
    "rootCauseOptions": [
      "Lack of physical partition in warehouse",
      "No bin labels",
      "QA didn't verify",
      "Late forklift movement"
    ],
    "correctRootCause": "Lack of physical partition in warehouse",
    "solutionOptions": [
      "Color-code zones with visual boards",
      "Create rejection cage",
      "Install warning lights",
      "Appoint bin-in-charge"
    ],
  "correctSolution": "Color-code zones with visual boards",
  "innovationWhatIf": "What if the process for 'Material Segregation' was completely changed — how would you redesign it to avoid this issue?",
  "innovationChallenge": "How would you handle 'Material Segregation' if you had to remove one key step from the current process?",
  "innovationBorrow": "What idea from another industry could you adapt to solve 'Material Segregation' in this scenario?"
  },
  {
    "id": 21,
    "caseFile": "During a BMR review, it was noted that several entries were written in pencil and later erased and rewritten in blue ink. No cross-outs were visible.",
    "violationOptions": [
      "Equipment Qualification",
      "Personnel Hygiene",
      "Documentation Practices",
      "Storage Conditions"
    ],
    "correctViolation": "Documentation Practices",
    "rootCauseOptions": [
      "Operator unaware of permanent ink usage policy",
      "Expired ink pen",
      "Training material not laminated",
      "Delayed deviation closure"
    ],
    "correctRootCause": "Operator unaware of permanent ink usage policy",
    "solutionOptions": [
      "Introduce black pen SOP",
      "Retrain all operators on GDP",
      "Use invisible ink",
      "Replace documentation team"
    ],
  "correctSolution": "Retrain all operators on GDP",
  "innovationWhatIf": "What if the process for 'Documentation Practices' was completely changed — how would you redesign it to avoid this issue?",
  "innovationChallenge": "How would you handle 'Documentation Practices' if you had to remove one key step from the current process?",
  "innovationBorrow": "What idea from another industry could you adapt to solve 'Documentation Practices' in this scenario?"
  },
  {
    "id": 22,
    "caseFile": "During a routine check, the storage area for finished products showed a temperature of 30\u00b0C for 8 hours, above the allowed 25\u00b0C. No alert was raised.",
    "violationOptions": [
      "Temperature Control",
      "Water Testing",
      "Vendor Qualification",
      "Product Labeling"
    ],
    "correctViolation": "Temperature Control",
    "rootCauseOptions": [
      "Sensor battery failure",
      "Fire alarm malfunction",
      "Power outage in canteen",
      "Staff didn't wear gloves"
    ],
    "correctRootCause": "Sensor battery failure",
    "solutionOptions": [
      "Freeze all batches",
      "Add manual logbook",
      "Install dual-alert sensor with auto-SMS",
      "Change thermometer color"
    ],
  "correctSolution": "Install dual-alert sensor with auto-SMS",
  "innovationWhatIf": "What if the process for 'Temperature Control' was completely changed — how would you redesign it to avoid this issue?",
  "innovationChallenge": "How would you handle 'Temperature Control' if you had to remove one key step from the current process?",
  "innovationBorrow": "What idea from another industry could you adapt to solve 'Temperature Control' in this scenario?"
  },
  {
    "id": 23,
    "caseFile": "Two APIs with similar names were kept adjacent in the dispensing area. A batch was found to contain the wrong API.",
    "violationOptions": [
      "Cross-contamination",
      "Dispensing & Material Handling",
      "Packaging Control",
      "Vendor Audit"
    ],
    "correctViolation": "Dispensing & Material Handling",
    "rootCauseOptions": [
      "Look-alike packaging with poor labeling",
      "Warehouse humidity",
      "Wrong barcoding",
      "No insect traps"
    ],
    "correctRootCause": "Look-alike packaging with poor labeling",
    "solutionOptions": [
      "Purchase new raw material",
      "Change vendor",
      "Physically separate and relabel materials",
      "Rotate raw materials monthly"
    ],
  "correctSolution": "Physically separate and relabel materials",
  "innovationWhatIf": "What if the process for 'Dispensing & Material Handling' was completely changed — how would you redesign it to avoid this issue?",
  "innovationChallenge": "How would you handle 'Dispensing & Material Handling' if you had to remove one key step from the current process?",
  "innovationBorrow": "What idea from another industry could you adapt to solve 'Dispensing & Material Handling' in this scenario?"
  },
  {
    "id": 24,
    "caseFile": "CCTV footage revealed an operator entered a Grade B area wearing a lab coat instead of coveralls.",
    "violationOptions": [
      "Gowning SOP Violation",
      "Pest Control",
      "Label Control",
      "Drainage Maintenance"
    ],
    "correctViolation": "Gowning SOP Violation",
    "rootCauseOptions": [
      "Lack of visual signage at entry point",
      "Late lunch breaks",
      "Footwear misplacement",
      "Temperature fluctuations"
    ],
    "correctRootCause": "Lack of visual signage at entry point",
    "solutionOptions": [
      "Suspend the operator",
      "Paste area-specific gowning visuals + retrain",
      "Change gown vendor",
      "Build new changing room"
    ],
  "correctSolution": "Paste area-specific gowning visuals + retrain",
  "innovationWhatIf": "What if the process for 'Gowning SOP Violation' was completely changed — how would you redesign it to avoid this issue?",
  "innovationChallenge": "How would you handle 'Gowning SOP Violation' if you had to remove one key step from the current process?",
  "innovationBorrow": "What idea from another industry could you adapt to solve 'Gowning SOP Violation' in this scenario?"
  },
  {
    "id": 25,
    "caseFile": "An internal audit revealed that 15 SOPs had not been reviewed in the last 2 years. Last review dates were expired.",
    "violationOptions": [
      "Change Control",
      "SOP Review & Documentation",
      "Lab Equipment Validation",
      "Line Clearance"
    ],
    "correctViolation": "SOP Review & Documentation",
    "rootCauseOptions": [
      "No SOP tracking calendar",
      "Printer was slow",
      "SOPs were hard to understand",
      "SOP font was too small"
    ],
    "correctRootCause": "No SOP tracking calendar",
    "solutionOptions": [
      "Archive old SOPs",
      "Digital SOP tracker with auto-alerts",
      "Create SOPs in Hindi",
      "Hire SOP manager"
    ],
  "correctSolution": "Digital SOP tracker with auto-alerts",
  "innovationWhatIf": "What if the process for 'SOP Review & Documentation' was completely changed — how would you redesign it to avoid this issue?",
  "innovationChallenge": "How would you handle 'SOP Review & Documentation' if you had to remove one key step from the current process?",
  "innovationBorrow": "What idea from another industry could you adapt to solve 'SOP Review & Documentation' in this scenario?"
  },
  {
    "id": 26,
    "caseFile": "Microbial count in purified water exceeded limits in 3 batches. Investigation revealed irregular sanitization.",
    "violationOptions": [
      "Water System Monitoring",
      "Vendor Qualification",
      "Stability Testing",
      "Microbial Testing Kit"
    ],
    "correctViolation": "Water System Monitoring",
    "rootCauseOptions": [
      "Sanitization not scheduled weekly",
      "RO system overloaded",
      "Filter had algae",
      "No gloves worn during testing"
    ],
    "correctRootCause": "Sanitization not scheduled weekly",
    "solutionOptions": [
      "Conduct final rinse",
      "Lock access to tanks",
      "Schedule auto-sanitization every 7 days",
      "Use UV stickers"
    ],
  "correctSolution": "Schedule auto-sanitization every 7 days",
  "innovationWhatIf": "What if the process for 'Water System Monitoring' was completely changed — how would you redesign it to avoid this issue?",
  "innovationChallenge": "How would you handle 'Water System Monitoring' if you had to remove one key step from the current process?",
  "innovationBorrow": "What idea from another industry could you adapt to solve 'Water System Monitoring' in this scenario?"
  },
  {
    "id": 27,
    "caseFile": "A batch was shipped with old artwork \u2014 the new regulatory update was missed on the label.",
    "violationOptions": [
      "Artwork Management",
      "Visual Inspection",
      "Expiry Date Validation",
      "Calibration"
    ],
    "correctViolation": "Artwork Management",
    "rootCauseOptions": [
      "Artwork change not updated in master copy",
      "HR didn\u2019t inform warehouse",
      "Stock was too high",
      "New label font unreadable"
    ],
    "correctRootCause": "Artwork change not updated in master copy",
    "solutionOptions": [
      "Lock the print room",
      "Link artwork tracker to change control system",
      "Color-code label reels",
      "Use QR stickers"
    ],
  "correctSolution": "Link artwork tracker to change control system",
  "innovationWhatIf": "What if the process for 'Artwork Management' was completely changed — how would you redesign it to avoid this issue?",
  "innovationChallenge": "How would you handle 'Artwork Management' if you had to remove one key step from the current process?",
  "innovationBorrow": "What idea from another industry could you adapt to solve 'Artwork Management' in this scenario?"
  },
  {
    "id": 28,
    "caseFile": "Same deviation recurred 4 times in 2 months. CAPA was marked as 'closed' each time.",
    "violationOptions": [
      "Ineffective CAPA Management",
      "SOP Duplication",
      "Internal Audit",
      "Product Sampling"
    ],
    "correctViolation": "Ineffective CAPA Management",
    "rootCauseOptions": [
      "CAPA just copied from previous incident",
      "Operator changed",
      "Vendor delayed raw material",
      "SOP was misplaced"
    ],
    "correctRootCause": "CAPA just copied from previous incident",
    "solutionOptions": [
      "Force RCA to change every time",
      "Review CAPA effectiveness after 15 days",
      "Track via WhatsApp",
      "Add graphics to CAPA forms"
    ],
  "correctSolution": "Review CAPA effectiveness after 15 days",
  "innovationWhatIf": "What if the process for 'Ineffective CAPA Management' was completely changed — how would you redesign it to avoid this issue?",
  "innovationChallenge": "How would you handle 'Ineffective CAPA Management' if you had to remove one key step from the current process?",
  "innovationBorrow": "What idea from another industry could you adapt to solve 'Ineffective CAPA Management' in this scenario?"
  },
  {
    "id": 29,
    "caseFile": "An operator performed equipment cleaning without undergoing training for the new model.",
    "violationOptions": [
      "Personnel Training",
      "Area Qualification",
      "Equipment Hold Time",
      "Raw Material Sampling"
    ],
    "correctViolation": "Personnel Training",
    "rootCauseOptions": [
      "Training matrix not updated",
      "Forgot password",
      "Overlapping shift",
      "Toolbox missing"
    ],
    "correctRootCause": "Training matrix not updated",
    "solutionOptions": [
      "Suspend operator",
      "Link training to equipment ID",
      "Move training to HR",
      "Create stickers on machines"
    ],
  "correctSolution": "Link training to equipment ID",
  "innovationWhatIf": "What if the process for 'Personnel Training' was completely changed — how would you redesign it to avoid this issue?",
  "innovationChallenge": "How would you handle 'Personnel Training' if you had to remove one key step from the current process?",
  "innovationBorrow": "What idea from another industry could you adapt to solve 'Personnel Training' in this scenario?"
  },
  {
    "id": 30,
    "caseFile": "Two different product batches were processed in the same mix tank with insufficient cleaning time between.",
    "violationOptions": [
      "Cleaning Validation",
      "Glassware SOP",
      "Shift Handover",
      "Gowning Room Entry"
    ],
    "correctViolation": "Cleaning Validation",
    "rootCauseOptions": [
      "Cleaning cycle time reduced to meet dispatch",
      "Foam detergent used",
      "Wrong pH",
      "Label fell off"
    ],
    "correctRootCause": "Cleaning cycle time reduced to meet dispatch",
    "solutionOptions": [
      "Introduce digital cleaning logs with checklists",
      "Color the tank lid",
      "Label with emojis",
      "Reduce cleaning steps"
    ],
  "correctSolution": "Introduce digital cleaning logs with checklists",
  "innovationWhatIf": "What if the process for 'Cleaning Validation' was completely changed — how would you redesign it to avoid this issue?",
  "innovationChallenge": "How would you handle 'Cleaning Validation' if you had to remove one key step from the current process?",
  "innovationBorrow": "What idea from another industry could you adapt to solve 'Cleaning Validation' in this scenario?"
  }
];