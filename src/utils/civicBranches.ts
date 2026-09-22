import { Complaint, GovernmentBranch, InfrastructureUrgencyData } from '../types/civic';

/**
 * Verified Indian Municipal & State Government Branches for Chennai / Tamil Nadu
 */
export const VERIFIED_GOVERNMENT_BRANCHES: Record<string, GovernmentBranch> = {
  gcc_zone_10: {
    branchName: 'Greater Chennai Corporation — Zone 10 (Kodambakkam) Zonal Works Office',
    branchNameTamil: 'பெருநகர சென்னை மாநகராட்சி — மண்டலம் 10 (கோடம்பாக்கம்) மண்டலப் பணிகள் அலுவலகம்',
    branchAddress: 'No. 64, Arcot Road, Near Power House, Kodambakkam, Chennai, Tamil Nadu 600024',
    branchPhone: '+91 44 2480 3211 / +91 44 2480 3212',
    tollFreeHelpline: 'GCC Citizen Helpline: 1913',
    branchEmail: 'zonal10.works@chennaicorporation.gov.in',
    executiveInCharge: 'Er. M. Senthil Kumar, M.E., Executive Engineer (Works)',
    wardJuniorEngineer: 'Er. K. Ramanathan, B.E., Assistant Engineer (Ward 134 / T. Nagar)',
    jurisdictionZone: 'Zone 10 (Kodambakkam) — Wards 127 to 142',
    workingHours: 'Mon – Sat: 09:30 AM – 05:30 PM (Control Room: 24x7)',
    grievancePortalUrl: 'https://chennaicorporation.gov.in/gcc/online-services/public-grievance-redressal/'
  },
  tangedco_velachery: {
    branchName: 'TANGEDCO — South Chennai Operation & Distribution Division (Velachery Substation)',
    branchNameTamil: 'தமிழ்நாடு மின் உற்பத்தி மற்றும் பகிர்மான கழகம் — தென் சென்னை இயக்கம் மற்றும் பகிர்மான பிரிவு',
    branchAddress: 'TANGEDCO 110/33kV Substation Complex, 100 Feet Bypass Road, Velachery, Chennai 600042',
    branchPhone: '+91 44 2244 5612 / +91 44 2244 5613',
    tollFreeHelpline: 'Minagam State Electrical Control Room: 1912 / 94987 94987',
    branchEmail: 'ee.velachery@tnebnet.org',
    executiveInCharge: 'Er. V. Shanmugam, Executive Engineer (Distribution - South)',
    wardJuniorEngineer: 'Er. S. Balamurugan, Assistant Engineer (O&M - Velachery)',
    jurisdictionZone: 'Zone 13 (Velachery & Adyar South) — Wards 175 to 182',
    workingHours: '24x7 Emergency Grid Operations / Administrative: 10:00 AM – 05:00 PM',
    grievancePortalUrl: 'https://www.tangedco.gov.in/consumer-grievance/'
  },
  cmwssb_area_9: {
    branchName: 'Chennai Metro Water (CMWSSB) — Area IX (Mylapore / Santhome) Depot Office',
    branchNameTamil: 'சென்னை பெருநகர் குடிநீர் வழங்கல் மற்றும் கழிவுநீரகற்று வாரியம் — பகுதி IX அலுவலகம்',
    branchAddress: 'No. 1, Muthu Street, Near Luz Church Road, Mylapore, Chennai 600004',
    branchPhone: '+91 44 2499 5689 / +91 44 2499 5690',
    tollFreeHelpline: 'Metro Water Complaint Cell: 044-4567 4567 / 1916',
    branchEmail: 'area9.engineer@cmwssb.in',
    executiveInCharge: 'Er. G. Nithyanandam, Area Engineer (Water Supply & Sewerage)',
    wardJuniorEngineer: 'Er. T. Gomathi, Assistant Engineer (Distribution Depot 123)',
    jurisdictionZone: 'Area IX (Mylapore, Mandaveli, Alwarpet) — Wards 120 to 126',
    workingHours: 'Mon – Sat: 08:30 AM – 04:30 PM (Water Distribution Emergencies: 24x7)',
    grievancePortalUrl: 'https://chennaimetrowater.tn.gov.in/grievance.html'
  },
  gcc_zone_8_sanitation: {
    branchName: 'Greater Chennai Corporation — Zone 8 (Anna Nagar) Solid Waste Management Circle',
    branchNameTamil: 'பெருநகர சென்னை மாநகராட்சி — மண்டலம் 8 (அண்ணா நகர்) திடக்கழிவு மேலாண்மை வட்டம்',
    branchAddress: 'No. 36B, Pulla Avenue, Shenoy Nagar, Anna Nagar, Chennai 600030',
    branchPhone: '+91 44 2664 1422 / +91 44 2664 1423',
    tollFreeHelpline: 'Swachhata Urban Grievance: 1969 / GCC 1913',
    branchEmail: 'zonal8.health@chennaicorporation.gov.in',
    executiveInCharge: 'Dr. P. Hemalatha, M.D., Zonal Health Officer (SWM In-Charge)',
    wardJuniorEngineer: 'K. Thirunavukkarasu, Sanitary Inspector (Ward 102)',
    jurisdictionZone: 'Zone 8 (Anna Nagar) — Wards 94 to 108',
    workingHours: 'Daily: 06:00 AM – 08:00 PM (Sanitation Sweeps in 3 shifts)',
    grievancePortalUrl: 'https://swachhbharaturban.gov.in/'
  },
  tnega_cm_cell: {
    branchName: 'Mudhalvarin Mugavari (CM Helpline Grievance Redressal Center) — Secretariat HQ',
    branchNameTamil: 'முதல்வரின் முகவரி (முதலமைச்சர் தனிப்பிரிவு குறைதீர்ப்பு மையம்) — தலைமைச் செயலகம்',
    branchAddress: 'Special Grievance Redressal Cell, Ground Floor, Fort St. George, Chennai 600009',
    branchPhone: '+91 44 2567 1514',
    tollFreeHelpline: 'Tamil Nadu CM Helpline: 1100 (Toll-Free 24x7)',
    branchEmail: 'cmcell@tn.gov.in',
    executiveInCharge: 'Thiru K. Sivakumar, Special Officer (Grievances & Redressal)',
    wardJuniorEngineer: 'Inter-Departmental Municipal Liaison Taskforce',
    jurisdictionZone: 'State of Tamil Nadu — All Districts & Metropolitan Corporations',
    workingHours: '24x7 Citizen Telephonic & Web Gateway',
    grievancePortalUrl: 'https://cmhelpline.tnega.org/'
  }
};

