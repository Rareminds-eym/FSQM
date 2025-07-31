import { Level } from "../types/game";

export const levels: Level[] = [
  {
    id: 1,
    title: "Rapid Discharge During Operation",
    symptoms: "Discharges quickly after full charge.",
  },
  {
    id: 2,
    title: "Overheating After Prolonged Use",
    symptoms: "High temperature during extended driving.",
  },
  {
    id: 3,
    title: "Uneven Charging Across Cells",
    symptoms: "Cells exhibit varying voltages after charging.",
  },
  {
    id: 4,
    title: "Failure to Charge Beyond 80%",
    symptoms: "Charging halts at 80% capacity.",
  },
  {
    id: 5,
    title: "Slow Charging Rate",
    symptoms: "Charging takes longer than expected.",
  },
  {
    id: 6,
    title: "BMS Sensor Malfunction",
    symptoms: "Inaccurate state of charge (SOC) readings.",
  },
  {
    id: 7,
    title: "Thermal Runaway",
    symptoms: "Sudden overheating and smoke.",
  },
  {
    id: 8,
    title: "High Self-Discharge",
    symptoms: "Battery drains significantly when idle.",
  },
  {
    id: 9,
    title: "Voltage Spike During Charging",
    symptoms: "Unusual voltage spike causing charging to stop.",
  },
  {
    id: 10,
    title: "Capacity Degradation",
    symptoms: "Reduced driving range over time.",
  },
  {
    id: 11,
    title: "Sudden Power Loss During Operation",
    symptoms: "EV shuts down without warning.",
  },
  {
    id: 12,
    title: "Intermittent Charging Failure",
    symptoms: "Charging stops intermittently.",
  },
  {
    id: 13,
    title: "Unusual Noise During Operation",
    symptoms: "Whining or buzzing sound.",
  },
  {
    id: 14,
    title: "Charger Incompatibility",
    symptoms: "EV fails to charge at certain public stations.",
  },
  {
    id: 15,
    title: "Fault Code Without Symptoms",
    symptoms: "No apparent operational issues, but fault code displayed.",
  },
];
