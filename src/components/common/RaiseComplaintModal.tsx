import React, { useState } from 'react';
import { useComplaintStore, IncidentCategory, ComplaintSeverity } from '../../store/complaintStore';
import { useUiStore } from '../../store/uiStore';

const AREA_PRESETS = [
  { name: 'Sector 4 - Commercial Central', address: 'Western Express Flyover Descent, Junction 14 Underpass', lat: 19.0825, lng: 72.8812 },
  { name: 'Zone H-East (Western Express Corridor)', address: 'Culvert Invert Sump #912, Station Road Junction', lat: 19.0818, lng: 72.8825 },
  { name: 'Ward F-North (Dharavi Drainage Basin)', address: 'Sector 5 Outfall Canal Ingress, 90 Feet Road', lat: 19.0435, lng: 72.8572 },
  { name: 'Bandra Kurla Complex (BKC Financial Gateway)', address: 'Avenue 3 Culvert Junction, Mithi River Inflow', lat: 19.0657, lng: 72.8688 },
  { name: 'Andheri Subway (Corridor 9)', address: 'Subway Dip Underpass, S.V. Road Junction', lat: 19.1197, lng: 72.8468 },
  { name: 'Custom Landmark / GPS Pin', address: 'Enter custom address or coordinates below', lat: 19.0760, lng: 72.8777 },
];

const CATEGORIES: { id: IncidentCategory; label: string; icon: string; desc: string }[] = [
  { id: 'waterlogging', label: 'Waterlogging & Inundation', icon: 'waves', desc: 'Submerged roads, underpass flooding' },
  { id: 'drain_blockage', label: 'Drain / Culvert Blocked', icon: 'filter_alt', desc: 'Trash or silt choking stormwater grill' },
  { id: 'pump_failure', label: 'Pump Station Failure', icon: 'power_off', desc: 'Sump pump tripped, water bubbling' },
  { id: 'traffic_gridlock', label: 'Traffic Gridlock / Stall', icon: 'traffic', desc: 'Transit buses or cars trapped in water' },
  { id: 'manhole_hazard', label: 'Manhole / Invert Hazard', icon: 'warning', desc: 'Open manhole lid or suction vortex' },
  { id: 'pipe_rupture', label: 'Water Pipe Rupture', icon: 'water_damage', desc: 'Subsurface main supply breach' },
];

