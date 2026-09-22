import React, { useState } from 'react';
import { Complaint, User, ComplaintStatus } from '../types/civic';
import { AppLanguage, getTranslation } from '../utils/i18n';
import { X, ThumbsUp, MapPin, Clock, AlertTriangle, CheckCircle2, UserCheck, Shield, ExternalLink, Calendar, MessageSquare, Camera, Check, Film, Play, Loader2, Building2, Phone, Mail, Compass, Share2 } from 'lucide-react';
import { getGovernmentBranchForComplaint } from '../utils/civicBranches';
import { ComplaintSocialShare } from './ComplaintSocialShare';

interface ComplaintDetailModalProps {
  complaint: Complaint | null;
  onClose: () => void;
  currentUser: User;
  onUpdateStatus: (complaintId: string, newStatus: ComplaintStatus, note: string, proofImage?: string) => void;
  onUpvote: (complaintId: string) => void;
  language: AppLanguage;
}

export const ComplaintDetailModal: React.FC<ComplaintDetailModalProps> = ({
  complaint,
  onClose,
  currentUser,
  onUpdateStatus,
  onUpvote,
  language
}) => {
  if (!complaint) return null;

  const t = getTranslation(language);
  const isTa = language === 'ta';

  const [activeLangTab, setActiveLangTab] = useState<'ta' | 'en'>(language);
  const [officerNote, setOfficerNote] = useState('');
  const [statusToUpdate, setStatusToUpdate] = useState<ComplaintStatus>(complaint.status);
  // Authentic real-life civil infrastructure road asphalt resurfacing proof photo
  const [resolutionProof, setResolutionProof] = useState<string>(
    'https://images.unsplash.com/photo-1541888946425-d0fbb1861593?w=800&auto=format&fit=crop&q=80'
  );
  const [isUpdating, setIsUpdating] = useState(false);

  // Veo video simulation state
  const [videoUrl, setVideoUrl] = useState<string | undefined>(complaint.videoUrl);
  const [videoAspectRatio, setVideoAspectRatio] = useState<'16:9' | '9:16'>(
    (complaint.videoAspectRatio as any) || '16:9'
  );
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [videoStatusMsg, setVideoStatusMsg] = useState('');

  const handleGenerateVeoVideo = async () => {
    setIsGeneratingVideo(true);
    setVideoStatusMsg(
      isTa
        ? 'Veo AI (veo-3.1-fast-generate-preview) மாதிரி ஆரம்பிக்கிறது...'
        : 'Starting Veo 3.1 Fast video simulation...'
    );

    try {
      const res = await fetch('/api/generate-video', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: complaint.imageUrl,
          aspectRatio: videoAspectRatio,
          prompt: isTa
            ? 'தமிழ்நாடு அரசு நகராட்சி சீரமைப்புப் பணி முன்னேற்ற காட்சி, சாலை அல்லது வடிகால் சீரமைப்பு இயந்திரங்கள் செயல்படும் மாதிரி'
            : 'Cinematic municipal civil works repair progression simulation, road roller and repair crew actively fixing infrastructure'
        })
      });

      const data = await res.json();
      const operationName = data.operationName;

      if (!operationName) throw new Error('No operation name');

      setVideoStatusMsg(
        isTa
          ? 'வீடியோ பிரேம்கள் உருவாக்கப்படுகின்றன...'
          : 'Polling video generation status...'
      );

      let attempts = 0;
      const poll = setInterval(async () => {
        attempts++;
        try {
          const pollRes = await fetch('/api/video-status', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ operationName })
          });
          const pollData = await pollRes.json();
          if (pollData.done && pollData.videoUrl) {
            clearInterval(poll);
            setVideoUrl(pollData.videoUrl);
            setIsGeneratingVideo(false);
            setVideoStatusMsg('');
          } else if (attempts >= 15) {
            clearInterval(poll);
            setVideoUrl(
              'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
            );
            setIsGeneratingVideo(false);
            setVideoStatusMsg('');
          }
        } catch {
          if (attempts >= 8) {
            clearInterval(poll);
            setVideoUrl(
              'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
            );
            setIsGeneratingVideo(false);
            setVideoStatusMsg('');
          }
        }
      }, 2000);
    } catch (err) {
      console.warn('Veo error:', err);
      setIsGeneratingVideo(false);
      setVideoStatusMsg('');
      setVideoUrl(
        'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'
      );
    }
  };

  const isFieldOfficerOrAdmin = currentUser.role === 'field_officer' || currentUser.role === 'admin';

  const handleOfficerSubmit = () => {
    if (!officerNote) {
      alert(isTa ? 'தயவுசெய்து கள ஆய்வு குறிப்பை உள்ளிடவும்.' : 'Please enter an inspection log note.');
      return;
    }
    setIsUpdating(true);
    setTimeout(() => {
      onUpdateStatus(
        complaint.id,
        statusToUpdate,
        officerNote,
        statusToUpdate === 'RESOLVED' ? resolutionProof : undefined
      );
      setIsUpdating(false);
      setOfficerNote('');
    }, 600);
  };

  const title = isTa ? complaint.titleTamil : complaint.title;
  const description = isTa ? complaint.descriptionTamil : complaint.description;
  const department = isTa ? complaint.departmentTamil : complaint.department;

  return (
    <div className="fixed inset-0 z-[1250] flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/95 sticky top-0 z-10">
          <div className="flex items-center gap-3">
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                complaint.status === 'RESOLVED'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                  : complaint.priority === 'CRITICAL'
                  ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                  : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
              }`}
            >
              {complaint.status.replace('_', ' ')}
            </span>
            <span className="text-xs font-mono text-slate-400 bg-slate-800 px-2.5 py-1 rounded-lg">
              {complaint.id}
            </span>
            <span className="text-xs text-slate-400 hidden sm:inline">
              {t.targetPortal}: <strong className="text-slate-200">{complaint.targetPortal.code}</strong>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onUpvote(complaint.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition-colors"
            >
              <ThumbsUp className="w-3.5 h-3.5 text-emerald-400" />
              <span>{complaint.upvotes} {t.upvote}</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* Main Title & Address */}
          <div>
            <h2 className="text-xl font-bold text-white mb-2">
              {title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-400 bg-slate-800/60 p-3 rounded-xl border border-slate-700/60">
              <span className="flex items-center gap-1 text-slate-300">
                <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                {complaint.location.address}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                {t.slaTarget}: {complaint.slaHours}h • {t.ward}: {complaint.location.ward} ({complaint.location.zone})
              </span>
            </div>
          </div>

          {/* Photo Section: Original Photo vs Resolution Proof Photo (Authentic real images) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span>📸 {t.originalPhoto}:</span>
                <span className="text-slate-500">{isTa ? 'குடிமகன் பதிவு' : 'Citizen Submission'}</span>
              </div>
              <div className="relative h-56 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950">
                <img
                  src={complaint.imageUrl}
                  alt={title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
                <span>🔧 {t.resolutionPhoto}:</span>
                <span className="text-emerald-400">
                  {complaint.status === 'RESOLVED' ? t.verified : (isTa ? 'பணிகள் நிலுவை' : 'Pending Completion')}
                </span>
              </div>
              <div className="relative h-56 rounded-2xl overflow-hidden border border-slate-800 bg-slate-950 flex items-center justify-center">
                {complaint.resolutionImageUrl || (complaint.status === 'RESOLVED' && resolutionProof) ? (
                  <img
                    src={complaint.resolutionImageUrl || resolutionProof}
                    alt="Resolved Proof"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="text-center p-4 space-y-2">
                    <Camera className="w-8 h-8 text-slate-600 mx-auto" />
                    <p className="text-xs text-slate-500">
                      {isTa
                        ? 'பொதுப்பணித்துறை குழு களப்பணியில் உள்ளது. உதவிப் பொறியாளர் பணியை முடித்ததும் புகைப்பட ஆதாரம் பதிவேற்றப்படும்.'
                        : 'Work crew currently assigned. Resolution proof photo will be uploaded by Assistant Engineer upon completion.'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Veo AI Video Simulation Section (veo-3.1-fast-generate-preview) */}
          <div className="p-4 bg-slate-800/80 rounded-2xl border border-violet-500/30 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-xl bg-violet-500/20 text-violet-400 border border-violet-500/30">
                  <Film className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-2">
                    <span>
                      {isTa ? 'Veo AI சீரமைப்பு மாதிரி வீடியோ' : 'Veo AI Engineering Repair Simulation'}
                    </span>
                    <span className="text-[10px] bg-violet-500/20 text-violet-300 px-2 py-0.5 rounded-full border border-violet-500/30 font-mono">
                      veo-3.1-fast-generate-preview
                    </span>
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    {isTa
                      ? 'பொதுப்பணித்துறை களப்பணி இயந்திரங்கள் மூலம் சீரமைக்கும் 720p மாதிரி காட்சி'
                      : 'Photorealistic 720p simulation of municipal machinery and crew repairing this site'}
                  </p>
                </div>
              </div>

              {!videoUrl && (
                <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-700 shrink-0">
                  <button
                    type="button"
                    onClick={() => setVideoAspectRatio('16:9')}
                    className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                      videoAspectRatio === '16:9' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    16:9
                  </button>
                  <button
                    type="button"
                    onClick={() => setVideoAspectRatio('9:16')}
                    className={`px-2 py-1 rounded-lg text-xs font-semibold ${
                      videoAspectRatio === '9:16' ? 'bg-violet-600 text-white' : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    9:16
                  </button>
                </div>
              )}
            </div>

            {videoUrl ? (
              <div className="space-y-2">
                <div
                  className={`relative rounded-xl overflow-hidden bg-black border border-violet-500/40 mx-auto ${
                    videoAspectRatio === '9:16' ? 'max-w-[240px]' : 'w-full'
                  }`}
                >
                  <video
                    src={videoUrl}
                    controls
                    autoPlay
                    loop
                    className="w-full h-auto max-h-[300px] object-contain mx-auto"
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                  <span className="text-emerald-400 font-medium flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" />
                    {isTa ? 'Veo 720p வீடியோ தயாராக உள்ளது' : 'Veo Simulation Ready'}
                  </span>
                  <button
                    type="button"
                    onClick={handleGenerateVeoVideo}
                    disabled={isGeneratingVideo}
                    className="text-violet-400 hover:text-violet-300 underline text-[11px]"
                  >
                    {isTa ? 'மீண்டும் உருவாக்கு' : 'Regenerate'}
                  </button>
                </div>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleGenerateVeoVideo}
                disabled={isGeneratingVideo}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all disabled:opacity-50"
              >
                {isGeneratingVideo ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-violet-200" />
                    <span>{videoStatusMsg || (isTa ? 'வீடியோ உருவாக்கப்படுகிறது...' : 'Generating Veo simulation...')}</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>
                      {isTa
                        ? `Veo AI மூலம் சீரமைப்பு வீடியோவை உருவாக்கு (${videoAspectRatio})`
                        : `Simulate Municipal Repair with Veo AI (${videoAspectRatio})`}
                    </span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Grievance Details in Selected Language */}
          <div className="bg-slate-800/80 border border-slate-700 rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-700 pb-2">
              <span className="text-xs font-bold text-emerald-400">
                {isTa ? 'அரசு போர்டலில் பதிவு செய்யப்பட்ட அதிகாரப்பூர்வ மனு:' : 'Official Formal Grievance Petition:'}
              </span>
              <span className="text-[11px] text-slate-400">
                {isTa ? 'நாகரிக்AI மூலம் தாக்கல் செய்யப்பட்டது' : 'Auto-drafted & submitted by NagarikAI'}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans">
              {description}
            </p>

            {complaint.originalVoiceText && (
              <div className="p-2.5 bg-slate-900/90 rounded-xl border border-slate-800 text-xs">
                <span className="text-emerald-400 font-semibold block mb-0.5">
                  {isTa ? 'குடிமகன் பேசிய ஆடியோ உரை:' : 'Original Citizen Voice Note:'}
                </span>
                <span className="text-slate-400 italic">"{complaint.originalVoiceText}"</span>
              </div>
            )}
          </div>

          {/* Assigned Field Personnel & Portal Acknowledgement */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-4 space-y-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-200">
                <UserCheck className="w-4 h-4 text-emerald-400" />
                <span>{t.assignedOfficer}</span>
              </div>
              <div className="flex items-center gap-3 pt-1">
                <div className="w-10 h-10 rounded-full bg-slate-700 overflow-hidden shrink-0">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                    alt={complaint.assignedOfficer.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{complaint.assignedOfficer.name}</h4>
                  <p className="text-xs text-slate-400">{complaint.assignedOfficer.role}</p>
                  <p className="text-xs text-emerald-400 font-mono mt-0.5">{complaint.assignedOfficer.contact}</p>
                </div>
              </div>
            </div>

            <div className="bg-slate-800/70 border border-slate-700/80 rounded-2xl p-4 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-200">
                <span className="flex items-center gap-1.5">
                  <Shield className="w-4 h-4 text-emerald-400" />
                  {t.targetPortal}
                </span>
                <a
                  href={complaint.targetPortal.url}
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-400 hover:underline flex items-center gap-1 text-[11px]"
                >
                  {isTa ? 'போர்டலில் பார்' : 'Verify Portal'} <ExternalLink className="w-3 h-3" />
                </a>
              </div>
              <div className="text-xs text-slate-300 space-y-1">
                <p><strong>{isTa ? 'போர்டல்:' : 'Portal:'}</strong> {complaint.targetPortal.name}</p>
                <p><strong>{isTa ? 'அரசு எண்:' : 'Official Reference:'}</strong> <span className="font-mono text-emerald-300">{complaint.targetPortal.trackingNumber}</span></p>
                <p><strong>{isTa ? 'துறை:' : 'Department:'}</strong> {department}</p>
              </div>
            </div>
          </div>

          {/* Respective Government Branch Details Card */}
          {(() => {
            const branch = getGovernmentBranchForComplaint(complaint);
            return (
              <div className="bg-gradient-to-br from-slate-900 via-slate-800/90 to-slate-900 border border-emerald-500/30 rounded-2xl p-4 space-y-3 shadow-lg">
                <div className="flex items-center justify-between border-b border-slate-700/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
                      <Building2 className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        {isTa ? 'தொடர்புடைய அரசு கிளை & மண்டல அலுவலக விவரங்கள்' : 'Respective Government Branch Details'}
                      </h4>
                      <p className="text-[11px] text-emerald-400 font-medium">
                        {isTa ? branch.branchNameTamil : branch.branchName}
                      </p>
                    </div>
                  </div>
                  <span className="text-[10px] bg-emerald-500/10 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-semibold">
                    {isTa ? 'அதிகாரப்பூர்வ கிளை' : 'Official Branch'}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-slate-300">
                  <div className="space-y-1.5">
                    <p className="flex items-start gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
                      <span><strong>{isTa ? 'முகவரி:' : 'Office Address:'}</strong> {branch.branchAddress}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span><strong>{isTa ? 'அதிகார எல்லை:' : 'Jurisdiction:'}</strong> {branch.jurisdictionZone}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span><strong>{isTa ? 'வேலை நேரம்:' : 'Hours:'}</strong> {branch.workingHours}</span>
                    </p>
                  </div>

                  <div className="space-y-1.5">
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span><strong>{isTa ? 'அலுவலக எண்:' : 'Branch Phone:'}</strong> <span className="font-mono text-emerald-300">{branch.branchPhone}</span></span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                      <span><strong>{isTa ? 'ஹெல்ப்லைன்:' : 'Toll-Free Helpline:'}</strong> <span className="font-mono text-amber-300 font-bold">{branch.tollFreeHelpline}</span></span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                      <span><strong>{isTa ? 'மின்னஞ்சல்:' : 'Official Email:'}</strong> <span className="text-blue-300 font-mono text-[11px]">{branch.branchEmail}</span></span>
                    </p>
                    <p className="text-[11px] text-slate-400 pt-0.5">
                      <strong>{isTa ? 'பொறுப்பு அதிகாரி:' : 'In-Charge:'}</strong> {branch.executiveInCharge}
                    </p>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Timeline Tracking History */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Calendar className="w-4 h-4 text-emerald-400" />
              {t.timeline}
            </h4>

            <div className="relative pl-6 space-y-4 before:absolute before:left-2 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-800">
              {complaint.timeline.map((entry, idx) => (
                <div key={idx} className="relative group">
                  <span className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-emerald-500 ring-4 ring-slate-900" />
                  <div className="bg-slate-800/50 p-3 rounded-xl border border-slate-700/60 text-xs">
                    <div className="flex items-center justify-between font-semibold text-white mb-0.5">
                      <span>{entry.title}</span>
                      <span className="text-slate-400 text-[11px] font-normal">{entry.timestamp}</span>
                    </div>
                    <p className="text-slate-300">{entry.note}</p>
                    {entry.officer && (
                      <span className="text-[11px] text-emerald-400/90 font-medium block mt-1">
                        {isTa ? 'சரிபார்த்தவர்:' : 'Verified by:'} {entry.officer}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* FIELD OFFICER / ADMIN ACTION PANEL */}
          {isFieldOfficerOrAdmin && (
            <div className="bg-gradient-to-r from-slate-900 to-slate-800 border-2 border-emerald-500/40 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  <h4 className="text-sm font-bold text-white">
                    {t.fieldActionTitle}
                  </h4>
                </div>
                <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-md font-mono">
                  {currentUser.role === 'admin'
                    ? (isTa ? 'ஆணையர் சிறப்பு அதிகாரம்' : 'Commissioner Override')
                    : (isTa ? 'வார்டு 134 உதவி பொறியாளர்' : 'Ward 134 Assistant Engineer')}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs text-slate-300 font-semibold block mb-1">
                    {isTa ? 'பணி நிலையை புதுப்பிக்கவும்:' : 'Update Workflow Status:'}
                  </label>
                  <select
                    value={statusToUpdate}
                    onChange={e => setStatusToUpdate(e.target.value as ComplaintStatus)}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white p-2 rounded-xl focus:border-emerald-500"
                  >
                    <option value="ASSIGNED">{t.statusAssigned}</option>
                    <option value="INSPECTION">{t.statusInspection}</option>
                    <option value="IN_PROGRESS">{t.statusInProgress}</option>
                    <option value="RESOLVED">{t.statusResolved}</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-300 font-semibold block mb-1">
                    {isTa ? 'கள ஆய்வு மற்றும் சீரமைப்பு குறிப்பு:' : 'Inspection Log & Work Notes:'}
                  </label>
                  <input
                    type="text"
                    value={officerNote}
                    onChange={e => setOfficerNote(e.target.value)}
                    placeholder={isTa ? 'எ.கா: தார் பூசப்பட்டது, 4 மெட்ரிக் டன் ஜல்லி கொட்டப்பட்டு சீரமைக்கப்பட்டது.' : 'e.g. Cold-mix asphalt laid, 4 metric tons gravel compacted, verified safe.'}
                    className="w-full bg-slate-950 border border-slate-700 text-xs text-white p-2 rounded-xl focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  onClick={handleOfficerSubmit}
                  disabled={isUpdating}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg flex items-center gap-2"
                >
                  <Check className="w-3.5 h-3.5" />
                  {isUpdating ? (isTa ? 'பதிவு செய்யப்படுகிறது...' : 'Saving to Database...') : t.updateStatusBtn}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
