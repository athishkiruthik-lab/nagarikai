import React, { useState, useMemo } from 'react';
import { Complaint } from '../types/civic';
import { AppLanguage } from '../utils/i18n';
import { getGovernmentBranchForComplaint } from '../utils/civicBranches';
import {
  Share2, Copy, Check, ExternalLink, QrCode, Mail,
  Send, Sparkles, AlertTriangle, Building2, Phone,
  FileText, ArrowUpRight, MessageCircle, Globe, Shield
} from 'lucide-react';

interface ComplaintSocialShareProps {
  complaint: Complaint;
  language: AppLanguage;
  onClose?: () => void;
  isCompactHeader?: boolean;
}

export const ComplaintSocialShare: React.FC<ComplaintSocialShareProps> = ({
  complaint,
  language,
  onClose,
  isCompactHeader = false
}) => {
  const isTa = language === 'ta';
  const branch = useMemo(() => getGovernmentBranchForComplaint(complaint), [complaint]);

  const [activeTab, setActiveTab] = useState<'standard' | 'compact' | 'tamil'>(
    isTa ? 'tamil' : 'standard'
  );
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedSummary, setCopiedSummary] = useState(false);
  const [showQrCode, setShowQrCode] = useState(false);

  // Generate canonical deep-link URL
  const deepLink = useMemo(() => {
    if (typeof window === 'undefined') return `https://nagarikai.gov.in/?complaintId=${complaint.id}`;
    const url = new URL(window.location.origin + window.location.pathname);
    url.searchParams.set('complaintId', complaint.id);
    return url.toString();
  }, [complaint.id]);

  // Comprehensive Citizen Alert Summary
  const standardSummary = useMemo(() => {
    return [
      `🚨 CITIZEN CIVIC ALERT | NagarikAI`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `📌 Issue: ${complaint.title}`,
      `📍 Location: ${complaint.location.address}`,
      `🏛️ Jurisdiction: ${complaint.location.zone}, Ward ${complaint.location.ward}`,
      `🏢 Department: ${complaint.department}`,
      `📑 Tracking ID: ${complaint.officialTracking.trackingNumber} (${complaint.targetPortal.name})`,
      `⏱️ SLA Target: ${complaint.slaHours} Hours | Priority: ${complaint.priority} | Status: ${complaint.status.replace('_', ' ')}`,
      ``,
      `📋 Citizen Report:`,
      `"${complaint.description}"`,
      ``,
      `🏛️ Responsible Branch:`,
      `• Office: ${branch.branchName}`,
      `• Address: ${branch.branchAddress}`,
      `• Helpline: ${branch.tollFreeHelpline} / ${branch.branchPhone}`,
      ``,
      `🗳️ Upvote & Track Live Resolution:`,
      `${deepLink}`,
      ``,
      `#NagarikAI #ChennaiCivic #GCC1913 #TANGEDCO #CMWSSB #CivicAccountability #TamilNadu`
    ].join('\n');
  }, [complaint, branch, deepLink]);

  // Compact / X (Twitter) Alert Summary (< 280 chars)
  const compactSummary = useMemo(() => {
    return `🚨 Civic Alert in Ward ${complaint.location.ward} (${complaint.location.zone}): ${complaint.title}. Tracking: ${complaint.officialTracking.trackingNumber} via ${complaint.targetPortal.code}. Urgent resolution required. Track & Upvote: ${deepLink} @chennaicorp @TANGEDCO_Offcl #NagarikAI #GCC1913`;
  }, [complaint, deepLink]);

  // Tamil Civic Alert Summary
  const tamilSummary = useMemo(() => {
    return [
      `🚨 குடிமக்கள் அவசர பொது அறிவிப்பு | நாகரிக்AI`,
      `━━━━━━━━━━━━━━━━━━━━━━━━━━━━`,
      `📌 பிரச்சனை: ${complaint.titleTamil || complaint.title}`,
      `📍 இடம்: ${complaint.location.address}`,
      `🏛️ மண்டலம்: ${complaint.location.zone}, வார்டு: ${complaint.location.ward}`,
      `🏢 துறை: ${complaint.departmentTamil || complaint.department}`,
      `📑 கண்காணிப்பு எண்: ${complaint.officialTracking.trackingNumber}`,
      `⏱️ நிர்ணயிக்கப்பட்ட நேரம்: ${complaint.slaHours} மணிநேரம் | தற்போதைய நிலை: ${complaint.status}`,
      ``,
      `📋 புகார் விபரம்:`,
      `"${complaint.descriptionTamil || complaint.description}"`,
      ``,
      `🏛️ சம்பந்தப்பட்ட அரசு கிளை & உதவி எண்:`,
      `• கிளை: ${branch.branchNameTamil || branch.branchName}`,
      `• முகவரி: ${branch.branchAddress}`,
      `• இலவச உதவி எண்: ${branch.tollFreeHelpline}`,
      ``,
      `🗳️ நேரலையாக கண்காணிக்கவும் ஆதரவளிக்கவும்:`,
      `${deepLink}`,
      ``,
      `#நாகரிக்AI #சென்னைமாநகராட்சி #GCC1913 #மின்வாரியம் #குடிநீர் #பொதுமக்கள்_மனு`
    ].join('\n');
  }, [complaint, branch, deepLink]);

  // Current active summary text
  const currentSummaryText = useMemo(() => {
    if (activeTab === 'tamil') return tamilSummary;
    if (activeTab === 'compact') return compactSummary;
    return standardSummary;
  }, [activeTab, tamilSummary, compactSummary, standardSummary]);

  // Copy Link Handler
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(deepLink);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2500);
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  };

  // Copy Summary Handler
  const handleCopySummary = async () => {
    try {
      await navigator.clipboard.writeText(currentSummaryText);
      setCopiedSummary(true);
      setTimeout(() => setCopiedSummary(false), 2500);
    } catch (err) {
      console.warn('Clipboard write failed:', err);
    }
  };

  // Native Share Handler
  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Civic Alert: ${complaint.title} (${complaint.id})`,
          text: currentSummaryText,
          url: deepLink
        });
      } catch (err) {
        // User cancelled or share failed
        console.log('Share dismissed');
      }
    } else {
      handleCopyLink();
    }
  };

  // External Platform Share URLs
  const shareLinks = useMemo(() => {
    const encodedText = encodeURIComponent(currentSummaryText);
    const encodedUrl = encodeURIComponent(deepLink);
    const encodedTitle = encodeURIComponent(`🚨 Civic Alert: ${complaint.title} (Ward ${complaint.location.ward})`);

    return {
      whatsapp: `https://api.whatsapp.com/send?text=${encodedText}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(compactSummary)}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      telegram: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(
        `🚨 ${complaint.title} (Ward ${complaint.location.ward}) - NagarikAI Grievance Tracker`
      )}`,
      email: `mailto:?subject=${encodedTitle}&body=${encodedText}`
    };
  }, [currentSummaryText, deepLink, complaint, compactSummary]);

  return (
    <div className="bg-gradient-to-br from-slate-900 via-slate-850 to-slate-900 border border-emerald-500/40 rounded-3xl p-5 sm:p-6 shadow-2xl space-y-5 ring-1 ring-emerald-500/20">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
            <Share2 className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-white">
                {isTa ? 'சமூக வலைதளப் பகிர்வு & விழிப்புணர்வு' : 'Social Amplification & Deep-Link Share'}
              </h3>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30 font-semibold uppercase">
                {isTa ? 'பொது விழிப்புணர்வு' : 'Public Awareness'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              {isTa
                ? 'பொதுமக்கள் பார்வையை ஈர்த்து விரைவான அரசு நடவடிக்கையை உறுதி செய்ய சமூக தளங்களில் பகிருங்கள்'
                : 'Share official deep-link and civic summaries across platforms to expedite government action'}
            </p>
          </div>
        </div>

        {/* Quick Native Device Share button */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleNativeShare}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{isTa ? 'நேரடி பகிர்வு' : 'Share Now'}</span>
          </button>
        </div>
      </div>

      {/* Deep-Link URL Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <label className="font-semibold text-slate-300 flex items-center gap-1.5">
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isTa ? 'நேரடி இணைப்பு (Canonical Deep-Link):' : 'Complaint Deep-Link URL:'}</span>
          </label>
          <span className="text-[11px] text-slate-400 font-mono">
            {complaint.id}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              readOnly
              value={deepLink}
              className="w-full bg-slate-950/90 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs font-mono text-emerald-300 select-all focus:outline-none focus:border-emerald-500/60"
            />
          </div>

          <button
            onClick={handleCopyLink}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold border transition-all shrink-0 ${
              copiedLink
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 shadow-md shadow-emerald-500/30'
                : 'bg-slate-800 hover:bg-slate-700 text-white border-slate-700'
            }`}
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                <span>{isTa ? 'இணைப்பு நகலெடுக்கப்பட்டது!' : 'Link Copied!'}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-emerald-400" />
                <span>{isTa ? 'இணைப்பை நகலெடு' : 'Copy Link'}</span>
              </>
            )}
          </button>

          <button
            onClick={() => setShowQrCode(!showQrCode)}
            title={isTa ? 'QR குறியீட்டை காட்டு' : 'Toggle QR Code for In-Person Sharing'}
            className={`p-2 rounded-xl border text-xs font-semibold transition-all ${
              showQrCode
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 border-slate-700'
            }`}
          >
            <QrCode className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Collapsible QR Code Panel for Neighborhood Poster / In-Person Scanning */}
      {showQrCode && (
        <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl flex flex-col sm:flex-row items-center gap-4 animate-in fade-in duration-200">
          <div className="bg-white p-2.5 rounded-xl shadow-md shrink-0">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                deepLink
              )}&format=svg&margin=2`}
              alt="Grievance Deep Link QR Code"
              className="w-32 h-32 object-contain"
              loading="lazy"
            />
          </div>
          <div className="space-y-1.5 text-xs text-center sm:text-left">
            <h4 className="font-bold text-white flex items-center justify-center sm:justify-start gap-1.5">
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>{isTa ? 'குடியிருப்போர் சங்க QR குறியீடு' : 'Resident Welfare Association (RWA) QR Code'}</span>
            </h4>
            <p className="text-slate-300 leading-relaxed text-[11px]">
              {isTa
                ? 'இந்த QR குறியீட்டை அச்சிட்டு உங்கள் பகுதியில் அல்லது குடியிருப்போர் அறிவிப்புப் பலகையில் ஒட்டலாம். பொதுமக்கள் தங்கள் கேமரா மூலம் ஸ்கேன் செய்து உடனடியாக ஆதரவளிக்கலாம்.'
                : 'Display or print this QR code for community notice boards and RWA meetings. Neighbors can scan directly with mobile cameras to view and upvote this ticket.'}
            </p>
            <p className="text-[10px] text-emerald-400 font-mono">
              Target: {complaint.officialTracking.trackingNumber}
            </p>
          </div>
        </div>
      )}

      {/* 1-Click Social Platform Sharing Grid */}
      <div className="space-y-2">
        <span className="text-xs font-semibold text-slate-300 block">
          {isTa ? 'ஒரே கிளிக்கில் பகிரவும்:' : 'One-Click Direct Sharing:'}
        </span>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {/* WhatsApp */}
          <a
            href={shareLinks.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 hover:border-emerald-500/60 text-xs font-semibold transition-all hover:scale-[1.02]"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400" />
            <span>WhatsApp</span>
          </a>

          {/* X (Twitter) */}
          <a
            href={shareLinks.twitter}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-sky-500/10 hover:bg-sky-500/20 text-sky-400 border border-sky-500/30 hover:border-sky-500/60 text-xs font-semibold transition-all hover:scale-[1.02]"
          >
            <Send className="w-4 h-4 text-sky-400" />
            <span>X (Twitter)</span>
          </a>

          {/* Telegram */}
          <a
            href={shareLinks.telegram}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 hover:border-cyan-500/60 text-xs font-semibold transition-all hover:scale-[1.02]"
          >
            <Send className="w-4 h-4 text-cyan-400" />
            <span>Telegram</span>
          </a>

          {/* LinkedIn */}
          <a
            href={shareLinks.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 hover:border-blue-500/60 text-xs font-semibold transition-all hover:scale-[1.02]"
          >
            <ExternalLink className="w-4 h-4 text-blue-400" />
            <span>LinkedIn</span>
          </a>

          {/* Facebook */}
          <a
            href={shareLinks.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 hover:border-indigo-500/60 text-xs font-semibold transition-all hover:scale-[1.02]"
          >
            <Globe className="w-4 h-4 text-indigo-400" />
            <span>Facebook</span>
          </a>

          {/* Email */}
          <a
            href={shareLinks.email}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 text-xs font-semibold transition-all hover:scale-[1.02]"
          >
            <Mail className="w-4 h-4 text-amber-400" />
            <span>{isTa ? 'மின்னஞ்சல்' : 'Email'}</span>
          </a>
        </div>
      </div>

      {/* Generated Civic Summary Preview & Format Tabs */}
      <div className="space-y-3 pt-1">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-emerald-400" />
            <span className="text-xs font-bold text-white">
              {isTa ? 'தானியங்கி சமூக அறிக்கை (Civic Summary Generator):' : 'Civic Grievance Summary Generator:'}
            </span>
          </div>

          {/* Format Tabs */}
          <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
            <button
              onClick={() => setActiveTab('standard')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'standard'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isTa ? 'முழு அறிக்கை' : 'Full Alert'}
            </button>

            <button
              onClick={() => setActiveTab('compact')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'compact'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {isTa ? 'சுருக்கம் / X' : 'Compact (X)'}
            </button>

            <button
              onClick={() => setActiveTab('tamil')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                activeTab === 'tamil'
                  ? 'bg-emerald-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              தமிழ் அறிக்கை
            </button>
          </div>
        </div>

        {/* Text Preview Box with 1-Click Copy */}
        <div className="relative">
          <textarea
            readOnly
            rows={activeTab === 'compact' ? 3 : 7}
            value={currentSummaryText}
            className="w-full bg-slate-950/90 border border-slate-800 rounded-2xl p-4 text-xs font-mono text-slate-300 leading-relaxed resize-none focus:outline-none focus:border-slate-700"
          />

          <div className="absolute top-3 right-3 flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition-all shadow-md ${
                copiedSummary
                  ? 'bg-emerald-500 text-slate-950 border-emerald-400'
                  : 'bg-slate-800/90 hover:bg-slate-700 text-white border-slate-700'
              }`}
            >
              {copiedSummary ? (
                <>
                  <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                  <span>{isTa ? 'நகலெடுக்கப்பட்டது!' : 'Copied!'}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-emerald-400" />
                  <span>{isTa ? 'அறிக்கையை நகலெடு' : 'Copy Summary'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Official Government Handles Callout */}
      <div className="p-3.5 bg-slate-950/60 border border-slate-800 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-400">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>
            <strong>{isTa ? 'பரிந்துரைக்கப்பட்ட அரசு குறிச்சொற்கள்:' : 'Recommended Official Tags:'}</strong>{' '}
            <span className="text-emerald-300 font-mono">@chennaicorp @TANGEDCO_Offcl @CMWSSB_Chennai #GCC1913</span>
          </span>
        </div>
        <div className="text-slate-500 font-mono text-[10px]">
          Target SLA: {complaint.slaHours}h • {complaint.targetPortal.code}
        </div>
      </div>
    </div>
  );
};
