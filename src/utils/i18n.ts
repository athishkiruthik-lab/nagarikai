export type AppLanguage = 'ta' | 'en';

export const TRANSLATIONS = {
  en: {
    appName: 'NagarikAI',
    tagline: 'Autonomous Civic Grievance & Urban Planning System',
    subTagline: 'AI voice & photo grievance filing directly to Indian Government Portals',
    fileComplaintBtn: 'File AI Complaint',
    quickVoiceBtn: 'Speak to AI',
    feedTab: 'Grievance Feed',
    mapTab: 'GIS City Map',
    analyticsTab: 'Urban Planning',
    aiAssistantTab: 'AI Civic Assistant',
    notifications: 'Notifications',
    allAlertsRead: 'All alerts caught up',
    newAlerts: 'New Alerts',
    
    // Roles
    roleCitizen: 'Citizen',
    roleOfficer: 'Public Works (AE)',
    roleAdmin: 'City Commissioner',
    switchRole: 'Switch Security Profile',
    
    // Stats
    totalGrievances: 'Total Grievances',
    inProgress: 'In-Progress / Physical Work',
    pendingAssignment: 'Pending Assignment',
    resolvedComplaints: 'Successfully Resolved',
    resolutionRate: 'SLA Adherence Rate',
    
    // Filter & Search
    searchPlaceholder: 'Search complaints by keyword, address, or ticket ID...',
    categoryAll: 'All Domains',
    catRoads: 'Roads & Potholes',
    catSanitation: 'Sanitation & Garbage',
    catElectricity: 'Electricity & Power',
    catWater: 'Water & Drainage',
    catSafety: 'Hazard & Open Drains',
    catTraffic: 'Traffic & Signals',
    
    priorityAll: 'All Priorities',
    prioCritical: 'Critical Hazard',
    prioHigh: 'High Priority',
    prioMedium: 'Medium',
    prioLow: 'Low',
    
    statusAll: 'All Statuses',
    statusSubmitted: 'Registered / Dispatched',
    statusAssigned: 'Assigned to Field Unit',
    statusInspection: 'Under Inspection',
    statusInProgress: 'Works in Progress',
    statusResolved: 'Resolved & Verified',
    
    // Details Modal
    slaTarget: 'Mandated SLA Target',
    targetPortal: 'Target Government Portal',
    assignedOfficer: 'Assigned Field Officer',
    timeline: 'Live Redressal Timeline',
    originalPhoto: 'Original Problem Captured',
    resolutionPhoto: 'Public Works Resolution Evidence',
    upvote: 'Upvote',
    upvoted: 'Upvoted',
    fieldActionTitle: 'Public Works Field Action Center',
    updateStatusBtn: 'Commit Status Update',
    closeModal: 'Close',
    
    // AI Intake Modal
    aiIntakeTitle: 'NagarikAI Grievance Assistant',
    aiIntakeSubtitle: 'Autonomous Portal Submission Agent',
    voiceTab: '1. Voice Input',
    photoTab: '2. Photo Evidence',
    locationTab: '3. Location & Details',
    tapToSpeak: 'Tap Mic to Speak in English',
    listening: 'Listening...',
    sampleVoicePromptTitle: 'Sample Real Civic Grievance Scenarios:',
    speechTranscriptLabel: 'Transcribed Speech & Notes:',
    speechPlaceholder: 'Your spoken words will appear here automatically...',
    openCamera: 'Open Camera',
    uploadPhoto: 'Upload Photo',
    orPickSample: 'Or select a real photo scenario:',
    locationAddressLabel: 'Civic Problem Location:',
    useGps: 'Detect GPS Location',
    deployAiAgent: 'Deploy AI Agent to File Grievance',
    filingWithPortals: 'Filing with Indian Government Portals...',
    successTitle: 'Grievance Registered Successfully',
    successSubtitle: 'AI Agent filed petition directly to government portal',
    viewOnDashboard: 'View on Live Dashboard',
    fileAnother: 'File Another Grievance',
    
    // GIS Map
    gisTitle: 'Metropolitan GIS Civic Map',
    gisSubtitle: 'Real-time spatial visualization of active civic complaints and completed works',
    gisActiveSpots: 'Grievances on Map',
    viewFullDossier: 'View Full Details',
    legendCritical: 'Critical Hazard',
    legendHigh: 'High Priority',
    legendResolved: 'Resolved Work',
    aiPredictionLayer: 'AI Predictive Hotspots',
    
    // Analytics
    analyticsTitle: 'Municipal Performance & Urban Planning Analytics',
    analyticsSubtitle: 'Actionable performance metrics and 5-year infrastructure planning',
    runAiAssessment: 'Run AI Urban Planning Assessment',
    exportCsv: 'Export CSV Dataset',
    printDossier: 'Print Dossier',
    kpiTab: 'KPIs & Trends',
    aiStrategyTab: 'AI Executive Strategy & Hotspots',
    workflowTab: 'Automated Workflows & Export',
    monthlyTrendTitle: 'Monthly Grievances: Inflow vs Resolution',
    domainDistributionTitle: 'Grievance Volume by Infrastructure Domain',
    wardTurnaroundTitle: 'Ward Turnaround Time vs Mandated SLA Ceiling',
    vulnerabilityIndex: 'Infrastructure Vulnerability Index',
    chronicHotspotsTitle: 'Identified Chronic Infrastructure Hotspots',
    futureRecsTitle: 'Strategic 5-Year Infrastructure Recommendations',
    
    // Chatbot
    chatTitle: 'NagarikAI Civic Copilot',
    chatPlaceholder: 'Ask anything about city complaints, ward engineers, or government portals...',
    chatWelcome: 'Hello! I am your AI Civic Assistant. You can ask me to check any complaint status, find ward engineers, or explain government portal procedures in English.',
    
    // General
    hours: 'hours',
    ward: 'Ward',
    zone: 'Zone',
    verified: 'Verified'
  },
  ta: {
    appName: 'நாகரிக்AI',
    tagline: 'குடிமக்கள் குறைதீர்ப்பு மற்றும் நகர்ப்புற திட்டமிடல் கட்டமைப்பு',
    subTagline: 'குரல் மற்றும் புகைப்படத்தின் மூலம் அரசு இணையதளங்களில் தானியங்கி புகார் பதிவு',
    fileComplaintBtn: 'AI மூலம் புகார் பதிவு செய்',
    quickVoiceBtn: 'AI-யிடம் பேசுங்கள்',
    feedTab: 'நேரலை புகார்கள்',
    mapTab: 'நகர வரைபடம் (GIS)',
    analyticsTab: 'நகர்ப்புற திட்டமிடல்',
    aiAssistantTab: 'AI உதவி மையம்',
    notifications: 'அறிவிப்புகள்',
    allAlertsRead: 'அனைத்து தகவல்களும் படிக்கப்பட்டன',
    newAlerts: 'புதிய அறிவிப்புகள்',
    
    // Roles
    roleCitizen: 'குடிமகன்',
    roleOfficer: 'களப்பணி பொறியாளர் (AE)',
    roleAdmin: 'மாநகராட்சி ஆணையர்',
    switchRole: 'பாதுகாப்பு சுயவிவரம் மாற்று',
    
    // Stats
    totalGrievances: 'மொத்த புகார்கள்',
    inProgress: 'நடைபெறும் களப்பணிகள்',
    pendingAssignment: 'ஆய்வு நிலுவை',
    resolvedComplaints: 'தீர்வு காணப்பட்டவை',
    resolutionRate: 'SLA காலக்கெடு துல்லியம்',
    
    // Filter & Search
    searchPlaceholder: 'புகார் எண், முகவரி அல்லது பிரச்சனை மூலம் தேடவும்...',
    categoryAll: 'அனைத்து பிரிவுகளும்',
    catRoads: 'சாலைகள் மற்றும் பள்ளங்கள்',
    catSanitation: 'திடக்கழிவு மற்றும் தூய்மை',
    catElectricity: 'மின்சாரம் மற்றும் விளக்குகள்',
    catWater: 'குடிநீர் மற்றும் கழிவுநீர்',
    catSafety: 'பாதுகாப்பு மற்றும் வடிகால்',
    catTraffic: 'போக்குவரத்து சிக்னல்கள்',
    
    priorityAll: 'அனைத்து முன்னுரிமைகள்',
    prioCritical: 'அவசர உயிராபத்து',
    prioHigh: 'அதிமுக்கியம்',
    prioMedium: 'நடுத்தரம்',
    prioLow: 'குறைந்த முன்னுரிமை',
    
    statusAll: 'அனைத்து நிலைகள்',
    statusSubmitted: 'பதிவு செய்யப்பட்டது',
    statusAssigned: 'பொறியாளருக்கு ஒதுக்கப்பட்டது',
    statusInspection: 'கள ஆய்வு நடக்கிறது',
    statusInProgress: 'சீரமைப்பு பணிகள் நடக்கிறது',
    statusResolved: 'முழுமையாக தீர்க்கப்பட்டது',
    
    // Details Modal
    slaTarget: 'அரசு நிர்ணயித்த காலக்கெடு',
    targetPortal: 'இணைக்கப்பட்ட அரசு தளம்',
    assignedOfficer: 'பொறுப்பு களப்பணி அதிகாரி',
    timeline: 'நடவடிக்கை வரலாறு',
    originalPhoto: 'ஆரம்ப நிலை புகைப்படம்',
    resolutionPhoto: 'சீரமைப்பு முடிவு ஆதாரம்',
    upvote: 'ஆதரவு',
    upvoted: 'ஆதரிக்கப்பட்டது',
    fieldActionTitle: 'பொதுப்பணித்துறை கள நடவடிக்கை தளம்',
    updateStatusBtn: 'நிலையை உறுதிசெய்',
    closeModal: 'மூடு',
    
    // AI Intake Modal
    aiIntakeTitle: 'நாகரிக்AI குறைதீர்ப்பு முகவர்',
    aiIntakeSubtitle: 'அரசு போர்டல் தானியங்கி மனு தாக்கல்',
    voiceTab: '1. குரல் பதிவு',
    photoTab: '2. புகைப்பட ஆதாரம்',
    locationTab: '3. முகவரி விவரம்',
    tapToSpeak: 'தமிழில் பேச மைக்கை அழுத்தவும்',
    listening: 'கேட்கிறது...',
    sampleVoicePromptTitle: 'உண்மை மாதிரி புகார்கள்:',
    speechTranscriptLabel: 'பேசப்பட்ட தமிழ் உரை:',
    speechPlaceholder: 'நீங்கள் பேசும் வார்த்தைகள் தானாக இங்கே தமிழில் தோன்றும்...',
    openCamera: 'கேமரா திற',
    uploadPhoto: 'படம் பதிவேற்று',
    orPickSample: 'அல்லது நேரடி புகைப்படத்தை தேர்வு செய்:',
    locationAddressLabel: 'பிரச்சனை உள்ள இடம்:',
    useGps: 'ஜிபிஎஸ் இருப்பிடத்தை எடு',
    deployAiAgent: 'AI முகவர் மூலம் புகார் தாக்கல் செய்',
    filingWithPortals: 'அரசு போர்டலில் தானியங்கியாக பதிவு செய்யப்படுகிறது...',
    successTitle: 'புகார் வெற்றிகரமாக பதிவு செய்யப்பட்டது',
    successSubtitle: 'உரிய அரசு இணையதளத்தில் மனு அதிகாரப்பூர்வமாக இணைக்கப்பட்டது',
    viewOnDashboard: 'டாஷ்போர்டில் பார்',
    fileAnother: 'மற்றொரு புகார் செய்',
    
    // GIS Map
    gisTitle: 'பெருநகர நேரலை GIS வரைபடம்',
    gisSubtitle: 'நகர புகார்கள் மற்றும் சீரமைப்பு பணிகளின் நேரடி வரைபட காட்சி',
    gisActiveSpots: 'வரைபடத்தில் உள்ள புகார்கள்',
    viewFullDossier: 'முழு விவரம் பார்',
    legendCritical: 'அவசர உயிராபத்து',
    legendHigh: 'அதிமுக்கியம்',
    legendResolved: 'தீர்வு பெற்ற பணி',
    aiPredictionLayer: 'AI கணிக்கப்பட்ட தீவிர பகுதிகள்',
    
    // Analytics
    analyticsTitle: 'மாநகராட்சி செயல் திறன் & உள்கட்டமைப்பு திட்டமிடல்',
    analyticsSubtitle: 'செயல்பாட்டு அளவீடுகள் மற்றும் 5 ஆண்டு உள்கட்டமைப்பு அறிக்கை',
    runAiAssessment: 'AI உள்கட்டமைப்பு மதிப்பீட்டை இயக்கு',
    exportCsv: 'CSV தரவுகளை பதிவிறக்கு',
    printDossier: 'அறிக்கையை அச்சிடு',
    kpiTab: 'செயல்திறன் வரைபடங்கள்',
    aiStrategyTab: 'AI உயர்நிலை உத்தி மற்றும் ஆபத்து பகுதிகள்',
    workflowTab: 'தானியங்கி அறிக்கைகள் & தரவு பகிர்வு',
    monthlyTrendTitle: 'மாதாந்திர புகார்கள்: வரவு மற்றும் தீர்வு ஒப்பீடு',
    domainDistributionTitle: 'துறை வாரியான புகார் பங்கீடு',
    wardTurnaroundTitle: 'வார்டு வாரியான தீர்வு வேகம் மற்றும் அரசு காலக்கெடு',
    vulnerabilityIndex: 'உள்கட்டமைப்பு பாதிப்பு குறியீடு',
    chronicHotspotsTitle: 'கண்டறியப்பட்ட தீவிர பிரச்சனை மையங்கள்',
    futureRecsTitle: 'முக்கிய 5-ஆண்டு உள்கட்டமைப்பு பரிந்துரைகள்',
    
    // Chatbot
    chatTitle: 'நாகரிக்AI குடிமக்கள் வழிகாட்டி',
    chatPlaceholder: 'புகாரின் நிலை, வார்டு அதிகாரி அல்லது அரசு இணையதளங்கள் பற்றி கேளுங்கள்...',
    chatWelcome: 'வணக்கம்! நான் உங்கள் AI குறைதீர்ப்பு உதவியாளர். உங்கள் புகாரின் நிலை, வார்டு பொறியாளரின் தொலைபேசி எண், அல்லது மாநகராட்சி விதிகள்பற்றி தமிழில் கேட்கலாம்.',
    
    // General
    hours: 'மணிநேரம்',
    ward: 'வார்டு',
    zone: 'மண்டலம்',
    verified: 'உறுதி செய்யப்பட்டது'
  }
};

export function getTranslation(lang: AppLanguage) {
  return TRANSLATIONS[lang] || TRANSLATIONS.en;
}
