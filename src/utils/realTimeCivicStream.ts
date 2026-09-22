import { Complaint, NotificationItem } from '../types/civic';
import { VERIFIED_GOVERNMENT_BRANCHES } from './civicBranches';

export interface StreamUpdateResult {
  updatedComplaints: (prev: Complaint[]) => Complaint[];
  newNotification: NotificationItem;
  toastMessage: {
    title: string;
    titleTamil: string;
    description: string;
    descriptionTamil: string;
    type: 'new_complaint' | 'status_update' | 'resolution';
  };
}

let streamCycleIndex = 0;

/**
 * Generates the next real-time civic event every 30 seconds
 */
export function getNext30SecondCivicUpdate(): StreamUpdateResult {
  const cycle = streamCycleIndex % 5;
  streamCycleIndex++;

  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (cycle === 0) {
    // Event 1: New Urgent Report in Triplicane (Ward 116)
    const newId = `GCC-2026-${Math.floor(10000 + Math.random() * 89999)}`;
    const newComplaint: Complaint = {
      id: newId,
      title: 'High Mast Streetlight Pole Short-Circuit on Bells Road',
      titleTamil: 'பெல்ஸ் சாலையில் உயர் கோபுர மின்விளக்கு மின்கசிவு மற்றும் ஒளிராமல் இருப்பது',
      description: 'Major high-mast streetlight assembly has lost illumination due to underground cable burnout near Triplicane Police Station, creating unsafe dark stretch for night commuters.',
      descriptionTamil: 'திருவல்லிக்கேணி காவல் நிலையம் அருகே உள்ள உயர் கோபுர விளக்கு தரைவழி கேபிள் தீய்ந்து போனதால் எரியவில்லை. இரவு நேரப் பயணிகளுக்கு பாதுகாப்பற்ற இருள் சூழ்ந்துள்ளது. உடனே சரிசெய்யவும்.',
      originalVoiceText: 'திருவல்லிக்கேணி பெல்ஸ் ரோடுல ஹைமாஸ்ட் லைட் எரியலைங்க, ரொம்ப இருட்டா இருக்கு. உடனே சரிபண்ணுங்க.',
      // Real-life municipal utility photo
      imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop&q=80',
      category: 'electricity',
      priority: 'HIGH',
      status: 'SUBMITTED',
      targetPortal: {
        name: 'TANGEDCO Minagam Consumer Grievance Portal',
        code: 'TNEB-1912',
        url: 'https://www.tangedco.gov.in/consumer-grievance/',
        trackingNumber: `TNEB-W116-${Date.now().toString().slice(-6)}`,
        jurisdiction: 'Zone 9 (Teynampet), Ward 116'
      },
      governmentBranch: VERIFIED_GOVERNMENT_BRANCHES.tangedco_velachery,
      department: 'TANGEDCO Street Lighting & Distribution Division',
      departmentTamil: 'மின் பகிர்மான கழகம் - தெருவிளக்கு பிரிவு',
      location: {
        lat: 13.0601,
        lng: 80.2764,
        address: 'Bells Road Junction, Near Triplicane Police Station, Chennai 600005',
        ward: 'Ward 116',
        zone: 'Zone 9 (Teynampet)'
      },
      submittedBy: {
        name: 'R. Vigneshwaran',
        phone: '+91 97910 88231',
        isAnonymous: false,
        userId: 'citizen-trip-9'
      },
      assignedOfficer: {
        name: 'Er. P. Srinivasan',
        role: 'Assistant Engineer (O&M Triplicane)',
        contact: '+91 94458 51102',
        department: 'TANGEDCO Triplicane Section'
      },
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      slaHours: 24,
      slaDeadline: new Date(now.getTime() + 24 * 3600000).toISOString(),
      slaBreached: false,
      upvotes: 3,
      timeline: [
        {
          id: `t-${Date.now()}`,
          status: 'SUBMITTED',
          title: 'Auto-Filed via NagarikAI Agent to Minagam',
          timestamp: timeStr,
          note: 'Citizen Tamil voice input parsed and ticket generated with TNEB-1912 API integration.'
        }
      ]
    };

    return {
      updatedComplaints: (prev) => [newComplaint, ...prev],
      newNotification: {
        id: `stream-notif-${Date.now()}`,
        complaintId: newId,
        title: 'New Civic Grievance Registered (Ward 116)',
        message: 'High mast street light blackout on Bells Road filed to TANGEDCO Minagam.',
        timestamp: 'Just now',
        isRead: false,
        type: 'assignment'
      },
      toastMessage: {
        title: 'New Grievance Registered in Ward 116',
        titleTamil: 'வார்டு 116-ல் புதிய மின் கோளாறு மனு பதிவானது',
        description: 'Bells Road high-mast electrical blackout dispatched to TANGEDCO Minagam (SLA 24h).',
        descriptionTamil: 'பெல்ஸ் சாலை மின்கோளாறு மின்வாரியத்தில் பதிவு செய்யப்பட்டு நடவடிக்கை துவங்கியது.',
        type: 'new_complaint'
      }
    };
  }

  if (cycle === 1) {
    // Event 2: Pothole on Usman Road updated to RESOLVED with real photo
    return {
      updatedComplaints: (prev) =>
        prev.map(c => {
          if (c.id === 'GCC-2026-89421') {
            const hasResolved = c.timeline.some(t => t.status === 'RESOLVED');
            if (hasResolved) return c;
            return {
              ...c,
              status: 'RESOLVED',
              // Authentic road paving photo
              resolutionImageUrl: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=800&auto=format&fit=crop&q=80',
              updatedAt: now.toISOString(),
              timeline: [
                ...c.timeline,
                {
                  id: `t-res-${Date.now()}`,
                  status: 'RESOLVED',
                  title: 'Cold-Mix Bitumen Resurfacing Completed & Verified',
                  timestamp: timeStr,
                  note: 'Assistant Engineer Er. K. Ramanathan deployed 2 tons of polymer cold-mix bitumen. Road levelled and opened for traffic.',
                  officer: 'Er. K. Ramanathan (AE Works)',
                  proofImage: 'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=800&auto=format&fit=crop&q=80'
                }
              ]
            };
          }
          return c;
        }),
      newNotification: {
        id: `stream-notif-${Date.now()}`,
        complaintId: 'GCC-2026-89421',
        title: 'Grievance Resolved: Usman Road Pothole',
        message: 'GCC Works completed road repair with cold-mix asphalt. Verified by Field AE.',
        timestamp: 'Just now',
        isRead: false,
        type: 'resolution'
      },
      toastMessage: {
        title: 'Grievance Resolved: Usman Road Crater',
        titleTamil: 'உஸ்மான் சாலை பள்ளம் சரிசெய்யப்பட்டது',
        description: 'GCC Works completed asphalt laying on Usman Road. Traffic restored safely.',
        descriptionTamil: 'மாநகராட்சி உதவி பொறியாளர் தார் பூசி சாலையை முழுமையாக சீரமைத்தார்.',
        type: 'resolution'
      }
    };
  }

  if (cycle === 2) {
    // Event 3: TANGEDCO Velachery live wire moved to IN_PROGRESS
    return {
      updatedComplaints: (prev) =>
        prev.map(c => {
          if (c.id === 'TNEB-2026-11894' || c.id === 'TNEB-2026-44012') {
            const inProgress = c.timeline.some(t => t.status === 'IN_PROGRESS');
            if (inProgress) return c;
            return {
              ...c,
              status: 'IN_PROGRESS',
              updatedAt: now.toISOString(),
              timeline: [
                ...c.timeline,
                {
                  id: `t-prog-${Date.now()}`,
                  status: 'IN_PROGRESS',
                  title: 'Line Isolated & Aerial Splicing Crew Deployed',
                  timestamp: timeStr,
                  note: 'Velachery 110kV Substation isolated feeder line. TANGEDCO lineman crew on tower wagon replacing snapped aluminum conductor.',
                  officer: 'Er. S. Balamurugan (AE O&M)',
                  proofImage: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=800&auto=format&fit=crop&q=80'
                }
              ]
            };
          }
          return c;
        }),
      newNotification: {
        id: `stream-notif-${Date.now()}`,
        complaintId: 'TNEB-2026-11894',
        title: 'Field Works Underway: Velachery Live Wire',
        message: 'TANGEDCO substation team isolated circuit; lineman crew splicing conductor.',
        timestamp: 'Just now',
        isRead: false,
        type: 'status_change'
      },
      toastMessage: {
        title: 'Field Crew On-Site: Velachery Wire Hazard',
        titleTamil: 'வேளச்சேரி மின்கம்பி: களப்பணிகள் தீவிரமாக துவங்கியது',
        description: 'TANGEDCO Linemen isolated high-tension feeder; conductor re-stringing underway.',
        descriptionTamil: 'மின்வாரிய குழுவினர் மின் இணைப்பை துண்டித்து புதிய கம்பி பொருத்தும் பணியில் ஈடுபட்டுள்ளனர்.',
        type: 'status_update'
      }
    };
  }

  if (cycle === 3) {
    // Event 4: New Sanitation Report in Anna Nagar (Ward 102)
    const newId = `SWM-2026-${Math.floor(10000 + Math.random() * 89999)}`;
    const newComplaint: Complaint = {
      id: newId,
      title: 'Commercial Waste Bin Overflow at 2nd Avenue Roundabout',
      titleTamil: '2வது அவென்யூ ரவுண்டானா அருகே குப்பைக் தொட்டி நிரம்பி வழிதல்',
      description: 'Solid waste container overflowing onto pedestrian sidewalk. Commercial food waste attracting stray animals and blocking rainwater catchment inlet.',
      descriptionTamil: '2வது அவென்யூ நடைபாதையில் உள்ள குப்பைத் தொட்டி நிரம்பி வெளியே சிதறியுள்ளது. மழைநீர் வடிகால் வாய்க்காலை குப்பைகள் அடைக்கின்றன. உடனடியாக அகற்ற வேண்டுகிறோம்.',
      originalVoiceText: 'அண்ணா நகர் 2வது அவென்யூல குப்பைத் தொட்டி ரொம்ப நிறைஞ்சு நாறுதுங்க, சீக்கிரம் வண்டி அனுப்பி அள்ளுங்க.',
      // Real-life municipal waste photo
      imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?w=800&auto=format&fit=crop&q=80',
      category: 'sanitation',
      priority: 'MEDIUM',
      status: 'SUBMITTED',
      targetPortal: {
        name: 'Swachh Bharat Urban / GCC SWM Portal',
        code: 'SBM-1969',
        url: 'https://swachhbharaturban.gov.in/',
        trackingNumber: `SBM-W102-${Date.now().toString().slice(-6)}`,
        jurisdiction: 'Zone 8 (Anna Nagar), Ward 102'
      },
      governmentBranch: VERIFIED_GOVERNMENT_BRANCHES.gcc_zone_8_sanitation,
      department: 'Greater Chennai Corporation Solid Waste Management',
      departmentTamil: 'சென்னை மாநகராட்சி திடக்கழிவு மேலாண்மை துறை',
      location: {
        lat: 13.0850,
        lng: 80.2101,
        address: '2nd Avenue, Near Anna Nagar Roundabout, Chennai 600040',
        ward: 'Ward 102',
        zone: 'Zone 8 (Anna Nagar)'
      },
      submittedBy: {
        name: 'Deepa Natarajan',
        phone: '+91 94443 11223',
        isAnonymous: false,
        userId: 'citizen-anna-2'
      },
      assignedOfficer: {
        name: 'K. Thirunavukkarasu',
        role: 'Sanitary Inspector (Ward 102)',
        contact: '+91 94440 45612',
        department: 'Health & SWM Dept'
      },
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      slaHours: 12,
      slaDeadline: new Date(now.getTime() + 12 * 3600000).toISOString(),
      slaBreached: false,
      upvotes: 8,
      timeline: [
        {
          id: `t-${Date.now()}`,
          status: 'SUBMITTED',
          title: 'Logged to Swachhata Grievance Portal',
          timestamp: timeStr,
          note: 'Compactor vehicle dispatch order issued to Zone 8 morning shift.'
        }
      ]
    };

    return {
      updatedComplaints: (prev) => [newComplaint, ...prev],
      newNotification: {
        id: `stream-notif-${Date.now()}`,
        complaintId: newId,
        title: 'New Sanitation Grievance (Ward 102)',
        message: 'Anna Nagar 2nd Avenue bin overflow assigned to Sanitary Inspector.',
        timestamp: 'Just now',
        isRead: false,
        type: 'assignment'
      },
      toastMessage: {
        title: 'New Sanitation Grievance: Ward 102',
        titleTamil: 'வார்டு 102-ல் புதிய திடக்கழிவு மனு பதிவானது',
        description: 'Commercial waste clearing compactor scheduled by GCC Zone 8 (SLA 12h).',
        descriptionTamil: 'அண்ணா நகர் குப்பைக் கழிவுகளை அகற்ற மாநகராட்சி தூய்மைப் பணியாளர்கள் விரைந்துள்ளனர்.',
        type: 'new_complaint'
      }
    };
  }

  // Event 5: CMWSSB Mylapore Sewer Leak marked RESOLVED with real photo
  return {
    updatedComplaints: (prev) =>
      prev.map(c => {
        if (c.id === 'CMWSSB-2026-55209' || c.id === 'CMWSSB-2026-10924') {
          const hasResolved = c.timeline.some(t => t.status === 'RESOLVED');
          if (hasResolved) return c;
          return {
            ...c,
            status: 'RESOLVED',
            resolutionImageUrl: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80',
            updatedAt: now.toISOString(),
            timeline: [
              ...c.timeline,
              {
                id: `t-res-${Date.now()}`,
                status: 'RESOLVED',
                title: 'High-Pressure Sewer Jetting Machine Cleared Choke',
                timestamp: timeStr,
                note: 'Super sucker machine deployed by Area IX depot. Silt dislodged and sewage flow restored. Chlorine powder disinfected.',
                officer: 'Er. T. Gomathi (AE Metro Water)',
                proofImage: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&auto=format&fit=crop&q=80'
              }
            ]
          };
        }
        return c;
      }),
    newNotification: {
      id: `stream-notif-${Date.now()}`,
      complaintId: 'CMWSSB-2026-55209',
      title: 'Resolved: Mylapore Water Main Repaired',
      message: 'CMWSSB Area IX completed ductile pipeline collar replacement.',
      timestamp: 'Just now',
      isRead: false,
      type: 'resolution'
    },
    toastMessage: {
      title: 'Grievance Resolved: Mylapore Sewer Line',
      titleTamil: 'மயிலாப்பூர் கழிவுநீர் அடைப்பு முழுமையாக சீரமைக்கப்பட்டது',
      description: 'CMWSSB Area IX super-sucker jetting dislodged underground blockage.',
      descriptionTamil: 'மெட்ரோ வாட்டர் ஜெட்டிங் வாகனம் மூலம் கழிவுநீர் அடைப்பு நீக்கப்பட்டு பிளீச்சிங் பவுடர் தெளிக்கப்பட்டது.',
      type: 'resolution'
    }
  };
}
