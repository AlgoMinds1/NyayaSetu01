import { INITIAL_CASES, INSTITUTIONS } from '../data/mockData';

const STORAGE_KEY = 'nyayasetu_cases_v1';
const INST_STORAGE_KEY = 'nyayasetu_institutions_v1';

export const getStoredCases = () => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CASES));
    return INITIAL_CASES;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INITIAL_CASES;
  }
};

export const getStoredInstitutions = () => {
  const data = localStorage.getItem(INST_STORAGE_KEY);
  if (!data) {
    localStorage.setItem(INST_STORAGE_KEY, JSON.stringify(INSTITUTIONS));
    return INSTITUTIONS;
  }
  try {
    return JSON.parse(data);
  } catch (e) {
    return INSTITUTIONS;
  }
};

export const saveCases = (cases) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cases));
};

export const createComplaint = (complaintData) => {
  const currentCases = getStoredCases();
  const newId = `AICTE-2026-C-${Math.floor(10000 + Math.random() * 90000)}`;
  
  // Cross-check for overlap with existing institutions handled by other bureaus
  const existingMatches = currentCases.filter(c => 
    c.aicteId === complaintData.aicteId || 
    c.institutionName.toLowerCase().includes(complaintData.institutionName.toLowerCase())
  );

  let overlapStatus = "NONE";
  let overlapWithCaseId = null;
  let overlapBureau = null;

  if (existingMatches.length > 0) {
    overlapStatus = "COORDINATION_ALERT";
    overlapWithCaseId = existingMatches[0].id;
    overlapBureau = existingMatches[0].currentBureau;
  }

  const newCase = {
    id: newId,
    aicteId: complaintData.aicteId || "1-9999999",
    institutionName: complaintData.institutionName,
    category: complaintData.category,
    title: complaintData.title,
    description: complaintData.description,
    complainantRole: complaintData.complainantRole || "Student",
    complainantName: complaintData.complainantName || "Anonymous Complainant",
    currentBureau: "PGRC", // Default destination for public grievances
    assignedOfficer: "Shri Rajesh Verma (PGRC)",
    status: "Under Process",
    priority: complaintData.priority || "Medium",
    dateSubmitted: new Date().toISOString().split('T')[0],
    lastActionDate: new Date().toISOString().split('T')[0],
    slaDaysRemaining: 14,
    overlapStatus,
    overlapWithCaseId,
    overlapBureau,
    history: [
      {
        date: new Date().toLocaleString(),
        actor: complaintData.complainantRole || "Student",
        action: "Grievance submitted via NyayaSetu Portal",
        bureau: "PGRC"
      },
      ...(overlapStatus !== "NONE" ? [{
        date: new Date().toLocaleString(),
        actor: "System AI / Overlap Engine",
        action: `Automatic Cross-Bureau Alert: Concurrent proceedings found in ${overlapBureau} for case ${overlapWithCaseId}`,
        bureau: "Cross-Bureau"
      }] : [])
    ]
  };

  const updatedCases = [newCase, ...currentCases];
  saveCases(updatedCases);
  return newCase;
};

export const updateCaseStatus = (caseId, newStatus, remarks, actorName, bureau) => {
  const currentCases = getStoredCases();
  const updated = currentCases.map(c => {
    if (c.id === caseId) {
      const historyEntry = {
        date: new Date().toLocaleString(),
        actor: actorName || "Authorized Officer",
        action: `Status changed to '${newStatus}'. Remarks: ${remarks || 'No remarks added'}`,
        bureau: bureau || c.currentBureau
      };
      return {
        ...c,
        status: newStatus,
        lastActionDate: new Date().toISOString().split('T')[0],
        history: [historyEntry, ...c.history]
      };
    }
    return c;
  });
  saveCases(updated);
  return updated;
};

export const transferCaseBureau = (caseId, targetBureau, targetOfficer, transferNote, actorName) => {
  const currentCases = getStoredCases();
  const updated = currentCases.map(c => {
    if (c.id === caseId) {
      const historyEntry = {
        date: new Date().toLocaleString(),
        actor: actorName || "Bureau In-Charge",
        action: `Case transferred from ${c.currentBureau} to ${targetBureau}. Reason: ${transferNote}`,
        bureau: targetBureau
      };
      return {
        ...c,
        currentBureau: targetBureau,
        assignedOfficer: targetOfficer,
        lastActionDate: new Date().toISOString().split('T')[0],
        history: [historyEntry, ...c.history]
      };
    }
    return c;
  });
  saveCases(updated);
  return updated;
};

export const resolveOverlap = (caseId1, caseId2, action, note) => {
  const currentCases = getStoredCases();
  const updated = currentCases.map(c => {
    if (c.id === caseId1 || c.id === caseId2) {
      const historyEntry = {
        date: new Date().toLocaleString(),
        actor: "AICTE Joint Coordination Committee",
        action: `Overlap ${action}: ${note}. Linked with ${c.id === caseId1 ? caseId2 : caseId1}`,
        bureau: "Cross-Bureau"
      };
      return {
        ...c,
        overlapStatus: action === "DISMISS" ? "NONE" : "LINKED_COORDINATED",
        history: [historyEntry, ...c.history]
      };
    }
    return c;
  });
  saveCases(updated);
  return updated;
};

export const resetMockData = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CASES));
  localStorage.setItem(INST_STORAGE_KEY, JSON.stringify(INSTITUTIONS));
  return INITIAL_CASES;
};