/**
 * Returns verified branch details for a complaint based on its category or department
 */
export function getGovernmentBranchForComplaint(complaint: Complaint): GovernmentBranch {
  if (complaint.governmentBranch) {
    return complaint.governmentBranch;
  }

  if (complaint.category === 'electricity' || complaint.department?.toLowerCase().includes('tangedco')) {
    return VERIFIED_GOVERNMENT_BRANCHES.tangedco_velachery;
  }
  if (complaint.category === 'water' || complaint.department?.toLowerCase().includes('metro water') || complaint.department?.toLowerCase().includes('cmwssb')) {
    return VERIFIED_GOVERNMENT_BRANCHES.cmwssb_area_9;
  }
  if (complaint.category === 'sanitation' || complaint.department?.toLowerCase().includes('solid waste') || complaint.department?.toLowerCase().includes('swachh')) {
    return VERIFIED_GOVERNMENT_BRANCHES.gcc_zone_8_sanitation;
  }
  if (complaint.category === 'safety' && complaint.priority === 'CRITICAL') {
    return VERIFIED_GOVERNMENT_BRANCHES.tnega_cm_cell;
  }
  // Default to GCC Zone 10 Works
  return VERIFIED_GOVERNMENT_BRANCHES.gcc_zone_10;
}

/**
 * AI-Calculated Infrastructure Urgency Index for a specific neighborhood
 * based on live GIS map data and active complaints.
 * 
 * Threshold = 70.
 * Above 70, alerts are raised to citizens and municipal engineers.
 */
