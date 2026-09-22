import React, { useState, useEffect, useMemo } from 'react';
import { Complaint, User, NotificationItem, CivicCategory, CivicPriority, ComplaintStatus } from './types/civic';
import { INITIAL_COMPLAINTS, INITIAL_USERS, INITIAL_NOTIFICATIONS } from './data/seedComplaints';
import { AppLanguage, getTranslation } from './utils/i18n';
import { Header } from './components/Header';
import { DashboardView } from './components/DashboardView';
import { GisCityMap } from './components/GisCityMap';
import { AnalyticsView } from './components/AnalyticsView';
import { AICivicAssistant } from './components/AICivicAssistant';
import { AIComplaintIntakeModal } from './components/AIComplaintIntakeModal';
import { ComplaintDetailModal } from './components/ComplaintDetailModal';
import { ApiKeyExplanationModal } from './components/ApiKeyExplanationModal';
import { getNext30SecondCivicUpdate } from './utils/realTimeCivicStream';
import { calculateInfrastructureUrgencyIndex } from './utils/civicBranches';
import {
  LayoutDashboard, Map, BarChart3, Plus, Sparkles, Smartphone,
  Monitor, Shield, Bell, CheckCircle2, ChevronRight, Mic, Bot,
  AlertTriangle, Radio, X
} from 'lucide-react';

