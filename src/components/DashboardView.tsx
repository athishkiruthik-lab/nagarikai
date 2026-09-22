import React, { useState } from 'react';
import { Complaint, CivicCategory, CivicPriority, ComplaintStatus, User } from '../types/civic';
import { AppLanguage, getTranslation } from '../utils/i18n';
import {
  Search, Filter, MapPin, Clock, ThumbsUp, ArrowRight,
  Shield, CheckCircle2, AlertTriangle, Eye, Sparkles, UserCheck, Plus, Building2
} from 'lucide-react';

interface DashboardViewProps {
  complaints: Complaint[];
  onSelectComplaint: (complaint: Complaint) => void;
  onUpvote: (complaintId: string) => void;
  currentUser: User;
  onOpenAIIntake: () => void;
  language: AppLanguage;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  complaints,
  onSelectComplaint,
  onUpvote,
  currentUser,
  onOpenAIIntake,
  language
}) => {
  const t = getTranslation(language);
  const isTa = language === 'ta';

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<CivicCategory | 'all'>('all');
  const [selectedPriority, setSelectedPriority] = useState<CivicPriority | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<ComplaintStatus | 'all'>('all');

  // Filter complaints
  const filtered = complaints.filter(c => {
    if (selectedCategory !== 'all' && c.category !== selectedCategory) return false;
    if (selectedPriority !== 'all' && c.priority !== selectedPriority) return false;
    if (selectedStatus !== 'all' && c.status !== selectedStatus) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchesText =
        c.title.toLowerCase().includes(q) ||
        c.titleTamil.toLowerCase().includes(q) ||
        c.id.toLowerCase().includes(q) ||
        c.location.address.toLowerCase().includes(q) ||
        c.department.toLowerCase().includes(q) ||
        c.targetPortal.name.toLowerCase().includes(q);
      if (!matchesText) return false;
    }
    return true;
  });

  // Calculate live numbers
  const totalCount = complaints.length;
  const inProgressCount = complaints.filter(c => c.status === 'IN_PROGRESS' || c.status === 'INSPECTION').length;
  const pendingCount = complaints.filter(c => c.status === 'SUBMITTED' || c.status === 'ASSIGNED').length;
  const resolvedCount = complaints.filter(c => c.status === 'RESOLVED').length;

  return (
    <div className="space-y-6">
      {/* Overview Stat Counters */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Total */}
        <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-3xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-2xl group-hover:bg-blue-500/20 transition-all" />
          <span className="text-xs font-semibold text-slate-400">{t.totalGrievances}</span>
          <div className="text-3xl font-black text-white mt-1">{totalCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">
            {isTa ? 'அனைத்து வார்டுகளின் பதிவுகள்' : 'Multi-ward civic reports logged'}
          </p>
        </div>

        {/* Action Underway */}
        <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-3xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all" />
          <span className="text-xs font-semibold text-slate-400">{t.inProgress}</span>
          <div className="text-3xl font-black text-amber-400 mt-1">{inProgressCount}</div>
          <p className="text-[11px] text-amber-400/90 mt-1">
            {isTa ? 'கள சீரமைப்பு பணிகள் தீவிரம்' : 'Ground physical works active'}
          </p>
        </div>

        {/* Pending Verification */}
        <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-3xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500/10 rounded-full blur-2xl group-hover:bg-rose-500/20 transition-all" />
          <span className="text-xs font-semibold text-slate-400">{t.pendingAssignment}</span>
          <div className="text-3xl font-black text-rose-400 mt-1">{pendingCount}</div>
          <p className="text-[11px] text-slate-400 mt-1">
            {isTa ? 'அதிகாரி ஆய்வு நிலுவை' : 'Within mandated SLA window'}
          </p>
        </div>

        {/* Resolved */}
        <div className="bg-slate-900 border border-slate-800 p-4 sm:p-5 rounded-3xl shadow-lg relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:bg-emerald-500/20 transition-all" />
          <span className="text-xs font-semibold text-slate-400">{t.resolvedComplaints}</span>
          <div className="text-3xl font-black text-emerald-400 mt-1">{resolvedCount}</div>
          <p className="text-[11px] text-emerald-400/90 mt-1">
            {isTa ? 'புகைப்பட ஆதாரத்துடன் தீர்க்கப்பட்டது' : 'Verified with proof photo'}
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-slate-900 border border-slate-800 p-4 rounded-3xl shadow-xl space-y-3">
        <div className="flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Search Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder={t.searchPlaceholder}
              className="w-full bg-slate-800/80 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
            />
          </div>

          {/* Quick Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
            {[
              { id: 'all', label: t.categoryAll },
              { id: 'roads', label: `🛣️ ${t.catRoads}` },
              { id: 'sanitation', label: `🗑️ ${t.catSanitation}` },
              { id: 'electricity', label: `⚡ ${t.catElectricity}` },
              { id: 'water', label: `💧 ${t.catWater}` },
              { id: 'safety', label: `⚠️ ${t.catSafety}` },
              { id: 'traffic', label: `🚦 ${t.catTraffic}` },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`text-xs px-3 py-1.5 rounded-xl font-medium transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                    : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Priority and Status Filters */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-slate-800/80 text-xs">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">{isTa ? 'முன்னுரிமை:' : 'Priority:'}</span>
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'all', label: t.priorityAll },
                { id: 'CRITICAL', label: `🔴 ${t.prioCritical}` },
                { id: 'HIGH', label: `🟠 ${t.prioHigh}` },
                { id: 'MEDIUM', label: `🟡 ${t.prioMedium}` },
                { id: 'LOW', label: `🔵 ${t.prioLow}` },
              ].map(p => (
                <button
                  key={p.id}
                  onClick={() => setSelectedPriority(p.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    selectedPriority === p.id
                      ? 'bg-slate-700 text-white ring-1 ring-emerald-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-semibold">{isTa ? 'நிலை:' : 'Status:'}</span>
            <div className="flex flex-wrap gap-1">
              {[
                { id: 'all', label: t.statusAll },
                { id: 'SUBMITTED', label: t.statusSubmitted },
                { id: 'IN_PROGRESS', label: t.statusInProgress },
                { id: 'RESOLVED', label: t.statusResolved },
              ].map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedStatus(s.id as any)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all ${
                    selectedStatus === s.id
                      ? 'bg-slate-700 text-white ring-1 ring-emerald-400'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Grievance Feed Card Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map(complaint => {
          const isResolved = complaint.status === 'RESOLVED';
          const isCritical = complaint.priority === 'CRITICAL';
          const title = isTa ? complaint.titleTamil : complaint.title;
          const description = isTa ? complaint.descriptionTamil : complaint.description;

          return (
            <div
              key={complaint.id}
              className="bg-slate-900 border border-slate-800/90 rounded-3xl overflow-hidden shadow-xl hover:border-slate-700 transition-all flex flex-col group cursor-pointer"
              onClick={() => onSelectComplaint(complaint)}
            >
              {/* Photo Banner with Real Documentary Photos */}
              <div className="relative h-48 w-full overflow-hidden bg-slate-950">
                <img
                  src={complaint.imageUrl}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Status Badges Overlay */}
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span
                    className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider backdrop-blur-md shadow-md ${
                      isResolved
                        ? 'bg-emerald-600/90 text-white'
                        : isCritical
                        ? 'bg-rose-600/90 text-white animate-pulse'
                        : 'bg-amber-600/90 text-white'
                    }`}
                  >
                    {isResolved ? t.statusResolved : isCritical ? t.prioCritical : complaint.status.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-mono bg-slate-950/80 backdrop-blur-md text-emerald-400 px-2 py-0.5 rounded-full border border-slate-700">
                    {complaint.targetPortal.code}
                  </span>
                </div>

                {/* Upvotes button on photo */}
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onUpvote(complaint.id);
                  }}
                  className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-950/80 backdrop-blur-md text-white text-xs font-semibold hover:bg-slate-900 border border-slate-700 shadow-lg"
                >
                  <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{complaint.upvotes}</span>
                </button>
              </div>

              {/* Content Body: Cleanly in EITHER Tamil OR English */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-sm font-bold text-white line-clamp-2 group-hover:text-emerald-400 transition-colors">
                    {title}
                  </h3>
                  <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                    {description}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-800/80 text-xs">
                  {/* Location */}
                  <div className="flex items-center gap-2 text-slate-300">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{complaint.location.address}</span>
                  </div>

                  {/* Government Branch */}
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-medium truncate">
                    <Building2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">
                      {isTa
                        ? (complaint.governmentBranch?.branchNameTamil || complaint.departmentTamil || complaint.department)
                        : (complaint.governmentBranch?.branchName || complaint.department)}
                    </span>
                  </div>

                  {/* Officer & SLA */}
                  <div className="flex items-center justify-between text-slate-400 pt-1">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-400" />
                      SLA: {complaint.slaHours}h {t.hours}
                    </span>
                    <span className="text-slate-300 font-medium">
                      {complaint.assignedOfficer.name.split(' ')[0]} ({isTa ? 'பொறியாளர்' : 'AE'})
                    </span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16 bg-slate-900 border border-slate-800 rounded-3xl p-8 space-y-4">
          <div className="w-16 h-16 rounded-full bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
            <Search className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-white">
            {isTa ? 'புகார்கள் எதுவும் பொருந்தவில்லை' : 'No complaints match your filter'}
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            {isTa
              ? 'தேடல் சொல் அல்லது வடிகட்டிகளை மாற்றி மீண்டும் முயற்சிக்கவும்.'
              : 'Try adjusting your search keywords, category pills, or priority status.'}
          </p>
          <button
            onClick={onOpenAIIntake}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg"
          >
            {t.fileComplaintBtn}
          </button>
        </div>
      )}
    </div>
  );
};
