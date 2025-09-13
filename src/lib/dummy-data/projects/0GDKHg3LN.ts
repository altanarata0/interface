// green: #5CC96E
// red: #E44234

import {
  Phase,
  Project,
  ProjectStatus,
  Regulation,
  Step,
  TimelineStatus,
} from "@/components/screens/projects-tracker/types";

/** Data-center–specific code & compliance items */
const regulations: Regulation[] = [
  {
    id: "DC-1",
    code: {
      jurisdiction: "California",
      code: "Building Code (CBC) 2022",
      section: "1607.1-CompRm",
    },
    isCompliant: false,
    regulation:
      "Computer-server rooms shall be designed for a minimum live load of 250 psf.",
    status: "In-Review",
    severity: "Moderate",
    description:
      "Structural calculations show portions of the slab-on-grade server hall designed for only 200 psf. This is below the 250 psf live-load requirement for data-processing areas.",
    calculations: "Design load = 200 psf < 250 psf required",
    nextSteps: [
      "Upsize slab reinforcement and verify sub-grade bearing capacity to support 250 psf live load",
    ],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add /><modify><square page="0" rect="1335.46,822.041,1979.99,1242.21" color="#00B43F" flags="print" name="threshold-compliant" title="Guest" subject="Rectangle" date="D:20250607155440-07'00'" width="3" creationdate="D:20250225135439-08'00'"/></modify>
<delete />
</xfdf>`,
  },
  {
    id: "DC-2",
    code: {
      jurisdiction: "California",
      code: "Electrical Code (CEC) 2022",
      section: "645.10",
    },
    isCompliant: true,
    regulation:
      "Information-Technology Equipment Rooms shall have a disconnecting means that shuts off all power to IT equipment.",
    status: "Approved",
    severity: "NA",
    description:
      "Design includes two remote Emergency Power-Off (EPO) stations—one at each exit door—wired per CEC 645.10.",
    calculations:
      "EPO device spacing ≤ 24 ft; conductor sizing per Table 430.52",
    nextSteps: [],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add />
<modify><square page="0" rect="1267.78,2794.78,1353.13,2841.471" color="#E44234" flags="print" name="e43bc1c6-3962-f597-3d35-fbe2d38ad04b" title="Guest" subject="Rectangle" date="D:20250607162257-07'00'" width="2" creationdate="D:20250607162226-07'00'" dashes=""/></modify>
<delete />
</xfdf>`,
  },
  {
    id: "DC-3",
    code: {
      jurisdiction: "California",
      code: "Fire Code (CFC) 2022",
      section: "904.13",
    },
    isCompliant: false,
    regulation:
      "Clean-agent (NFPA 2001) fire-extinguishing systems required in mission-critical data halls.",
    status: "In-Review",
    severity: "Critical",
    description:
      "Drawings indicate only wet-pipe sprinklers in white-space; no clean-agent system specified.",
    calculations: "",
    nextSteps: [
      "Provide FM-200 / Novec 1230 system with minimum 10-second discharge time and reach of 30 sec sustained concentration",
      "Submit agent concentration calculations and nozzle layout",
    ],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add><square page="0" rect="1352.86,2767.76,1441.23,2841.54" color="#E44234" flags="print" name="f517f5fe-8688-625f-dc9a-8b4fd336cfc2" title="Guest" subject="Rectangle" date="D:20250607165452-07'00'" creationdate="D:20250607165449-07'00'" width="2" dashes=""/></add>
<modify />
</xfdf>`,
  },
  {
    id: "DC-4",
    code: {
      jurisdiction: "California",
      code: "Fire Code (CFC) 2022",
      section: "1206.2",
    },
    isCompliant: false,
    regulation:
      "Lithium-Ion Battery Energy Storage Systems (BESS) over 50 kWh require UL 9540A testing and dedicated 3-hr fire-rated room.",
    status: "In-Review",
    severity: "Moderate",
    description:
      "Project includes 4 × 75 kWh UPS cabinets in electrical room without 3-hour enclosure.",
    calculations: "Total BESS = 300 kWh > 50 kWh trigger",
    nextSteps: [
      "Provide 3-hr fire-rated barriers or relocate BESS to exterior rated enclosure",
      "Submit UL 9540A summary to Fire Prevention",
    ],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add />
<modify><square page="0" rect="1635.72,1397.37,1855.66,2666.57" color="#E44234" flags="print" name="4785e8ea-613a-2321-1785-c4505811c9b1" title="Guest" subject="Rectangle" date="D:20250607165743-07'00'" creationdate="D:20250607165732-07'00'" dashes=""/></modify>
<delete />
</xfdf>`,
  },
  {
    id: "DC-5",
    code: {
      jurisdiction: "California",
      code: "Mechanical Code (CMC) 2022",
      section: "312.1",
    },
    isCompliant: true,
    regulation:
      "CRAC/CRAH units serving data halls shall provide N + 1 redundancy (Tier III equivalent).",
    status: "Approved",
    severity: "NA",
    description:
      "HVAC schedule shows 10 × 150 kW CRAH units with one redundant unit per gallery (N + 1).",
    calculations: "Cooling load 1.2 MW; capacity installed 1.35 MW",
    nextSteps: [],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add />
<modify><square page="1" rect="1346.46,1020.43,1968.34,1397.221" color="#E44234" flags="print" name="8d6107be-fb17-817d-b3f3-c2bb1285b568" title="Guest" subject="Rectangle" date="D:20250607181653-07'00'" creationdate="D:20250607181646-07'00'" dashes=""/></modify>
<delete />
</xfdf>`,
  },
  {
    id: "DC-6",
    code: {
      jurisdiction: "California",
      code: "Energy Code (Title 24, Part 6) 2022",
      section: "140.9",
    },
    isCompliant: false,
    regulation:
      "Data centers > 50 kW IT load must achieve a Design PUE ≤ 1.35 or provide economizer cooling.",
    status: "In-Review",
    severity: "Minor",
    description:
      "Energy model indicates predicted PUE of 1.42 at 50 % loading—exceeding Title 24 threshold.",
    calculations: "Modeled PUE = 1.42 > 1.35 allowed",
    nextSteps: [
      "Incorporate indirect evaporative economizers or UPS high-efficiency mode to bring PUE ≤ 1.35",
    ],
    xfdfString: "<xfdf>…red highlight on energy model summary…</xfdf>",
  },
  {
    id: "DC-7",
    code: {
      jurisdiction: "California",
      code: "Building Code (CBC) 2022",
      section: "1705.12",
    },
    isCompliant: true,
    regulation:
      "Seismic anchorage of equipment weighing > 400 lbs in SDC D shall be special-inspected.",
    status: "Approved",
    severity: "NA",
    description:
      "Special inspection plan covers all CRAC units, UPS modules, and generators; anchorage calcs sealed by SE.",
    calculations: "Anchor demand/capacity ratio ≤ 0.85",
    nextSteps: [],
    xfdfString: "<xfdf>…green anchors callout…</xfdf>",
  },
  {
    id: "DC-8",
    code: {
      jurisdiction: "California",
      code: "Plumbing Code (CPC) 2022",
      section: "604.11",
    },
    isCompliant: true,
    regulation:
      "Make-up water for evaporative cooling shall be metered and provided with backflow prevention.",
    status: "Approved",
    severity: "NA",
    description:
      "Design includes RP-type backflow preventer and dedicated make-up water meter.",
    calculations: "",
    nextSteps: [],
    xfdfString: "<xfdf>…green square at make-up water line…</xfdf>",
  },
  {
    id: "DC-9",
    code: {
      jurisdiction: "California",
      code: "Fire Code (CFC) 2022",
      section: "907.2.22",
    },
    isCompliant: true,
    regulation:
      "Early-warning smoke detection (aspirating system) shall be installed in data halls ≥ 2,500 ft².",
    status: "Approved",
    severity: "NA",
    description:
      "VESDA VLF detectors specified with coverage calculations per manufacturer’s tables.",
    calculations: "Detector spacing = 30 ft; ceiling height = 16 ft",
    nextSteps: [],
    xfdfString: "<xfdf>…green circle on detector network…</xfdf>",
  },
  {
    id: "DC-10",
    code: {
      jurisdiction: "California",
      code: "Fuel Gas Code 2022",
      section: "414.6.1",
    },
    isCompliant: false,
    regulation:
      "Diesel generator day-tanks located inside the building shall not exceed 660 gal unless protected.",
    status: "In-Review",
    severity: "Moderate",
    description:
      "Design shows three 1,000 gal belly tanks beneath generators inside the enclosure.",
    calculations: "Tank volume = 1,000 gal > 660 gal limit",
    nextSteps: [
      "Reduce individual day-tank capacity or provide 2-hr rated enclosure with dedicated spill containment and leak detection",
    ],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
// <xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
// <fields />
// <add><square page="0" rect="369.893,528.91,465.733,654.95" color="#E44234" flags="print" name="572e292d-6f9c-6cf6-2ef4-48052dd1a1ee" title="Guest" subject="Rectangle" date="D:20250224194058-08'00'" creationdate="D:20250224194052-08'00'" width="5" dashes=""/></add>
// <modify />
// <delete />
// </xfdf>`,
  },
];

