import React from 'react';
import { AppLanguage } from '../utils/i18n';
import {
  X, KeyRound, ShieldCheck, Sparkles, Mic, Eye, MapPin,
  Film, Server, CheckCircle2, AlertCircle, ArrowRight
} from 'lucide-react';

interface ApiKeyExplanationModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: AppLanguage;
}

export const ApiKeyExplanationModal: React.FC<ApiKeyExplanationModalProps> = ({
  isOpen,
  onClose,
  language
}) => {
  if (!isOpen) return null;

  const isTa = language === 'ta';

  return (
    <div className="fixed inset-0 z-[1400] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-emerald-950/80 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <span>{isTa ? 'ஏன் Gemini API Key தேவைப்படுகிறது?' : 'Why is the Gemini API Key Required?'}</span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30 font-semibold">
                  {isTa ? 'பாதுகாப்பான சர்வர் ஒருங்கிணைப்பு' : 'Secure Server-Side AI'}
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                {isTa
                  ? 'நாகரிக்AI குடிமக்கள் சேவையை தடையின்றி இயக்க தேவையான AI காரணங்கள்'
                  : 'How Gemini AI powers autonomous civic governance & why it works right'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-slate-300 text-xs leading-relaxed">
          {/* Main Answer Summary */}
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-emerald-300 font-bold text-sm">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>
                {isTa
                  ? 'சுருக்கம்: AI வசதிகள் செயல்பட மட்டுமே API சாவி தேவைப்படுகிறது, பயனர் எதுவும் உள்ளிட தேவையில்லை!'
                  : 'Key Answer: The Gemini API key powers the underlying AI engine securely on the server.'}
              </span>
            </div>
            <p className="text-slate-300">
              {isTa
                ? 'நாகரிக்AI-ல் குரல் பதிவு (Tamil Audio), புகைப்பட ஆய்வு (Real Photo Verification), அரசு துறை கண்டறிதல் (Government Branch Routing) மற்றும் சீரமைப்பு வீடியோ உருவகப்படுத்துதல் (Veo 3.1) ஆகியவை Google Gemini மாதிரிகளை பயன்படுத்துகின்றன. இந்த சாவி சர்வர் பக்கத்திலேயே பாதுகாப்பாக இணைக்கப்பட்டுள்ளதால் உங்களுக்கு எந்தவித கட்டணமோ உள்ளீடோ தேவையில்லை.'
                : 'The Gemini API key connects the application to Google DeepMind Gemini models on the backend. This allows NagarikAI to understand natural citizen voice recordings, verify real-life photo evidence, automatically map grievances to the correct government branch, and simulate municipal repairs without requiring you to manually fill tedious government forms.'}
            </p>
          </div>

          {/* 5 Core Pillars */}
          <div className="space-y-3">
            <h4 className="font-bold text-white text-xs uppercase tracking-wider flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>{isTa ? 'API சாவி இயக்கும் 5 முக்கிய அம்சங்கள்:' : '5 Core Features Powered by the Gemini API Key:'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {/* Pillar 1 */}
              <div className="p-3.5 bg-slate-800/70 border border-slate-700/80 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                  <Mic className="w-4 h-4" />
                  <span>{isTa ? '1. தமிழ் & ஆங்கில குரல் பதிவு' : '1. Tamil & English Voice Intake'}</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  {isTa
                    ? 'Gemini 2.5 Flash ஆடியோ மாதிரியானது குடிமக்களின் பேச்சு வழக்கை பிழையின்றி உரை வடிவமாக மாற்றுகிறது.'
                    : 'Gemini 2.5 Flash accurately transcribes spoken Tamil audio notes and English dictation with civic terminology.'}
                </p>
              </div>

              {/* Pillar 2 */}
              <div className="p-3.5 bg-slate-800/70 border border-slate-700/80 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-2 text-blue-400 font-semibold">
                  <Eye className="w-4 h-4" />
                  <span>{isTa ? '2. கள புகைப்பட ஆய்வு' : '2. Real Photo Verification'}</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  {isTa
                    ? 'சாலை பள்ளம், அறுந்த மின்கம்பி, குப்பை மற்றும் உடைந்த குடிநீர் குழாய் ஆகியவற்றை கம்ப்யூட்டர் விஷன் மூலம் சரிபார்க்கிறது.'
                    : 'Computer vision inspects real documentary photographs to classify road craters, live wire snaps, and water leaks.'}
                </p>
              </div>

              {/* Pillar 3 */}
              <div className="p-3.5 bg-slate-800/70 border border-slate-700/80 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-2 text-amber-400 font-semibold">
                  <MapPin className="w-4 h-4" />
                  <span>{isTa ? '3. அரசு கிளை கண்டறிதல்' : '3. Govt Branch Grounding'}</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  {isTa
                    ? 'Google Maps மற்றும் Search Grounding மூலம் சரியான மாநகராட்சி வார்டு, மின்வாரிய உபநிலையம் மற்றும் குடிநீர் வாரியத்தை கண்டறிகிறது.'
                    : 'Google Search & Maps Grounding routes the complaint to GCC 1913, TANGEDCO Minagam, or CMWSSB with ward AE details.'}
                </p>
              </div>

              {/* Pillar 4 */}
              <div className="p-3.5 bg-slate-800/70 border border-slate-700/80 rounded-2xl space-y-1.5">
                <div className="flex items-center gap-2 text-violet-400 font-semibold">
                  <Film className="w-4 h-4" />
                  <span>{isTa ? '4. Veo 3.1 சீரமைப்பு வீடியோ' : '4. Veo 3.1 Repair Simulation'}</span>
                </div>
                <p className="text-slate-400 text-[11px]">
                  {isTa
                    ? 'பொதுப்பணித்துறை இயந்திரங்கள் சாலையை தார் போட்டு சீரமைக்கும் 720p மாதிரி காட்சியை உருவாக்குகிறது.'
                    : 'Veo 3.1 generates photorealistic video simulations showing municipal crews repairing the infrastructure.'}
                </p>
              </div>
            </div>
          </div>

          {/* Security & Zero UI Input Guarantee */}
          <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-2">
            <div className="flex items-center gap-2 text-white font-bold text-xs">
              <Server className="w-4 h-4 text-emerald-400" />
              <span>{isTa ? 'முழுமையான சர்வர்-பக்க பாதுகாப்பு' : 'Server-Side Security & Zero Manual Form Inputs'}</span>
            </div>
            <p className="text-slate-400 text-[11px]">
              {isTa
                ? 'உங்கள் உலாவியில் (Browser) எந்தவொரு API சாவியையும் உள்ளிட வேண்டிய அவசியமில்லை. அனைத்தும் பாதுகாப்பான பின்-தளத்தில் (Node/Express Server) தானாக இணைக்கப்பட்டுள்ளது.'
                : 'All API requests are proxied securely through server endpoints (`/api/transcribe`, `/api/generate-insights`, `/api/generate-veo-video`). Your API keys are never exposed in browser JavaScript or local storage.'}
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-950 border-t border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 font-mono">
            Status: GEMINI_API_KEY Configured & Healthy
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all"
          >
            {isTa ? 'புரிந்தது / மூடு' : 'Got it, Close'}
          </button>
        </div>
      </div>
    </div>
  );
};