export const RaiseComplaintModal: React.FC = () => {
  const { isRaiseComplaintOpen, setIsRaiseComplaintOpen, submitComplaint } = useComplaintStore();
  const { notifications } = useUiStore();

  const [selectedAreaIndex, setSelectedAreaIndex] = useState(0);
  const [customAddress, setCustomAddress] = useState('');
  const [category, setCategory] = useState<IncidentCategory>('waterlogging');
  const [severity, setSeverity] = useState<ComplaintSeverity>('high');
  const [conditionDescription, setConditionDescription] = useState(
    'Water level rising rapidly over road surface. Underpass impassable for cars and pedestrians.'
  );
  const [waterLevelCm, setWaterLevelCm] = useState(38);
  const [trafficHalted, setTrafficHalted] = useState(true);
  const [powerOutage, setPowerOutage] = useState(false);
  const [citizenName, setCitizenName] = useState('');
  const [citizenContact, setCitizenContact] = useState('');
  const [hasSimulatedPhoto, setHasSimulatedPhoto] = useState(true);

  // Submission state
  const [submittedReceipt, setSubmittedReceipt] = useState<{
    trackingNumber: string;
    assignedOrganisation: string;
    targetSlaMinutes: number;
    linkedIncidentId?: string;
    area: string;
  } | null>(null);

  if (!isRaiseComplaintOpen) return null;

  const currentArea = AREA_PRESETS[selectedAreaIndex];
  const finalAddress = selectedAreaIndex === AREA_PRESETS.length - 1 && customAddress ? customAddress : currentArea.address;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const result = submitComplaint({
      zone: currentArea.name,
      address: finalAddress,
      latitude: currentArea.lat,
      longitude: currentArea.lng,
      category,
      severity,
      conditionDescription,
      waterLevelCm,
      trafficHalted,
      powerOutage,
      citizenName: citizenName || 'Civic Field Reporter',
      citizenContact: citizenContact || 'Anonymous Citizen Report',
      photoUrl: hasSimulatedPhoto ? 'https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=400&q=80' : undefined,
    });

    // Push into UI notification stream so operations team gets alerted immediately
    useUiStore.setState((state) => ({
      notifications: [
        {
          id: `notif_${Date.now()}`,
          title: `Civic Area Complaint Logged: ${result.trackingNumber}`,
          message: `${result.zone}: ${category.replace(/_/g, ' ')} reported. Assigned to ${result.assignedOrganisation} (SLA: ${result.targetSlaMinutes}m).`,
          type: severity === 'critical' ? 'critical' : 'warning',
          timestamp: 'Just now',
          read: false,
          incidentId: result.linkedIncidentId,
        },
        ...state.notifications,
      ],
    }));

    setSubmittedReceipt({
      trackingNumber: result.trackingNumber,
      assignedOrganisation: result.assignedOrganisation,
      targetSlaMinutes: result.targetSlaMinutes,
      linkedIncidentId: result.linkedIncidentId,
      area: currentArea.name,
    });
  };

  const handleReset = () => {
    setSubmittedReceipt(null);
    setConditionDescription('Water level rising rapidly over road surface. Underpass impassable for cars and pedestrians.');
    setWaterLevelCm(38);
    setTrafficHalted(true);
    setPowerOutage(false);
    setIsRaiseComplaintOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs select-none animate-in fade-in duration-150">
      <div 
        className="w-full max-w-2xl bg-surface-container-lowest rounded-xl shadow-2xl border border-outline-variant/60 flex flex-col overflow-hidden max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 bg-surface-container-low border-b border-outline-variant/40 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-container text-on-primary flex items-center justify-center shadow-xs">
              <span className="material-symbols-outlined text-[24px]">campaign</span>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-label-mono-sm text-label-mono-sm font-bold px-2 py-0.5 rounded bg-surface-container text-on-surface">
                  CIVIC-311
                </span>
                <h2 className="font-headline-sm text-headline-sm text-on-surface font-semibold tracking-tight">
                  Report Civic Issue / Raise Area Complaint
                </h2>
              </div>
              <p className="font-body-sm text-body-sm text-on-surface-variant">
                Directly transmits ground observations to Municipal Emergency Command &amp; Field Dispatch Units
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleReset}
            className="w-8 h-8 rounded-full hover:bg-surface-container flex items-center justify-center text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined text-[20px]">close</span>
          </button>
        </div>

        {/* Modal Body */}
        {submittedReceipt ? (
          /* Confirmation Receipt View */
          <div className="p-8 flex flex-col items-center text-center gap-6 overflow-y-auto">
            <div className="w-16 h-16 rounded-full bg-tertiary-fixed text-on-tertiary-fixed flex items-center justify-center shadow-md animate-bounce">
              <span className="material-symbols-outlined text-[36px]">check_circle</span>
            </div>

            <div className="flex flex-col gap-1 max-w-md">
              <span className="font-label-mono text-label-mono font-bold text-primary text-base">
                COMPLAINT REGISTERED SUCCESSFULLY
              </span>
              <h3 className="font-headline-md text-headline-md text-on-surface font-semibold">
                Tracking ID: <code className="font-label-mono px-2 py-1 bg-surface-container rounded text-primary">{submittedReceipt.trackingNumber}</code>
              </h3>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-2 leading-relaxed">
                Your report for <strong>{submittedReceipt.area}</strong> has been ingested into the causal fusion pipeline and dispatched to the competent municipal authority.
              </p>
            </div>

            {/* Receipt Summary Card */}
            <div className="w-full bg-surface-container-low rounded-lg p-5 border border-outline-variant/30 flex flex-col gap-3 text-left">
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                <span className="font-caption text-caption uppercase text-on-surface-variant font-semibold">Assigned Operational Unit:</span>
                <span className="font-title-sm text-title-sm text-on-surface font-medium text-right max-w-[280px]">
                  {submittedReceipt.assignedOrganisation}
                </span>
              </div>
              <div className="flex items-center justify-between pb-2 border-b border-outline-variant/20">
                <span className="font-caption text-caption uppercase text-on-surface-variant font-semibold">Guaranteed Response SLA:</span>
                <span className="font-label-mono text-label-mono font-bold text-error">
                  T+{submittedReceipt.targetSlaMinutes} Minutes
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-caption text-caption uppercase text-on-surface-variant font-semibold">Algorithmic Correlation:</span>
                <span className="font-label-mono-sm text-label-mono-sm px-2 py-0.5 rounded bg-surface-container text-secondary font-semibold">
                  {submittedReceipt.linkedIncidentId ? `Linked to ${submittedReceipt.linkedIncidentId}` : 'New Spatial Cluster Formed'}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-3 w-full justify-center pt-2">
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(submittedReceipt.trackingNumber);
                  alert(`Copied tracking ID: ${submittedReceipt.trackingNumber}`);
                }}
                className="h-10 px-4 rounded bg-surface-container hover:bg-surface-container-high text-on-surface font-title-sm text-title-sm border border-outline-variant/40 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">content_copy</span>
                <span>Copy Tracking ID</span>
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="h-10 px-6 rounded bg-primary text-on-primary font-title-sm text-title-sm hover:bg-primary-container shadow-sm flex items-center gap-2 cursor-pointer transition-colors"
              >
                <span className="material-symbols-outlined text-[18px]">done</span>
                <span>Done</span>
              </button>
            </div>
          </div>
        ) : (
          /* Complaint Submission Form */
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6 overflow-y-auto">
            {/* Step 1: Specific Area & Location */}
            <div className="flex flex-col gap-2">
              <label className="font-caption text-caption uppercase tracking-wider text-on-surface-variant font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">location_on</span>
                1. Specific Area / Zone Selection
              </label>
              <select
                value={selectedAreaIndex}
                onChange={(e) => setSelectedAreaIndex(Number(e.target.value))}
                className="w-full h-10 px-3 rounded bg-surface border border-outline-variant font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary cursor-pointer"
              >
                {AREA_PRESETS.map((area, idx) => (
                  <option key={area.name} value={idx}>
                    {area.name}
                  </option>
                ))}
              </select>

              {selectedAreaIndex === AREA_PRESETS.length - 1 ? (
                <input
                  type="text"
                  placeholder="Enter custom street address or landmark..."
                  value={customAddress}
                  onChange={(e) => setCustomAddress(e.target.value)}
                  className="w-full h-9 px-3 rounded bg-surface border border-outline-variant font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary mt-1"
                  required
                />
              ) : (
                <div className="flex items-center justify-between px-3 py-2 rounded bg-surface-container-low border border-outline-variant/30 text-body-xs font-body-xs text-on-surface-variant">
                  <span className="truncate">{currentArea.address}</span>
                  <span className="font-label-mono-sm text-label-mono-sm shrink-0 ml-2">
                    {currentArea.lat.toFixed(4)}°N, {currentArea.lng.toFixed(4)}°E
                  </span>
                </div>
              )}
            </div>

            {/* Step 2: Incident Category Selection */}
            <div className="flex flex-col gap-2">
              <label className="font-caption text-caption uppercase tracking-wider text-on-surface-variant font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">category</span>
                2. Incident Type / Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {CATEGORIES.map((cat) => {
                  const isSelected = category === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => setCategory(cat.id)}
                      className={`p-2.5 rounded-lg border text-left flex flex-col gap-1 transition-all cursor-pointer ${
                        isSelected
                          ? 'bg-primary-container/30 border-primary text-on-surface shadow-xs'
                          : 'bg-surface hover:bg-surface-container border-outline-variant/40 text-on-surface-variant'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className={`material-symbols-outlined text-[20px] ${isSelected ? 'text-primary' : 'text-on-surface-variant'}`}>
                          {cat.icon}
                        </span>
                        {isSelected && (
                          <span className="material-symbols-outlined text-[16px] text-primary">check_circle</span>
                        )}
                      </div>
                      <span className="font-title-sm text-title-sm font-semibold text-on-surface leading-tight">
                        {cat.label}
                      </span>
                      <span className="font-caption text-caption text-[11px] text-on-surface-variant line-clamp-1">
                        {cat.desc}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Current Condition Description */}
            <div className="flex flex-col gap-2">
              <label className="font-caption text-caption uppercase tracking-wider text-on-surface-variant font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">description</span>
                3. Ground Condition &amp; Incident Observation
              </label>
              <textarea
                rows={3}
                value={conditionDescription}
                onChange={(e) => setConditionDescription(e.target.value)}
                placeholder="Describe current ground situation: water height, vehicle stalls, pump noise, danger to pedestrians..."
                className="w-full p-3 rounded bg-surface border border-outline-variant font-body-sm text-body-sm text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary resize-none"
                required
              />

              {/* Water Level Depth Slider */}
              <div className="p-3 bg-surface-container-low rounded border border-outline-variant/30 flex flex-col gap-2">
                <div className="flex items-center justify-between font-body-sm text-body-sm">
                  <span className="text-on-surface font-medium flex items-center gap-1.5">
                    <span className="material-symbols-outlined text-[16px] text-secondary">straighten</span>
                    Estimated Water Depth:
                  </span>
                  <span className="font-label-mono text-label-mono font-bold text-primary">
                    {waterLevelCm} cm {waterLevelCm > 40 ? '(Knee Deep)' : waterLevelCm > 20 ? '(Ankle Deep)' : '(Surface Ponding)'}
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  value={waterLevelCm}
                  onChange={(e) => setWaterLevelCm(Number(e.target.value))}
                  className="w-full accent-primary cursor-pointer"
                />
              </div>

              {/* Critical Impact Toggles */}
              <div className="grid grid-cols-2 gap-2 mt-1">
                <label className="flex items-center gap-2 p-2.5 rounded bg-surface border border-outline-variant/30 cursor-pointer hover:bg-surface-container">
                  <input
                    type="checkbox"
                    checked={trafficHalted}
                    onChange={(e) => setTrafficHalted(e.target.checked)}
                    className="accent-primary w-4 h-4 rounded cursor-pointer"
                  />
                  <span className="font-body-sm text-body-sm text-on-surface">Traffic Roadway Paralyzed</span>
                </label>
                <label className="flex items-center gap-2 p-2.5 rounded bg-surface border border-outline-variant/30 cursor-pointer hover:bg-surface-container">
                  <input
                    type="checkbox"
                    checked={powerOutage}
                    onChange={(e) => setPowerOutage(e.target.checked)}
                    className="accent-primary w-4 h-4 rounded cursor-pointer"
                  />
                  <span className="font-body-sm text-body-sm text-on-surface">Electrical Hazard / Power Out</span>
                </label>
              </div>
            </div>

            {/* Step 4: Urgency / Severity */}
            <div className="flex flex-col gap-2">
              <label className="font-caption text-caption uppercase tracking-wider text-on-surface-variant font-semibold flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[16px] text-primary">priority_high</span>
                4. Reported Severity
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[
                  { id: 'low', label: 'Low', badge: 'Minor nuisance' },
                  { id: 'moderate', label: 'Moderate', badge: 'Curb level' },
                  { id: 'high', label: 'High', badge: 'Transit stopped' },
                  { id: 'critical', label: 'Critical', badge: 'Emergency life risk' },
                ].map((sev) => (
                  <button
                    key={sev.id}
                    type="button"
                    onClick={() => setSeverity(sev.id as ComplaintSeverity)}
                    className={`py-2 px-1 rounded text-center border font-label-mono-sm text-label-mono-sm transition-all cursor-pointer ${
                      severity === sev.id
                        ? sev.id === 'critical'
                          ? 'bg-error-container text-on-error-container border-error font-bold'
                          : 'bg-primary-container text-on-primary border-primary font-bold'
                        : 'bg-surface hover:bg-surface-container border-outline-variant/40 text-on-surface-variant'
                    }`}
                  >
                    <div>{sev.label}</div>
                    <div className="text-[10px] font-caption text-caption opacity-80">{sev.badge}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 5: Reporter Contact & Photo */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-outline-variant/30">
              <div>
                <label className="font-caption text-caption uppercase text-on-surface-variant font-semibold">
                  Reporter Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="Citizen / Officer Name"
                  value={citizenName}
                  onChange={(e) => setCitizenName(e.target.value)}
                  className="w-full h-9 px-3 rounded bg-surface border border-outline-variant font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary mt-1"
                />
              </div>
              <div>
                <label className="font-caption text-caption uppercase text-on-surface-variant font-semibold">
                  Contact Phone / WhatsApp
                </label>
                <input
                  type="text"
                  placeholder="+91 98XXX XXXXX (for SMS updates)"
                  value={citizenContact}
                  onChange={(e) => setCitizenContact(e.target.value)}
                  className="w-full h-9 px-3 rounded bg-surface border border-outline-variant font-body-sm text-body-sm text-on-surface focus:outline-none focus:border-primary mt-1"
                />
              </div>
            </div>

            {/* Evidence attachment preview toggle */}
            <div className="p-3 bg-surface-container-low rounded border border-outline-variant/30 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[20px] text-secondary">add_photo_alternate</span>
                <div>
                  <div className="font-body-sm text-body-sm text-on-surface font-medium">Attach Camera Photo Evidence</div>
                  <div className="font-caption text-caption text-on-surface-variant">Attaches ground photo for automated visual corroboration</div>
                </div>
              </div>
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasSimulatedPhoto}
                  onChange={(e) => setHasSimulatedPhoto(e.target.checked)}
                  className="accent-primary w-4 h-4 cursor-pointer"
                />
                <span className="ml-2 font-body-sm text-body-sm text-on-surface">Attached</span>
              </label>
            </div>

            {/* Footer Buttons */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-outline-variant/30">
              <button
                type="button"
                onClick={handleReset}
                className="h-10 px-4 rounded bg-surface hover:bg-surface-container text-on-surface font-title-sm text-title-sm border border-outline-variant/40 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="h-10 px-6 rounded bg-primary text-on-primary font-title-sm text-title-sm hover:bg-primary-container shadow-md flex items-center gap-2 transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                <span>Transmit Complaint to Organization</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
