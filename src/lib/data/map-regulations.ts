export const REGULATION_CATEGORIES = {
  ZONING_RM1: {
    title: "RM-1 Zoning Laws",
    regulations: {
      "MAXIMUM DWELLING UNIT DENSITY":
        "Three dwelling units per lot or one dwelling unit per 800 sq.ft. of lot area",
      "OTHER PRINCIPAL USES":
        "Residential care facility for 6 or fewer; child care facility for 12 or fewer; open space for horticulture or passive recreation; public structure or use of non-industrial character; sale or lease sign. Group housing, boarding; group housing, religious orders.",
      "OTHER CONDITIONAL USES":
        "Medical institution; residential care facility for 7 or more; child care facility for 13 or more; elementary school; secondary school; religious institution; community facility; open recreation area; greenhouse or plant nursery; utility installation or public service facility; community garage; access driveway to C or M district; non-accessory parking for a specific use; Planned Unit Development; C- 2 use in structure on designated landmark site.",
      "MINIMUM LOT SIZE": "Width: 25 ft. Area: 2500 sq.ft.",
      "BASIC FLOOR AREA RATIO": "1.8 times lot area",
      "FRONT SET-BACK REQUIREMENTS":
        "Based upon average of adjacent buildings; up to 15 ft. or 15% of lot depth",
      "REAR YARD REQUIREMENTS":
        "45% of lot depth, except of reductions based upon average of adjacent buildings; if averaged, last 10 ft. is limited to height of 30 ft. and a minimum of 25% of lot depth, but no less than 15 feet.",
      "USABLE OPEN SPACE REQUIREMENTS FOR DWELLING UNITS":
        "100 sq.ft. per unit if all private; common space substituted must be 1/3 greater.",
      "OTHER SPECIAL REQUIREMENTS":
        "(§144) Limits on parking entrances and blank facades. (§145) Building stepping or multiple pedestrian entrances on wider lots",
    },
  },
  BUILDING_CODES: {
    title: "Building Codes",
    regulations: {
      "CEILING HEIGHT":
        "Minimum ceiling height for occupiable spaces, habitable spaces, and corridors: 7 feet 6 inches",
      "KITCHEN REQUIREMENTS":
        "Kitchens must have a clear passageway of at least 3 feet between counter fronts and appliances or walls",
      "MINIMUM ROOM SIZE":
        "Every dwelling unit must have at least one room with a minimum of 120 square feet of net floor area",
      "ELECTRICAL PERMITS":
        "Homeowners can obtain electrical work permits for single-family dwellings, but only if they perform the work themselves",
      "EMERGENCY WORK":
        "Emergency electrical work requires a permit obtained within one business day of starting the work",
      "LUMINAIRE REPLACEMENT":
        "Replacement of luminaires weighing 50 pounds or less doesn't require a permit if no wiring changes are involved",
    },
  },
  SEISMIC: {
    title: "Seismic Regulations",
    regulations: {
      "ACCELEROGRAPH REQUIREMENTS":
        "Buildings over six stories and 60,000 square feet or over 10 stories regardless of size must have at least three approved recording accelerographs with triaxial seismic sensors",
      "SOFT-STORY BUILDINGS":
        "Soft-story buildings with five or more residential units, built before 1978, must undergo seismic retrofitting",
      "SEISMIC LOAD REQUIREMENTS":
        "Public utility facilities and high occupancy school and college buildings must be designed for at least 25% more seismic load than common buildings",
      "CRITICAL FACILITIES":
        "Hospitals, emergency facilities, and other critical structures must be designed for at least 50% more seismic load than common buildings",
      "MASONRY RESTRICTIONS":
        "Ordinary plain masonry and plain concrete buildings without steel reinforcing are not permitted in moderate or higher seismic hazard regions",
    },
  },
  ENVIRONMENTAL: {
    title: "Environmental Regulations",
    regulations: {
      "GREEN BUILDING":
        "Green Building Ordinance mandates LEED certification for municipal buildings and sets standards for private developments",
      "BETTER ROOFS":
        "Better Roofs Ordinance requires 15% to 30% of roof space to have solar panels, contributing to renewable energy goals",
      "ENERGY PERFORMANCE":
        "Existing Commercial Buildings Energy Performance Ordinance promotes energy benchmarking and disclosures for large residential and non-residential buildings",
      "RENEWABLE ENERGY":
        "By 2024, commercial properties over 250,000 square feet must operate from renewable sources. By 2030, this extends to all non-residential properties over 50,000 square feet",
      "WATER CONSERVATION":
        "Mandates water-saving measures and fixtures in buildings",
    },
  },
} as const;
