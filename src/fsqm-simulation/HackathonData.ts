export interface Question {
  id: number;
  caseFile: string;
  violationOptions: string[];
  correctViolation: string;
  rootCauseOptions: string[];
  correctRootCause: string;
  solutionOptions: string[];
  correctSolution: string;
}

export const hackathonData: Question[] = [
  {
    "id": 1,
    "caseFile": "During a ready-to-eat chicken curry run, the cooker trend chart shows the core of the largest pieces reached 70 °C for 2 minutes. The validated CCP requires ≥74 °C for ≥15 seconds at the core. Operators, rushing to meet the dispatch cut-off, let the batch move to packing while planning to 'check later.' No photo or note of probe placement was taken, and the daily probe verification entry is missing for that shift. Some units have thicker cuts than usual because a new butcher joined that morning. What should the QA team do next?",
    "violationOptions": [
      "Product left the CCP without meeting the validated critical limit",
      "Line used stainless steel utensils",
      "Operators changed hair nets at shift change",
      "Labels printed in black ink"
    ],
    "correctViolation": "Product left the CCP without meeting the validated critical limit",
    "rootCauseOptions": [
      "Probe placed near surface; no core verification; operator rushed due to backlog",
      "CO2 level high in boiler room",
      "Wrong font size on label artwork",
      "Excess hand sanitizer used by staff"
    ],
    "correctRootCause": "Probe placed near surface; no core verification; operator rushed due to backlog",
    "solutionOptions": [
      "Place calibrated core probes; retrain on CCP monitoring; hold and reheat/recook if safe, else reject; document and verify trend",
      "Cool product faster to balance undercooking",
      "Add extra spices to mask issue",
      "Ship only to nearby customers"
    ],
    "correctSolution": "Place calibrated core probes; retrain on CCP monitoring; hold and reheat/recook if safe, else reject; document and verify trend"
  },
  {
    "id": 2,
    "caseFile": "A 'nut-free' cookie order showed low peanut protein in a routine finished-product test. Earlier that day, the same sifter was used for peanut cookies and then 'cleaned.' The cleaning log shows only visual clean and a rinse; the 'allergen verification swab' row is blank. Changeover took 20 minutes instead of the scheduled 45. Color-coded tools for allergen lines are stored on the same rack as non-allergen tools. What actions should follow?",
    "violationOptions": [
      "Failure to prevent allergen cross-contact as per HACCP pre-requisite program",
      "Using blue gloves in production",
      "Recording metal detector checks every hour",
      "Wearing steel-toe shoes"
    ],
    "correctViolation": "Failure to prevent allergen cross-contact as per HACCP pre-requisite program",
    "rootCauseOptions": [
      "Shared equipment not cleaned to validated allergen removal standard; changeover checklist incomplete",
      "Supplier sent wrong carton size",
      "Incorrect QR code on pallet tag",
      "Ambient noise high in packing hall"
    ],
    "correctRootCause": "Shared equipment not cleaned to validated allergen removal standard; changeover checklist incomplete",
    "solutionOptions": [
      "Implement validated allergen cleaning; dedicated tools or sifter; visual ID for allergen tools; update changeover checklist; verify with rapid allergen test",
      "Print an allergy warning sticker and continue",
      "Shorten bake time to reduce proteins",
      "Switch to paper hair nets"
    ],
    "correctSolution": "Implement validated allergen cleaning; dedicated tools or sifter; visual ID for allergen tools; update changeover checklist; verify with rapid allergen test"
  },
  {
    "id": 3,
    "caseFile": "After a shift change, the date coder on the pouch line was set to +7 days, but pasteurized milk has an approved shelf life of 3 days. The line packed 5,000 pouches before QC noticed at post-run check. The two-person coder verification box on the line-clearance sheet was left unchecked, and the vision camera that reads codes was 'temporarily disabled' during maintenance. Trucks with mixed lots have already left the plant. What decisions are needed now?",
    "violationOptions": [
      "Incorrect date coding contrary to label approval and shelf-life validation",
      "Using automated case packers",
      "Sampling every production hour",
      "Applying tamper-evident seals"
    ],
    "correctViolation": "Incorrect date coding contrary to label approval and shelf-life validation",
    "rootCauseOptions": [
      "Date coder preset not updated after changeover; verification step skipped during line clearance",
      "Pasteurizer holding tube slightly fouled",
      "Dock leveler not serviced",
      "Operator forgot hair net"
    ],
    "correctRootCause": "Date coder preset not updated after changeover; verification step skipped during line clearance",
    "solutionOptions": [
      "Stop distribution; trace and recall affected lots; correct coding; reinforce line clearance and coder verification with two-person check",
      "Reduce storage temperature to extend life",
      "Blend old milk with fresh",
      "Overlabel only the pallets at the plant"
    ],
    "correctSolution": "Stop distribution; trace and recall affected lots; correct coding; reinforce line clearance and coder verification with two-person check"
  },
  {
    "id": 4,
    "caseFile": "At start-up, the metal detector failed the 2.0 mm ferrous test piece. Operators adjusted sensitivity downward to reduce false rejects and kept running for 40 minutes. There is no interlock to stop the conveyor after a failed challenge, and the reject-confirmation test has not been performed for a week. Product from that period is already palletized. How should this situation be handled?",
    "violationOptions": [
      "Continuing production after failing a critical control verification test",
      "Using smaller cartons",
      "Measuring weight every 30 minutes",
      "Using foils for sealing"
    ],
    "correctViolation": "Continuing production after failing a critical control verification test",
    "rootCauseOptions": [
      "Test piece placed off-centre; detector sensitivity not set as per product effect; no interlock to stop conveyor",
      "Humidity high in corridor",
      "Wrong pallet height used",
      "QC sample bottle cracked"
    ],
    "correctRootCause": "Test piece placed off-centre; detector sensitivity not set as per product effect; no interlock to stop conveyor",
    "solutionOptions": [
      "Stop line; hold and re-screen affected product; fix setup; add interlock and SOP to prevent bypass; retrain operators",
      "Ship the product but increase market sampling",
      "Switch detector brand immediately",
      "Reduce pack speed only"
    ],
    "correctSolution": "Stop line; hold and re-screen affected product; fix setup; add interlock and SOP to prevent bypass; retrain operators"
  },
  {
    "id": 5,
    "caseFile": "A zone-2 environmental swab in the salad room came back presumptive Listeria spp. on Saturday. The weekend supervisor did not place a product hold, assuming “it’s not on food contact.” Two more shifts produced and shipped product. The EMP SOP has unclear action limits and no weekend escalation contact list. What should the food safety team do now?",
    "violationOptions": [
      "Failure to act on environmental pathogen positive in RTE area",
      "Using color-coded mops",
      "Recording employee temperatures at entry",
      "Using stainless tables"
    ],
    "correctViolation": "Failure to act on environmental pathogen positive in RTE area",
    "rootCauseOptions": [
      "Ambiguous action limits in EMP SOP; weekend shift unsure about authority; no hold/release protocol",
      "Condensation on ceiling",
      "Supplier provided larger lettuce leaves",
      "Scale uncalibrated"
    ],
    "correctRootCause": "Ambiguous action limits in EMP SOP; weekend shift unsure about authority; no hold/release protocol",
    "solutionOptions": [
      "Immediate product hold and risk assessment; intensified swabbing; sanitize; review EMP action levels; train weekend shift; revise hold/release flow",
      "Heat product after packing",
      "Dilute salad with vinegar",
      "Change room air freshener"
    ],
    "correctSolution": "Immediate product hold and risk assessment; intensified swabbing; sanitize; review EMP action levels; train weekend shift; revise hold/release flow"
  },
  {
    "id": 6,
    "caseFile": "The aw meter used to release dried fruit shows a calibration due date that expired two weeks ago; the sticker is faded. Three lots were released based on this meter’s readings. The calibration tracker spreadsheet shows no alerts sent to QC for due dates, and the alternate meter is locked in another building. What is the right next step?",
    "violationOptions": [
      "Using measuring equipment past calibration schedule",
      "Storing pouches in cartons",
      "Using powder-free gloves",
      "Having SOPs in a folder"
    ],
    "correctViolation": "Using measuring equipment past calibration schedule",
    "rootCauseOptions": [
      "Calibration tracker not updated; no alert; sticker faded",
      "High room temperature",
      "Long sample equilibration time",
      "Operator left early"
    ],
    "correctRootCause": "Calibration tracker not updated; no alert; sticker faded",
    "solutionOptions": [
      "Quarantine affected lots; verify with a calibrated aw meter; update electronic tracker with alerts; retrain staff",
      "Average current aw with historical data",
      "Release by visual dryness only",
      "Reduce target aw next time"
    ],
    "correctSolution": "Quarantine affected lots; verify with a calibrated aw meter; update electronic tracker with alerts; retrain staff"
  },
  {
    "id": 7,
    "caseFile": "A peanut lot arrived with a COA reporting aflatoxin B1 = 8 ppb; the plant spec is ≤5 ppb. Receiving focused on weight and appearance and filed the COA without review; the lot was issued to roasting and used in production. A customer asks for the COA copy and the gap is discovered. Intake has no rapid aflatoxin screen and no COA review checklist. How should this be handled?",
    "violationOptions": [
      "Accepting and using a raw material that does not meet specification",
      "Taking duplicate retain samples",
      "Recording dock temperature",
      "Using metal pallets"
    ],
    "correctViolation": "Accepting and using a raw material that does not meet specification",
    "rootCauseOptions": [
      "Receiving check focused on appearance/weight; COA review not done; no rapid aflatoxin test in intake",
      "Supplier pallet height too tall",
      "CO2 fogging absent",
      "Incorrect forklift route"
    ],
    "correctRootCause": "Receiving check focused on appearance/weight; COA review not done; no rapid aflatoxin test in intake",
    "solutionOptions": [
      "Quarantine finished product; trace back; test retains and in-process; block supplier until corrective action; add intake rapid test and COA verification",
      "Roast peanuts longer to burn off toxins",
      "Add sugar to mask bitterness",
      "Use the same supplier but request discount"
    ],
    "correctSolution": "Quarantine finished product; trace back; test retains and in-process; block supplier until corrective action; add intake rapid test and COA verification"
  },
  {
    "id": 8,
    "caseFile": "Yogurt pallets sat at the dock at ~12 °C for ~4 hours because the cold room was full. The SOP has no put-away time target, and the dock has no temperature logger. When moved inside, some cartons had condensation and wet shrink wrap. The delivery timing overlaps with three other chilled deliveries every Friday. What must the team decide and change?",
    "violationOptions": [
      "Failure to maintain required cold-chain temperature during receiving",
      "Using plastic wrap on pallets",
      "Recording truck seal number",
      "Using slip sheets"
    ],
    "correctViolation": "Failure to maintain required cold-chain temperature during receiving",
    "rootCauseOptions": [
      "No put-away time target; limited cold-room capacity; dock temperature not monitored",
      "Wrong pallet jack type",
      "Excess shrink film",
      "Unpainted floor lines"
    ],
    "correctRootCause": "No put-away time target; limited cold-room capacity; dock temperature not monitored",
    "solutionOptions": [
      "Move pallets to cold room; assess excursion; increase capacity or staging plan; set put-away SLA; add dock loggers; train staff",
      "Quick-freeze to bring temp down faster",
      "Mix with colder pallets to average temp",
      "Shorten shelf life by 1 day and ship"
    ],
    "correctSolution": "Move pallets to cold room; assess excursion; increase capacity or staging plan; set put-away SLA; add dock loggers; train staff"
  },
  {
    "id": 9,
    "caseFile": "To catch up with orders, sanitation staff reduced CIP contact time by 30% on the beverage line. ATP swabs after start-up failed at two sites downstream. The CIP recipe is not password-locked, and there is no step that forces QA to review a CIP exception before production starts. Two hours of product have been filled. What should be done?",
    "violationOptions": [
      "Changing validated sanitation parameters without approval",
      "Using different colored gaskets",
      "Recording lot numbers of chemicals",
      "Performing daily toolbox talk"
    ],
    "correctViolation": "Changing validated sanitation parameters without approval",
    "rootCauseOptions": [
      "Production pressure; no real-time oversight; CIP recipe not password protected",
      "Water hardness variation only",
      "Incorrect pump rotation direction",
      "Chemical MSDS outdated"
    ],
    "correctRootCause": "Production pressure; no real-time oversight; CIP recipe not password protected",
    "solutionOptions": [
      "Stop production; re-run full CIP; lock recipe; add verification swabs; implement production-sanitation scheduling rules",
      "Run hot water once and start up",
      "Switch to stronger caustic permanently",
      "Ignore ATP fails if visual is clean"
    ],
    "correctSolution": "Stop production; re-run full CIP; lock recipe; add verification swabs; implement production-sanitation scheduling rules"
  },
  {
    "id": 10,
    "caseFile": "Two tomato-sauce lots were labeled with duplicate case barcodes due to a cloned label template that reused the same lot seed. Warehouse scanners flag random “already scanned” errors, delaying dispatch, and making trace-back unclear. There is no software validation record for the label system, and QA verification at start-up focuses on text, not ID uniqueness. How should the site proceed?",
    "violationOptions": [
      "Compromising traceability by issuing duplicate identifiers",
      "Using taller pallets",
      "Applying two labels per case",
      "Manual stretch wrapping"
    ],
    "correctViolation": "Compromising traceability by issuing duplicate identifiers",
    "rootCauseOptions": [
      "Label software template duplicated with same lot seed; no unique ID control; no QA check",
      "Printer ribbon worn",
      "Carton glue set too fast",
      "Forklift parked near printer"
    ],
    "correctRootCause": "Label software template duplicated with same lot seed; no unique ID control; no QA check",
    "solutionOptions": [
      "Stop dispatch; re-label with unique IDs; validate label software; add QA verification and lock lot seeds; conduct mock trace",
      "Ship and fix IDs at customer site",
      "Keep a handwritten list of cases",
      "Shorten lot code to save space"
    ],
    "correctSolution": "Stop dispatch; re-label with unique IDs; validate label software; add QA verification and lock lot seeds; conduct mock trace"
  },
  {
    "id": 11,
    "caseFile": "An operator saw a rodent near the flour silo at 06:10. The pest-control log shows two missed weekly checks, and proofing around cable entries is incomplete. Inside the silo area, spilled flour is visible along the wall. No product hold decision has been recorded. What are the immediate and follow-up steps?",
    "violationOptions": [
      "Failure to maintain pest control as per schedule and to act on sighting",
      "Using earplugs near machines",
      "Changing mop heads weekly",
      "Posting safety posters"
    ],
    "correctViolation": "Failure to maintain pest control as per schedule and to act on sighting",
    "rootCauseOptions": [
      "Pest control contractor visit missed and not tracked; internal audit not done; feed openings not sealed",
      "High ambient humidity only",
      "Different broom type used",
      "Short gap in shift handover"
    ],
    "correctRootCause": "Pest control contractor visit missed and not tracked; internal audit not done; feed openings not sealed",
    "solutionOptions": [
      "Seal entry points; perform full inspection and intensified trapping; update schedule tracker; retrain staff to escalate sightings immediately",
      "Increase air freshener use",
      "Spray perfume near silo",
      "Ignore since product is baked later"
    ],
    "correctSolution": "Seal entry points; perform full inspection and intensified trapping; update schedule tracker; retrain staff to escalate sightings immediately"
  },
  {
    "id": 12,
    "caseFile": "A new ready-to-eat sous-vide chicken was launched using a copy of an older HACCP plan. The new process adds a rapid-chill step, but no CCP/OPRP is listed for chilling, and there is no validation for time–temperature limits. First customer feedback mentions variable texture. Change-control records do not show a cross-functional HACCP review. What needs to happen?",
    "violationOptions": [
      "Operating with an outdated HACCP plan that misses new hazards/CCPs",
      "Using a new recipe card format",
      "Printing labels in bilingual format",
      "Weighing spices in separate room"
    ],
    "correctViolation": "Operating with an outdated HACCP plan that misses new hazards/CCPs",
    "rootCauseOptions": [
      "Change management did not trigger HACCP review; cross-functional team not assembled",
      "New chiller delivered late",
      "QC team short-staffed",
      "Packaging vendor changed ink"
    ],
    "correctRootCause": "Change management did not trigger HACCP review; cross-functional team not assembled",
    "solutionOptions": [
      "Run a formal hazard analysis; update HACCP; validate time–temperature for sous-vide; train team; integrate into change control",
      "Add extra salt to improve safety",
      "Shorten shelf life by one day without validation",
      "Keep old HACCP until the next audit"
    ],
    "correctSolution": "Run a formal hazard analysis; update HACCP; validate time–temperature for sous-vide; train team; integrate into change control"
  },
  {
    "id": 13,
    "caseFile": "Yogurt fermentation completed overnight. The pH at end-point was not recorded because the pH meter was in maintenance. The supervisor judged readiness by taste and texture and released the batch to packing. There is no backup meter or hold step when critical readings are unavailable. What should QA require now?",
    "violationOptions": [
      "Missing critical quality attribute record at release",
      "Using a new ladle",
      "Extra cleaning of floor drains",
      "Wearing different shoe color"
    ],
    "correctViolation": "Missing critical quality attribute record at release",
    "rootCauseOptions": [
      "Operator assumed taste/texture sufficient; pH meter kept in maintenance; no alternate device or hold step",
      "Milk fat % varied slightly",
      "Cup size changed",
      "Sticker roll finished"
    ],
    "correctRootCause": "Operator assumed taste/texture sufficient; pH meter kept in maintenance; no alternate device or hold step",
    "solutionOptions": [
      "Introduce mandatory pH recording with calibrated meter; add hold until data captured; provide backup meter; retrain staff",
      "Lower incubation temperature next time",
      "Increase starter culture dose",
      "Skip pH checks for thick products"
    ],
    "correctSolution": "Introduce mandatory pH recording with calibrated meter; add hold until data captured; provide backup meter; retrain staff"
  },
  {
    "id": 14,
    "caseFile": "A chocolate bar uses soy lecithin, but the new label artwork omitted the “contains soy” statement. Artwork was changed to add a nutrition claim, and the allergen checklist was not part of the approval flow. Two production days have shipped. E-commerce images also show the incorrect label. What needs to be done immediately?",
    "violationOptions": [
      "Incorrect allergen labeling against regulatory requirements",
      "Incorrect carton EAN code",
      "Shorter label width",
      "Two languages present on label"
    ],
    "correctViolation": "Incorrect allergen labeling against regulatory requirements",
    "rootCauseOptions": [
      "Artwork change not reviewed by QA/regulatory; allergen statement not on the checklist",
      "Supplier sent new COA format",
      "Ink smudged during print",
      "Operator used small blades"
    ],
    "correctRootCause": "Artwork change not reviewed by QA/regulatory; allergen statement not on the checklist",
    "solutionOptions": [
      "Stop shipments; relabel/recall affected lots; revise artwork approval checklist to include allergen statement; retrain approvers",
      "Add a separate sticker at store level later",
      "Reduce soy lecithin amount",
      "Print allergen in a different color only"
    ],
    "correctSolution": "Stop shipments; relabel/recall affected lots; revise artwork approval checklist to include allergen statement; retrain approvers"
  },
  {
    "id": 15,
    "caseFile": "Cooking oil delivered yesterday has peroxide value above spec, but the COA was not reviewed at intake. Without an on-site PV quick test, the oil was pumped to the fryer and used for two hours. Operators noted a slight off-odor at cooling. The supplier is new and not yet on the approved-supplier list. What should the plant decide?",
    "violationOptions": [
      "Using an input that fails quality specification",
      "Using stainless fry baskets",
      "Daily fryer boil-out performed",
      "Counting cartons per lot"
    ],
    "correctViolation": "Using an input that fails quality specification",
    "rootCauseOptions": [
      "COA not reviewed at intake; rapid PV test not available; FIFO confusion",
      "Fryer exhaust fan loud",
      "Wrong glove size",
      "Small pallets used"
    ],
    "correctRootCause": "COA not reviewed at intake; rapid PV test not available; FIFO confusion",
    "solutionOptions": [
      "Stop production; drain fryer; test finished product for rancidity markers; add PV intake test; tighten COA review and FEFO",
      "Mask rancid flavor with spices",
      "Blend with fresh oil to dilute PV",
      "Ship quickly before flavor develops"
    ],
    "correctSolution": "Stop production; drain fryer; test finished product for rancidity markers; add PV intake test; tighten COA review and FEFO"
  },
  {
    "id": 16,
    "caseFile": "A glass jar broke near the filler during production. Staff quickly picked up the big pieces and restarted after about 10 minutes. They didn’t block off the full area, didn’t pull back jars that had already passed through, and didn’t do a full glass check. Later, tiny glass chips were found stuck in the cap chute guard.",
    "violationOptions": [
      "Incomplete response to glass breakage per foreign-body control program",
      "Using plastic scoops",
      "Changing filters weekly",
      "Running conveyors at slower speed"
    ],
    "correctViolation": "Incomplete response to glass breakage per foreign-body control program",
    "rootCauseOptions": [
      "No defined cordon zone; staff unaware of full-glass audit steps; inadequate checklist",
      "Jar supplier increased pallet size",
      "Glue temperature varied",
      "Operator gloves torn"
    ],
    "correctRootCause": "No defined cordon zone; staff unaware of full-glass audit steps; inadequate checklist",
    "solutionOptions": [
      "Stop line; cordon area; remove and quarantine all product from last safe point; perform documented glass audit; retrain staff",
      "Install a stronger magnet to catch glass",
      "Wipe top surface only and restart",
      "Continue but increase QC sampling later"
    ],
    "correctSolution": "Stop line; cordon area; remove and quarantine all product from last safe point; perform documented glass audit; retrain staff"
  },
  {
    "id": 17,
    "caseFile": "To reduce waste, the mixer added 25% rework dough, though the SOP limit is 15%. The BMR does not list the extra rework, and scale printouts show manual overrides. Biscuit texture on cooling is harder than usual. The rework bin lacks auto-weigh recording and supervisor approval. What should be addressed?",
    "violationOptions": [
      "Exceeding validated rework limits and poor documentation",
      "Cleaning belts with approved chemical",
      "Adjusting oven zone 2 temperature",
      "Using new pallets"
    ],
    "correctViolation": "Exceeding validated rework limits and poor documentation",
    "rootCauseOptions": [
      "Pressure to reduce waste; no automatic rework weighing/recording; supervisor approval step absent",
      "Humidity lower than usual",
      "Shorter cooling belt",
      "Carton tape width changed"
    ],
    "correctRootCause": "Pressure to reduce waste; no automatic rework weighing/recording; supervisor approval step absent",
    "solutionOptions": [
      "Hold product; evaluate quality; implement rework scale with auto-record; add approval workflow; train team on limits",
      "Increase baking time to fix texture",
      "Blend more fresh dough to average down",
      "Ignore if customers do not complain"
    ],
    "correctSolution": "Hold product; evaluate quality; implement rework scale with auto-record; add approval workflow; train team on limits"
  },
  {
    "id": 18,
    "caseFile": "A final taste check for a premium soup included a panelist with a cold and blocked nose. The panel still scored the soup as normal, and the product was shipped to meet the truck time. Afterward, two customers reported odd flavors. There was no health check for tasters and no backup panelists available.",
    "violationOptions": [
      "Deviation from sensory panel qualification and health-screening SOP",
      "Using white booths with neutral light",
      "Randomizing sample order",
      "Rinsing with water between samples"
    ],
    "correctViolation": "Deviation from sensory panel qualification and health-screening SOP",
    "rootCauseOptions": [
      "No pre-panel health checklist; pressure to meet release timing; alternate panelists not trained",
      "Serving temperature slightly off",
      "Sample cups smaller",
      "Timer battery low"
    ],
    "correctRootCause": "No pre-panel health checklist; pressure to meet release timing; alternate panelists not trained",
    "solutionOptions": [
      "Invalidate panel; repeat with qualified panelists; introduce health checklist and backup panel roster; train panel leader",
      "Adjust scoring scale downward",
      "Skip sensory for low-risk lots",
      "Ask customers to confirm by email"
    ],
    "correctSolution": "Invalidate panel; repeat with qualified panelists; introduce health checklist and backup panel roster; train panel leader"
  },
  {
    "id": 19,
    "caseFile": "A consumer reported a foreign body in a product from lot L24-118. When QA tried to pull the retention sample, it could not be found. The retention fridge shows gaps in the manual log, and there is no barcode/LIMS index. Chain-of-custody documents are incomplete. How should the investigation proceed?",
    "violationOptions": [
      "Failure to maintain and retrieve retention samples as per retention program",
      "Using thicker sample jars",
      "Keeping samples in dark room",
      "Applying tamper tape"
    ],
    "correctViolation": "Failure to maintain and retrieve retention samples as per retention program",
    "rootCauseOptions": [
      "Sample storage not indexed; LIMS not used; manual log had gaps; periodic reconciliation not done",
      "Fridge temperature slightly high",
      "Labels smudged",
      "Courier delayed"
    ],
    "correctRootCause": "Sample storage not indexed; LIMS not used; manual log had gaps; periodic reconciliation not done",
    "solutionOptions": [
      "Institute barcode/LIMS tracking; reconcile inventory monthly; retrain staff; update retention SOP; conduct mock retrieval drills",
      "Ask customer to return their product only",
      "Close complaint due to lack of sample",
      "Reduce retention period next year"
    ],
    "correctSolution": "Institute barcode/LIMS tracking; reconcile inventory monthly; retrain staff; update retention SOP; conduct mock retrieval drills"
  },
  {
    "id": 20,
    "caseFile": "The site has not performed a mock recall/trace drill for 22 months. A real-world trace request from a retailer last week took 9 hours to complete because the contact list was outdated and systems weren’t aligned (ERP/WMS/LIMS). Staff turnover is high, and no one owns the recall calendar. What is the next move?",
    "violationOptions": [
      "Missing annual mock recall/trace exercise as required by QMS/regulators",
      "Posting SOPs on notice board",
      "Weekly toolbox meetings",
      "Having visitor logs at gate"
    ],
    "correctViolation": "Missing annual mock recall/trace exercise as required by QMS/regulators",
    "rootCauseOptions": [
      "Recall program lacked a scheduler/owner; competing priorities; no KPI",
      "Printer down time",
      "Two new staff joined",
      "Customer returned empty pallets late"
    ],
    "correctRootCause": "Recall program lacked a scheduler/owner; competing priorities; no KPI",
    "solutionOptions": [
      "Plan and run a full mock recall; assign owner and KPI; document lessons; update contact lists; schedule recurring drills",
      "Run a paper-only audit without exercising systems",
      "Wait until next certification audit",
      "Reduce product variety to simplify"
    ],
    "correctSolution": "Plan and run a full mock recall; assign owner and KPI; document lessons; update contact lists; schedule recurring drills"
  }
];