export default function App() {
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USERS[0]);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  
  // Explicit Language Selection: 'en' or 'ta'
  const [language, setLanguage] = useState<AppLanguage>('en');
  const t = getTranslation(language);
  const isTa = language === 'ta';

  // Navigation View
  const [activeView, setActiveView] = useState<'dashboard' | 'map' | 'assistant' | 'analytics'>('dashboard');

  // Modals
  const [isAIIntakeOpen, setIsAIIntakeOpen] = useState(false);
  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);
  const [isApiKeyModalOpen, setIsApiKeyModalOpen] = useState(false);

  // Platform Display Mode (Windows Desktop vs Android Native simulator)
  const [platformMode, setPlatformMode] = useState<'windows' | 'android'>('windows');

  // Map filters state shared with map
  const [mapCategoryFilter, setMapCategoryFilter] = useState<CivicCategory | 'all'>('all');
  const [mapPriorityFilter, setMapPriorityFilter] = useState<CivicPriority | 'all'>('all');
  const [mapStatusFilter, setMapStatusFilter] = useState<ComplaintStatus | 'all'>('all');

  // AI-calculated Infrastructure Urgency Index for user's neighborhood
  const neighborhoodUrgency = useMemo(() => {
    return calculateInfrastructureUrgencyIndex(
      complaints,
      currentUser.zone || 'Zone 10 (Kodambakkam)',
      currentUser.ward || 'Ward 134'
    );
  }, [complaints, currentUser.zone, currentUser.ward]);

  // Real-time live data stream: cycles every 30 seconds
  const [liveToast, setLiveToast] = useState<{
    id: string;
    title: string;
    description: string;
    type: 'new_complaint' | 'status_update' | 'resolution';
  } | null>(null);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Live (30s Sync)');

  useEffect(() => {
    const streamInterval = setInterval(() => {
      const update = getNext30SecondCivicUpdate();
      setComplaints(update.updatedComplaints);
      setNotifications(prev => [update.newNotification, ...prev]);

      const toastTitle = isTa ? update.toastMessage.titleTamil : update.toastMessage.title;
      const toastDesc = isTa ? update.toastMessage.descriptionTamil : update.toastMessage.description;

      const toastId = `toast-${Date.now()}`;
      setLiveToast({
        id: toastId,
        title: toastTitle,
        description: toastDesc,
        type: update.toastMessage.type
      });
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));

      // Auto dismiss after 7 seconds
      setTimeout(() => {
        setLiveToast(curr => (curr?.id === toastId ? null : curr));
      }, 7000);
    }, 30000);

    return () => clearInterval(streamInterval);
  }, [isTa]);

  // Handle new complaint submitted by AI Agent
  const handleComplaintSubmitted = (newComplaint: Complaint) => {
    setComplaints(prev => [newComplaint, ...prev]);

    // Push real-time notification
    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      complaintId: newComplaint.id,
      title: isTa ? 'புதிய மனு பதிவு செய்யப்பட்டது' : 'New Grievance Registered',
      message: isTa
        ? `நாகரிக்AI ${newComplaint.id} மனுவை ${newComplaint.targetPortal.name}-ல் இணைத்துள்ளது.`
        : `AI Agent filed ticket ${newComplaint.id} to ${newComplaint.targetPortal.name} with ${newComplaint.slaHours}h SLA.`,
      timestamp: isTa ? 'இப்போது' : 'Just now',
      isRead: false,
      type: 'assignment'
    };
    setNotifications(prev => [newNotif, ...prev]);
  };

  // Upvote complaint
  const handleUpvote = (complaintId: string) => {
    setComplaints(prev =>
      prev.map(c => {
        if (c.id === complaintId) {
          const hasVoted = c.hasUpvoted;
          return {
            ...c,
            upvotes: hasVoted ? c.upvotes - 1 : c.upvotes + 1,
            hasUpvoted: !hasVoted
          };
        }
        return c;
      })
    );
  };

  // Field Officer / Admin status update
  const handleUpdateStatus = (
    complaintId: string,
    newStatus: ComplaintStatus,
    note: string,
    proofImage?: string
  ) => {
    setComplaints(prev =>
      prev.map(c => {
        if (c.id === complaintId) {
          const updatedTimeline = [
            ...c.timeline,
            {
              id: `t-${Date.now()}`,
              status: newStatus,
              title:
                newStatus === 'RESOLVED'
                  ? (isTa ? 'குறை தீர்க்கப்பட்டு சரிபார்க்கப்பட்டது' : 'Grievance Resolved & Verified')
                  : newStatus === 'IN_PROGRESS'
                  ? (isTa ? 'களப்பணிகள் நடைபெறுகின்றன' : 'Field Works Underway')
                  : (isTa ? 'அதிகாரி ஆய்வு செய்தார்' : 'Inspection Conducted'),
              timestamp: isTa ? 'இப்போது' : 'Just now',
              note,
              officer: currentUser.name,
              proofImage
            }
          ];

          return {
            ...c,
            status: newStatus,
            resolutionImageUrl: proofImage || c.resolutionImageUrl,
            updatedAt: new Date().toISOString(),
            timeline: updatedTimeline
          };
        }
        return c;
      })
    );

    // Add status notification
    const notif: NotificationItem = {
      id: `notif-${Date.now()}`,
      complaintId,
      title: isTa ? `நிலை புதுப்பிக்கப்பட்டது: ${newStatus}` : `Status Changed to ${newStatus.replace('_', ' ')}`,
      message: `${currentUser.name}: "${note}"`,
      timestamp: isTa ? 'இப்போது' : 'Just now',
      isRead: false,
      type: newStatus === 'RESOLVED' ? 'resolution' : 'status_change'
    };
    setNotifications(prev => [notif, ...prev]);

    // Update open modal state
    if (selectedComplaint && selectedComplaint.id === complaintId) {
      setSelectedComplaint(prev =>
        prev
          ? {
              ...prev,
              status: newStatus,
              resolutionImageUrl: proofImage || prev.resolutionImageUrl
            }
          : null
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Top Application Header */}
      <Header
        currentUser={currentUser}
        onSwitchUser={setCurrentUser}
        allUsers={INITIAL_USERS}
        notifications={notifications}
        onOpenNotifications={() => {}}
        onOpenAIIntake={() => setIsAIIntakeOpen(true)}
        platformMode={platformMode}
        onTogglePlatformMode={setPlatformMode}
        language={language}
        onLanguageChange={setLanguage}
        onOpenApiKeyInfo={() => setIsApiKeyModalOpen(true)}
      />

      {/* Main Container Wrapper - Conditional Android Frame or Full Desktop */}
      <main className="flex-1 flex justify-center p-3 sm:p-6 lg:p-8">
        <div
          className={`w-full transition-all duration-300 ${
            platformMode === 'android'
              ? 'max-w-[430px] bg-slate-900 border-[10px] border-slate-800 rounded-[48px] shadow-2xl overflow-hidden min-h-[840px] flex flex-col relative ring-1 ring-slate-700/50'
              : 'max-w-7xl'
          }`}
        >
          {/* ANDROID DEVICE PHONE HEADER IF IN ANDROID MODE */}
          {platformMode === 'android' && (
            <div className="bg-slate-950 px-6 py-2.5 flex items-center justify-between text-[11px] text-slate-400 border-b border-slate-800/80">
              <span className="font-bold text-white">9:41</span>
              <div className="w-4 h-4 rounded-full bg-slate-900 ring-2 ring-slate-800 mx-auto" />
              <div className="flex items-center gap-1.5 text-xs">
                <span>5G</span>
                <span className="w-5 h-2.5 border border-slate-400 rounded-sm p-0.5 flex items-center">
                  <span className="w-full h-full bg-emerald-400 rounded-2xs" />
                </span>
              </div>
            </div>
          )}

          {/* Main Navigation Subheader Bar */}
          <div className="px-4 py-3 bg-slate-900/60 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 sticky top-0 z-30 backdrop-blur-md">
            <div className="flex items-center gap-1.5 sm:gap-2">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeView === 'dashboard'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span>{t.feedTab}</span>
              </button>

              <button
                onClick={() => setActiveView('map')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeView === 'map'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Map className="w-3.5 h-3.5" />
                <span>{t.mapTab}</span>
              </button>

              <button
                onClick={() => setActiveView('assistant')}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeView === 'assistant'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Bot className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t.aiAssistantTab}</span>
              </button>

              {/* Analytics Tab with Notification Badge for Neighborhood Urgency Index Exceeding Critical Threshold */}
              <button
                onClick={() => setActiveView('analytics')}
                className={`relative flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  activeView === 'analytics'
                    ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <BarChart3 className="w-3.5 h-3.5" />
                <span>{t.analyticsTab}</span>
                {neighborhoodUrgency.isCritical && (
                  <span
                    title={
                      isTa
                        ? `அவசர எச்சரிக்கை: ${neighborhoodUrgency.ward} அவசர குறியீடு ${neighborhoodUrgency.score}/100!`
                        : `Critical Alert: ${neighborhoodUrgency.ward} Urgency Index is ${neighborhoodUrgency.score}/100 (Threshold > ${neighborhoodUrgency.threshold})!`
                    }
                    className="flex items-center gap-1 bg-rose-500 text-white text-[10px] font-black px-1.5 py-0.5 rounded-full animate-pulse shadow-md shadow-rose-500/50 ring-2 ring-rose-400/50"
                  >
                    <AlertTriangle className="w-2.5 h-2.5" />
                    <span>{neighborhoodUrgency.score}</span>
                  </span>
                )}
              </button>
            </div>

            {/* Quick Live Stream 30s Status Indicator */}
            <div className="hidden sm:flex items-center gap-2.5 text-xs text-slate-400 bg-slate-950/60 px-3 py-1.5 rounded-xl border border-slate-800/80">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-[11px] font-medium text-slate-300">
                {isTa ? '30 வினாடி நேரலை தரவு புதுப்பிப்பு' : 'Live Civic Stream (30s)'}
              </span>
              <span className="text-slate-600 font-mono">•</span>
              <span className="text-[10px] text-slate-400 font-mono">
                {lastSyncTime}
              </span>
            </div>
          </div>

          {/* Dynamic Content Views */}
          <div className="p-4 sm:p-6 flex-1 overflow-y-auto">
            {activeView === 'dashboard' && (
              <DashboardView
                complaints={complaints}
                onSelectComplaint={setSelectedComplaint}
                onUpvote={handleUpvote}
                currentUser={currentUser}
                onOpenAIIntake={() => setIsAIIntakeOpen(true)}
                language={language}
              />
            )}

            {activeView === 'map' && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-base font-bold text-white flex items-center gap-2">
                      <Map className="w-4 h-4 text-emerald-400" />
                      {isTa ? 'பெருநகர நேரலை ஜிஐஎஸ் வரைபடம்' : 'Live Metropolitan GIS Grievance Map'}
                    </h2>
                    <p className="text-xs text-slate-400">
                      {isTa
                        ? 'சென்னையின் அனைத்து வார்டுகளின் நிகழ்நேர புகார்கள் மற்றும் முடிவடைந்த பணிகளின் காட்சி'
                        : 'Real-time spatial visualization of active civic complaints and completed public works across Chennai'}
                    </p>
                  </div>
                </div>

                <GisCityMap
                  complaints={complaints}
                  selectedComplaint={selectedComplaint}
                  onSelectComplaint={setSelectedComplaint}
                  categoryFilter={mapCategoryFilter}
                  priorityFilter={mapPriorityFilter}
                  statusFilter={mapStatusFilter}
                  onCategoryFilterChange={setMapCategoryFilter}
                  onPriorityFilterChange={setMapPriorityFilter}
                  onStatusFilterChange={setMapStatusFilter}
                  language={language}
                />
              </div>
            )}

            {activeView === 'assistant' && (
              <AICivicAssistant
                complaints={complaints}
                currentUser={currentUser}
                onSelectComplaint={setSelectedComplaint}
                onOpenIntakeModal={() => setIsAIIntakeOpen(true)}
                language={language}
              />
            )}

            {activeView === 'analytics' && (
              <AnalyticsView
                complaints={complaints}
                language={language}
                neighborhoodZone={currentUser.zone}
                ward={currentUser.ward}
              />
            )}
          </div>

          {/* ANDROID FLOATING ACTION BUTTON & BOTTOM NAV BAR */}
          {platformMode === 'android' && (
            <div className="mt-auto bg-slate-950 border-t border-slate-800 p-2 flex items-center justify-around text-xs text-slate-400 sticky bottom-0 z-40">
              <button
                onClick={() => setActiveView('dashboard')}
                className={`flex flex-col items-center gap-1 py-1 ${activeView === 'dashboard' ? 'text-emerald-400 font-bold' : ''}`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span className="text-[10px]">{t.feedTab}</span>
              </button>

              <button
                onClick={() => setActiveView('map')}
                className={`flex flex-col items-center gap-1 py-1 ${activeView === 'map' ? 'text-emerald-400 font-bold' : ''}`}
              >
                <Map className="w-4 h-4" />
                <span className="text-[10px]">{t.mapTab}</span>
              </button>

              <button
                onClick={() => setIsAIIntakeOpen(true)}
                className="w-12 h-12 -mt-6 rounded-full bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/40 transform active:scale-95"
              >
                <Mic className="w-6 h-6" />
              </button>

              <button
                onClick={() => setActiveView('assistant')}
                className={`flex flex-col items-center gap-1 py-1 ${activeView === 'assistant' ? 'text-emerald-400 font-bold' : ''}`}
              >
                <Bot className="w-4 h-4" />
                <span className="text-[10px]">AI Bot</span>
              </button>

              <button
                onClick={() => setActiveView('analytics')}
                className={`relative flex flex-col items-center gap-1 py-1 ${activeView === 'analytics' ? 'text-emerald-400 font-bold' : ''}`}
              >
                <div className="relative">
                  <BarChart3 className="w-4 h-4" />
                  {neighborhoodUrgency.isCritical && (
                    <span className="absolute -top-1.5 -right-2.5 bg-rose-500 text-white text-[8px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center animate-pulse ring-1 ring-white">
                      !
                    </span>
                  )}
                </div>
                <span className="text-[10px]">Insights</span>
              </button>
            </div>
          )}
        </div>
      </main>

      {/* 30-Second Real-Time Civic Stream Notification Toast */}
      {liveToast && (
        <div className="fixed bottom-5 right-5 z-[1300] max-w-sm bg-slate-900/95 border border-emerald-500/40 text-white p-4 rounded-2xl shadow-2xl backdrop-blur-md animate-in slide-in-from-bottom-5 duration-300 flex items-start gap-3 ring-1 ring-emerald-500/20">
          <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0 mt-0.5">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                {isTa ? 'நேரலை புதுப்பிப்பு (30 விநாடி)' : 'Live Civic Stream (30s)'}
              </span>
              <button
                onClick={() => setLiveToast(null)}
                className="text-slate-400 hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <h4 className="text-xs font-bold text-white mt-0.5 leading-snug">{liveToast.title}</h4>
            <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">{liveToast.description}</p>
          </div>
        </div>
      )}

      {/* Why API Key Explanation Modal */}
      <ApiKeyExplanationModal
        isOpen={isApiKeyModalOpen}
        onClose={() => setIsApiKeyModalOpen(false)}
        language={language}
      />

      {/* AI Complaint Intake Modal */}
      <AIComplaintIntakeModal
        isOpen={isAIIntakeOpen}
        onClose={() => setIsAIIntakeOpen(false)}
        onComplaintSubmitted={handleComplaintSubmitted}
        currentUser={currentUser}
        language={language}
      />

      {/* Complaint Detailed Inspector Modal */}
      <ComplaintDetailModal
        complaint={selectedComplaint}
        onClose={() => setSelectedComplaint(null)}
        currentUser={currentUser}
        onUpdateStatus={handleUpdateStatus}
        onUpvote={handleUpvote}
        language={language}
      />
    </div>
  );
}
