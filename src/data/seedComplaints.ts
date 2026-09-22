import { Complaint, User, NotificationItem } from '../types/civic';
import { VERIFIED_GOVERNMENT_BRANCHES } from '../utils/civicBranches';

export const INITIAL_USERS: User[] = [
  {
    id: 'user-citizen-1',
    name: 'Athish Kiruthik',
    email: 'athish.citizen@example.in',
    phone: '+91 98401 23456',
    role: 'citizen',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    ward: 'Ward 134',
    zone: 'Zone 10 (Kodambakkam)',
    badge: 'Active Citizen Champion'
  },
  {
    id: 'user-officer-1',
    name: 'Er. K. Ramanathan',
    email: 'k.ramanathan.ae@chennaicorporation.gov.in',
    phone: '+91 94440 98765',
    role: 'field_officer',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    ward: 'Ward 134',
    zone: 'Zone 10 (Kodambakkam)',
    department: 'Greater Chennai Corporation - Works & Roads',
    badge: 'Assistant Engineer (Zone 10)'
  },
  {
    id: 'user-admin-1',
    name: 'Dr. J. Radhakrishnan, IAS',
    email: 'commissioner@chennaicorporation.gov.in',
    phone: '+91 44 2538 4520',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    zone: 'All Metropolitan Zones (1 - 15)',
    department: 'Municipal Administration & Water Supply Dept',
    badge: 'Principal Secretary / Commissioner'
  }
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'GCC-2026-89421',
    title: 'Severe Deep Pothole on Usman Road causing 2-Wheeler Skidding',
    titleTamil: 'உஸ்மான் சாலையில் ஆழமான பள்ளம் - இருசக்கர வாகனங்கள் விபத்துக்குள்ளாகும் அபாயம்',
    description: 'A 2-foot wide and 8-inch deep crater has formed after recent heavy rain near Panagal Park signal on North Usman Road. Multiple motorcyclists have sustained minor skidding injuries during peak hours.',
    descriptionTamil: 'பனகல் பார்க் சிக்னல் அருகே வடக்கு உஸ்மான் சாலையில் 2 அடி அகலமும் 8 அங்குல ஆழமும் கொண்ட பெரிய பள்ளம் ஏற்பட்டுள்ளது. பீக் ஹவர்ஸில் பல இருசக்கர வாகன ஓட்டிகள் தவறி விழுந்து காயம் அடைந்துள்ளனர். உடனடியாக தார் பூசி சீரமைக்க வேண்டுகிறோம்.',
    originalVoiceText: 'பனகல் பார்க் கிட்ட உஸ்மான் ரோட்டுல ரொம்ப பெரிய பள்ளம் இருக்குங்க, நேத்து ராத்திரி கூட ஒருத்தர் விழுந்துட்டார். உடனே தார் போட்டு மூடுங்க.',
    // Authentic real-life asphalt road damage photo
    imageUrl: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
    // Authentic real-life asphalt road resurfacing photo
    resolutionImageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=800&auto=format&fit=crop&q=80',
    category: 'roads',
    priority: 'CRITICAL',
    status: 'IN_PROGRESS',
    targetPortal: {
      name: 'Greater Chennai Corporation GCC 1913 Portal',
      code: 'GCC-1913',
      url: 'https://chennaicorporation.gov.in/gcc/online-services/public-grievance-redressal/',
      trackingNumber: 'GCC-W134-2026-09281',
      jurisdiction: 'Zone 10 (Kodambakkam), Ward 134'
    },
    governmentBranch: VERIFIED_GOVERNMENT_BRANCHES.gcc_zone_10,
    department: 'GCC Bus Route Roads & Works Dept',
    departmentTamil: 'மாநகராட்சி பேருந்து வழித்தட சாலைகள் மற்றும் பணிகள் துறை',
    location: {
      lat: 13.0418,
      lng: 80.2337,
      address: 'Near Panagal Park Signal, North Usman Road, T. Nagar, Chennai - 600017',
      ward: 'Ward 134',
      zone: 'Zone 10 (Kodambakkam)'
    },
    submittedBy: {
      name: 'Athish Kiruthik',
      phone: '+91 98401 23456',
      isAnonymous: false,
      userId: 'user-citizen-1'
    },
    assignedOfficer: {
      name: 'Er. K. Ramanathan',
      role: 'Assistant Engineer (Roads & Works)',
      contact: '+91 94440 98765',
      department: 'Works Dept, Zone 10'
    },
    createdAt: '2026-09-20T08:30:00Z',
    updatedAt: '2026-09-21T14:15:00Z',
    slaHours: 24,
    slaDeadline: '2026-09-21T08:30:00Z',
    slaBreached: false,
    upvotes: 42,
    hasUpvoted: true,
    timeline: [
      {
        id: 't1',
        status: 'SUBMITTED',
        title: 'AI Auto-Filed to GCC 1913',
        timestamp: 'Sep 20, 08:30 AM',
        note: 'Citizen voice prompt transcribed and processed. Ticket dispatched to GCC Works API.'
      },
      {
        id: 't2',
        status: 'ASSIGNED',
        title: 'Assigned to Ward 134 Works Engineer',
        timestamp: 'Sep 20, 09:15 AM',
        note: 'Grievance verified and assigned to Er. K. Ramanathan.',
        officer: 'GCC Central Grievance Cell'
      },
      {
        id: 't3',
        status: 'IN_PROGRESS',
        title: 'Road Repair Unit Dispatched',
        timestamp: 'Sep 21, 02:15 PM',
        note: 'Bitumen cold-mix asphalt gang dispatched with compactor roller to fill the crater.',
        officer: 'Er. K. Ramanathan'
      }
    ]
  },
  {
    id: 'SBM-2026-34012',
    title: 'Overflowing Garbage Bin & Waste Spillage at 3rd Avenue',
    titleTamil: '3வது அவென்யூவில் நிரம்பி வழியும் குப்பைத் தொட்டி - சுகாதார சீர்கேடு',
    description: 'Community garbage dumpster has not been cleared for 3 consecutive days. Refuse is spilling onto the pedestrian footpath, attracting stray cows, rodents, and causing foul odor in residential zone.',
    descriptionTamil: 'அண்ணா நகர் 3வது அவென்யூ குடியிருப்பு பகுதியில் உள்ள குப்பைத் தொட்டி தொடர்ந்து 3 நாட்களாக அகற்றப்படவில்லை. பாதசாரிகள் நடக்கும் நடைபாதையில் குப்பைகள் சிதறி, துர்நாற்றமும் ஈ, கொசுக்கள் உற்பத்தியும் அதிகரித்துள்ளது.',
    originalVoiceText: '3வது அவென்யூவுல 3 நாளா குப்பை லாரி வரல, குப்பை எல்லாம் ரோட்டுல சிதறி கிடக்குது, துர்நாற்றம் தாங்க முடியல.',
    // Authentic real-life municipal waste dumpster photo
    imageUrl: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?w=800&auto=format&fit=crop&q=80',
    resolutionImageUrl: 'https://images.unsplash.com/photo-1528323273322-d81458248d40?w=800&auto=format&fit=crop&q=80',
    category: 'sanitation',
    priority: 'HIGH',
    status: 'ASSIGNED',
    targetPortal: {
      name: 'Swachh Bharat Urban Grievance Portal',
      code: 'SWACHH-BHARAT',
      url: 'https://swachhata.gov.in/',
      trackingNumber: 'SBM-TN-CHN-2026-1934',
      jurisdiction: 'Zone 8 (Anna Nagar), Ward 102'
    },
    governmentBranch: VERIFIED_GOVERNMENT_BRANCHES.gcc_zone_8_sanitation,
    department: 'Solid Waste Management (SWM) & Urbaser Sumeet',
    departmentTamil: 'திடக்கழிவு மேலாண்மைத் துறை',
    location: {
      lat: 13.0850,
      lng: 80.2101,
      address: '3rd Avenue, Near Roundtana, Anna Nagar West, Chennai - 600040',
      ward: 'Ward 102',
      zone: 'Zone 8 (Anna Nagar)'
    },
    submittedBy: {
      name: 'P. Vasanthi',
      phone: '+91 94441 55678',
      isAnonymous: false,
      userId: 'user-citizen-2'
    },
    assignedOfficer: {
      name: 'S. Shanmugam',
      role: 'Sanitary Inspector (Ward 102)',
      contact: '+91 94451 90102',
      department: 'SWM Zone 8'
    },
    createdAt: '2026-09-21T06:45:00Z',
    updatedAt: '2026-09-21T07:30:00Z',
    slaHours: 12,
    slaDeadline: '2026-09-21T18:45:00Z',
    slaBreached: false,
    upvotes: 28,
    timeline: [
      {
        id: 't2-1',
        status: 'SUBMITTED',
        title: 'Filed to Swachhata National Urban Engine',
        timestamp: 'Sep 21, 06:45 AM',
        note: 'AI classified image evidence and dispatched to SWM automated compact truck route system.'
      },
      {
        id: 't2-2',
        status: 'ASSIGNED',
        title: 'Sanitary Inspector Alerted',
        timestamp: 'Sep 21, 07:30 AM',
        note: 'Compactor vehicle driver route re-scheduled to clear the overflowing bins.',
        officer: 'S. Shanmugam'
      }
    ]
  },
  {
    id: 'TNEB-2026-11894',
    title: 'Dangling 11kV Overhead Wire Snapped near Bus Stop',
    titleTamil: 'பேருந்து நிறுத்தம் அருகே அறுந்து தொங்கும் உயர் அழுத்த மின்கம்பி - அவசர விபத்து அபாயம்',
    description: 'Live power line disconnected from distribution pole and hanging dangerously 5 feet above the pavement near Velachery Main Road bus stop. Sparks observed when windy.',
    descriptionTamil: 'வேளச்சேரி மெயின் ரோடு பஸ் ஸ்டாப் அருகில் மின்கம்பத்திலிருந்து அறுந்து 5 அடி உயரத்தில் மின்கம்பி தொங்குகிறது. காற்று வீசும்போது தீப்பொறி பறக்கிறது. பொதுமக்களுக்கு மிகக் கடுமையான உயிராபத்து உள்ளது.',
    originalVoiceText: 'வேளச்சேரி பஸ் ஸ்டாப் பக்கத்துல கரண்ட் கம்பி அறுந்து தொங்குது, தீப்பொறி பறக்குது, உடனே ஆள அனுப்பி கட் பண்ணுங்க!',
    // Authentic real-life electricity utility pole and wires photo
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop&q=80',
    category: 'electricity',
    priority: 'CRITICAL',
    status: 'INSPECTION',
    targetPortal: {
      name: 'TANGEDCO Minagam Consumer Grievance Portal',
      code: 'TANGEDCO',
      url: 'https://www.tangedco.gov.in/minagam.html',
      trackingNumber: 'TNEB-CHN-SOUTH-2026-8812',
      jurisdiction: 'Chennai South EDC, Velachery Division'
    },
    governmentBranch: VERIFIED_GOVERNMENT_BRANCHES.tangedco_velachery,
    department: 'TANGEDCO Electrical Operations & Distribution',
    departmentTamil: 'தமிழ்நாடு மின் உற்பத்தி மற்றும் பகிர்மான கழகம்',
    location: {
      lat: 12.9815,
      lng: 80.2180,
      address: 'Velachery Main Road, Near Vijaya Nagar Bus Stand, Chennai - 600042',
      ward: 'Ward 178',
      zone: 'Zone 13 (Adyar / Velachery)'
    },
    submittedBy: {
      name: 'R. Karthikeyan',
      phone: '+91 98840 99881',
      isAnonymous: false,
      userId: 'user-citizen-3'
    },
    assignedOfficer: {
      name: 'Er. M. Sivakumar',
      role: 'Junior Engineer (O&M South)',
      contact: '+91 94458 51234',
      department: 'TANGEDCO Velachery Substation'
    },
    createdAt: '2026-09-21T11:10:00Z',
    updatedAt: '2026-09-21T11:25:00Z',
    slaHours: 4,
    slaDeadline: '2026-09-21T15:10:00Z',
    slaBreached: false,
    upvotes: 67,
    timeline: [
      {
        id: 't3-1',
        status: 'SUBMITTED',
        title: 'Emergency Red-Flag Escalation to TNEB Minagam',
        timestamp: 'Sep 21, 11:10 AM',
        note: 'AI detected critical electrocution hazard and pushed priority alert to substation dispatcher.'
      },
      {
        id: 't3-2',
        status: 'INSPECTION',
        title: 'Emergency Line Crew Dispatched',
        timestamp: 'Sep 21, 11:25 AM',
        note: 'Feeder isolated remotely. Emergency breakdown gang en route in service van.',
        officer: 'Er. M. Sivakumar'
      }
    ]
  },
  {
    id: 'CMWSSB-2026-55209',
    title: 'Drinking Water Pipeline Fracture & Continuous Fresh Water Leakage',
    titleTamil: 'குடிநீர் குழாய் உடைந்து லட்சக்கணக்கான லிட்டர் குடிநீர் வீணாக ரோட்டில் பாய்கிறது',
    description: 'Underground CMWSSB potable water trunk pipeline fractured near Luz Corner. Continuous high-pressure freshwater is flooding the road, submerging store fronts and dropping water pressure to 500 households.',
    descriptionTamil: 'லஸ் கார்னர் சந்திப்பில் பூமிக்கடியில் செல்லும் குடிநீர் பிரதான குழாய் உடைந்து குடிநீர் பெருக்கெடுத்து சாலையில் ஓடுகிறது. இதனால் 500-க்கும் மேற்பட்ட குடியிருப்புகளுக்கு குடிநீர் விநியோகம் பாதிக்கப்பட்டுள்ளது.',
    // Authentic real-life water pipe leak and repair photo
    imageUrl: 'https://images.unsplash.com/photo-1584467735815-f778f274e296?w=800&auto=format&fit=crop&q=80',
    resolutionImageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80',
    category: 'water',
    priority: 'HIGH',
    status: 'IN_PROGRESS',
    targetPortal: {
      name: 'CMWSSB Metro Water Online Redressal System',
      code: 'CMWSSB',
      url: 'https://chennaimetrowater.tn.gov.in/',
      trackingNumber: 'CMWSSB-AREA9-2026-443',
      jurisdiction: 'Area IX (Mylapore), Depot 123'
    },
    governmentBranch: VERIFIED_GOVERNMENT_BRANCHES.cmwssb_area_9,
    department: 'Chennai Metro Water Supply & Sewerage Board',
    departmentTamil: 'சென்னை பெருநகர குடிநீர் வழங்கல் மற்றும் கழிவுநீரகற்று வாரியம்',
    location: {
      lat: 13.0368,
      lng: 80.2676,
      address: 'Luz Church Road, Opposite Kamadhenu Theatre, Mylapore, Chennai - 600004',
      ward: 'Ward 123',
      zone: 'Zone 9 (Teynampet)'
    },
    submittedBy: {
      name: 'Meenakshi Sundaram',
      phone: '+91 94442 33441',
      isAnonymous: false,
      userId: 'user-citizen-4'
    },
    assignedOfficer: {
      name: 'Er. T. Arumugam',
      role: 'Depot Engineer (Area IX)',
      contact: '+91 94440 33499',
      department: 'CMWSSB Maintenance'
    },
    createdAt: '2026-09-20T16:00:00Z',
    updatedAt: '2026-09-21T09:00:00Z',
    slaHours: 24,
    slaDeadline: '2026-09-21T16:00:00Z',
    slaBreached: false,
    upvotes: 31,
    timeline: [
      {
        id: 't4-1',
        status: 'SUBMITTED',
        title: 'Auto-Submitted to CMWSSB Metro Water',
        timestamp: 'Sep 20, 04:00 PM',
        note: 'Grievance ticket created with geo-tagging.'
      },
      {
        id: 't4-2',
        status: 'IN_PROGRESS',
        title: 'Excavation & Sluice Valve Replaced',
        timestamp: 'Sep 21, 09:00 AM',
        note: 'Excavator mobilized to dig trench and weld collar fitting onto damaged 300mm pipe.',
        officer: 'Er. T. Arumugam'
      }
    ]
  },
  {
    id: 'CMHELPLINE-2026-77810',
    title: 'Uncovered Open Storm Water Drain Manhole near Primary School',
    titleTamil: 'தொடக்கப் பள்ளி அருகில் மூடப்படாத மழைநீர் வடிகால் குழி - குழந்தைகள் பாதுகாப்பு',
    description: 'Heavy reinforced concrete slab missing over an 8-foot deep stormwater drain chamber directly outside St. Mary Primary School. Poses mortal drowning hazard for young school children.',
    descriptionTamil: 'புனித மேரி தொடக்கப் பள்ளி நுழைவாயில் அருகே 8 அடி ஆழமுள்ள மழைநீர் வடிகால் குழியின் கான்கிரீட் மூடி உடைந்து திறந்த நிலையில் உள்ளது. பள்ளி குழந்தைகள் தவறி விழும் கொடிய ஆபத்து உள்ளது.',
    // Authentic real-life open road storm drain photo
    imageUrl: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&auto=format&fit=crop&q=80',
    // Authentic real-life completed concrete manhole cover repair photo
    resolutionImageUrl: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&auto=format&fit=crop&q=80',
    category: 'safety',
    priority: 'CRITICAL',
    status: 'RESOLVED',
    targetPortal: {
      name: 'Tamil Nadu CM Helpline (Mudhalvarin Mugavari)',
      code: 'TN-CMS',
      url: 'https://cmhelpline.tnega.org/',
      trackingNumber: 'MM-TN-2026-902188',
      jurisdiction: 'Special Grievance Redressal / GCC Zone 10'
    },
    governmentBranch: VERIFIED_GOVERNMENT_BRANCHES.tnega_cm_cell,
    department: 'Storm Water Drainage (SWD) Department',
    departmentTamil: 'மழைநீர் வடிகால் மற்றும் அவசரகால பாதுகாப்புத் துறை',
    location: {
      lat: 13.0102,
      lng: 80.2158,
      address: 'GST Road, Near Guindy Railway Station, Chennai - 600032',
      ward: 'Ward 160',
      zone: 'Zone 10 (Guindy Division)'
    },
    submittedBy: {
      name: 'Dr. S. Balasubramanian',
      phone: '+91 98410 77123',
      isAnonymous: false,
      userId: 'user-citizen-5'
    },
    assignedOfficer: {
      name: 'Er. V. Murugan',
      role: 'Executive Engineer (SWD South)',
      contact: '+91 94440 12099',
      department: 'SWD Central Cell'
    },
    createdAt: '2026-09-18T10:00:00Z',
    updatedAt: '2026-09-19T15:30:00Z',
    slaHours: 24,
    slaDeadline: '2026-09-19T10:00:00Z',
    slaBreached: false,
    upvotes: 89,
    timeline: [
      {
        id: 't5-1',
        status: 'SUBMITTED',
        title: 'Auto-Routed to CM Helpline Priority Track',
        timestamp: 'Sep 18, 10:00 AM',
        note: 'AI classified hazard near educational institution as Critical Priority.'
      },
      {
        id: 't5-2',
        status: 'IN_PROGRESS',
        title: 'Barricading & Pre-cast Slab Deployment',
        timestamp: 'Sep 18, 12:45 PM',
        note: 'Area cordoned off with high-visibility reflective barricades.'
      },
      {
        id: 't5-3',
        status: 'RESOLVED',
        title: 'Heavy Duty RCC Slab Installed & Sealed',
        timestamp: 'Sep 19, 03:30 PM',
        note: 'Pre-cast reinforced concrete manhole cover fitted with bitumen leveling. Site photo verified.',
        officer: 'Er. V. Murugan',
        proofImage: 'https://images.unsplash.com/photo-1590381105924-c72589b9ef3f?w=800&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'GCC-2026-94112',
    title: 'Damaged Traffic Signal Controller Blinking Hazard at OMR Junction',
    titleTamil: 'ஓ.எம்.ஆர் சந்திப்பில் பழுதடைந்த போக்குவரத்து சிக்னல் - வாகன நெரிசல்',
    description: 'Automatic traffic light controller damaged by thunderstorm surge. Signal stuck in amber blink for 18 hours creating dangerous gridlock during morning IT corridor rush.',
    descriptionTamil: 'ராஜீவ் காந்தி சாலை (OMR) மற்றும் பெருங்குடி சந்திப்பில் உள்ள தானியங்கி போக்குவரத்து சிக்னல் இடி மின்னல் காரணமாக பழுதடைந்து தொடர்ந்து மஞ்சள் நிறத்தில் மட்டுமே ஒளிர்கிறது. கடும் போக்குவரத்து நெரிசல் ஏற்பட்டுள்ளது.',
    originalVoiceText: 'ஓ.எம்.ஆர் பெருங்குடி சிக்னல் வேலை செய்யல, 2 கிலோமீட்டர் டிராபிக் ஜாம் ஆகிடுச்சு, உடனே சரிபண்ணுங்க.',
    // Authentic real-life urban street intersection traffic signal photo
    imageUrl: 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800&auto=format&fit=crop&q=80',
    category: 'traffic',
    priority: 'HIGH',
    status: 'SUBMITTED',
    targetPortal: {
      name: 'Greater Chennai Corporation GCC 1913 Portal',
      code: 'GCC-1913',
      url: 'https://chennaicorporation.gov.in/',
      trackingNumber: 'GCC-TRF-2026-4402',
      jurisdiction: 'Zone 14 (Perungudi), Ward 182'
    },
    governmentBranch: VERIFIED_GOVERNMENT_BRANCHES.gcc_zone_10,
    department: 'Chennai City Traffic Police & GCC Electrical Signals',
    departmentTamil: 'பெருநகர சென்னை போக்குவரத்து காவல்துறை மற்றும் மாநகராட்சி சிக்னல் துறை',
    location: {
      lat: 12.9654,
      lng: 80.2461,
      address: 'Rajiv Gandhi Salai (OMR), Perungudi Junction, Chennai - 600096',
      ward: 'Ward 182',
      zone: 'Zone 14 (Perungudi)'
    },
    submittedBy: {
      name: 'G. Suresh Kumar',
      phone: '+91 98402 44901',
      isAnonymous: false,
      userId: 'user-citizen-6'
    },
    assignedOfficer: {
      name: 'Er. D. Rajendran',
      role: 'Senior Signal Engineer (Traffic Zone South)',
      contact: '+91 94450 11992',
      department: 'Traffic Engineering Cell'
    },
    createdAt: '2026-09-22T01:15:00Z',
    updatedAt: '2026-09-22T01:30:00Z',
    slaHours: 8,
    slaDeadline: '2026-09-22T09:15:00Z',
    slaBreached: false,
    upvotes: 53,
    timeline: [
      {
        id: 't6-1',
        status: 'SUBMITTED',
        title: 'Auto-Dispatched to Joint Traffic Cell',
        timestamp: 'Sep 22, 01:15 AM',
        note: 'AI parsed audio note and identified intersection coordinates on OMR arterial highway.'
      }
    ]
  }
];

export const INITIAL_NOTIFICATIONS: NotificationItem[] = [
  {
    id: 'n1',
    complaintId: 'CMHELPLINE-2026-77810',
    title: 'Grievance Verified & Closed',
    message: 'Open drain manhole outside St. Mary School has been covered with new heavy-duty RCC slab. Field inspection photo attached.',
    timestamp: '2 hours ago',
    isRead: false,
    type: 'resolution'
  },
  {
    id: 'n2',
    complaintId: 'TNEB-2026-11894',
    title: 'High Priority Crew Mobilized',
    message: 'TANGEDCO breakdown squad dispatched to Velachery Main Road to repair dangling 11kV conductor.',
    timestamp: '4 hours ago',
    isRead: false,
    type: 'status_change'
  },
  {
    id: 'n3',
    complaintId: 'GCC-2026-89421',
    title: 'Asphalt Repair in Progress',
    message: 'GCC cold-mix bitumen road gang is currently repairing pothole near Panagal Park, T. Nagar.',
    timestamp: 'Yesterday',
    isRead: true,
    type: 'status_change'
  }
];