export const project: Project = {
  id: "0GDKHg3LN",
  address: "1482 34th Ave, Santa Clara CA 94122",
  customerName: "Turner Construction Company",
  status: ProjectStatus.OnTrack,
  lastUpdate: new Date("2025-06-06"),
  ballInCourt: "Rescope",
  property: {
    geojson: {
      type: "MultiPolygon",
      coordinates: [
        [
          [
            [-122.492637782, 37.759432468],
            [-122.492836727, 37.759423695],
            [-122.492843349, 37.759518023],
            [-122.492644405, 37.759526796],
            [-122.492637782, 37.759432468],
          ],
        ],
      ],
    },
    parcel: "1820026",
    legalDescription: "Block 1820 Lot 026",
    streetAddress: "1482 34th Ave, Santa Clara CA 94122",
    jurisdiction: "City of Santa Clara",
    zoningDesignation: "IG — Industrial General (Data-Center Overlay)",
    lotSize: "400000", // ft² ≈9.2 acres
    buildingArea: "180000", // ft² (Phase 1)
    maxFAR: "1.0",
    yearBuilt: 2025,
    owner: "Altan A.",
    ownerContact: "627-726-1100",
    propertyManager: "Phil Gross",
    landValue: 52200000,
  },
  apn: "3417 / 17 (APN 224-12-034)",
  zoningDistrict: "Light-Industrial / Limited-Industrial (ML, IL, IP, I-1)",
  existingUse: "1-story warehouse & build 3-story",
  feature: {
    type: "Feature",
    properties: {
      project_id_drop: null,
      from_address_num: "1482",
      police_district: "TARAVAL",
      supdistpad: "04",
      date_map_alt: null,
      odd_even: "E",
      zoning_code: "IG",
      zoning_district: "INDUSTRIAL GENERAL",
      analysis_neighborhood: "Santa Clara North",
      centroid_latitude: "37.759475245367156",
      centroid_longitude: "-122.49274056576091",
      pw_recorded_map: "true",
      mapblklot: "1820026",
      date_map_add: "2025-02-01T00:00:00.000",
      data_loaded_at: "2025-06-06T10:05:05.276",
      to_address_num: "1482",
      street_name: "34TH",
      supdist: "SUPERVISORIAL DISTRICT 4",
      planning_district: "Industrial Core",
      project_id_alt: null,
      date_map_drop: null,
      supname: "Gordon Mar",
      street_type: "AVE",
      planning_district_number: "99",
      project_id_add: "RESCOPE_DC_BASEMAP",
      date_rec_drop: null,
      police_company: "I",
      numbertext: "FOUR",
      supervisor_district: "4",
      data_as_of: "2025-06-06T03:46:00.000",
      block_num: "1820",
      blklot: "1820026",
      in_asr_secured_roll: "true",
      date_rec_add: null,
      lot_num: "026",
      active: "true",
    },
    geometry: {
      type: "MultiPolygon",
      coordinates: [
        [
          [
            [-122.492637782, 37.759432468],
            [-122.492836727, 37.759423695],
            [-122.492843349, 37.759518023],
            [-122.492644405, 37.759526796],
            [-122.492637782, 37.759432468],
          ],
        ],
      ],
    },
  },
  activityLog: [
    {
      title: "30 % Design Submitted",
      message: "Structural & MEP packages uploaded to e-Plan.",
      author: "Rescope Bot",
      date: new Date("2025-05-10"),
    },
    {
      title: "Peer Review Complete",
      message: "Third-party peer review approved seismic design.",
      author: "Gensys Engineering",
      date: new Date("2025-05-28"),
    },
    {
      title: "Permit Intake",
      message: "Application accepted by City of Santa Clara Building Division.",
      author: "GSX Permitting",
      date: new Date("2025-06-01"),
    },
  ],
  nextSteps: [
    Step.AddressFeedback,
    Step.ComplianceMonitoring,
    Step.PermitIssuance,
  ],
  progress: {
    percentComplete: 18,
    phase: Phase.PreApplication,
    completionDate: new Date("2026-03-31"),
    daysElapsed: 35,
  },
  files: [
    {
      id: "DC-PF-1",
      name: "1482 34th Ave, Santa Clara CA 94122.pdf",
      url: "/11_Santa_Clara_Colo_Floor_Plan_14.pdf",
      status: "In-Review",
      regulations,
    },
  ],
  reviewAndSubmitDetails: {
    proposedWorkSummary:
      "Demolish 1-story warehouse & build 3-story, 120 000 GSF hyperscale data center (30 MW IT load)",
    documents: [
      {
        id: "doc1",
        title: "Site Survey (signed by licensed surveyor)",
        status: "Not Required", // Default status
      },
      {
        id: "doc2",
        title: "Plot Plan (scaled, dimensioned)",
        status: "Not Required",
      },
      {
        id: "doc3",
        title: "Floor Plans (all levels)",
        status: "Not Required",
      },
      {
        id: "doc13",
        title: "Pre-Application Meeting Documentation",
        status: "Not Required",
      },
    ],
    fees: [
      {
        id: "fee1",
        type: "DBI Building Permit Base Fee",
        amount: 1200.0,
        isApplicable: true,
      },
      {
        id: "fee2",
        type: "Planning Department Review Fee",
        amount: 350.0,
        isApplicable: true,
      },
      {
        id: "fee3",
        type: "30-Day Notification Mailing Fee",
        amount: 75.0,
        isApplicable: true,
      },
      {
        id: "fee4",
        type: "Pre-Application Meeting Fee (if any)",
        amount: 150.0,
        isApplicable: true,
      },
      {
        id: "fee5",
        type: "Variance / Conditional Use Fee",
        amount: 0.0,
        isApplicable: false,
      },
    ],
    billing: {
      cardholderName: "Digital Edge Properties Inc.",
      cardType: "VISA",
      last4Digits: "1234",
      billingAddressLines: [
        "100 Tech Parkway",
        "Santa Clara, CA 95054",
        "United States",
      ],
    },
    acknowledgments: [
      {
        id: "ack1",
        text: "I affirm that all information and documents I have provided are true and correct to the best of my knowledge.",
        isChecked: false,
      },
      {
        id: "ack2",
        text: "I understand that by clicking 'Submit,' my fee will be charged and my application will be sent to SF Planning for review. I acknowledge that no further changes can be made without contacting Rescope support.",
        isChecked: false,
      },
      {
        id: "ack3",
        text: "I have confirmed compliance with all applicable design guidelines (Residential or Neighborhood Commercial).",
        isChecked: false,
      },
      {
        id: "ack4",
        text: "I understand that Planning may request additional materials or revisions during their 30-day notification period, and that I am responsible for addressing them in a timely manner.",
        isChecked: false,
      },
    ],
  },
  projectTimeline: [
    {
      id: "timeline1",
      projectId: "0GDKHg3LN",
      name: "Rescope is reviewing your project",
      status: TimelineStatus.Pending,
      createdAt: new Date("2025-06-06"),
      updatedAt: new Date("2025-06-06"),
    },
  ],
};
