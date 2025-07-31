import { DiagnosticScenario } from "../types/game";

export const scenarios: DiagnosticScenario[] = [
  {
    id: 1,
    title: "Rapid Discharge During Operation",
    description: "The EV battery discharges quickly after a full charge.",
    symptoms: "Discharges quickly after full charge.",
    clues: ["SOC drops faster than normal.", "Cell voltages are uneven."],
    questions: [
      {
        text: "Is the SOC (State of Charge) dropping quickly?",
        answer: "Yes",
        isRelevant: true,
        hint: "Check the rate of battery discharge compared to normal operation",
      },
      {
        text: "Are individual cell voltages within the normal range?",
        answer: "No",
        isRelevant: true,
        hint: "Compare voltage readings across different cells",
      },
      {
        text: "Is the battery temperature normal?",
        answer: "Yes",
        isRelevant: true,
        hint: "Monitor temperature sensors for any abnormal readings",
      },
      {
        text: "Are external loads connected to the battery?",
        answer: "No",
        isRelevant: true,
        hint: "Check for any unauthorized or parasitic loads",
      },
      {
        text: "Is there any visible damage to the battery?",
        answer: "No",
        isRelevant: true,
        hint: "Inspect the battery pack for physical damage",
      },
      {
        text: "Has the battery recently undergone cell balancing?",
        answer: "No",
        isRelevant: true,
        hint: "Review maintenance history for recent balancing procedures",
      },
      {
        text: "Is the cooling system operational?",
        answer: "Yes",
        isRelevant: false,
        explanation: "Not related to discharge rates",
        hint: "This is not relevant to the current issue",
      },
      {
        text: "Is the charger functioning properly?",
        answer: "Yes",
        isRelevant: false,
        explanation: "Not a charging issue",
        hint: "This is not relevant to the current issue",
      },
    ],
    resolutionQuestion: {
      text: "What should you do to resolve the issue?",
      options: [
        {
          id: "a",
          text: "Replace the charger",
          isCorrect: false,
        },
        {
          id: "b",
          text: "Perform cell balancing",
          isCorrect: true,
        },
        {
          id: "c",
          text: "Inspect the cooling system",
          isCorrect: false,
        },
        {
          id: "d",
          text: "Replace the temperature sensors",
          isCorrect: false,
        },
      ],
    },
  },
  {
    id: 2,
    title: "Overheating After Prolonged Use",
    description: "The EV battery overheats after extended driving.",
    symptoms: "High temperature during extended driving.",
    clues: ["The cooling system has issues.", "High ambient temperatures."],
    questions: [
      {
        text: "Are the cooling systems functioning normally?",
        answer: "No",
        isRelevant: true,
        hint: "Check if the cooling system is fully operational",
      },
      {
        text: "Are temperature sensors reporting consistent readings?",
        answer: "Yes",
        isRelevant: true,
        hint: "Monitor sensor readings for accuracy",
      },
      {
        text: "Is the battery being used under high load conditions?",
        answer: "Yes",
        isRelevant: true,
        hint: "Verify the battery's usage scenario",
      },
      {
        text: "Is the ambient temperature unusually high?",
        answer: "Yes",
        isRelevant: true,
        hint: "Check the surrounding temperature during operation",
      },
      {
        text: "Are there any blockages in the cooling system?",
        answer: "Yes",
        isRelevant: true,
        hint: "Inspect the cooling system for obstructions",
      },
      {
        text: "Are all battery cells operating within normal voltage levels?",
        answer: "Yes",
        isRelevant: true,
        hint: "Confirm all cells are balanced and functioning",
      },
      {
        text: "Are external loads connected to the battery?",
        answer: "No",
        isRelevant: false,
        explanation: "Unrelated to overheating",
        hint: "External loads are not contributing to the issue",
      },
      {
        text: "Is the BMS communicating with the charger?",
        answer: "No",
        isRelevant: false,
        explanation: "Not a charging issue",
        hint: "This is not relevant to the current issue",
      },
    ],
    resolutionQuestion: {
      text: "What is the likely root cause of the overheating?",
      options: [
        {
          id: "a",
          text: "Faulty cooling system",
          isCorrect: true,
        },
        {
          id: "b",
          text: "Damaged connectors",
          isCorrect: false,
        },
        {
          id: "c",
          text: "Uneven cell voltages",
          isCorrect: false,
        },
        {
          id: "d",
          text: "Incorrect charging protocol",
          isCorrect: false,
        },
      ],
    },
  },
  {
    id: 3,
    title: "Uneven Charging Across Cells",
    description:
      "Battery cells charge unevenly, leading to performance issues.",
    symptoms: "Cells exhibit varying voltages after charging.",
    clues: ["One cell group has significantly lower voltage."],
    questions: [
      {
        text: "Are all battery cells charging evenly?",
        answer: "No",
        isRelevant: true,
        hint: "Check for uneven voltage across cells",
      },
      {
        text: "Is the BMS detecting any faulty cells?",
        answer: "Yes",
        isRelevant: true,
        hint: "Review BMS logs for faulty cell alerts",
      },
      {
        text: "Are temperature sensors reporting normal values?",
        answer: "Yes",
        isRelevant: true,
        hint: "Monitor temperature consistency across cells",
      },
      {
        text: "Is there physical damage to the battery cells?",
        answer: "No",
        isRelevant: true,
        hint: "Ensure the battery cells are intact",
      },
      {
        text: "Is the charger providing consistent voltage output?",
        answer: "Yes",
        isRelevant: true,
        hint: "Verify the charger's output is stable",
      },
      {
        text: "Has the battery been exposed to extreme temperatures recently?",
        answer: "No",
        isRelevant: true,
        hint: "Check the battery's thermal history",
      },
      {
        text: "Are external loads connected to the battery?",
        answer: "No",
        isRelevant: false,
        explanation: "Unrelated to charging",
        hint: "External loads are not affecting the charge",
      },
      {
        text: "Is the SOC dropping rapidly?",
        answer: "No",
        isRelevant: false,
        explanation: "Not related to uneven charging",
        hint: "SOC drop is not a concern here",
      },
    ],
    resolutionQuestion: {
      text: "What is the most likely root cause of uneven cell charging?",
      options: [
        {
          id: "a",
          text: "Faulty cooling system",
          isCorrect: false,
        },
        {
          id: "b",
          text: "Faulty battery management system (BMS)",
          isCorrect: false,
        },
        {
          id: "c",
          text: "Parasitic loads on the battery",
          isCorrect: false,
        },
        {
          id: "d",
          text: "Uneven cell balancing",
          isCorrect: true,
        },
      ],
    },
  },
  {
    id: 4,
    title: "Failure to Charge Beyond 80%",
    description:
      "The EV battery consistently fails to charge above 80%, causing reduced range.",
    symptoms: "Charging halts at 80% capacity.",
    clues: [
      "The charging stops automatically at 80%.",
      "The BMS shows no fault codes.",
    ],
    questions: [
      {
        text: "Is the charger functioning correctly?",
        answer: "Yes",
        isRelevant: true,
        hint: "Verify charger performance",
      },
      {
        text: "Are there any restrictions in the BMS for charging limits?",
        answer: "Yes",
        isRelevant: true,
        hint: "Check BMS for charging limit settings",
      },
      {
        text: "Has the battery reached its maximum cycle count?",
        answer: "No",
        isRelevant: true,
        hint: "Verify the cycle count and age of the battery",
      },
      {
        text: "Is there an issue with the battery cooling system?",
        answer: "No",
        isRelevant: true,
        hint: "Confirm that cooling system is operational",
      },
      {
        text: "Is the SOC reading consistent with the actual charge level?",
        answer: "No",
        isRelevant: true,
        hint: "Check for discrepancies between SOC and actual charge",
      },
      {
        text: "Is there a firmware update pending for the BMS?",
        answer: "Yes",
        isRelevant: true,
        hint: "Ensure the BMS firmware is up to date",
      },
      {
        text: "Is the battery discharging rapidly?",
        answer: "No",
        isRelevant: false,
        explanation: "Not related to charging limits",
        hint: "Battery discharge is not a concern here",
      },
      {
        text: "Is the voltage of individual cells uneven?",
        answer: "No",
        isRelevant: false,
        explanation: "Not relevant to charge cap",
        hint: "Cell voltages do not affect charging limits",
      },
    ],
    resolutionQuestion: {
      text: "What is the most likely cause of the failure to charge beyond 80%?",
      options: [
        {
          id: "a",
          text: "Faulty battery cells",
          isCorrect: false,
        },
        {
          id: "b",
          text: "BMS firmware limitations",
          isCorrect: true,
        },
        {
          id: "c",
          text: "Damaged charging port",
          isCorrect: false,
        },
        {
          id: "d",
          text: "Uneven cooling",
          isCorrect: false,
        },
      ],
    },
  },
  {
    id: 5,
    title: "BMS Sensor Malfunction",
    description:
      "The Battery Management System (BMS) reports inconsistent or incorrect sensor readings.",
    symptoms: "Charging takes longer than expected.",
    clues: [
      "The SOC fluctuates unexpectedly.",
      "The temperature readings are inconsistent.",
    ],
    questions: [
      {
        text: "Are the temperature sensors functioning correctly?",
        answer: "No",
        isRelevant: true,
        hint: "Check temperature sensor performance",
      },
      {
        text: "Are the voltage readings consistent across all cells?",
        answer: "Yes",
        isRelevant: true,
        hint: "Ensure voltage stability across cells",
      },
      {
        text: "Is there a fault code displayed on the system?",
        answer: "Yes",
        isRelevant: true,
        hint: "Review fault codes for potential sensor issues",
      },
      {
        text: "Are communication lines between sensors and the BMS intact?",
        answer: "No",
        isRelevant: true,
        hint: "Check for broken communication lines",
      },
      {
        text: "Is the BMS firmware up to date?",
        answer: "No",
        isRelevant: true,
        hint: "Check and update BMS firmware",
      },
      {
        text: "Is there physical damage to the sensor connections?",
        answer: "Yes",
        isRelevant: true,
        hint: "Inspect connections for damage",
      },
      {
        text: "Is the battery overheating?",
        answer: "No",
        isRelevant: false,
        explanation: "Not directly relevant to BMS issues",
        hint: "Overheating is not the issue",
      },
      {
        text: "Are external loads connected to the battery?",
        answer: "No",
        isRelevant: false,
        explanation: "Unrelated to sensors",
        hint: "External loads are not affecting sensors",
      },
    ],
    resolutionQuestion: {
      text: "What is the most probable cause of sensor malfunction?",
      options: [
        {
          id: "a",
          text: "Faulty temperature sensors",
          isCorrect: true,
        },
        {
          id: "b",
          text: "Overheating of the battery",
          isCorrect: false,
        },
        {
          id: "c",
          text: "Damaged cooling system",
          isCorrect: false,
        },
        {
          id: "d",
          text: "Parasitic loads",
          isCorrect: false,
        },
      ],
    },
  },
  {
    id: 6,
    title: "Thermal Runaway",
    description:
      "The EV battery experiences rapid overheating, potentially leading to thermal runaway.",
    symptoms: "Battery temperature spikes suddenly, smoke or fumes detected.",
    clues: [
      "The battery temperature spikes suddenly",
      "Smoke or fumes are detected",
    ],
    questions: [
      {
        text: "Is the cooling system operational?",
        answer: "No",
        isRelevant: true,
        hint: "Check if the cooling system is functioning properly.",
      },
      {
        text: "Are the temperature sensors functioning correctly?",
        answer: "No",
        isRelevant: true,
        hint: "Inspect the temperature sensors for malfunctions.",
      },
      {
        text: "Are there damaged cells within the battery?",
        answer: "Yes",
        isRelevant: true,
        hint: "Check for damaged or faulty battery cells.",
      },
      {
        text: "Is the BMS reporting any fault codes?",
        answer: "Yes",
        isRelevant: true,
        hint: "Check BMS logs for any error codes.",
      },
      {
        text: "Is the battery under heavy load?",
        answer: "Yes",
        isRelevant: true,
        hint: "Check if the battery is under high load conditions.",
      },
      {
        text: "Are there physical signs of damage to the battery pack?",
        answer: "Yes",
        isRelevant: true,
        hint: "Inspect the battery pack for any visible damage.",
      },
      {
        text: "Is the battery SOC dropping quickly?",
        answer: "No",
        isRelevant: false,
        hint: "Unrelated to thermal runaway.",
      },
      {
        text: "Is the charger output consistent?",
        answer: "No",
        isRelevant: false,
        hint: "Not relevant to overheating.",
      },
    ],
    resolutionQuestion: {
      text: "What is the likely cause of the thermal runaway?",
      options: [
        {
          id: "a",
          text: "Faulty cooling system and damaged cells",
          isCorrect: true,
        },
        { id: "b", text: "Uneven charging", isCorrect: false },
        { id: "c", text: "External loads", isCorrect: false },
        { id: "d", text: "Charger malfunction", isCorrect: false },
      ],
    },
  },
  {
    id: 7,
    title: "Voltage Spike During Charging",
    description:
      "The battery experiences a voltage spike during charging, causing the system to shut down.",
    symptoms:
      "Charger output exceeds expected voltage levels, abnormal current flow detected.",
    clues: [
      "Charger output exceeds expected voltage levels",
      "BMS detects abnormal current flow",
    ],
    questions: [
      {
        text: "Is the charger output voltage consistent?",
        answer: "No",
        isRelevant: true,
        hint: "Verify if the charger output is stable.",
      },
      {
        text: "Is the BMS detecting overvoltage conditions?",
        answer: "Yes",
        isRelevant: true,
        hint: "Check BMS logs for overvoltage warnings.",
      },
      {
        text: "Are there any physical damages to the charging port?",
        answer: "No",
        isRelevant: true,
        hint: "Inspect the charging port for damage.",
      },
      {
        text: "Is the charging protocol compatible with the battery?",
        answer: "No",
        isRelevant: true,
        hint: "Ensure the charging protocol is supported by the battery.",
      },
      {
        text: "Are the battery cells operating within safe voltage levels?",
        answer: "Yes",
        isRelevant: true,
        hint: "Check voltage levels across individual cells.",
      },
      {
        text: "Has the battery been exposed to power surges before?",
        answer: "Yes",
        isRelevant: true,
        hint: "Check for previous instances of power surges.",
      },
      {
        text: "Is the cooling system functioning properly?",
        answer: "Yes",
        isRelevant: false,
        hint: "Not related to voltage issues.",
      },
      {
        text: "Is the battery discharging rapidly?",
        answer: "No",
        isRelevant: false,
        hint: "Unrelated to charging.",
      },
    ],
    resolutionQuestion: {
      text: "What is the most likely cause of the voltage spike?",
      options: [
        { id: "a", text: "Charger malfunction", isCorrect: false },
        { id: "b", text: "Faulty battery cells", isCorrect: false },
        { id: "c", text: "Incompatible charging protocol", isCorrect: true },
        { id: "d", text: "External temperature", isCorrect: false },
      ],
    },
  },
  {
    id: 8,
    title: "High Self-Discharge When Idle",
    description: "The EV battery loses charge significantly when not in use.",
    symptoms:
      "Voltage drops noticeably during idle periods with no external loads connected.",
    clues: [
      "Voltage drops noticeably during idle periods",
      "No external loads are connected",
    ],
    questions: [
      {
        text: "Is the self-discharge rate higher than the standard range?",
        answer: "Yes",
        isRelevant: true,
        hint: "Check if the self-discharge rate is abnormally high.",
      },
      {
        text: "Are there parasitic loads on the battery system?",
        answer: "Yes",
        isRelevant: true,
        hint: "Check for parasitic loads such as small devices connected to the battery.",
      },
      {
        text: "Is the battery operating at a high ambient temperature?",
        answer: "Yes",
        isRelevant: true,
        hint: "Ensure the temperature around the battery is within safe limits.",
      },
      {
        text: "Are individual cells showing significant voltage differences?",
        answer: "No",
        isRelevant: false,
        hint: "Irrelevant to self-discharge issues.",
      },
      {
        text: "Is there visible damage to the battery terminals?",
        answer: "No",
        isRelevant: false,
        hint: "Irrelevant to self-discharge issues.",
      },
      {
        text: "Has the BMS flagged any internal errors?",
        answer: "Yes",
        isRelevant: true,
        hint: "Check the BMS for any flagged errors that may affect battery performance.",
      },
    ],
    resolutionQuestion: {
      text: "What is the recommended resolution?",
      options: [
        {
          id: "a",
          text: "Identify and eliminate parasitic loads",
          isCorrect: true,
        },
        { id: "b", text: "Replace damaged cells", isCorrect: false },
        { id: "c", text: "Adjust BMS firmware settings", isCorrect: false },
        { id: "d", text: "Perform cell balancing", isCorrect: false },
      ],
    },
  },
  {
    id: 9,
    title: "Voltage Spike During Charging",
    description: "An unexpected voltage spike occurs while the EV is charging.",
    symptoms:
      "Charging stops abruptly. Battery voltage readings spike intermittently.",
    clues: [
      "Charging stops abruptly.",
      "Battery voltage readings spike intermittently.",
    ],
    questions: [
      {
        text: "Is the charger supplying consistent voltage?",
        answer: "No",
        isRelevant: true,
        hint: "Check the charger for voltage irregularities.",
      },
      {
        text: "Is the battery voltage within the expected range?",
        answer: "No",
        isRelevant: true,
        hint: "Verify battery voltage for inconsistencies.",
      },
      {
        text: "Has the battery recently undergone a deep discharge?",
        answer: "Yes",
        isRelevant: false,
        explanation: "Not related to the voltage spike during charging.",
        hint: "This is not relevant to the current issue.",
      },
      {
        text: "Is the charger rated for the battery's voltage?",
        answer: "Yes",
        isRelevant: true,
        hint: "Ensure that the charger is rated appropriately for the EV battery.",
      },
      {
        text: "Are the charging cables intact and not frayed?",
        answer: "Yes",
        isRelevant: true,
        hint: "Inspect cables for wear or damage.",
      },
    ],
    resolutionQuestion: {
      text: "What is the likely cause of the voltage spike during charging?",
      options: [
        { id: "a", text: "Inconsistent charger voltage", isCorrect: true },
        { id: "b", text: "Overheating of the battery", isCorrect: false },
        { id: "c", text: "Damaged charging cables", isCorrect: false },
        { id: "d", text: "Faulty BMS communication", isCorrect: false },
      ],
    },
  },
  {
    id: 10,
    title: "Capacity Degradation",
    description: "The EV battery range has reduced significantly over time.",
    symptoms:
      "The battery has undergone extensive charge cycles. SOC readings are inconsistent.",
    clues: [
      "The battery has undergone extensive charge cycles.",
      "SOC readings are inconsistent.",
    ],
    questions: [
      {
        text: "Has the battery reached its maximum cycle life?",
        answer: "Yes",
        isRelevant: true,
        hint: "Review the battery's cycle count.",
      },
      {
        text: "Are there any flagged issues with individual cells?",
        answer: "Yes",
        isRelevant: true,
        hint: "Check for issues in individual cells.",
      },
      {
        text: "Is the BMS reporting degraded performance?",
        answer: "Yes",
        isRelevant: true,
        hint: "Check for performance degradation flagged by the BMS.",
      },
      {
        text: "Is the charging speed consistent with specifications?",
        answer: "Yes",
        isRelevant: true,
        hint: "Monitor the charging speed to ensure it matches specifications.",
      },
      {
        text: "Are temperature sensors functioning correctly?",
        answer: "Yes",
        isRelevant: true,
        hint: "Verify the correct operation of temperature sensors.",
      },
      {
        text: "Is the cooling system operational?",
        answer: "Yes",
        isRelevant: true,
        hint: "Ensure that the cooling system is working as expected.",
      },
      {
        text: "Is there external damage to the battery pack?",
        answer: "No",
        isRelevant: false,
        explanation: "External damage is not related to degradation.",
        hint: "This is not relevant to the current issue.",
      },
      {
        text: "Is there a communication error with the charger?",
        answer: "No",
        isRelevant: false,
        explanation: "This is unrelated to capacity degradation.",
        hint: "This is not relevant to the current issue.",
      },
    ],
    resolutionQuestion: {
      text: "What is the primary cause of capacity degradation?",
      options: [
        { id: "a", text: "Reached maximum charge cycles", isCorrect: true },
        { id: "b", text: "Parasitic loads", isCorrect: false },
        { id: "c", text: "Faulty charger", isCorrect: false },
        { id: "d", text: "Uneven cooling", isCorrect: false },
      ],
    },
  },
  {
    id: 11,
    title: "EV Shuts Down Unexpectedly",
    description: "The EV suddenly loses power during operation.",
    symptoms: "Power relay shows inconsistent performance. BMS logs errors.",
    clues: ["Power relay shows inconsistent performance.", "BMS logs errors."],
    questions: [
      {
        text: "Is the power relay functioning correctly?",
        answer: "No",
        isRelevant: true,
        hint: "Check the relay for faults or malfunction.",
      },
      {
        text: "Are communication lines between the BMS and motor intact?",
        answer: "No",
        isRelevant: true,
        hint: "Inspect communication cables for disconnections.",
      },
      {
        text: "Are individual cells providing consistent voltage?",
        answer: "Yes",
        isRelevant: true,
        hint: "Ensure cells are charging properly.",
      },
      {
        text: "Is the SOC dropping rapidly before shutdown?",
        answer: "Yes",
        isRelevant: true,
        hint: "Monitor battery performance closely.",
      },
      {
        text: "Are there error codes logged in the BMS?",
        answer: "Yes",
        isRelevant: true,
        hint: "Review BMS error codes for further diagnostics.",
      },
      {
        text: "Is the cooling system operational?",
        answer: "Yes",
        isRelevant: false,
        explanation: "Cooling system not relevant to sudden power loss.",
        hint: "This is not relevant to the current issue.",
      },
    ],
    resolutionQuestion: {
      text: "What is the likely cause of sudden power loss?",
      options: [
        {
          id: "a",
          text: "Faulty power relay and communication errors",
          isCorrect: true,
        },
        { id: "b", text: "Overheating of the battery", isCorrect: false },
        { id: "c", text: "Uneven cell balancing", isCorrect: false },
        { id: "d", text: "Damaged charging port", isCorrect: false },
      ],
    },
  },
  {
    id: 12,
    title: "Charging Stops Intermittently",
    description:
      "The EV battery charges inconsistently, with charging sessions frequently stopping.",
    symptoms:
      "Loose connections in the charging port. BMS logs communication errors.",
    clues: [
      "The charging port has loose connections.",
      "The BMS logs communication errors.",
    ],
    questions: [
      {
        text: "Are the connections to the charging port secure?",
        answer: "No",
        isRelevant: true,
        hint: "Inspect charging port for any loose connections.",
      },
      {
        text: "Are communication lines between the charger and BMS intact?",
        answer: "No",
        isRelevant: true,
        hint: "Ensure proper communication between charger and BMS.",
      },
      {
        text: "Is the charger output voltage consistent?",
        answer: "Yes",
        isRelevant: true,
        hint: "Verify charger output voltage is within specifications.",
      },
      {
        text: "Are there physical damages to the charging port?",
        answer: "Yes",
        isRelevant: true,
        hint: "Check for physical wear or damage to the charging port.",
      },
      {
        text: "Are individual cells charging evenly?",
        answer: "Yes",
        isRelevant: true,
        hint: "Confirm that all cells are charging evenly.",
      },
      {
        text: "Has the battery recently undergone servicing?",
        answer: "No",
        isRelevant: false,
        explanation: "Not relevant to the current charging issue.",
        hint: "This is not relevant to the current issue.",
      },
    ],
    resolutionQuestion: {
      text: "What is the likely cause of intermittent charging failure?",
      options: [
        {
          id: "a",
          text: "Loose connections in the charging port",
          isCorrect: true,
        },
        { id: "b", text: "Uneven cell voltages", isCorrect: false },
        { id: "c", text: "Faulty cooling system", isCorrect: false },
        { id: "d", text: "Overheated battery", isCorrect: false },
      ],
    },
  },
  {
    id: 13,
    title: "Whining or Buzzing Sound",
    description: "The EV battery system emits unusual noises during operation.",
    symptoms: "Cooling fans cycle rapidly. No error codes in the BMS.",
    clues: [
      "The cooling fans cycle rapidly.",
      "There are no error codes logged in the BMS.",
    ],
    questions: [
      {
        text: "Are the cooling fans operating normally?",
        answer: "No",
        isRelevant: true,
        hint: "Inspect the cooling fans for issues or damage.",
      },
      {
        text: "Is the noise coming from the inverter?",
        answer: "Yes",
        isRelevant: true,
        hint: "Check the inverter for signs of malfunction.",
      },
      {
        text: "Is there physical damage to the cooling fans?",
        answer: "Yes",
        isRelevant: true,
        hint: "Look for signs of wear or damage to the fans.",
      },
      {
        text: "Is the battery overheating?",
        answer: "No",
        isRelevant: false,
        explanation: "Not relevant to unusual noise.",
        hint: "This is not relevant to the current issue.",
      },
      {
        text: "Are the battery connectors secured?",
        answer: "Yes",
        isRelevant: true,
        hint: "Ensure battery connectors are properly secured.",
      },
      {
        text: "Are the inverter components worn or damaged?",
        answer: "Yes",
        isRelevant: true,
        hint: "Inspect inverter components for wear or damage.",
      },
    ],
    resolutionQuestion: {
      text: "What is the likely cause of the unusual noise?",
      options: [
        {
          id: "a",
          text: "Faulty cooling fans and worn inverter components",
          isCorrect: true,
        },
        { id: "b", text: "Uneven cell voltages", isCorrect: false },
        { id: "c", text: "Overheated battery", isCorrect: false },
        { id: "d", text: "Charger malfunction", isCorrect: false },
      ],
    },
  },
  {
    id: 14,
    title: "EV Fails to Charge at Certain Public Stations",
    description:
      "The EV refuses to charge at specific public charging stations but works fine at others.",
    symptoms:
      "BMS logs protocol mismatch errors. Charger does not support EV's charging standard.",
    clues: [
      "The BMS logs protocol mismatch errors.",
      "The charger at the station does not support the EV's charging standard.",
    ],
    questions: [
      {
        text: "Is the charging protocol supported by the public station?",
        answer: "No",
        isRelevant: true,
        hint: "Check the charging protocol compatibility.",
      },
      {
        text: "Is the EV compatible with other chargers?",
        answer: "Yes",
        isRelevant: true,
        hint: "Ensure compatibility with other chargers.",
      },
      {
        text: "Are there physical damages to the charging port?",
        answer: "No",
        isRelevant: true,
        hint: "Inspect the charging port for damage.",
      },
      {
        text: "Has the EV successfully charged at this station before?",
        answer: "No",
        isRelevant: false,
        explanation: "Not related to current charging failure.",
        hint: "This is not relevant to the current issue.",
      },
      {
        text: "Are other vehicles able to charge at this station?",
        answer: "Yes",
        isRelevant: true,
        hint: "Confirm if other vehicles charge successfully.",
      },
      {
        text: "Does the BMS report any faults?",
        answer: "Yes",
        isRelevant: true,
        hint: "Check for any faults flagged by the BMS.",
      },
    ],
    resolutionQuestion: {
      text: "What is the likely cause of the charging failure?",
      options: [
        {
          id: "a",
          text: "Protocol mismatch between the EV and the charger",
          isCorrect: true,
        },
        { id: "b", text: "Damaged charging port", isCorrect: false },
        { id: "c", text: "Faulty cooling system", isCorrect: false },
        { id: "d", text: "Uneven cell voltages", isCorrect: false },
      ],
    },
  },
  {
    id: 15,
    title: "Fault Code Displayed, No Apparent Issues",
    description:
      "The BMS displays a fault code, but the EV operates normally without any visible issues.",
    symptoms:
      "Fault code indicates a minor communication glitch. The BMS firmware is outdated.",
    clues: [
      "The fault code indicates a minor communication glitch.",
      "The BMS firmware is outdated.",
    ],
    questions: [
      {
        text: "Is the fault code related to a communication error?",
        answer: "Yes",
        isRelevant: true,
        hint: "Review fault code details for communication error.",
      },
      {
        text: "Are there any recent firmware updates for the BMS?",
        answer: "Yes",
        isRelevant: true,
        hint: "Check if any updates have been applied to the BMS.",
      },
      {
        text: "Are all battery cells functioning within normal parameters?",
        answer: "Yes",
        isRelevant: true,
        hint: "Ensure that the battery cells are functioning correctly.",
      },
      {
        text: "Are there any flagged issues in the system diagnostics?",
        answer: "Yes",
        isRelevant: true,
        hint: "Check the system diagnostics for flagged issues.",
      },
      {
        text: "Does the EV exhibit performance degradation?",
        answer: "No",
        isRelevant: false,
        explanation: "Not related to fault code display.",
        hint: "This is not relevant to the current issue.",
      },
      {
        text: "Is there physical damage to any system components?",
        answer: "No",
        isRelevant: false,
        explanation: "No physical damage reported.",
        hint: "This is not relevant to the current issue.",
      },
    ],
    resolutionQuestion: {
      text: "What is the likely cause of the fault code?",
      options: [
        { id: "a", text: "Outdated BMS firmware", isCorrect: true },
        { id: "b", text: "Damaged cooling system", isCorrect: false },
        { id: "c", text: "Faulty battery cells", isCorrect: false },
        { id: "d", text: "Uneven cell charging", isCorrect: false },
      ],
    },
  },
];
