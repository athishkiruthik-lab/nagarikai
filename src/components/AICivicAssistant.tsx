import React, { useState, useRef, useEffect } from 'react';
import { Bot, Send, Mic, MicOff, Sparkles, Volume2, CheckCircle2, Shield, ArrowRight, UserCheck, AlertTriangle, FileText, Globe, MapPin, ExternalLink, Loader2, Radio } from 'lucide-react';
import { Complaint, User } from '../types/civic';
import { AppLanguage, getTranslation } from '../utils/i18n';

interface AICivicAssistantProps {
  complaints: Complaint[];
  currentUser: User;
  language: AppLanguage;
  onOpenIntakeModal: () => void;
  onSelectComplaint: (complaint: Complaint) => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  relatedComplaint?: Complaint;
  groundingSources?: Array<{ title: string; url: string; snippet?: string }>;
  groundingPlaces?: Array<{ title: string; url: string; address?: string }>;
  groundingType?: 'web' | 'maps';
  actionButton?: {
    label: string;
    action: () => void;
  };
}

export const AICivicAssistant: React.FC<AICivicAssistantProps> = ({
  complaints,
  currentUser,
  language,
  onOpenIntakeModal,
  onSelectComplaint
}) => {
  const t = getTranslation(language);
  const isTa = language === 'ta';

  const [inputQuery, setInputQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>(() => [
    {
      id: 'm-welcome',
      sender: 'assistant',
      text: isTa
        ? `வணக்கம் ${currentUser.name}! நான் உங்கள் நாகரிக்AI நகராட்சி வழிகாட்டி. \n\nஉங்களின் எந்தவொரு புகாரின் நிலை (Status), வார்டு பொறியாளரின் விவரம், அல்லது புதிய புகார் தாக்கல் செய்ய என்னிடம் கேளுங்கள். உதாரணமாக:\n• "என் புகார் GCC-2026-89421 என்ன நிலையில் உள்ளது?"\n• "வேளச்சேரி வார்டு பொறியாளர் யார்?"\n• "குடிநீர் கசிவு குறித்து புகார் செய்வது எப்படி?"`
        : `Greetings ${currentUser.name}! I am your NagarikAI Civic Copilot.\n\nYou can ask me to track existing grievances, look up ward engineers, or understand government portal procedures. For example:\n• "Track status of complaint GCC-2026-89421"\n• "Who is the Assistant Engineer for T. Nagar (Ward 134)?"\n• "What is the mandated SLA for power breakdown in Velachery?"`,
      timestamp: 'Just now'
    }
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const [isRecordingAudio, setIsRecordingAudio] = useState(false);
  const [isTranscribingAudio, setIsTranscribingAudio] = useState(false);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Update initial message if language changes
  useEffect(() => {
    setMessages(prev => {
      if (prev.length === 1 && prev[0].id === 'm-welcome') {
        return [
          {
            id: 'm-welcome',
            sender: 'assistant',
            text: isTa
              ? `வணக்கம் ${currentUser.name}! நான் உங்கள் நாகரிக்AI நகராட்சி வழிகாட்டி. \n\nஉங்களின் எந்தவொரு புகாரின் நிலை (Status), வார்டு பொறியாளரின் விவரம், அல்லது புதிய புகார் தாக்கல் செய்ய என்னிடம் கேளுங்கள். உதாரணமாக:\n• "என் புகார் GCC-2026-89421 என்ன நிலையில் உள்ளது?"\n• "வேளச்சேரி வார்டு பொறியாளர் யார்?"\n• "குடிநீர் கசிவு குறித்து புகார் செய்வது எப்படி?"`
              : `Greetings ${currentUser.name}! I am your NagarikAI Civic Copilot.\n\nYou can ask me to track existing grievances, look up ward engineers, or understand government portal procedures. For example:\n• "Track status of complaint GCC-2026-89421"\n• "Who is the Assistant Engineer for T. Nagar (Ward 134)?"\n• "What is the mandated SLA for power breakdown in Velachery?"`,
            timestamp: 'Just now'
          }
        ];
      }
      return prev;
    });
  }, [language, currentUser.name, isTa]);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // Audio transcription with gemini-3.5-transcribe
  const toggleVoiceInput = async () => {
    if (isRecordingAudio) {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      setIsRecordingAudio(false);
      return;
    }

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioChunksRef.current = [];
        const mediaRecorder = new MediaRecorder(stream);

        mediaRecorder.ondataavailable = event => {
          if (event.data && event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = async () => {
          stream.getTracks().forEach(track => track.stop());
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
          const reader = new FileReader();
          reader.onloadend = async () => {
            const base64Audio = reader.result as string;
            setIsTranscribingAudio(true);
            try {
              const res = await fetch('/api/transcribe-audio', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  base64Audio,
                  mimeType: 'audio/webm',
                  language: isTa ? 'ta' : 'en'
                })
              });
              const data = await res.json();
              if (data.text) {
                setInputQuery(prev => (prev ? `${prev} ${data.text}` : data.text));
              }
            } catch (err) {
              console.warn('Voice transcription error:', err);
            } finally {
              setIsTranscribingAudio(false);
            }
          };
          reader.readAsDataURL(audioBlob);
        };

        mediaRecorderRef.current = mediaRecorder;
        mediaRecorder.start(250);
        setIsRecordingAudio(true);
        return;
      } catch (err) {
        console.warn('Microphone error in assistant:', err);
      }
    }

    // Fallback sample
    if (isTa) {
      setInputQuery('உஸ்மான் சாலை தார் பள்ளம் என்ன நிலையில் உள்ளது?');
    } else {
      setInputQuery('Check status of Usman Road pothole');
    }
  };

  // Quick suggestions based on language
  const suggestions = isTa
    ? [
        'உஸ்மான் சாலை புகார் என்ன ஆச்சு?',
        'வேளச்சேரி மின்சார கம்பி சரிசெய்யப்பட்டதா?',
        'அருகிலுள்ள சென்னை மாநகராட்சி வார்டு அலுவலகம் எங்கே?',
        'புதிய புகார் தாக்கல் செய்ய வேண்டும்'
      ]
    : [
        'Status of Usman Road pothole (GCC-2026-89421)',
        'Is the Velachery snapped live wire repaired?',
        'Where is the nearest Greater Chennai Corporation ward office?',
        'File a new civic complaint now'
      ];

  const handleSendMessage = (textToSend?: string) => {
    const query = (textToSend || inputQuery).trim();
    if (!query) return;

    const userMessage: ChatMessage = {
      id: `u-${Date.now()}`,
      sender: 'user',
      text: query,
      timestamp: 'Just now'
    };

    setMessages(prev => [...prev, userMessage]);
    if (!textToSend) setInputQuery('');
    setIsTyping(true);

    setTimeout(() => {
      processCivicQuery(query);
    }, 500);
  };

  const processCivicQuery = async (query: string) => {
    const qLower = query.toLowerCase();

    // 1. File new complaint intent
    if (
      qLower.includes('புதிய புகார்') ||
      qLower.includes('file') ||
      qLower.includes('new complaint') ||
      qLower.includes('புகார் செய்')
    ) {
      const reply: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: isTa
          ? 'நிச்சயமாக! AI குறைதீர்ப்பு பதிவு முறையை திறக்கிறேன். நீங்கள் நேரடியாக குரல் மூலமாகவோ அல்லது புகைப்படம் எடுத்தோ உடனே புகாரை சமர்ப்பிக்கலாம். AI தானாக அரசு இணையதளத்தில் இணைக்கும்.'
          : 'Opening the NagarikAI Intake Engine. You can speak naturally or snap a photo of the civic issue, and our AI agent will autonomously file it with the designated government portal.',
        timestamp: 'Just now',
        actionButton: {
          label: isTa ? 'AI புகார் படிவத்தை திறக்க' : 'Launch AI Grievance Assistant',
          action: onOpenIntakeModal
        }
      };
      setMessages(prev => [...prev, reply]);
      setIsTyping(false);
      return;
    }

    // 2. Search for existing complaints by keyword or ticket ID
    const matchedComplaint = complaints.find(c => {
      const idMatch =
        c.id.toLowerCase().includes(qLower) ||
        c.targetPortal.trackingNumber.toLowerCase().includes(qLower);
      const roadMatch =
        (qLower.includes('usman') || qLower.includes('உஸ்மான்')) &&
        c.location.address.toLowerCase().includes('usman');
      const wireMatch =
        (qLower.includes('wire') ||
          qLower.includes('மின்') ||
          qLower.includes('velachery') ||
          qLower.includes('வேளச்சேரி')) &&
        c.category === 'electricity';
      const drainMatch =
        (qLower.includes('drain') ||
          qLower.includes('school') ||
          qLower.includes('வடிகால்') ||
          qLower.includes('பள்ளி')) &&
        c.category === 'safety';
      const garbageMatch =
        (qLower.includes('garbage') ||
          qLower.includes('குப்பை') ||
          qLower.includes('anna nagar') ||
          qLower.includes('அண்ணா')) &&
        c.category === 'sanitation';
      const waterMatch =
        (qLower.includes('water') ||
          qLower.includes('குடிநீர்') ||
          qLower.includes('mylapore') ||
          qLower.includes('லஸ்')) &&
        c.category === 'water';
      return idMatch || roadMatch || wireMatch || drainMatch || garbageMatch || waterMatch;
    });

    if (matchedComplaint) {
      const isResolved = matchedComplaint.status === 'RESOLVED';
      const statusTextEn = matchedComplaint.status.replace('_', ' ');
      const statusTextTa =
        matchedComplaint.status === 'RESOLVED'
          ? 'முழுமையாக தீர்க்கப்பட்டது (RESOLVED)'
          : matchedComplaint.status === 'IN_PROGRESS'
          ? 'சீரமைப்பு பணிகள் தற்போது நடக்கிறது (IN PROGRESS)'
          : matchedComplaint.status === 'INSPECTION'
          ? 'கள ஆய்வு நடக்கிறது (UNDER INSPECTION)'
          : 'அதிகாரிக்கு ஒதுக்கப்பட்டது (ASSIGNED)';

      const reply: ChatMessage = {
        id: `a-${Date.now()}`,
        sender: 'assistant',
        text: isTa
          ? `கண்டறியப்பட்ட புகார்: **${matchedComplaint.id}** (${matchedComplaint.titleTamil})\n\n• **தற்போதைய நிலை:** ${statusTextTa}\n• **ஒதுக்கப்பட்ட துறை:** ${matchedComplaint.departmentTamil}\n• **களப்பணி பொறியாளர்:** ${matchedComplaint.assignedOfficer.name} (${matchedComplaint.assignedOfficer.contact})\n• **அரசு போர்டல் குறிப்பு:** ${matchedComplaint.targetPortal.trackingNumber}\n• **அரசு SLA கெடு:** ${matchedComplaint.slaHours} மணிநேரம்\n\n${
              isResolved
                ? '✅ இப்பிரச்சனைக்கு புதிய கான்கிரீட் மூடி பொருத்தப்பட்டு தளம் புகைப்படத்துடன் சரிபார்க்கப்பட்டுவிட்டது.'
                : '🔧 பொதுப்பணித்துறை வாகனங்களும் பணியாளர்களும் களத்தில் பணியில் உள்ளனர்.'
            }`
          : `Grievance Found: **${matchedComplaint.id}** (${matchedComplaint.title})\n\n• **Current Status:** ${statusTextEn}\n• **Department:** ${matchedComplaint.department}\n• **Assigned Officer:** ${matchedComplaint.assignedOfficer.name} (${matchedComplaint.assignedOfficer.role})\n• **Contact:** ${matchedComplaint.assignedOfficer.contact}\n• **Govt Reference:** ${matchedComplaint.targetPortal.trackingNumber}\n• **SLA Target:** Within ${matchedComplaint.slaHours} hours\n\n${
              isResolved
                ? '✅ Verified resolved with photo evidence attached.'
                : '🔧 Repair crews and materials have been mobilized.'
            }`,
        timestamp: 'Just now',
        relatedComplaint: matchedComplaint,
        actionButton: {
          label: isTa ? 'புகாரின் முழு விவரம் & புகைப்படங்களை பார்' : 'View Full Dossier & Timeline',
          action: () => onSelectComplaint(matchedComplaint)
        }
      };
      setMessages(prev => [...prev, reply]);
      setIsTyping(false);
      return;
    }

    // 3. Check if query is looking for locations or municipal offices -> Google Maps Grounding
    const isLocationQuery =
      qLower.includes('office') ||
      qLower.includes('centre') ||
      qLower.includes('center') ||
      qLower.includes('where') ||
      qLower.includes('location') ||
      qLower.includes('address') ||
      qLower.includes('near') ||
      qLower.includes('depot') ||
      qLower.includes('வார்டு') ||
      qLower.includes('அலுவலகம்') ||
      qLower.includes('எங்கே') ||
      qLower.includes('இடம்');

    if (isLocationQuery) {
      try {
        const res = await fetch('/api/search-maps', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query,
            lat: 13.0827,
            lng: 80.2707,
            language: isTa ? 'ta' : 'en'
          })
        });
        const data = await res.json();
        if (data.text) {
          const reply: ChatMessage = {
            id: `a-${Date.now()}`,
            sender: 'assistant',
            text: data.text,
            timestamp: 'Just now',
            groundingType: 'maps',
            groundingPlaces: data.places,
            actionButton: {
              label: isTa ? 'புதிய புகார் தாக்கல் செய்' : 'File a Civic Grievance',
              action: onOpenIntakeModal
            }
          };
          setMessages(prev => [...prev, reply]);
          setIsTyping(false);
          return;
        }
      } catch (err) {
        console.warn('Maps grounding lookup error:', err);
      }
    }

    // 4. Otherwise use Google Search Grounding for live real-time civic & government information
    try {
      const res = await fetch('/api/search-web', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query,
          language: isTa ? 'ta' : 'en'
        })
      });
      const data = await res.json();
      if (data.text) {
        const reply: ChatMessage = {
          id: `a-${Date.now()}`,
          sender: 'assistant',
          text: data.text,
          timestamp: 'Just now',
          groundingType: 'web',
          groundingSources: data.sources,
          actionButton: {
            label: isTa ? 'புதிய புகார் தாக்கல் செய்' : 'File a Civic Grievance',
            action: onOpenIntakeModal
          }
        };
        setMessages(prev => [...prev, reply]);
        setIsTyping(false);
        return;
      }
    } catch (err) {
      console.warn('Web search grounding error:', err);
    }

    // 5. Fallback civic intelligence answer
    const fallbackText = isTa
      ? `உங்கள் கேள்விக்கு நன்றி. சென்னை பெருநகர மாநகராட்சி (GCC 1913), மின்சார வாரியம் (TANGEDCO), குடிநீர் வாரியம் (CMWSSB) மற்றும் முதல்வர் முகவரி (TN CM Helpline) தொடர்பான எந்த புகாரையும் உடனடியாக AI மூலம் தாக்கல் செய்யலாம்.\n\nமேலும் விவரங்களுக்கு கீழே உள்ள "AI மூலம் புகார் செய்" பொத்தானை பயன்படுத்தலாம்.`
      : `Thank you for your query. NagarikAI connects directly to Greater Chennai Corporation (GCC 1913), TANGEDCO Minagam, CMWSSB Metro Water, Swachh Bharat Urban, and Tamil Nadu CM Helpline (Mudhalvarin Mugavari).\n\nIf you have a civic issue to report, you can describe it here or click below to launch the autonomous filing assistant.`;

    const reply: ChatMessage = {
      id: `a-${Date.now()}`,
      sender: 'assistant',
      text: fallbackText,
      timestamp: 'Just now',
      actionButton: {
        label: isTa ? 'புதிய புகார் தாக்கல் செய்' : 'File a Civic Grievance',
        action: onOpenIntakeModal
      }
    };
    setMessages(prev => [...prev, reply]);
    setIsTyping(false);
  };

  return (
    <div className="w-full h-[650px] bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden">
      {/* Copilot Header */}
      <div className="px-6 py-4 bg-slate-900/90 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/20">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">{t.chatTitle}</h3>
              <span className="text-[10px] font-semibold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/30">
                Gemini 2.5 Flash
              </span>
            </div>
            <p className="text-xs text-slate-400">
              {isTa ? 'அரசு போர்டல் நிலவரம் மற்றும் நேரடி வழிகாட்டி' : 'Intelligent civic grievance tracking & government portal guide'}
            </p>
          </div>
        </div>

        <button
          onClick={onOpenIntakeModal}
          className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{t.fileComplaintBtn}</span>
        </button>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 p-6 overflow-y-auto space-y-4">
        {messages.map(msg => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-xl rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-md ${
                msg.sender === 'user'
                  ? 'bg-emerald-600 text-white rounded-br-none'
                  : 'bg-slate-800/90 text-slate-200 border border-slate-700/80 rounded-bl-none'
              }`}
            >
              {msg.text}

              {/* Grounding Attribution & Verified Badges */}
              {msg.groundingType === 'web' && (
                <div className="mt-3 pt-2.5 border-t border-slate-700/80 space-y-1.5">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-sky-400">
                    <Globe className="w-3.5 h-3.5" />
                    <span>
                      {isTa ? 'Google தேடல் மூலம் சரிபார்க்கப்பட்டது (gemini-3.5-flash)' : 'Verified with Google Search Grounding (gemini-3.5-flash)'}
                    </span>
                  </div>
                  {msg.groundingSources && msg.groundingSources.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {msg.groundingSources.slice(0, 4).map((src, i) => (
                        <a
                          key={i}
                          href={src.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-sky-950/60 border border-sky-800/60 text-sky-300 hover:text-white text-[11px] hover:underline"
                        >
                          <span className="truncate max-w-[140px]">{src.title || 'Source'}</span>
                          <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {msg.groundingType === 'maps' && (
                <div className="mt-3 pt-2.5 border-t border-slate-700/80 space-y-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-bold text-emerald-400">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>
                      {isTa ? 'Google வரைபடத் தரவு மூலம் சரிபார்க்கப்பட்டது (gemini-3.5-flash)' : 'Verified with Google Maps Grounding (gemini-3.5-flash)'}
                    </span>
                  </div>
                  {msg.groundingPlaces && msg.groundingPlaces.length > 0 && (
                    <div className="space-y-1.5 pt-1">
                      {msg.groundingPlaces.slice(0, 3).map((pl, i) => (
                        <a
                          key={i}
                          href={pl.url || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(pl.title + ' ' + (pl.address || 'Chennai'))}`}
                          target="_blank"
                          rel="noreferrer"
                          className="block p-2 rounded-xl bg-slate-900/80 border border-slate-700/70 hover:border-emerald-500/50 transition-colors"
                        >
                          <div className="flex items-center justify-between text-xs font-semibold text-white">
                            <span className="truncate">{pl.title}</span>
                            <ExternalLink className="w-3 h-3 text-emerald-400 shrink-0 ml-1" />
                          </div>
                          {pl.address && (
                            <p className="text-[11px] text-slate-400 truncate mt-0.5">{pl.address}</p>
                          )}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Related Complaint Card Attachment */}
              {msg.relatedComplaint && (
                <div className="mt-3 p-3 bg-slate-900/90 rounded-xl border border-slate-700 flex items-center gap-3">
                  <img
                    src={msg.relatedComplaint.imageUrl}
                    alt={msg.relatedComplaint.title}
                    className="w-14 h-14 rounded-lg object-cover shrink-0 border border-slate-700"
                  />
                  <div className="flex-1 min-w-0 text-xs">
                    <p className="font-bold text-white truncate">
                      {isTa ? msg.relatedComplaint.titleTamil : msg.relatedComplaint.title}
                    </p>
                    <p className="text-slate-400 text-[11px] truncate">
                      {msg.relatedComplaint.location.address}
                    </p>
                    <span className="text-[10px] font-mono text-emerald-400">
                      {msg.relatedComplaint.targetPortal.trackingNumber}
                    </span>
                  </div>
                </div>
              )}

              {/* Quick Action Button */}
              {msg.actionButton && (
                <button
                  onClick={msg.actionButton.action}
                  className="mt-3 w-full py-2 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 transition-all"
                >
                  <span>{msg.actionButton.label}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <span className="text-[10px] text-slate-500 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 bg-slate-800/60 p-3 rounded-2xl max-w-xs border border-slate-700">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>{isTa ? 'AI சிந்தித்து பதிலளிக்கிறது...' : 'NagarikAI is analyzing municipal database...'}</span>
          </div>
        )}

        <div ref={chatBottomRef} />
      </div>

      {/* Suggested Quick Prompt Chips */}
      <div className="px-6 py-2 bg-slate-950/60 border-t border-slate-800/80 flex items-center gap-2 overflow-x-auto no-scrollbar">
        <span className="text-[11px] text-slate-500 shrink-0 font-medium">
          {isTa ? 'மாதிரி கேள்விகள்:' : 'Suggestions:'}
        </span>
        {suggestions.map((s, idx) => (
          <button
            key={idx}
            onClick={() => handleSendMessage(s)}
            className="text-xs px-3 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 whitespace-nowrap transition-colors"
          >
            {s}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <form
          onSubmit={e => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={e => setInputQuery(e.target.value)}
            placeholder={t.chatPlaceholder}
            className="flex-1 bg-slate-800/90 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
          />
          <button
            type="button"
            onClick={toggleVoiceInput}
            title={
              isRecordingAudio
                ? isTa ? 'பதிவை நிறுத்த கிளிக் செய்யவும்' : 'Click to stop recording'
                : isTa ? 'குரல் மூலம் பேச (gemini-3.5-transcribe)' : 'Speak query (gemini-3.5-transcribe)'
            }
            className={`p-3 rounded-xl border transition-all ${
              isRecordingAudio
                ? 'bg-rose-600 text-white border-rose-500 animate-pulse shadow-lg shadow-rose-600/30'
                : isTranscribingAudio
                ? 'bg-amber-600 text-white border-amber-500'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-emerald-400 border-slate-700'
            }`}
          >
            {isRecordingAudio ? (
              <Radio className="w-4 h-4 animate-spin" />
            ) : isTranscribingAudio ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Mic className="w-4 h-4" />
            )}
          </button>
          <button
            type="submit"
            disabled={!inputQuery.trim() || isTyping}
            className="p-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl transition-all shadow-md"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
