import React, { useState } from 'react';
import { User, NotificationItem } from '../types/civic';
import { AppLanguage, getTranslation } from '../utils/i18n';
import {
  Sparkles, Bell, Monitor, Smartphone, Shield, LogOut,
  UserCheck, ChevronDown, Check, Plus, AlertCircle, Volume2, Globe, KeyRound
} from 'lucide-react';

interface HeaderProps {
  currentUser: User;
  onSwitchUser: (user: User) => void;
  allUsers: User[];
  notifications: NotificationItem[];
  onOpenNotifications: () => void;
  onOpenAIIntake: () => void;
  platformMode: 'windows' | 'android';
  onTogglePlatformMode: (mode: 'windows' | 'android') => void;
  language: AppLanguage;
  onLanguageChange: (lang: AppLanguage) => void;
  onOpenApiKeyInfo?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentUser,
  onSwitchUser,
  allUsers,
  notifications,
  onOpenNotifications,
  onOpenAIIntake,
  platformMode,
  onTogglePlatformMode,
  language,
  onLanguageChange,
  onOpenApiKeyInfo
}) => {
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);

  const t = getTranslation(language);
  const isTa = language === 'ta';
  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <header className="sticky top-0 z-[1100] bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 py-3 transition-colors">
      {/* If in Windows App mode, show subtle Windows titlebar styling */}
      {platformMode === 'windows' && (
        <div className="hidden lg:flex items-center justify-between text-[11px] text-slate-500 pb-2 mb-2 border-b border-slate-800/60 select-none">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500/80" />
            <span className="font-semibold text-slate-400">
              {isTa ? 'நாகரிக்AI பெருநகர குடிமக்கள் கட்டமைப்பு • Windows v2.4 (x64)' : 'NagarikAI Civic Operating System • Windows v2.4 (x64)'}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-slate-400">
              {isTa ? 'இணைப்பு: தமிழ்நாடு அரசு குறைதீர்ப்பு நெட்வொர்க்' : 'Connected: Tamil Nadu State Grievance Grid'}
            </span>
            <div className="flex items-center gap-1.5 pl-3 border-l border-slate-800">
              <span className="w-3 h-0.5 bg-slate-500 rounded" />
              <span className="w-2.5 h-2.5 border border-slate-500 rounded-sm" />
              <span className="text-xs text-slate-500 hover:text-rose-400 font-bold px-1">✕</span>
            </div>
          </div>
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        {/* Brand Logo & Emblem */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-600 via-teal-500 to-cyan-500 p-0.5 shadow-lg shadow-emerald-500/20">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-black tracking-tight text-white flex items-center gap-1">
                Nagarik<span className="text-emerald-400">AI</span>
              </h1>
              <span className="hidden sm:inline text-[10px] font-bold uppercase tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                {isTa ? 'குடிமக்கள் குறைதீர்ப்பு AI' : 'Civic Governance AI'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {t.subTagline}
            </p>
          </div>
        </div>

        {/* Action Controls, Language Toggle & User Profiles */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* EXPLICIT TAMIL OR ENGLISH SELECTOR (Not together!) */}
          <div className="flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800 shadow-inner">
            <button
              onClick={() => onLanguageChange('en')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                language === 'en'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              English
            </button>
            <button
              onClick={() => onLanguageChange('ta')}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
                language === 'ta'
                  ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/30'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              தமிழ்
            </button>
          </div>

          {/* Platform Switcher Toggle (Windows / Android) */}
          <div className="hidden md:flex items-center bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => onTogglePlatformMode('windows')}
              title="Windows App Mode"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                platformMode === 'windows'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Monitor className="w-3.5 h-3.5 text-blue-400" />
              <span>Windows</span>
            </button>
            <button
              onClick={() => onTogglePlatformMode('android')}
              title="Android Mobile View"
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                platformMode === 'android'
                  ? 'bg-slate-800 text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
              <span>Android</span>
            </button>
          </div>

          {/* Quick AI File Button */}
          <button
            onClick={onOpenAIIntake}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 transition-all transform active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span>{t.fileComplaintBtn}</span>
          </button>

          {/* Why API Key? Info Trigger */}
          {onOpenApiKeyInfo && (
            <button
              onClick={onOpenApiKeyInfo}
              title={isTa ? 'Gemini API சாவி ஏன் தேவைப்படுகிறது?' : 'Why is the Gemini API Key required?'}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-300 border border-slate-700 text-xs font-semibold transition-colors"
            >
              <KeyRound className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">{isTa ? 'ஏன் AI சாவி?' : 'Why API Key?'}</span>
            </button>
          )}

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              className="relative w-9 h-9 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-slate-700"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-[10px] font-bold text-white flex items-center justify-center animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifDropdown && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-3 z-[1200] space-y-2">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                  <span className="text-xs font-bold text-white">{t.notifications}</span>
                  <span className="text-[10px] text-emerald-400 font-semibold">
                    {unreadCount} {t.newAlerts}
                  </span>
                </div>
                <div className="space-y-1.5 max-h-72 overflow-y-auto">
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl text-xs transition-colors ${
                        n.isRead ? 'bg-slate-800/40 text-slate-400' : 'bg-slate-800/90 text-slate-200 border border-slate-700/60'
                      }`}
                    >
                      <div className="flex items-center justify-between font-semibold mb-0.5">
                        <span className="text-white flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${n.type === 'resolution' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                          {n.title}
                        </span>
                        <span className="text-[10px] text-slate-400">{n.timestamp}</span>
                      </div>
                      <p className="text-[11px] text-slate-300 leading-normal">{n.message}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Secure Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowUserDropdown(!showUserDropdown)}
              className="flex items-center gap-2 p-1.5 pr-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-left transition-colors"
            >
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="w-7 h-7 rounded-lg object-cover"
              />
              <div className="hidden lg:block">
                <div className="text-xs font-bold text-white leading-tight">
                  {currentUser.name.split(' ')[0]}
                </div>
                <div className="text-[10px] text-emerald-400 font-medium leading-tight">
                  {currentUser.role === 'citizen' ? t.roleCitizen : currentUser.role === 'field_officer' ? t.roleOfficer : t.roleAdmin}
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {/* Role Switcher Menu */}
            {showUserDropdown && (
              <div className="absolute right-0 mt-2 w-72 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl p-2 z-[1200] space-y-1">
                <div className="px-3 py-2 border-b border-slate-800 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {t.switchRole}
                  </span>
                  <p className="text-[10px] text-slate-500">
                    {isTa ? 'நகராட்சி அனுமதி நிலைகளை சோதிக்கவும்' : 'Test municipal access credentials'}
                  </p>
                </div>

                {allUsers.map(u => (
                  <button
                    key={u.id}
                    onClick={() => {
                      onSwitchUser(u);
                      setShowUserDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between p-2 rounded-xl text-left transition-colors ${
                      currentUser.id === u.id
                        ? 'bg-emerald-500/20 border border-emerald-500/30 text-white'
                        : 'hover:bg-slate-800 text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={u.avatar} alt={u.name} className="w-7 h-7 rounded-lg object-cover" />
                      <div>
                        <div className="text-xs font-bold text-white">{u.name}</div>
                        <div className="text-[10px] text-slate-400">{u.badge}</div>
                      </div>
                    </div>
                    {currentUser.id === u.id && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