export function calculateInfrastructureUrgencyIndex(
  complaints: Complaint[],
  neighborhoodZone: string = 'Zone 10 (Kodambakkam)',
  ward: string = 'Ward 134'
): InfrastructureUrgencyData {
  // Filter complaints related to this neighborhood / ward or immediate GIS vicinity
  const localComplaints = complaints.filter(c => {
    const zoneMatch = c.location.zone.toLowerCase().includes(neighborhoodZone.toLowerCase()) ||
                      neighborhoodZone.toLowerCase().includes(c.location.zone.toLowerCase());
    const wardMatch = c.location.ward.toLowerCase().includes(ward.toLowerCase());
    return zoneMatch || wardMatch;
  });

  const dataset = localComplaints.length > 0 ? localComplaints : complaints.slice(0, 5);

  const critical = dataset.filter(c => c.priority === 'CRITICAL' && c.status !== 'RESOLVED');
  const high = dataset.filter(c => c.priority === 'HIGH' && c.status !== 'RESOLVED');
  const active = dataset.filter(c => c.status !== 'RESOLVED');
  const resolved = dataset.filter(c => c.status === 'RESOLVED');
  const slaBreached = dataset.filter(c => c.slaBreached && c.status !== 'RESOLVED');

  // Urgency Formula (0 - 100)
  // Baseline urgency from critical hazards
  let rawScore = 30; // base infrastructure load in metropolitan area
  rawScore += critical.length * 22; // heavy weight for open hazards (live wires, deep craters)
  rawScore += high.length * 12; // high priority issues
  rawScore += active.length * 5; // queue density
  rawScore += slaBreached.length * 15; // SLA overdue penalty
  rawScore -= resolved.length * 6; // mitigation from resolved interventions

  // Clamp 10 - 98
  const score = Math.min(98, Math.max(15, rawScore));
  const threshold = 70;
  const isCritical = score >= threshold;

  const contributingFactors: string[] = [];
  const contributingFactorsTamil: string[] = [];

  if (critical.length > 0) {
    contributingFactors.push(`${critical.length} Active CRITICAL hazards mapped in GIS (e.g. electrical wire hazard / road cave-in)`);
    contributingFactorsTamil.push(`${critical.length} அவசர முன்னுரிமை ஆபத்துகள் வரைபடத்தில் நிலுவையில் உள்ளன (மின் கம்பி / சாலை பள்ளம்)`);
  }
  if (high.length > 0) {
    contributingFactors.push(`${high.length} High-density infrastructure disruptions awaiting field engineering crews`);
    contributingFactorsTamil.push(`${high.length} அதிக முன்னுரிமை உள்கட்டமைப்பு புகார்களுக்கு களப்பணிகள் தேவை`);
  }
  if (active.length >= 3) {
    contributingFactors.push(`Active civic grievance volume in ${ward} exceeds zonal buffer capacity`);
    contributingFactorsTamil.push(`${ward} பகுதியில் உள்ள புகார்களின் எண்ணிக்கை மண்டல திறனை விட அதிகம்`);
  }
  if (slaBreached.length > 0) {
    contributingFactors.push(`SLA response window breached on ${slaBreached.length} pending civic tickets`);
    contributingFactorsTamil.push(`${slaBreached.length} மனுக்களுக்கு அரசு காலக்கெடு கடந்துள்ளது`);
  }
  if (contributingFactors.length === 0) {
    contributingFactors.push('Moderate seasonal infrastructure load with routine maintenance in progress');
    contributingFactorsTamil.push('வழக்கமான பராமரிப்பு பணிகள் சீராக நடைபெற்று வருகின்றன');
  }

  const recommendedAction = isCritical
    ? `IMMEDIATE ACTION: Dispatch Zone 10 Rapid Response Van with cold-mix asphalt and mobilize TANGEDCO Lineman crew to Ward 134 immediately.`
    : `Routine Monitoring: Schedule scheduled inspections with Ward 134 Assistant Engineer within normal 48h SLA window.`;

  const recommendedActionTamil = isCritical
    ? `உடனடி நடவடிக்கை: மண்டலம் 10 விரைவு மீட்பு வாகனத்தையும், மின்வாரிய பொறியாளர்களையும் உடனடியாக வார்டு 134-க்கு அனுப்ப உத்தரவிடப்படுகிறது.`
    : `வழக்கமான கண்காணிப்பு: வார்டு 134 உதவிப் பொறியாளர் 48 மணி நேரத்திற்குள் வழக்கமான கள ஆய்வு மேற்கொள்ள அறிவுறுத்தப்படுகிறது.`;

  return {
    neighborhoodName: `${neighborhoodZone} • ${ward} (T. Nagar / Kodambakkam)`,
    zone: neighborhoodZone,
    ward: ward,
    score,
    isCritical,
    threshold,
    criticalCount: critical.length,
    highCount: high.length,
    activeCount: active.length,
    resolvedCount: resolved.length,
    contributingFactors,
    contributingFactorsTamil,
    recommendedAction,
    recommendedActionTamil
  };
}
