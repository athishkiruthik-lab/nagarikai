export type CivicCategory = 'roads' | 'sanitation' | 'electricity' | 'water' | 'safety' | 'traffic';

export type CivicPriority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type ComplaintStatus = 'SUBMITTED' | 'ASSIGNED' | 'INSPECTION' | 'IN_PROGRESS' | 'RESOLVED';

export type UserRole = 'citizen' | 'field_officer' | 'admin';

export interface TargetPortal {
  name: string;
  code: string;
  url: string;
  trackingNumber: string;
  jurisdiction: string;
}

export interface GovernmentBranch {
  branchName: string;
  branchNameTamil: string;
  branchAddress: string;
  branchPhone: string;
  tollFreeHelpline: string;
  branchEmail: string;
  executiveInCharge: string;
  wardJuniorEngineer: string;
  jurisdictionZone: string;
  workingHours: string;
  grievancePortalUrl: string;
}

export interface InfrastructureUrgencyData {
  neighborhoodName: string;
  zone: string;
  ward: string;
  score: number; // 0 - 100
  isCritical: boolean; // true if score >= 70
  threshold: number; // default 70
  criticalCount: number;
  highCount: number;
  activeCount: number;
  resolvedCount: number;
  contributingFactors: string[];
  contributingFactorsTamil: string[];
  recommendedAction: string;
  recommendedActionTamil: string;
}

export interface ComplaintTimelineEntry {
  id: string;
  status: ComplaintStatus;
  title: string;
  timestamp: string;
  note: string;
  officer?: string;
  proofImage?: string;
}

export interface ComplaintLocation {
  lat: number;
  lng: number;
  address: string;
  ward: string;
  zone: string;
}

export interface Complaint {
  id: string;
  title: string;
  titleTamil: string;
  description: string;
  descriptionTamil: string;
  originalVoiceText?: string;
  imageUrl: string;
  resolutionImageUrl?: string;
  videoUrl?: string;
  videoAspectRatio?: '16:9' | '9:16';
  category: CivicCategory;
  priority: CivicPriority;
  status: ComplaintStatus;
  targetPortal: TargetPortal;
  department: string;
  departmentTamil: string;
  location: ComplaintLocation;
  submittedBy: {
    name: string;
    phone: string;
    isAnonymous: boolean;
    userId: string;
  };
  assignedOfficer: {
    name: string;
    role: string;
    contact: string;
    department: string;
  };
  governmentBranch?: GovernmentBranch;
  createdAt: string;
  updatedAt: string;
  slaHours: number;
  slaDeadline: string;
  slaBreached: boolean;
  upvotes: number;
  hasUpvoted?: boolean;
  timeline: ComplaintTimelineEntry[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
  ward?: string;
  zone?: string;
  department?: string;
  badge?: string;
}

export interface NotificationItem {
  id: string;
  complaintId: string;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  type: 'status_change' | 'sla_warning' | 'resolution' | 'assignment';
}

export interface WardMetric {
  ward: string;
  zone: string;
  totalComplaints: number;
  resolvedComplaints: number;
  pendingComplaints: number;
  avgResolutionHours: number;
  slaComplianceRate: number;
}
