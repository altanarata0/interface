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

const regulations: Regulation[] = [
  {
    id: "1",
    code: {
      jurisdiction: "San Francisco",
      code: "BIC Building Code 2022",
      section: "1208.4",
    },
    isCompliant: false,
    regulation: "An ADU must be a minimum of 220 sq ft.",
    status: "In-Review",
    severity: "Moderate",
    description:
      "The ADU's living area is approximately 205 sq ft, which does not meet the 220 sq ft minimum requirement. This shortfall may lead to occupancy issues and non-compliance with current building standards.",
    calculations: `16'0" x 14'0" - (2'0" x 9'4") = 205 sq ft < 220 sq ft required`,
    nextSteps: ["Increase the ADU's floor area to at least 220 sq ft"],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?><xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields /><add><polygon page="0" rect="357.963,372.03,613.143,666.96" color="#E44234" flags="print" name="38322b15-ea9c-747d-d5b1-305ea964b207" title="Guest" subject="Polygon" date="D:20250223232440-08'00'" width="4" creationdate="D:20250223232422-08'00'"><vertices>359.89204,373.9599999999999;612.14204,373.02999999999986;611.21204,496.7099999999999;578.63204,497.6399999999999;576.77204,663.1699999999998;358.96204,665.9599999999998;359.89204,373.9599999999999</vertices></polygon></add><modify /><delete /></xfdf>`,
  },
  {
    id: "2",
    code: {
      jurisdiction: "San Francisco",
      code: "BIC Building Code 2022",
      section: "1208.4",
    },
    isCompliant: false,
    regulation:
      "An ADU must have a living room with a minimum 220 sq ft of floor area (and an additional 100 sq ft for each occupant more than 2).",
    status: "In-Review",
    severity: "Minor",
    description:
      "The given ADU has a living room with only 85 sq ft of floor area, which is below the required minimum of 220 sq ft.",
    calculations: "85 sq ft < 220 sq ft required",
    nextSteps: [
      "Expand the living room to meet the minimum area requirement of 220 sq ft",
    ],

    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add><square page="0" rect="369.893,528.91,465.733,654.95" color="#E44234" flags="print" name="572e292d-6f9c-6cf6-2ef4-48052dd1a1ee" title="Guest" subject="Rectangle" date="D:20250224194058-08'00'" creationdate="D:20250224194052-08'00'" width="4" dashes=""/></add>
<modify />
<delete />
</xfdf>`,
  },
  {
    id: "3",
    code: {
      jurisdiction: "San Francisco",
      code: "BIC Building Code 2022",
      section: "1208.4",
    },
    isCompliant: false,
    regulation: "A studio unit ADU must have a closet.",
    status: "In-Review",
    severity: "Minor",
    description:
      "The given ADU does not have at least one designated closet space.",
    calculations: "",
    nextSteps: ["Add a closet"],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add />
<modify><polygon page="0" rect="354.963,369.61,616.143,670.54" color="#E44234" flags="print" name="2e069d7a-99be-8a69-8ba7-f085b6db0753" title="Guest" subject="Polygon" date="D:20250224200656-08'00'" width="4" creationdate="D:20250224200652-08'00'"><trn-custom-data bytes="{&quot;trn-behavior-type&quot;:&quot;normal&quot;}"/><vertices>359.89204,374.53999999999985;612.14204,373.6099999999999;611.21204,497.28999999999985;578.63204,498.2199999999999;576.77204,663.7499999999999;358.96204,666.5399999999998;359.89204,374.53999999999985</vertices></polygon></modify>
<delete />
</xfdf>`,
  },
  {
    id: "4",
    code: {
      jurisdiction: "San Francisco",
      code: "BIC Building Code 2022",
      section: "1208.4",
    },
    isCompliant: true,
    regulation:
      "A studio unit ADU must have a kitchen area with a sink, cooking appliance, fridge, and counter at least 30 inches wide.",
    status: "In-Review",
    severity: "NA",
    description:
      "The given ADU has a kitchen area with a sink, cooking appliance, fridge, and counter at least 30 inches wide.",
    calculations: "Counter width ≥ 30 inches",
    nextSteps: [],

    xfdfString: `
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add />
<modify><square page="0" rect="426.953,385.32,602.923,485.77" color="#E44234" flags="print" name="552de684-7f99-47f8-1127-a89830c22fc4" title="Guest" subject="Rectangle" date="D:20250224201020-08'00'" width="4" creationdate="D:20250224200948-08'00'" dashes=""/></modify>
<delete />
</xfdf>`,
  },
  {
    id: "5",
    code: {
      jurisdiction: "San Francisco",
      code: "BIC Building Code 2022",
      section: "1208.4",
    },
    isCompliant: true,
    regulation:
      "A studio unit ADU must have a separate bathroom with toilet and bathtub or shower.",
    status: "Approved",
    severity: "NA",
    description:
      "The given ADU has a separate bathroom with a toilet and either a bathtub or shower, meeting the regulatory requirements.",
    calculations: "Bathroom facilities present and functional",
    nextSteps: [],

    xfdfString: `
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add />
<modify><square page="0" rect="371.473,385.96,418.513,521.94" color="#00b43f" flags="print" name="b0b73394-4763-7fe7-c945-d108c1ff4ee4" title="Guest" subject="Rectangle" date="D:20250224201203-08'00'" width="4" creationdate="D:20250224201135-08'00'" dashes=""/></modify>
<delete />
</xfdf>`,
  },
  {
    id: "6",
    code: {
      jurisdiction: "California",
      code: "Building Code 2022",
      section: "P104.4.1",
    },
    isCompliant: true,
    regulation:
      "An ADU must have a window or other glazing that is at least 7.5 inches and at most 44 inchesfrom the finished floor.",
    status: "Approved",
    severity: "NA",
    description:
      "The given ADU has a window or other glazing that is at least 7.5 inches from the finished floor, meeting compliance requirements. The bottom of the clear opening of the egress window is not more than 44 inches above the floor.",
    calculations: "Window height ≥ 7.5 inches",
    nextSteps: [],

    xfdfString: `<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
  <fields />
  <add>
    <square page="0" rect="449.403,648.91,542.473,669.9" 
      color="#00b43f" flags="print" 
      name="139a20f3-c272-5cdd-465f-3748ee9b03da" 
      title="Guest" subject="Rectangle" 
      date="D:20250224203243-08'00'" 
      width="4" creationdate="D:20250224201434-08'00'" 
      dashes=""/>
      
    <square page="0" rect="944.503,98.95,1073.613,503.9" 
      color="#00b43f" flags="print" 
      name="2da755c8-126c-ee00-da86-a1c32021e4b5" 
      title="Guest" subject="Rectangle" 
      date="D:20250224203036-08'00'" 
      width="4" creationdate="D:20250224203033-08'00'" 
      dashes=""/>
      
    <square page="0" rect="480.423,364.94,522.463,390.94" 
      color="#00b43f" flags="print" 
      name="38aa9474-72b1-279b-c92d-b7b30c46b950" 
      title="Guest" subject="Rectangle" 
      date="D:20250224201430-08'00'" 
      width="4" creationdate="D:20250224201420-08'00'" 
      dashes=""/>
  </add>
  <delete />
</xfdf>
`,
  },
  {
    id: "7",
    code: {
      jurisdiction: "San Francisco",
      code: "BIC Building Code 2022",
      section: "1208.5",
    },
    isCompliant: false,
    regulation:
      "The ADU’s main entry door must have a minimum clear width of 32 inches.",
    status: "In-Review",
    severity: "Minor",
    description:
      "The current entry door to the studio measures only 30 inches in clear width, which is below the required 32 inches for safe egress and accessibility.",
    calculations: "30 in < 32 in required",
    nextSteps: [
      "Replace the entry door with one providing at least a 32-inch clear opening.",
    ],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add />
<modify><square page="0" rect="561.09,502.01,584.08,564.01" color="#E44234" flags="print" name="entry-door-violation" title="Guest" subject="Rectangle" date="D:20250225134017-08'00'" width="4" creationdate="D:20250301100000-08'00'"/></modify>
<delete />
</xfdf>`,
  },
  {
    id: "8",
    code: {
      jurisdiction: "California",
      code: "Building Code 2022",
      section: "R311.7.8",
    },
    isCompliant: false,
    regulation:
      "Any porch or raised floor surface more than 30 inches above grade must have a guard at least 36 inches in height.",
    status: "In-Review",
    severity: "Moderate",
    description:
      "The covered porch is approximately 32 inches above grade but does not have a guardrail. This poses a fall risk and violates guard requirements.",
    calculations: "Porch height = 32 in > 30 in threshold",
    nextSteps: [
      "Install a guard or railing at least 36 inches high around the porch perimeter to ensure safety.",
    ],
    xfdfString: `<?xml version="1.0" encoding="UTF-8"?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add><square page="0" rect="414.943,663.98,575.083,735.68" color="#E44234" flags="print" name="4f94749a-d72b-8618-cc16-53e4fa24e4ed" title="Guest" subject="Rectangle" date="D:20250225134244-08'00'" creationdate="D:20250225134241-08'00'" dashes=""/></add>
<modify />
<delete />
</xfdf>`,
  },
  {
    id: "9",
    code: {
      jurisdiction: "San Francisco",
      code: "BIC Building Code 2022",
      section: "1208.4",
    },
    isCompliant: false,
    regulation:
      "The bathroom must provide at least 24 inches of clear space in front of the toilet.",
    status: "In-Review",
    severity: "Minor",
    description:
      "Measurements show only 22 inches of clearance between the toilet front and the adjacent wall/fixture. This violates the minimum clearance requirement for comfortable and safe use.",
    calculations: "22 in < 24 in required",
    nextSteps: [
      "Relocate the toilet or adjust the wall/fixture layout to provide at least 24 inches of clear space.",
    ],
    xfdfString: `<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add />
<modify><square page="0" rect="370.483,383.67,418.523,520.67" color="#E44234" flags="print" name="feff38c5-530b-2aa4-03ce-8f5bd016a822" title="Guest" subject="Rectangle" date="D:20250225134421-08'00'" width="4" creationdate="D:20250225134406-08'00'" dashes=""/></modify>
<delete />
</xfdf>`,
  },
  {
    id: "10",
    code: {
      jurisdiction: "California",
      code: "Building Code 2022",
      section: "R303.3",
    },
    isCompliant: true,
    regulation:
      "A bathroom that does not have an operable window must be equipped with mechanical ventilation.",
    status: "Approved",
    severity: "NA",
    description:
      "The bathroom in the ADU includes an exhaust fan that meets mechanical ventilation requirements, ensuring adequate air exchange.",
    calculations: "",
    nextSteps: [],
    xfdfString: `<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add />
<modify><square page="0" rect="370.483,383.67,418.523,520.67" color="#56d412" flags="print" name="feff38c5-530b-2aa4-03ce-8f5bd016a822" title="Guest" subject="Rectangle" date="D:20250225134421-08'00'" width="4" creationdate="D:20250225134406-08'00'" dashes=""/></modify>
<delete />
</xfdf>`,
  },
  {
    id: "11",
    code: {
      jurisdiction: "San Francisco",
      code: "BIC Building Code 2022",
      section: "1208.5.1",
    },
    isCompliant: false,
    regulation:
      "Ceiling height in habitable spaces must be a minimum of 7 feet.",
    status: "In-Review",
    severity: "Moderate",
    description:
      "The ceiling height in the northwest corner of the ADU measures 6'8\", which is below the required minimum of 7'0\". This reduction in height affects approximately 25 sq ft of the living area.",
    calculations: "6'8\" < 7'0\" required",
    nextSteps: [
      "Raise the ceiling height in the affected area to at least 7'0\"",
      "Alternatively, redesign the space to exclude the non-compliant area from habitable use",
    ],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add><square page="0" rect="358.96,373.03,418.51,452.77" color="#E44234" flags="print" name="ceiling-height-violation" title="Guest" subject="Rectangle" date="D:20250225134623-08'00'" creationdate="D:20250225134620-08'00'" width="4" dashes=""/></add>
<modify />
<delete />
</xfdf>`,
  },
  {
    id: "12",
    code: {
      jurisdiction: "California",
      code: "Building Code 2022",
      section: "R308.4.2",
    },
    isCompliant: false,
    regulation: "Glazing within 24 inches of a door must be safety glazed.",
    status: "In-Review",
    severity: "Moderate",
    description:
      "The window adjacent to the entry door is within 18 inches of the door edge and does not use safety glazing as required. This poses a potential safety hazard in case of accidental impact.",
    calculations: 'Window distance from door = 18" < 24" threshold',
    nextSteps: [
      "Replace the existing glazing with tempered or laminated safety glass",
      "Provide documentation confirming the installation of code-compliant safety glazing",
    ],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add><square page="0" rect="522.46,502.01,545.47,564.01" color="#E44234" flags="print" name="glazing-violation" title="Guest" subject="Rectangle" date="D:20250225134732-08'00'" creationdate="D:20250225134729-08'00'" width="4" dashes=""/></add>
<modify />
<delete />
</xfdf>`,
  },
  {
    id: "13",
    code: {
      jurisdiction: "San Francisco",
      code: "BIC Building Code 2022",
      section: "1207.4",
    },
    isCompliant: true,
    regulation:
      "Walls between dwelling units must have an STC rating of at least 50.",
    status: "Approved",
    severity: "NA",
    description:
      "The wall assembly between the ADU and main residence has been verified to have an STC rating of 55, exceeding the minimum requirement of 50. This ensures adequate sound isolation between living spaces.",
    calculations: "STC 55 > STC 50 required",
    nextSteps: [],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add><square page="0" rect="359.89,373.03,365.89,665.96" color="#00b43f" flags="print" name="sound-transmission-compliant" title="Guest" subject="Rectangle" date="D:20250225134911-08'00'" creationdate="D:20250225134908-08'00'" width="4" dashes=""/></add>
<modify />
<delete />
</xfdf>`,
  },
  {
    id: "14",
    code: {
      jurisdiction: "California",
      code: "Building Code 2022",
      section: "R310.1",
    },
    isCompliant: false,
    regulation:
      "Habitable rooms must have emergency escape and rescue openings with a minimum net clear opening of 5.7 sq ft.",
    status: "In-Review",
    severity: "Critical",
    description:
      "The bedroom window provides only 4.9 sq ft of clear opening area, which is below the required 5.7 sq ft for emergency egress. This significantly compromises the safety of occupants in emergency situations.",
    calculations: "4.9 sq ft < 5.7 sq ft required",
    nextSteps: [
      "Replace the window with a larger model that provides at least 5.7 sq ft of clear opening",
      "Ensure the replacement window also meets minimum width and height requirements",
    ],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add><square page="0" rect="480.42,364.94,522.46,390.94" color="#E44234" flags="print" name="egress-window-violation" title="Guest" subject="Rectangle" date="D:20250225135039-08'00'" creationdate="D:20250225135036-08'00'" width="4" dashes=""/></add>
<modify />
<delete />
</xfdf>`,
  },
  {
    id: "15",
    code: {
      jurisdiction: "San Francisco",
      code: "BIC Building Code 2022",
      section: "1203.1",
    },
    isCompliant: true,
    regulation:
      "Ventilation in habitable spaces must be at least 4% of the floor area being ventilated.",
    status: "Approved",
    severity: "NA",
    description:
      "The operable windows in the ADU provide ventilation equivalent to 4.8% of the floor area, exceeding the minimum requirement of 4%. This ensures adequate natural air exchange for occupant health and comfort.",
    calculations:
      "Ventilation area = 9.8 sq ft; Floor area = 205 sq ft; 9.8/205 = 4.8% > 4% required",
    nextSteps: [],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add><polygon page="0" rect="480.42,364.94,584.08,659.01" color="#00b43f" flags="print" name="ventilation-compliant" title="Guest" subject="Polygon" date="D:20250225135203-08'00'" creationdate="D:20250225135159-08'00'" width="4"><vertices>480.42,364.94;522.46,364.94;522.46,390.94;480.42,390.94;480.42,364.94</vertices></polygon></add>
<modify />
<delete />
</xfdf>`,
  },
  {
    id: "16",
    code: {
      jurisdiction: "California",
      code: "Energy Code 2022",
      section: "150.0(o)",
    },
    isCompliant: false,
    regulation:
      "All dwelling units must have a whole-building mechanical ventilation system meeting ASHRAE 62.2 requirements.",
    status: "In-Review",
    severity: "Moderate",
    description:
      "The ADU lacks the required whole-building mechanical ventilation system. While there is mechanical ventilation in the bathroom, the unit does not have a system that provides the minimum required air exchange for the entire dwelling per ASHRAE 62.2.",
    calculations:
      "Required airflow based on floor area (205 sq ft) and number of bedrooms (0) = 30 CFM",
    nextSteps: [
      "Install a whole-building mechanical ventilation system that provides at least 30 CFM continuous airflow",
      "Acceptable options include an ERV/HRV, continuous bathroom exhaust, or supply ventilation",
    ],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add><polygon page="0" rect="359.89,373.03,612.14,665.96" color="#E44234" flags="print" name="mechanical-ventilation-violation" title="Guest" subject="Polygon" date="D:20250225135322-08'00'" creationdate="D:20250225135319-08'00'" width="4"><vertices>359.89,373.96;612.14,373.03;611.21,496.71;578.63,497.64;576.77,663.17;358.96,665.96;359.89,373.96</vertices></polygon></add>
<modify />
<delete />
</xfdf>`,
  },
  {
    id: "17",
    code: {
      jurisdiction: "San Francisco",
      code: "BIC Building Code 2022",
      section: "1010.1.1",
    },
    isCompliant: true,
    regulation:
      "The floor or landing at the exterior side of the main entry door must not be more than 1.5 inches lower than the threshold.",
    status: "Approved",
    severity: "NA",
    description:
      "The exterior landing at the main entry door is at the same level as the door threshold, meeting the maximum 1.5-inch difference requirement. This ensures safe entry and exit without tripping hazards.",
    calculations: 'Threshold difference = 0" < 1.5" maximum',
    nextSteps: [],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add><square page="0" rect="561.09,562.01,584.08,583.91" color="#00b43f" flags="print" name="threshold-compliant" title="Guest" subject="Rectangle" date="D:20250225135442-08'00'" creationdate="D:20250225135439-08'00'" width="4" dashes=""/></add>
<modify />
<delete />
</xfdf>`,
  },
  {
    id: "18",
    code: {
      jurisdiction: "California",
      code: "Building Code 2022",
      section: "R304.2",
    },
    isCompliant: false,
    regulation:
      "Kitchens must have a clear working space of at least 3 feet in front of counters and appliances.",
    status: "In-Review",
    severity: "Minor",
    description:
      "The clear space in front of the kitchen counter narrows to 32 inches at one point due to the placement of a built-in shelf. This restricts the working area and does not meet the minimum 3-foot clearance requirement.",
    calculations: 'Minimum clearance = 32" < 36" required',
    nextSteps: [
      "Modify or remove the built-in shelf to provide at least 36 inches of clear working space",
      "Alternatively, redesign the kitchen layout to ensure adequate clearances",
    ],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add><square page="0" rect="445.95,485.77,475.95,509.87" color="#E44234" flags="print" name="kitchen-clearance-violation" title="Guest" subject="Rectangle" date="D:20250225135604-08'00'" creationdate="D:20250225135601-08'00'" width="4" dashes=""/></add>
<modify />
<delete />
</xfdf>`,
  },
  {
    id: "19",
    code: {
      jurisdiction: "San Francisco",
      code: "Electrical Code 2022",
      section: "210.52(A)",
    },
    isCompliant: false,
    regulation:
      "Receptacle outlets in habitable rooms must be installed so that no point along the wall space is more than 6 feet from an outlet.",
    status: "In-Review",
    severity: "Minor",
    description:
      "The south wall of the living area has a 9-foot section without an electrical outlet, exceeding the maximum 6-foot distance requirement. This may lead to unsafe use of extension cords.",
    calculations: "Maximum distance to outlet = 9' > 6' allowed",
    nextSteps: [
      "Install at least one additional receptacle outlet on the south wall to ensure no point is more than 6 feet from an outlet",
    ],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add><square page="0" rect="414.94,665.96,557.08,669.9" color="#E44234" flags="print" name="outlet-spacing-violation" title="Guest" subject="Rectangle" date="D:20250225135722-08'00'" creationdate="D:20250225135719-08'00'" width="4" dashes=""/></add>
<modify />
<delete />
</xfdf>`,
  },
  {
    id: "20",
    code: {
      jurisdiction: "California",
      code: "Building Code 2022",
      section: "R303.1",
    },
    isCompliant: true,
    regulation:
      "Habitable rooms must have an aggregate glazing area of at least 8% of the floor area.",
    status: "Approved",
    severity: "NA",
    description:
      "The ADU has windows with a total glazing area of 18.2 sq ft, which is 8.9% of the 205 sq ft floor area. This exceeds the minimum 8% requirement, providing adequate natural light.",
    calculations:
      "Glazing area = 18.2 sq ft; Floor area = 205 sq ft; 18.2/205 = 8.9% > 8% required",
    nextSteps: [],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add><polygon page="0" rect="480.42,364.94,584.08,659.01" color="#00b43f" flags="print" name="natural-light-compliant" title="Guest" subject="Polygon" date="D:20250225135843-08'00'" creationdate="D:20250225135840-08'00'" width="4"><vertices>480.42,364.94;522.46,364.94;522.46,390.94;480.42,390.94;480.42,364.94</vertices></polygon></add>
<modify />
<delete />
</xfdf>`,
  },
  {
    id: "21",
    code: {
      jurisdiction: "San Francisco",
      code: "Plumbing Code 2022",
      section: "422.2",
    },
    isCompliant: false,
    regulation:
      "Shower compartments must have a minimum finished interior of 1,024 square inches and be capable of encompassing a 30-inch circle.",
    status: "In-Review",
    severity: "Minor",
    description:
      "The shower in the bathroom measures 30 inches by 30 inches (900 sq in), which is below the minimum required interior area of 1,024 sq in. This limits usability and accessibility of the shower space.",
    calculations: '30" × 30" = 900 sq in < 1,024 sq in required',
    nextSteps: [
      'Enlarge the shower compartment to at least 32" × 32" to meet the minimum area requirement',
      "Ensure the redesigned shower can encompass a 30-inch circle",
    ],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add><square page="0" rect="370.48,435.67,418.52,485.67" color="#E44234" flags="print" name="shower-size-violation" title="Guest" subject="Rectangle" date="D:20250225140009-08'00'" creationdate="D:20250225140006-08'00'" width="4" dashes=""/></add>
<modify />
<delete />
</xfdf>`,
  },
  {
    id: "22",
    code: {
      jurisdiction: "California",
      code: "Energy Code 2022",
      section: "150.0(k)",
    },
    isCompliant: true,
    regulation:
      "All permanently installed lighting in dwelling units must be high-efficacy.",
    status: "Approved",
    severity: "NA",
    description:
      "All light fixtures in the ADU are LED-based high-efficacy fixtures, meeting the energy efficiency requirements. This helps reduce energy consumption and operating costs.",
    calculations: "100% of installed lighting is high-efficacy (LED)",
    nextSteps: [],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add><polygon page="0" rect="359.89,373.03,612.14,665.96" color="#00b43f" flags="print" name="lighting-compliant" title="Guest" subject="Polygon" date="D:20250225140127-08'00'" creationdate="D:20250225140124-08'00'" width="4"><vertices>359.89,373.96;612.14,373.03;611.21,496.71;578.63,497.64;576.77,663.17;358.96,665.96;359.89,373.96</vertices></polygon></add>
<modify />
<delete />
</xfdf>`,
  },
  {
    id: "23",
    code: {
      jurisdiction: "San Francisco",
      code: "Fire Code 2022",
      section: "907.2.11",
    },
    isCompliant: false,
    regulation:
      "Smoke alarms must be installed in each sleeping room, outside each sleeping area, and on each level of the dwelling unit.",
    status: "In-Review",
    severity: "Critical",
    description:
      "The ADU lacks a required smoke alarm. As a studio unit, it requires at least one smoke alarm in the main living/sleeping area, but none has been installed.",
    calculations: "0 smoke alarms < 1 required",
    nextSteps: [
      "Install at least one smoke alarm in the main living/sleeping area",
      "Ensure the alarm is interconnected with any other alarms in the building if feasible",
    ],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add><square page="0" rect="440.51,564.95,500.51,600.95" color="#E44234" flags="print" name="smoke-alarm-violation" title="Guest" subject="Rectangle" date="D:20250225140256-08'00'" creationdate="D:20250225140253-08'00'" width="4" dashes=""/></add>
<modify />
<delete />
</xfdf>`,
  },
  {
    id: "24",
    code: {
      jurisdiction: "California",
      code: "Building Code 2022",
      section: "R308.4.5",
    },
    isCompliant: true,
    regulation:
      "Glazing in walls, enclosures, or fences containing hot tubs, spas, or pools where the bottom edge of the glazing is less than 60 inches above the walking surface must be safety glazed.",
    status: "Approved",
    severity: "NA",
    description:
      "The ADU does not contain any hot tubs, spas, or pools, so this requirement is not applicable. The regulation has been reviewed and determined to be not relevant to this project.",
    calculations: "N/A",
    nextSteps: [],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add />
<modify />
<delete />
</xfdf>`,
  },
  {
    id: "25",
    code: {
      jurisdiction: "San Francisco",
      code: "BIC Building Code 2022",
      section: "1010.1.9",
    },
    isCompliant: false,
    regulation:
      "Egress doors must be readily openable from the inside without the use of a key or special knowledge or effort.",
    status: "In-Review",
    severity: "Critical",
    description:
      "The main entry door has a double-cylinder deadbolt that requires a key to unlock from both sides. This violates egress requirements and creates a serious safety hazard in emergency situations.",
    calculations: "N/A",
    nextSteps: [
      "Replace the double-cylinder deadbolt with a single-cylinder model that can be unlocked from the inside without a key",
      "Verify proper operation of the replacement hardware",
    ],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add><square page="0" rect="561.09,520.01,575.09,545.01" color="#E44234" flags="print" name="deadbolt-violation" title="Guest" subject="Rectangle" date="D:20250225140434-08'00'" creationdate="D:20250225140430-08'00'" width="4" dashes=""/></add>
<modify />
<delete />
</xfdf>`,
  },
  {
    id: "26",
    code: {
      jurisdiction: "California",
      code: "Building Code 2022",
      section: "R802.10.1",
    },
    isCompliant: true,
    regulation:
      "Roof framing must be designed to support all applied loads, including dead, live, and snow loads as applicable.",
    status: "Approved",
    severity: "NA",
    description:
      "The structural calculations and plans for the ADU roof framing demonstrate compliance with all applicable load requirements. The design accommodates the anticipated dead, live, and environmental loads for the region.",
    calculations:
      "Design capacity meets or exceeds required loads as verified by structural engineer",
    nextSteps: [],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add><polygon page="0" rect="359.89,373.03,612.14,390.94" color="#00b43f" flags="print" name="roof-load-compliant" title="Guest" subject="Polygon" date="D:20250225140552-08'00'" creationdate="D:20250225140548-08'00'" width="4"><vertices>359.89,373.96;612.14,373.03;611.21,390.94;359.89,390.94;359.89,373.96</vertices></polygon></add>
<modify />
<delete />
</xfdf>`,
  },
  {
    id: "27",
    code: {
      jurisdiction: "San Francisco",
      code: "Electrical Code 2022",
      section: "210.8(A)",
    },
    isCompliant: false,
    regulation:
      "All 125-volt, 15- and 20-ampere receptacles in bathrooms, kitchens, and outdoor areas must have ground-fault circuit-interrupter (GFCI) protection.",
    status: "In-Review",
    severity: "Moderate",
    description:
      "The receptacle near the kitchen sink lacks the required GFCI protection, posing an electrical shock hazard, especially given its proximity to water sources.",
    calculations: "N/A",
    nextSteps: [
      "Replace the standard receptacle with a GFCI-protected receptacle",
      "Alternatively, install a GFCI circuit breaker for the entire circuit",
    ],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add><square page="0" rect="602.92,425.32,610.92,435.32" color="#E44234" flags="print" name="gfci-violation" title="Guest" subject="Rectangle" date="D:20250225140711-08'00'" creationdate="D:20250225140708-08'00'" width="4" dashes=""/></add>
<modify />
<delete />
</xfdf>`,
  },
  {
    id: "28",
    code: {
      jurisdiction: "California",
      code: "Building Code 2022",
      section: "R302.1",
    },
    isCompliant: true,
    regulation:
      "Exterior walls with a fire separation distance less than 5 feet must have at least a 1-hour fire-resistance rating.",
    status: "Approved",
    severity: "NA",
    description:
      "The ADU's exterior walls are located more than 5 feet from the property line, exceeding the minimum fire separation distance. Therefore, a fire-resistance rating is not required for these walls.",
    calculations: "Minimum fire separation distance = 8'6\" > 5' threshold",
    nextSteps: [],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add><polygon page="0" rect="359.89,373.03,612.14,665.96" color="#00b43f" flags="print" name="fire-separation-compliant" title="Guest" subject="Polygon" date="D:20250225140829-08'00'" creationdate="D:20250225140826-08'00'" width="4"><vertices>359.89,373.96;612.14,373.03;611.21,496.71;578.63,497.64;576.77,663.17;358.96,665.96;359.89,373.96</vertices></polygon></add>
<modify />
<delete />
</xfdf>`,
  },
  {
    id: "29",
    code: {
      jurisdiction: "San Francisco",
      code: "Plumbing Code 2022",
      section: "408.3",
    },
    isCompliant: false,
    regulation:
      "Shower compartments must have a minimum finished interior area of 1,024 square inches and be capable of encompassing a 30-inch circle.",
    status: "In-Review",
    severity: "Minor",
    description:
      "The shower compartment in the bathroom has dimensions of 28 inches by 32 inches (896 sq in), which is below the minimum required interior area of 1,024 sq in. This limits usability and doesn't meet code requirements.",
    calculations: '28" × 32" = 896 sq in < 1,024 sq in required',
    nextSteps: [
      'Enlarge the shower compartment to at least 32" × 32" or equivalent area',
      "Ensure the redesigned shower can encompass a 30-inch circle",
    ],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add><square page="0" rect="370.48,435.67,418.52,485.67" color="#E44234" flags="print" name="shower-size-violation" title="Guest" subject="Rectangle" date="D:20250225140947-08'00'" creationdate="D:20250225140943-08'00'" width="4" dashes=""/></add>
<modify />
<delete />
</xfdf>`,
  },
  {
    id: "30",
    code: {
      jurisdiction: "California",
      code: "Fire Code 2022",
      section: "915.1",
    },
    isCompliant: false,
    regulation:
      "Carbon monoxide alarms must be installed outside of each separate sleeping area in the immediate vicinity of bedrooms in dwelling units with fuel-burning appliances or attached garages.",
    status: "In-Review",
    severity: "Critical",
    description:
      "The ADU has a gas water heater but lacks the required carbon monoxide alarm. This creates a significant safety hazard as carbon monoxide is a colorless, odorless gas that can be lethal.",
    calculations: "0 carbon monoxide alarms < 1 required",
    nextSteps: [
      "Install at least one carbon monoxide alarm outside the sleeping area",
      "Consider a combination smoke/carbon monoxide alarm to meet both requirements",
    ],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add><square page="0" rect="440.51,564.95,500.51,600.95" color="#E44234" flags="print" name="co-alarm-violation" title="Guest" subject="Rectangle" date="D:20250225141106-08'00'" creationdate="D:20250225141102-08'00'" width="4" dashes=""/></add>
<modify />
<delete />
</xfdf>`,
  },
  {
    id: "31",
    code: {
      jurisdiction: "San Francisco",
      code: "Accessibility Code 2022",
      section: "1150A.1",
    },
    isCompliant: true,
    regulation:
      "In buildings with three or fewer dwelling units, at least one bathroom must have reinforced walls to allow for future installation of grab bars.",
    status: "Approved",
    severity: "NA",
    description:
      "The bathroom in the ADU has been constructed with properly reinforced walls around the toilet, shower, and tub areas to accommodate potential future installation of grab bars. This meets accessibility provisions for aging in place.",
    calculations: "Wall reinforcement present in required locations",
    nextSteps: [],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add><square page="0" rect="370.48,383.67,418.52,520.67" color="#00b43f" flags="print" name="wall-reinforcement-compliant" title="Guest" subject="Rectangle" date="D:20250225141225-08'00'" creationdate="D:20250225141222-08'00'" width="4" dashes=""/></add>
<modify />
<delete />
</xfdf>`,
  },
  {
    id: "32",
    code: {
      jurisdiction: "California",
      code: "Energy Code 2022",
      section: "150.0(e)",
    },
    isCompliant: false,
    regulation:
      "All joints, seams, and penetrations of the building envelope must be sealed to limit air leakage.",
    status: "In-Review",
    severity: "Minor",
    description:
      "Inspection revealed unsealed penetrations around plumbing and electrical entries through the exterior walls. These gaps allow uncontrolled air leakage that reduces energy efficiency and may lead to moisture problems.",
    calculations: "Multiple unsealed penetrations observed",
    nextSteps: [
      "Seal all penetrations through exterior walls with appropriate air sealing materials",
      "Verify proper sealing with a follow-up inspection",
    ],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add><polygon page="0" rect="359.89,373.03,612.14,665.96" color="#E44234" flags="print" name="air-sealing-violation" title="Guest" subject="Polygon" date="D:20250225141341-08'00'" creationdate="D:20250225141338-08'00'" width="4"><vertices>359.89,373.96;612.14,373.03;611.21,496.71;578.63,497.64;576.77,663.17;358.96,665.96;359.89,373.96</vertices></polygon></add>
<modify />
<delete />
</xfdf>`,
  },
  {
    id: "33",
    code: {
      jurisdiction: "San Francisco",
      code: "BIC Building Code 2022",
      section: "1013.2",
    },
    isCompliant: false,
    regulation:
      "Guards must be provided for open-sided walking surfaces that are more than 30 inches above the floor or ground below.",
    status: "In-Review",
    severity: "Critical",
    description:
      "The east side of the entry porch lacks a guard rail despite being 32 inches above grade. This poses a significant fall hazard and violates safety requirements for elevated surfaces.",
    calculations: 'Height above grade = 32" > 30" threshold',
    nextSteps: [
      "Install code-compliant guardrails along the open sides of the porch",
      "Guard rails must be at least 42 inches high with no openings large enough to pass a 4-inch sphere",
    ],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add><square page="0" rect="584.08,562.01,602.08,583.91" color="#E44234" flags="print" name="missing-guard-violation" title="Guest" subject="Rectangle" date="D:20250225141456-08'00'" creationdate="D:20250225141453-08'00'" width="4" dashes=""/></add>
<modify />
<delete />
</xfdf>`,
  },
  {
    id: "34",
    code: {
      jurisdiction: "California",
      code: "Building Code 2022",
      section: "R309.5",
    },
    isCompliant: true,
    regulation:
      "Walls and ceilings between attached garages and dwelling units must have a fire separation with a minimum 1/2-inch gypsum board on the garage side.",
    status: "Approved",
    severity: "NA",
    description:
      "The ADU is not attached to a garage, so this requirement is not applicable. The regulation has been reviewed and determined to be not relevant to this project.",
    calculations: "N/A",
    nextSteps: [],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add />
<modify />
<delete />
</xfdf>`,
  },
  {
    id: "35",
    code: {
      jurisdiction: "San Francisco",
      code: "BIC Building Code 2022",
      section: "1011.5.2",
    },
    isCompliant: false,
    regulation:
      "The minimum tread depth for stairs serving dwelling units shall be 11 inches.",
    status: "In-Review",
    severity: "Moderate",
    description:
      "The stairs from the porch to the grade level have treads measuring only 9.5 inches in depth. This is below the required 11-inch minimum tread depth, creating a potential trip and fall hazard.",
    calculations: 'Tread depth = 9.5" < 11" required',
    nextSteps: [
      "Reconstruct the stairs to provide treads with a minimum depth of 11 inches",
      "Ensure the entire stairway meets all applicable code requirements",
    ],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add><square page="0" rect="561.09,583.91,584.08,665.96" color="#E44234" flags="print" name="stair-tread-violation" title="Guest" subject="Rectangle" date="D:20250225141615-08'00'" creationdate="D:20250225141612-08'00'" width="4" dashes=""/></add>
<modify />
<delete />
</xfdf>`,
  },
  {
    id: "36",
    code: {
      jurisdiction: "California",
      code: "Residential Code 2022",
      section: "R314.6",
    },
    isCompliant: false,
    regulation:
      "Where more than one smoke alarm is required, the smoke alarms shall be interconnected in such a manner that the activation of one alarm will activate all of the alarms.",
    status: "In-Review",
    severity: "Moderate",
    description:
      "The required smoke alarm in the ADU is not interconnected with the alarms in the main residence. This reduces the effectiveness of the alarm system in notifying all occupants of a fire emergency.",
    calculations: "N/A",
    nextSteps: [
      "Install interconnected smoke alarms, either hardwired with battery backup or using wireless interconnection technology",
      "Verify proper function of the interconnected system",
    ],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add><square page="0" rect="440.51,564.95,500.51,600.95" color="#E44234" flags="print" name="alarm-interconnection-violation" title="Guest" subject="Rectangle" date="D:20250225141734-08'00'" creationdate="D:20250225141731-08'00'" width="4" dashes=""/></add>
<modify />
<delete />
</xfdf>`,
  },
  {
    id: "37",
    code: {
      jurisdiction: "San Francisco",
      code: "BIC Building Code 2022",
      section: "1204.1",
    },
    isCompliant: true,
    regulation:
      "Interior spaces intended for human occupancy shall be provided with active or passive space-heating systems capable of maintaining a minimum room temperature of 68°F at a point 3 feet above the floor.",
    status: "Approved",
    severity: "NA",
    description:
      "The ADU is equipped with a properly sized mini-split heat pump system capable of maintaining the required minimum temperature. The heating system has adequate capacity for the space.",
    calculations:
      "Heat load calculation = 3.2 kW; Heat pump capacity = 4.0 kW > 3.2 kW required",
    nextSteps: [],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add><square page="0" rect="500.51,400.94,540.51,430.94" color="#00b43f" flags="print" name="heating-system-compliant" title="Guest" subject="Rectangle" date="D:20250225141849-08'00'" creationdate="D:20250225141846-08'00'" width="4" dashes=""/></add>
<modify />
<delete />
</xfdf>`,
  },
  {
    id: "38",
    code: {
      jurisdiction: "California",
      code: "Residential Code 2022",
      section: "R303.9",
    },
    isCompliant: true,
    regulation:
      "Required heating facilities shall be capable of maintaining a minimum room temperature of 68°F at a point 3 feet above the floor and 2 feet from exterior walls in all habitable rooms.",
    status: "Approved",
    severity: "NA",
    description:
      "The mini-split heat pump system installed in the ADU has been properly sized and located to provide adequate heating throughout the space, meeting the minimum temperature requirements specified in the code.",
    calculations:
      "System capacity verified by HVAC contractor as adequate for the space",
    nextSteps: [],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add><square page="0" rect="500.51,400.94,540.51,430.94" color="#00b43f" flags="print" name="heating-capacity-compliant" title="Guest" subject="Rectangle" date="D:20250225142007-08'00'" creationdate="D:20250225142004-08'00'" width="4" dashes=""/></add>
<modify />
<delete />
</xfdf>`,
  },
  {
    id: "39",
    code: {
      jurisdiction: "San Francisco",
      code: "Electrical Code 2022",
      section: "210.52(D)",
    },
    isCompliant: false,
    regulation:
      "At least one receptacle outlet must be installed within 36 inches of the outside edge of each bathroom sink.",
    status: "In-Review",
    severity: "Minor",
    description:
      "The nearest receptacle outlet to the bathroom sink is located 42 inches from the edge of the sink, exceeding the maximum distance of 36 inches required by code.",
    calculations: 'Distance to outlet = 42" > 36" maximum',
    nextSteps: [
      "Install a GFCI-protected receptacle outlet within 36 inches of the outside edge of the bathroom sink",
      "Ensure the new outlet meets all applicable electrical code requirements",
    ],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add><square page="0" rect="386.48,485.67,402.52,510.67" color="#E44234" flags="print" name="bathroom-outlet-violation" title="Guest" subject="Rectangle" date="D:20250225142125-08'00'" creationdate="D:20250225142122-08'00'" width="4" dashes=""/></add>
<modify />
<delete />
</xfdf>`,
  },
  {
    id: "40",
    code: {
      jurisdiction: "California",
      code: "Building Code 2022",
      section: "R703.4",
    },
    isCompliant: true,
    regulation:
      "The exterior wall envelope shall be designed and constructed to prevent the accumulation of water within the wall assembly by providing a water-resistant barrier behind the exterior veneer.",
    status: "Approved",
    severity: "NA",
    description:
      "The ADU's exterior walls have been properly constructed with a continuous weather-resistant barrier (house wrap) installed behind the siding. Flashing is correctly installed at all penetrations and transitions.",
    calculations: "N/A",
    nextSteps: [],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add><polygon page="0" rect="359.89,373.03,612.14,665.96" color="#00b43f" flags="print" name="weather-barrier-compliant" title="Guest" subject="Polygon" date="D:20250225142243-08'00'" creationdate="D:20250225142240-08'00'" width="4"><vertices>359.89,373.96;612.14,373.03;611.21,496.71;578.63,497.64;576.77,663.17;358.96,665.96;359.89,373.96</vertices></polygon></add>
<modify />
<delete />
</xfdf>`,
  },
  {
    id: "41",
    code: {
      jurisdiction: "San Francisco",
      code: "Plumbing Code 2022",
      section: "417.3",
    },
    isCompliant: true,
    regulation:
      "Showers and bathtubs must be provided with individual control valves of the pressure balance or thermostatic mixing valve type.",
    status: "Approved",
    severity: "NA",
    description:
      "The shower in the ADU bathroom is equipped with a pressure-balancing valve that prevents scalding when pressure changes occur in the water supply system.",
    calculations: "N/A",
    nextSteps: [],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add><square page="0" rect="370.48,435.67,383.52,450.67" color="#00b43f" flags="print" name="shower-valve-compliant" title="Guest" subject="Rectangle" date="D:20250225142351-08'00'" creationdate="D:20250225142348-08'00'" width="4" dashes=""/></add>
<modify />
<delete />
</xfdf>`,
  },
  {
    id: "42",
    code: {
      jurisdiction: "California",
      code: "Electrical Code 2022",
      section: "210.70(A)",
    },
    isCompliant: false,
    regulation:
      "At least one wall switch-controlled lighting outlet must be installed in every habitable room, bathroom, hallway, stairway, and outdoor entrance.",
    status: "In-Review",
    severity: "Minor",
    description:
      "The outdoor entrance to the ADU lacks a switch-controlled lighting outlet. While there is indoor lighting near the door, the absence of exterior lighting creates a safety concern for nighttime entry.",
    calculations: "N/A",
    nextSteps: [
      "Install a wall switch-controlled lighting fixture at the outdoor entrance",
      "Ensure the switch is accessible from the interior of the ADU",
    ],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add><square page="0" rect="584.08,520.01,602.08,545.01" color="#E44234" flags="print" name="exterior-lighting-violation" title="Guest" subject="Rectangle" date="D:20250225142505-08'00'" creationdate="D:20250225142502-08'00'" width="4" dashes=""/></add>
<modify />
<delete />
</xfdf>`,
  },
  {
    id: "43",
    code: {
      jurisdiction: "San Francisco",
      code: "Accessibility Code 2022",
      section: "1132A.3",
    },
    isCompliant: false,
    regulation:
      "The primary entry door shall have a minimum net clear opening width of 32 inches.",
    status: "In-Review",
    severity: "Moderate",
    description:
      "The ADU entry door provides only 29.5 inches of clear opening width when open at 90 degrees, which is below the minimum required clear width of 32 inches for accessible entry.",
    calculations: 'Clear width = 29.5" < 32" required',
    nextSteps: [
      "Replace the entry door with a wider model that provides at least 32 inches of clear opening width",
      "Verify that the door operation and hardware also meet accessibility requirements",
    ],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add><square page="0" rect="561.09,502.01,584.08,564.01" color="#E44234" flags="print" name="door-width-violation" title="Guest" subject="Rectangle" date="D:20250225142622-08'00'" creationdate="D:20250225142619-08'00'" width="4" dashes=""/></add>
<modify />
<delete />
</xfdf>`,
  },
  {
    id: "44",
    code: {
      jurisdiction: "California",
      code: "Building Code 2022",
      section: "R301.2.2",
    },
    isCompliant: true,
    regulation:
      "Buildings in Seismic Design Categories D0, D1, and D2 shall comply with the seismic provisions for these categories.",
    status: "Approved",
    severity: "NA",
    description:
      "The ADU has been designed and constructed in accordance with the seismic provisions required for its Seismic Design Category. Structural elements, connections, and bracing meet the applicable requirements.",
    calculations: "Seismic design calculations verified by structural engineer",
    nextSteps: [],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add><polygon page="0" rect="359.89,373.03,612.14,665.96" color="#00b43f" flags="print" name="seismic-design-compliant" title="Guest" subject="Polygon" date="D:20250225142739-08'00'" creationdate="D:20250225142736-08'00'" width="4"><vertices>359.89,373.96;612.14,373.03;611.21,496.71;578.63,497.64;576.77,663.17;358.96,665.96;359.89,373.96</vertices></polygon></add>
<modify />
<delete />
</xfdf>`,
  },
  {
    id: "45",
    code: {
      jurisdiction: "San Francisco",
      code: "Plumbing Code 2022",
      section: "504.6",
    },
    isCompliant: false,
    regulation:
      "Water heater relief valves shall discharge to an approved location, such as an indirect waste receptor or exterior location.",
    status: "In-Review",
    severity: "Moderate",
    description:
      "The temperature and pressure relief (T&P) valve for the water heater discharges directly onto the interior floor rather than to an approved location. This could cause water damage and poses a safety hazard in case of valve activation.",
    calculations: "N/A",
    nextSteps: [
      "Install proper drainage for the T&P valve that discharges to an approved location",
      "Ensure the discharge pipe is the full size of the valve outlet and is made of an approved material",
    ],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add><square page="0" rect="418.52,455.67,435.52,485.67" color="#E44234" flags="print" name="tp-valve-violation" title="Guest" subject="Rectangle" date="D:20250225142857-08'00'" creationdate="D:20250225142854-08'00'" width="4" dashes=""/></add>
<modify />
<delete />
</xfdf>`,
  },
  {
    id: "46",
    code: {
      jurisdiction: "California",
      code: "Energy Code 2022",
      section: "150.0(n)",
    },
    isCompliant: true,
    regulation:
      "Space conditioning systems must have automatic thermostat setback capabilities.",
    status: "Approved",
    severity: "NA",
    description:
      "The mini-split heat pump system in the ADU is equipped with a programmable thermostat that allows for automatic setback during unoccupied periods, meeting the energy efficiency requirements of the code.",
    calculations: "Verified programmable thermostat capabilities",
    nextSteps: [],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add><square page="0" rect="520.51,510.94,550.51,530.94" color="#00b43f" flags="print" name="thermostat-compliant" title="Guest" subject="Rectangle" date="D:20250225143013-08'00'" creationdate="D:20250225143010-08'00'" width="4" dashes=""/></add>
<modify />
<delete />
</xfdf>`,
  },
  {
    id: "47",
    code: {
      jurisdiction: "San Francisco",
      code: "BIC Building Code 2022",
      section: "1006.2",
    },
    isCompliant: true,
    regulation:
      "The means of egress shall be illuminated with at least 1 footcandle at the walking surface level when the means of egress is occupied.",
    status: "Approved",
    severity: "NA",
    description:
      "The path of egress from the ADU is adequately illuminated with ceiling-mounted light fixtures that provide the required minimum illumination levels at the floor surface.",
    calculations:
      "Measured illumination levels > 1 footcandle throughout the egress path",
    nextSteps: [],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add><square page="0" rect="500.51,496.71,584.08,564.01" color="#00b43f" flags="print" name="egress-lighting-compliant" title="Guest" subject="Rectangle" date="D:20250225143129-08'00'" creationdate="D:20250225143126-08'00'" width="4" dashes=""/></add>
<modify />
<delete />
</xfdf>`,
  },
  {
    id: "48",
    code: {
      jurisdiction: "California",
      code: "Plumbing Code 2022",
      section: "607.2",
    },
    isCompliant: false,
    regulation:
      "Hot water delivery systems serving public lavatory faucets shall deliver hot water within 0.5 gallons of water.",
    status: "In-Review",
    severity: "Minor",
    description:
      "The hot water delivery system serving the bathroom sink requires approximately 0.7 gallons of water before hot water reaches the fixture. This exceeds the maximum allowed volume and wastes water while waiting for hot water.",
    calculations: "0.7 gallons > 0.5 gallons maximum",
    nextSteps: [
      "Install an on-demand recirculation pump or point-of-use water heater to reduce water waste",
      "Alternatively, insulate the hot water piping to reduce heat loss and improve delivery time",
    ],
    xfdfString: `<?xml version="1.0" encoding="UTF-8" ?>
<xfdf xmlns="http://ns.adobe.com/xfdf/" xml:space="preserve">
<fields />
<add><square page="0" rect="386.48,485.67,402.52,510.67" color="#E44234" flags="print" name="hot-water-delivery-violation" title="Guest" subject="Rectangle" date="D:20250225143247-08'00'" creationdate="D:20250225143244-08'00'" width="4" dashes=""/></add>
<modify />
<delete />
</xfdf>`,
  },
];

export const project: Project = {
  id: "L2RSPEHIL",
  address: "14500 Innovation Way, Rancho Cucamonga CA 91730",
  status: ProjectStatus.OnTrack,
  lastUpdate: new Date("2025-05-18"),
  ballInCourt: "Applicant",
  property: {
    geojson: {
      type: "MultiPolygon",
      coordinates: [
        [
          [
            [-117.5645, 34.102],
            [-117.5643, 34.102],
            [-117.5643, 34.1022],
            [-117.5645, 34.1022],
            [-117.5645, 34.102],
          ],
        ],
      ],
    },
    parcel: "0207-041-18-0000",
    legalDescription: "Tract 16028 Lot 18",
    streetAddress: "14500 Innovation Way, Rancho Cucamonga CA 91730",
    jurisdiction: "San Bernardino County, California",
    zoningDesignation: "IP — Industrial Park",
    lotSize: "95832",
    buildingArea: "55000",
    maxFAR: "0.6",
    yearBuilt: 2004,
    owner: "Inland Research Lab LLC",
    ownerContact: "909-555-0123",
    propertyManager: "TriCity Property Mgmt",
    landValue: 25000000,
  },
  feature: {
    type: "Feature",
    properties: {
      zoning_code: "IP",
      centroid_latitude: 34.1021,
      centroid_longitude: -117.5644,
      zoning_district: "Industrial Park",
      planning_district: "Rancho Cucamonga",
      county: "San Bernardino",
      project_id_add: "ORIG_BASEMAP",
      active: "true",
    },
    geometry: {
      type: "MultiPolygon",
      coordinates: [
        [
          [
            [-117.5645, 34.102],
            [-117.5643, 34.102],
            [-117.5643, 34.1022],
            [-117.5645, 34.1022],
            [-117.5645, 34.102],
          ],
        ],
      ],
    },
  },
  activityLog: [
    {
      title: "Project created",
      message: "Applicant created a new project.",
      author: "Jackson Lee",
      date: new Date("2025-04-01"),
    },
    {
      title: "Application submitted",
      message: "Initial submission completed by the applicant.",
      author: "SBX Permitting Team",
      date: new Date("2025-04-01"),
    },
    {
      title: "Completeness review passed",
      message: "Intake package accepted; routing to plan review.",
      author: "San Bernardino Co. Land Use Services",
      date: new Date("2025-04-12"),
    },
    {
      title: "Plan-check comments issued (Cycle 1)",
      message:
        "14 items identified across structural, egress, and haz-mat storage.",
      author: "County Plan Review – Building Safety",
      date: new Date("2025-04-25"),
    },
    {
      title: "Response to corrections submitted",
      message: "Updated plans and narrative uploaded for re-review.",
      author: "SBX Design Team",
      date: new Date("2025-05-12"),
    },
    {
      title: "Fire Department accepted fire safety plan",
      message: "Sprinkler and alarm layouts approved with no comments.",
      author: "San Bernardino Co. Building Safety", // Reused avatar
      date: new Date("2025-05-15"),
    },
    {
      title: "Zoning Department requested final clarifications",
      message: "Clarification needed on parking lot coverage and setbacks.",
      author: "San Bernardino Co. Land Use Services",
      date: new Date("2025-05-18"),
    },
    {
      title: "Revised documents uploaded for final review",
      message: "All departments notified. Awaiting final approval.",
      author: "SBX Design Team",
      date: new Date("2025-05-24"),
    },
    {
      title: "All disciplines approved project",
      message: "Permit documents cleared by fire, building, and zoning.",
      author: "SBX Permitting Team",
      date: new Date("2025-06-01"),
    },
    {
      title: "Permit pending issuance",
      message: "Project ready for final issuance upon final changes.",
      author: "San Bernardino Co. Building Safety",
      date: new Date("2025-06-06"),
    },
  ],
  nextSteps: [Step.ApplicationReview],
  progress: {
    percentComplete: 100,
    phase: Phase.Issued,
    completionDate: new Date("2025-06-06"),
    daysElapsed: 94,
  },
  files: [
    {
      id: "1",
      name: "11_Mesa_Colo_Floor_Plan.pdf",
      url: "/center_plan.pdf",
      status: "In-Review",
      regulations,
    },
  ],
  customerName: "Sarah Parker",
  projectTimeline: [
    {
      id: "timeline1",
      projectId: "DHgZCREVu",
      name: "Cucamonga has issued a permit",
      status: TimelineStatus.Completed,
      createdAt: new Date("2025-06-06"),
      updatedAt: new Date("2025-06-06"),
    },
  ],
};
