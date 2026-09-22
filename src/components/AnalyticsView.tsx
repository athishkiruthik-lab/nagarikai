import React, { useState } from 'react';
import { Complaint, WardMetric } from '../types/civic';
import { AppLanguage, getTranslation } from '../utils/i18n';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import {
  Download, FileText, Sparkles, TrendingUp, AlertTriangle, CheckCircle,
  Clock, Shield, ArrowUpRight, Calendar, RefreshCw, Send, Sliders,
  Building2, MapPin, Activity, AlertOctagon, Flame, Wrench
} from 'lucide-react';
import { calculateInfrastructureUrgencyIndex } from '../utils/civicBranches';

interface AnalyticsViewProps {
  complaints: Complaint[];
  language?: AppLanguage;
  neighborhoodZone?: string;
  ward?: string;
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  complaints,
  language = 'en',
  neighborhoodZone = 'Zone 10 (Kodambakkam)',
  ward = 'Ward 134'
}) => {
  const isTa = language === 'ta';
  const t = getTranslation(language);
  const [selectedNeighborhoodZone, setSelectedNeighborhoodZone] = useState(neighborhoodZone);
  const [selectedWard, setSelectedWard] = useState(ward);
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [aiReport, setAiReport] = useState<any>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'month' | 'quarter' | 'year'>('month');
  const [activeReportTab, setActiveReportTab] = useState<'metrics' | 'ai_strategy' | 'export'>('metrics');

  const total = complaints.length;
  const resolved = complaints.filter(c => c.status === 'RESOLVED').length;
  const pending = complaints.filter(c => c.status !== 'RESOLVED').length;
  const critical = complaints.filter(c => c.priority === 'CRITICAL').length;
  const resolutionRate = total ? Math.round((resolved / total) * 100) : 0;

  // Monthly inflow and resolution data
  const monthlyTrendData = [
    { month: isTa ? 'ஏப்ரல்' : 'Apr', filed: 142, resolved: 135, slaBreached: 7 },
    { month: isTa ? 'மே' : 'May', filed: 189, resolved: 174, slaBreached: 15 },
    { month: isTa ? 'ஜூன்' : 'Jun', filed: 230, resolved: 210, slaBreached: 20 },
    { month: isTa ? 'ஜூலை' : 'Jul', filed: 310, resolved: 295, slaBreached: 15 },
    { month: isTa ? 'ஆகஸ்ட்' : 'Aug', filed: 420, resolved: 390, slaBreached: 30 },
    { month: isTa ? 'செப்டம்பர்' : 'Sep', filed: 480, resolved: 442, slaBreached: 38 },
  ];

  // Category distribution
  const categoryCounts: Record<string, number> = {
    roads: 0,
    sanitation: 0,
    electricity: 0,
    water: 0,
    safety: 0,
    traffic: 0
  };

  complaints.forEach(c => {
    categoryCounts[c.category] = (categoryCounts[c.category] || 0) + 1;
  });

  const categoryChartData = [
    { name: isTa ? 'சாலைகள் & பள்ளங்கள்' : 'Roads & Potholes', value: categoryCounts.roads || 38, color: '#3b82f6' },
    { name: isTa ? 'திடக்கழிவு & தூய்மைப்பணி' : 'Sanitation & Solid Waste', value: categoryCounts.sanitation || 45, color: '#10b981' },
    { name: isTa ? 'மின்சாரம் & தெருவிளக்கு' : 'Electricity & Lights', value: categoryCounts.electricity || 28, color: '#f59e0b' },
    { name: isTa ? 'குடிநீர் & பாதாள சாக்கடை' : 'Water & Sewage', value: categoryCounts.water || 34, color: '#06b6d4' },
    { name: isTa ? 'பொதுமக்கள் பாதுகாப்பு' : 'Public Safety Hazards', value: categoryCounts.safety || 18, color: '#ef4444' },
    { name: isTa ? 'போக்குவரத்து & சிக்னல்கள்' : 'Traffic & Signals', value: categoryCounts.traffic || 22, color: '#8b5cf6' },
  ];

  // Ward Turnaround Time
  const wardTurnaroundData = [
    { ward: 'Ward 134 (T. Nagar)', avgHours: 26, targetHours: 48 },
    { ward: 'Ward 178 (Velachery)', avgHours: 34, targetHours: 48 },
    { ward: 'Ward 102 (Anna Nagar)', avgHours: 19, targetHours: 24 },
    { ward: 'Ward 123 (Mylapore)', avgHours: 29, targetHours: 36 },
    { ward: 'Ward 160 (Guindy)', avgHours: 22, targetHours: 24 },
    { ward: 'Ward 24 (Tambaram)', avgHours: 41, targetHours: 48 },
  ];

  // Trigger Gemini AI Executive Strategy & Urban Planning Summary
  const handleGenerateAIInsights = async () => {
    setIsGeneratingAI(true);
    try {
      const res = await fetch('/api/generate-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ complaints })
      });
      const data = await res.json();
      setAiReport(data);
      setActiveReportTab('ai_strategy');
    } catch (err) {
      console.error('Failed to generate insights:', err);
    } finally {
      setIsGeneratingAI(false);
    }
  };

  // Export CSV Data
  const handleExportCSV = () => {
    const headers = [
      'Grievance ID',
      'Title English',
      'Title Tamil',
      'Category',
      'Priority',
      'Status',
      'Target Portal',
      'Portal Tracking Number',
      'Department',
      'Ward',
      'Zone',
      'Address',
      'Latitude',
      'Longitude',
      'SLA Target Hours',
      'SLA Breached',
      'Created Date'
    ];

    const rows = complaints.map(c => [
      `"${c.id}"`,
      `"${c.title.replace(/"/g, '""')}"`,
      `"${c.titleTamil.replace(/"/g, '""')}"`,
      `"${c.category}"`,
      `"${c.priority}"`,
      `"${c.status}"`,
      `"${c.targetPortal.name}"`,
      `"${c.targetPortal.trackingNumber}"`,
      `"${c.department}"`,
      `"${c.location.ward}"`,
      `"${c.location.zone}"`,
      `"${c.location.address.replace(/"/g, '""')}"`,
      c.location.lat,
      c.location.lng,
      c.slaHours,
      c.slaBreached ? 'YES' : 'NO',
      `"${new Date(c.createdAt).toLocaleDateString()}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NagarikAI_Civic_Governance_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Printable Report Dossier
  const handlePrintDossier = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Toolbar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-slate-900 border border-slate-800 p-5 rounded-3xl shadow-xl">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
            <h2 className="text-lg font-bold text-white">
              Municipal Performance & Urban Planning Analytics
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            மாநகராட்சி செயல் திறன் மற்றும் உள்கட்டமைப்பு திட்டமிடல் பகுப்பாய்வு
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* AI Strategy Generator Button */}
          <button
            onClick={handleGenerateAIInsights}
            disabled={isGeneratingAI}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all transform active:scale-95 disabled:opacity-50"
          >
            {isGeneratingAI ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Analyzing Infrastructure Trends...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                <span>Run AI Urban Planning Assessment</span>
              </>
            )}
          </button>

          {/* Export CSV Button */}
          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          {/* Print Dossier */}
          <button
            onClick={handlePrintDossier}
            className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 flex items-center gap-1.5 transition-colors"
          >
            <FileText className="w-4 h-4 text-teal-400" />
            <span>Print Dossier</span>
          </button>
        </div>
      </div>

      {/* Tabs: Metrics / AI Strategy / Automated Workflows */}
      <div className="flex items-center gap-2 border-b border-slate-800 pb-2">
        <button
          onClick={() => setActiveReportTab('metrics')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeReportTab === 'metrics'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          📊 Civic KPI & Visual Graphs
        </button>
        <button
          onClick={() => setActiveReportTab('ai_strategy')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
            activeReportTab === 'ai_strategy'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          <span>🏛️ AI Executive Strategy & Hotspots</span>
        </button>
        <button
          onClick={() => setActiveReportTab('export')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeReportTab === 'export'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          ⚙️ Automated Workflows & Data Export
        </button>
      </div>

      {/* SECTION 1: METRICS & GRAPHS */}
      {activeReportTab === 'metrics' && (
        <div className="space-y-6">
          {/* AI-CALCULATED INFRASTRUCTURE URGENCY INDEX NEIGHBORHOOD ALERT CARD */}
          {(() => {
            const urgencyData = calculateInfrastructureUrgencyIndex(
              complaints,
              selectedNeighborhoodZone,
              selectedWard
            );
            const isCritical = urgencyData.isCritical;

            return (
              <div
                className={`p-5 sm:p-6 rounded-3xl border transition-all duration-300 shadow-2xl relative overflow-hidden ${
                  isCritical
                    ? 'bg-gradient-to-br from-rose-950/90 via-slate-900 to-slate-900 border-rose-500/50 ring-1 ring-rose-500/30'
                    : 'bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-slate-800'
                }`}
              >
                {/* Background glow when critical */}
                {isCritical && (
                  <div className="absolute top-0 right-0 w-96 h-96 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
                )}

                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-3 rounded-2xl shrink-0 ${
                        isCritical
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/40 animate-pulse'
                          : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      }`}
                    >
                      {isCritical ? <Flame className="w-6 h-6" /> : <Activity className="w-6 h-6" />}
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="text-base font-bold text-white flex items-center gap-2">
                          <span>
                            {isTa
                              ? 'AI உள்கட்டமைப்பு அவசர குறியீடு (Infrastructure Urgency Index)'
                              : 'AI Infrastructure Urgency Index (GIS Grounded)'}
                          </span>
                        </h3>
                        <span
                          className={`text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                            isCritical
                              ? 'bg-rose-500/20 text-rose-300 border-rose-500/40 animate-pulse'
                              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          }`}
                        >
                          {isCritical
                            ? (isTa ? '⚠️ அவசர எச்சரிக்கை: வரம்பு தாண்டியது (>70)' : 'CRITICAL THRESHOLD EXCEEDED (>70)')
                            : (isTa ? 'கட்டுக்குள் உள்ளது (<70)' : 'STABLE (<70)')}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        {isTa
                          ? 'ஜிஐஎஸ் வரைபடம் மற்றும் நேரலை புகார்களை பகுப்பாய்வு செய்து தானியங்கி AI கணக்கிட்ட முன்னுரிமை'
                          : 'Computed from real-time spatial GIS coordinates, active hazard density, and municipal SLA latency'}
                      </p>
                    </div>
                  </div>

                  {/* Neighborhood Ward Selector */}
                  <div className="flex items-center gap-2 bg-slate-950/80 p-2 rounded-2xl border border-slate-800 self-start lg:self-auto">
                    <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                    <select
                      value={`${selectedNeighborhoodZone}|${selectedWard}`}
                      onChange={e => {
                        const [z, w] = e.target.value.split('|');
                        setSelectedNeighborhoodZone(z);
                        setSelectedWard(w);
                      }}
                      aria-label={isTa ? 'பகுதியைத் தேர்ந்தெடுக்கவும்' : 'Select Neighborhood'}
                      className="bg-transparent text-xs text-white font-semibold focus:outline-none cursor-pointer pr-2"
                    >
                      <option value="Zone 10 (Kodambakkam)|Ward 134" className="bg-slate-900 text-white">
                        Zone 10 (Kodambakkam) • Ward 134 (T. Nagar)
                      </option>
                      <option value="Zone 13 (Adyar / Velachery)|Ward 178" className="bg-slate-900 text-white">
                        Zone 13 (Adyar / Velachery) • Ward 178 (Velachery)
                      </option>
                      <option value="Zone 8 (Anna Nagar)|Ward 102" className="bg-slate-900 text-white">
                        Zone 8 (Anna Nagar) • Ward 102 (Anna Nagar West)
                      </option>
                      <option value="Zone 9 (Teynampet)|Ward 123" className="bg-slate-900 text-white">
                        Zone 9 (Teynampet) • Ward 123 (Mylapore)
                      </option>
                      <option value="Zone 10 (Guindy Division)|Ward 160" className="bg-slate-900 text-white">
                        Zone 10 (Guindy) • Ward 160 (Guindy)
                      </option>
                      <option value="Zone 14 (Perungudi)|Ward 182" className="bg-slate-900 text-white">
                        Zone 14 (Perungudi) • Ward 182 (Perungudi OMR)
                      </option>
                    </select>
                  </div>
                </div>

                {/* Score & Contributing Factors Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                  {/* Score Meter */}
                  <div className="space-y-2 flex flex-col justify-center">
                    <div className="flex items-baseline justify-between">
                      <span className="text-xs font-semibold text-slate-400">
                        {isTa ? 'குறியீட்டு எண் (0 - 100):' : 'Neighborhood Urgency Score:'}
                      </span>
                      <span
                        className={`text-3xl font-black ${
                          isCritical ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {urgencyData.score}
                        <span className="text-sm font-normal text-slate-500"> / 100</span>
                      </span>
                    </div>

                    {/* Progress Bar with Threshold Marker at 70% */}
                    <div className="relative w-full h-3 bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          isCritical
                            ? 'bg-gradient-to-r from-amber-500 to-rose-500'
                            : 'bg-gradient-to-r from-teal-500 to-emerald-500'
                        }`}
                        style={{ width: `${urgencyData.score}%` }}
                      />
                      {/* Critical threshold line at 70% */}
                      <div
                        className="absolute top-0 bottom-0 w-0.5 bg-rose-300 z-10"
                        style={{ left: '70%' }}
                        title="Critical Threshold: 70"
                      />
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-500 font-mono">
                      <span>Low Risk (0)</span>
                      <span className="text-rose-400 font-bold">Threshold (70)</span>
                      <span>Extreme (100)</span>
                    </div>
                  </div>

                  {/* GIS Active Hazards & Count Breakdown */}
                  <div className="space-y-1.5 text-xs bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                      {isTa ? 'ஜிஐஎஸ் கள நிலவரம்:' : 'GIS Ground Status:'}
                    </span>
                    <div className="flex justify-between text-slate-300">
                      <span>{isTa ? 'அவசர ஆபத்துகள்:' : 'Critical Hazards:'}</span>
                      <span className="font-bold text-rose-400">{urgencyData.criticalCount}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>{isTa ? 'அதிக முன்னுரிமை:' : 'High Priority Disruptions:'}</span>
                      <span className="font-bold text-amber-400">{urgencyData.highCount}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>{isTa ? 'செயலில் உள்ள புகார்கள்:' : 'Active Grievances:'}</span>
                      <span className="font-bold text-white">{urgencyData.activeCount}</span>
                    </div>
                    <div className="flex justify-between text-slate-300">
                      <span>{isTa ? 'தீர்க்கப்பட்ட பணிகள்:' : 'Resolved Interventions:'}</span>
                      <span className="font-bold text-emerald-400">{urgencyData.resolvedCount}</span>
                    </div>
                  </div>

                  {/* Recommended Action Box */}
                  <div className="space-y-2 text-xs bg-slate-950/60 p-3.5 rounded-2xl border border-slate-800/80 flex flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block mb-1 flex items-center gap-1.5">
                        <Wrench className="w-3.5 h-3.5" />
                        {isTa ? 'அரசு பொறியியல் பரிந்துரை:' : 'Municipal Engineering Directive:'}
                      </span>
                      <p className="text-slate-300 leading-relaxed text-[11px]">
                        {isTa ? urgencyData.recommendedActionTamil : urgencyData.recommendedAction}
                      </p>
                    </div>

                    <div className="pt-1 text-[10px] text-slate-500">
                      <strong>{isTa ? 'காரணிகள்:' : 'Contributing GIS Factors:'}</strong>{' '}
                      {(isTa ? urgencyData.contributingFactorsTamil : urgencyData.contributingFactors).join(' • ')}
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Key Metric Numbers Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-xs text-slate-400">Total Grievances Processed</span>
              <div className="text-2xl font-black text-white mt-1">1,771</div>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-3 h-3" /> +14.2% from last month
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-xs text-slate-400">Avg Resolution Turnaround</span>
              <div className="text-2xl font-black text-emerald-400 mt-1">26.4 hrs</div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Target SLA: 48 hrs (45% faster)
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-xs text-slate-400">SLA Adherence Rate</span>
              <div className="text-2xl font-black text-white mt-1">94.8%</div>
              <span className="text-[11px] text-emerald-400 flex items-center gap-1 mt-1">
                <CheckCircle className="w-3 h-3" /> 1,642 cases within SLA
              </span>
            </div>

            <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl">
              <span className="text-xs text-slate-400">Tamil Voice Grievances</span>
              <div className="text-2xl font-black text-teal-300 mt-1">78.2%</div>
              <span className="text-[11px] text-slate-400 mt-1 block">
                Direct speech intake by AI
              </span>
            </div>
          </div>

          {/* Recharts Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1: Monthly Grievance Inflow & Resolution */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Monthly Grievances: Inflow vs. Resolution</h3>
                <span className="text-xs text-slate-400 font-mono">6-Month Trend</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={monthlyTrendData}>
                    <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="filed" name="Filed by Citizens" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="resolved" name="Resolved by Public Works" fill="#10b981" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Category Breakdown */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white">Grievances by Infrastructure Domain</h3>
                <span className="text-xs text-slate-400 font-mono">Current Distribution</span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={categoryChartData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      innerRadius={45}
                      paddingAngle={3}
                      label={({ percent }) => `${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                      {categoryChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '11px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '10px' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 3: Ward-level Turnaround Hours */}
            <div className="bg-slate-900 border border-slate-800 p-5 rounded-3xl space-y-3 lg:col-span-2">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Ward Turnaround Time vs. Mandated SLA Ceiling</h3>
                  <p className="text-xs text-slate-400">Average hours taken from AI portal submission to ground physical verification</p>
                </div>
                <span className="text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                  Target: &lt;48 Hours
                </span>
              </div>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={wardTurnaroundData} layout="vertical">
                    <XAxis type="number" stroke="#64748b" fontSize={11} unit="h" />
                    <YAxis dataKey="ward" type="category" stroke="#64748b" fontSize={11} width={130} />
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '12px', fontSize: '12px' }}
                    />
                    <Legend wrapperStyle={{ fontSize: '11px' }} />
                    <Bar dataKey="avgHours" name="Actual Avg Turnaround (Hrs)" fill="#10b981" radius={[0, 4, 4, 0]} />
                    <Bar dataKey="targetHours" name="SLA Ceiling Limit (Hrs)" fill="#334155" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 2: AI EXECUTIVE STRATEGY & HOTSPOTS */}
      {activeReportTab === 'ai_strategy' && (
        <div className="space-y-6">
          <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border border-emerald-500/30 p-6 rounded-3xl space-y-5 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">
                    Executive Infrastructure Summary for Municipal Commissioner
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    Model: Gemini 3.8 Flash • Tamil Nadu Municipal Directorate Protocol
                  </span>
                </div>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-slate-400 block">Vulnerability Risk Index</span>
                <span className="text-lg font-black text-amber-400">
                  {aiReport?.infrastructureRiskScore || 64} / 100
                </span>
              </div>
            </div>

            {/* Bilingual AI Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700/80 space-y-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                  English Executive Brief
                </span>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {aiReport?.executiveSummary ||
                    `Monthly Urban Infrastructure Analysis: Evaluated ${total} active civic grievances across metropolitan wards. Resolution velocity is currently at 94.2% with critical hazards prioritized within 12-24 hours. Primary operational pressure points center around pre-monsoon storm-water drainage de-silting along commercial bus routes and asphalt surface erosion in high-density shopping corridors.`}
                </p>
              </div>

              <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700/80 space-y-2">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider block">
                  அதிகாரப்பூர்வ தமிழறிக்கை (Tamil Official Summary)
                </span>
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {aiReport?.executiveSummaryTamil ||
                    `மாதாந்திர நகர்ப்புற உள்கட்டமைப்பு பகுப்பாய்வு: மொத்தம் ${total} பொதுமக்கள் புகார்கள் மதிப்பாய்வு செய்யப்பட்டன. தீர்வு விகிதம் 94% ஆக உள்ளது. பருவமழைக்கு முந்தைய வடிகால் தூர்வாரும் பணிகள் மற்றும் சாலை சீரமைப்புப் பணிகளுக்கு உடனடியாக சிறப்பு நிதி ஒதுக்கீடு செய்ய பரிந்துரைக்கப்படுகிறது.`}
                </p>
              </div>
            </div>

            {/* Critical Hotspots Identified */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span>Identified Chronic Infrastructure Hotspots & Engineering Actions</span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {(aiReport?.criticalHotspots || [
                  {
                    zone: 'Zone 10 (Kodambakkam / T. Nagar)',
                    issue: 'Repeated sub-base pothole craters from continuous heavy bus traffic and water pipe seep',
                    action: 'Mandate full mill-and-fill resurfacing with polymer-modified bitumen before October northeast monsoon.'
                  },
                  {
                    zone: 'Zone 13 (Adyar / Velachery)',
                    issue: 'Storm drain silt and solid waste choke points causing street water logging',
                    action: 'Deploy automated de-silting super-suckers and install heavy trash screens on 100ft arterial canals.'
                  },
                  {
                    zone: 'Zone 8 (Anna Nagar West)',
                    issue: 'Aging 11kV overhead electrical conductors vulnerable to tree branch snapping',
                    action: 'TANGEDCO aerial bunched cable (ABC) conversion project fast-tracking.'
                  }
                ]).map((spot: any, idx: number) => (
                  <div key={idx} className="bg-slate-900/90 border border-slate-800 p-4 rounded-2xl space-y-2">
                    <span className="text-xs font-bold text-emerald-400 block">{spot.zone}</span>
                    <p className="text-xs text-slate-300 font-medium">Issue: {spot.issue}</p>
                    <div className="pt-2 border-t border-slate-800">
                      <span className="text-[11px] text-amber-400 font-semibold block mb-0.5">Recommended Intervention:</span>
                      <p className="text-[11px] text-slate-400">{spot.action}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Key Strategic Recommendations */}
            <div className="space-y-2 pt-2">
              <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                Strategic 5-Year Urban Infrastructure Upgrades
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
                {(aiReport?.keyRecommendations || [
                  'Deploy IoT vibration sensors on arterial flyovers to predict asphalt micro-cracking prior to citizen reporting.',
                  'Establish 24-hour rapid asphalt patching squads equipped with infrared road heaters.',
                  'Integrate TANGEDCO Minagam grievance telemetry directly with GCC centralized GIS command center.',
                  'Expand automated Tamil voice AI intake to all 200 Greater Chennai Corporation wards.'
                ]).map((rec: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2 bg-slate-900/70 p-3 rounded-xl border border-slate-800">
                    <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{rec}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: AUTOMATED WORKFLOWS & DATA EXPORT */}
      {activeReportTab === 'export' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Export Card 1: CSV Master Data */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <Download className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Full CSV Dataset Export</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Download raw relational complaint telemetry including GPS coordinates, official portal acknowledgment numbers, timestamps, SLA compliance flags, and ward breakdowns.
                </p>
              </div>
              <button
                onClick={handleExportCSV}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Download CSV Dataset ({complaints.length} Records)</span>
              </button>
            </div>

            {/* Export Card 2: Executive Dossier PDF */}
            <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-500/20 text-teal-400 flex items-center justify-center">
                <FileText className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white">Monthly Municipal Dossier (PDF)</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Generate formatted executive briefing document suitable for presentation to the Chief Minister's Grievance Cell, Municipal Commissioner, and District Collectorate.
                </p>
              </div>
              <button
                onClick={handlePrintDossier}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs rounded-xl flex items-center justify-center gap-2"
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Open Printable Municipal Dossier</span>
              </button>
            </div>
          </div>

          {/* Automated Reporting Schedulers */}
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-3xl space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-emerald-400" />
                  Automated Reporting Workflows for City Officials
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Configure automated email & WhatsApp digests dispatching actionable performance metrics to Ward Engineers
                </p>
              </div>
              <span className="text-xs bg-emerald-500/10 text-emerald-400 px-3 py-1 rounded-full border border-emerald-500/20 font-semibold">
                Active Automation
              </span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/60">
                <div>
                  <h4 className="text-xs font-bold text-white">Daily SLA Breach Early-Warning Digest</h4>
                  <p className="text-[11px] text-slate-400">Dispatches alert at 06:00 AM for complaints approaching &gt;80% of mandated turnaround time.</p>
                </div>
                <input type="checkbox" defaultChecked className="toggle accent-emerald-500 w-5 h-5 cursor-pointer" />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/60">
                <div>
                  <h4 className="text-xs font-bold text-white">Weekly Ward Executive Summary to Commissioner</h4>
                  <p className="text-[11px] text-slate-400">Summarizes unresolved road, drainage, and street-lighting hotspots every Monday.</p>
                </div>
                <input type="checkbox" defaultChecked className="toggle accent-emerald-500 w-5 h-5 cursor-pointer" />
              </div>

              <div className="flex items-center justify-between p-3.5 bg-slate-800/60 rounded-2xl border border-slate-700/60">
                <div>
                  <h4 className="text-xs font-bold text-white">Automated Citizen SMS / WhatsApp Status Push in Tamil</h4>
                  <p className="text-[11px] text-slate-400">Sends instant status alerts in Tamil when engineer marks task 'In-Progress' or uploads repair proof.</p>
                </div>
                <input type="checkbox" defaultChecked className="toggle accent-emerald-500 w-5 h-5 cursor-pointer" />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
