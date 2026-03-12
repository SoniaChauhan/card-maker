/**
 * Resume Parser — extracts structured data from uploaded PDF / Word / Text files.
 * Uses pdfjs-dist for PDF and mammoth for DOCX.
 */

/**
 * Parse an uploaded resume file and return structured data.
 * @param {File} file
 * @returns {Promise<object>} parsed resume fields
 */
export async function parseResumeFile(file) {
  const ext = file.name.split('.').pop().toLowerCase();
  let text = '';

  if (ext === 'pdf') {
    text = await extractTextFromPDF(file);
  } else if (ext === 'docx' || ext === 'doc') {
    text = await extractTextFromDOCX(file);
  } else if (ext === 'txt') {
    text = await file.text();
  } else {
    throw new Error('Unsupported file format. Please upload a PDF, DOCX or TXT file.');
  }

  return parseResumeText(text);
}

/* ── PDF Text Extraction ── */
async function extractTextFromPDF(file) {
  // Load pdf.js from CDN to avoid Next.js webpack issues with pdfjs-dist
  const PDFJS_VERSION = '3.11.174';
  const cdnBase = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS_VERSION}`;

  if (!window.pdfjsLib) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `${cdnBase}/pdf.min.js`;
      script.onload = resolve;
      script.onerror = () => reject(new Error('Failed to load PDF.js library'));
      document.head.appendChild(script);
    });
  }

  const pdfjsLib = window.pdfjsLib;
  pdfjsLib.GlobalWorkerOptions.workerSrc = `${cdnBase}/pdf.worker.min.js`;

  const arrayBuf = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuf }).promise;
  const pages = [];
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    // Group text items by their vertical position (y-coordinate) to preserve line breaks.
    // Items on the same line share a similar transform[5] (y) value.
    let lastY = null;
    const parts = [];
    for (const item of content.items) {
      const y = item.transform ? item.transform[5] : null;
      if (lastY !== null && y !== null && Math.abs(y - lastY) > 2) {
        parts.push('\n');
      } else if (parts.length > 0) {
        // Same line — add space if needed between items
        const prev = parts[parts.length - 1];
        if (prev && !prev.endsWith(' ') && !item.str.startsWith(' ')) {
          parts.push(' ');
        }
      }
      parts.push(item.str);
      lastY = y;
    }
    pages.push(parts.join(''));
  }
  return pages.join('\n');
}

/* ── DOCX Text Extraction ── */
async function extractTextFromDOCX(file) {
  // Load mammoth from CDN to avoid Next.js webpack issues
  if (!window.mammoth) {
    await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdnjs.cloudflare.com/ajax/libs/mammoth/1.6.0/mammoth.browser.min.js';
      script.onload = resolve;
      script.onerror = () => reject(new Error('Failed to load DOCX parser'));
      document.head.appendChild(script);
    });
  }
  const arrayBuf = await file.arrayBuffer();
  const result = await window.mammoth.extractRawText({ arrayBuffer: arrayBuf });
  return result.value;
}

/* ── Text → Structured Data ── */
function parseResumeText(text) {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const data = {
    fullName: '',
    jobTitle: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    summary: '',
    experience: [],
    education: [],
    projects: [],
    skills: '',
    languages: '',
    interests: '',
  };

  // Extract email
  const emailMatch = text.match(/[\w.+-]+@[\w-]+\.[\w.-]+/);
  if (emailMatch) data.email = emailMatch[0];

  // Extract phone (broad patterns)
  const phoneMatch = text.match(/(?:\+?\d{1,3}[\s-]?)?\(?\d{2,5}\)?[\s.-]?\d{3,5}[\s.-]?\d{3,5}/);
  if (phoneMatch) data.phone = phoneMatch[0].trim();

  // Extract LinkedIn
  const linkedinMatch = text.match(/linkedin\.com\/in\/[a-zA-Z0-9_-]+/i);
  if (linkedinMatch) data.linkedin = linkedinMatch[0];

  // Extract portfolio / website
  if (!data.linkedin) {
    const urlMatch = text.match(/(?:https?:\/\/)?(?:www\.)?[a-z0-9-]+\.[a-z]{2,}(?:\/[^\s]*)*/i);
    if (urlMatch && !urlMatch[0].includes('linkedin')) data.linkedin = urlMatch[0];
  }

  // Section-based extraction
  const sections = splitIntoSections(text);

  // Try to extract name — first non-section, non-contact line
  for (const line of lines) {
    const clean = line.replace(/[^a-zA-Z\s.]/g, '').trim();
    if (
      clean.length >= 3 && clean.length < 50 &&
      !line.includes('@') &&
      !line.match(/^\+?\d/) &&
      !line.match(/linkedin/i) &&
      !isSectionHeader(line) &&
      clean.split(/\s+/).length >= 2 &&            // at least first+last
      clean.split(/\s+/).every(w => /^[A-Z]/.test(w))  // each word capitalized
    ) {
      data.fullName = clean;
      break;
    }
  }
  // Fallback: first line
  if (!data.fullName && lines.length) {
    const first = lines[0].replace(/[^a-zA-Z\s.]/g, '').trim();
    if (first.length >= 2 && first.length < 60) data.fullName = first;
  }

  // Job title — look for a line right after the name, or look for common title keywords
  const nameIdx = lines.findIndex(l => l.includes(data.fullName));
  if (nameIdx >= 0 && nameIdx + 1 < lines.length) {
    const nextLine = lines[nameIdx + 1];
    if (
      !nextLine.includes('@') &&
      !nextLine.match(/^\+?\d/) &&
      !nextLine.match(/linkedin/i) &&
      !isSectionHeader(nextLine) &&
      nextLine.length < 60
    ) {
      data.jobTitle = nextLine;
    }
  }

  // Location — look in contact section or near top
  if (sections.contact) {
    const locMatch = sections.contact.match(/(?:^|\n)([A-Z][a-zA-Z\s]+,\s*[A-Z][a-zA-Z\s]+(?:\d{5,6})?)/m);
    if (locMatch) data.location = locMatch[1].trim();
  }
  if (!data.location) {
    // Scan top 8 lines for city, state/country pattern
    for (let i = 0; i < Math.min(8, lines.length); i++) {
      const lm = lines[i].match(/([A-Z][a-z]+(?:\s[A-Z][a-z]+)*,\s*[A-Z][a-z]+(?:\s[A-Z][a-z]+)*(?:\s*\d{5,6})?)/);
      if (lm && !lines[i].includes('@') && !isSectionHeader(lines[i])) {
        data.location = lm[1].trim();
        break;
      }
    }
  }

  // Summary / Profile / Objective
  if (sections.summary) data.summary = sections.summary.replace(/\n{2,}/g, '\n').trim();

  // Skills
  if (sections.skills) {
    data.skills = cleanList(sections.skills);
  }

  // Languages
  if (sections.languages) {
    data.languages = cleanList(sections.languages);
  }

  // Interests / Hobbies
  if (sections.interests) {
    data.interests = cleanList(sections.interests);
  }

  // Parse experience
  if (sections.experience) {
    data.experience = parseExperienceEntries(sections.experience);
  }
  if (data.experience.length === 0) {
    data.experience = [{ title: '', company: '', from: '', to: '', location: '', desc: '' }];
  }

  // Parse education
  if (sections.education) {
    data.education = parseEducationEntries(sections.education);
  }
  if (data.education.length === 0) {
    data.education = [{ degree: '', institution: '', year: '', location: '' }];
  }

  // Parse projects
  if (sections.projects) {
    data.projects = parseProjectEntries(sections.projects);
  }
  if (data.projects.length === 0) {
    data.projects = [{ name: '', tech: '', desc: '' }];
  }

  return data;
}

/* Clean a list section into comma-separated values */
function cleanList(text) {
  return text
    .replace(/[\n•·\-\*▪►●○◆‣⦿]/g, ',')
    .replace(/,{2,}/g, ',')
    .replace(/^,|,$/g, '')
    .split(',')
    .map(s => s.trim())
    .filter(Boolean)
    .join(', ');
}

/* ── Section Header Detection ── */
const SECTION_PATTERNS = {
  summary:    /^(?:summary|profile|about\s*me?|objective|professional\s*summary|career\s*summary|career\s*objective|overview)/i,
  experience: /^(?:experience|work\s*experience|employment|professional\s*experience|work\s*history|career\s*history|relevant\s*experience)/i,
  education:  /^(?:education|education\s*(?:and|&)\s*training|academic|qualifications|certifications?\s*(?:and|&)\s*education|academic\s*background)/i,
  skills:     /^(?:skills|technical\s*skills|core\s*skills|key\s*skills|competencies|areas?\s*of\s*expertise|technologies|tools?\s*(?:and|&)\s*technologies)/i,
  languages:  /^(?:languages?|language\s*proficiency)/i,
  interests:  /^(?:interests?|hobbies|interests?\s*(?:and|&)\s*hobbies|extracurricular|activities)/i,
  contact:    /^(?:contact|personal\s*info|personal\s*details|contact\s*info(?:rmation)?)/i,
  projects:   /^(?:projects?|key\s*projects?|personal\s*projects?)/i,
  certifications: /^(?:certifications?|licenses?|credentials?|certifications?\s*(?:and|&)\s*awards?)/i,
};

function isSectionHeader(line) {
  const clean = line.replace(/[^a-zA-Z\s]/g, '').trim();
  return Object.values(SECTION_PATTERNS).some(p => p.test(clean));
}

function splitIntoSections(text) {
  const lines = text.split('\n');
  const sections = {};
  let currentSection = null;
  let buffer = [];

  for (const line of lines) {
    const trimmed = line.trim();
    const clean = trimmed.replace(/[^a-zA-Z\s]/g, '').trim();

    let matched = false;
    for (const [key, pattern] of Object.entries(SECTION_PATTERNS)) {
      if (pattern.test(clean)) {
        // Save previous section
        if (currentSection && buffer.length) {
          sections[currentSection] = buffer.join('\n').trim();
        }
        currentSection = key;
        buffer = [];
        matched = true;
        break;
      }
    }
    if (!matched && currentSection) {
      buffer.push(trimmed);
    }
  }
  // Save last section
  if (currentSection && buffer.length) {
    sections[currentSection] = buffer.join('\n').trim();
  }

  return sections;
}

/* ── Parse experience entries ── */
function parseExperienceEntries(text) {
  const entries = [];
  const lines = text.split('\n').filter(l => l.trim());

  // Date pattern used to detect entry boundaries
  const DATE_RE = /(\d{1,2}\/\d{4}|\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4})\s*[-–—to]+\s*(\d{1,2}\/\d{4}|\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4}|Current|Present|Till\s*Date|Ongoing)/i;
  const SINGLE_DATE_RE = /\b(\d{1,2}\/\d{4}|(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{4})\b/i;

  // Split text into blocks — each block starts at a line that contains a date range
  // or looks like a job title (e.g., "Senior Software Engineer" without bullet chars)
  const blockStarts = [];
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (DATE_RE.test(line)) {
      // date range found — this line or previous line is block start
      if (i > 0 && !DATE_RE.test(lines[i - 1]) && !lines[i - 1].match(/^[\s•·\-\*▪►●]/)) {
        if (!blockStarts.includes(i - 1)) blockStarts.push(i - 1);
      } else {
        blockStarts.push(i);
      }
    }
  }

  // Fallback: if no date ranges found, try splitting on lines that look like titles
  if (blockStarts.length === 0) {
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      if (line.length < 80 && !line.match(/^[\s•·\-\*▪►●]/) && !SINGLE_DATE_RE.test(line) && line.length > 5) {
        blockStarts.push(i);
      }
    }
  }

  if (blockStarts.length === 0 && lines.length > 0) blockStarts.push(0);

  for (let b = 0; b < blockStarts.length; b++) {
    const start = blockStarts[b];
    const end = b + 1 < blockStarts.length ? blockStarts[b + 1] : lines.length;
    const block = lines.slice(start, end);
    if (block.length === 0) continue;

    const entry = { title: '', company: '', from: '', to: '', location: '', desc: '' };

    // Look for dates in the block
    const blockText = block.join('\n');
    const dateMatch = blockText.match(DATE_RE);
    if (dateMatch) {
      entry.from = dateMatch[1] || '';
      entry.to = dateMatch[2] || '';
    }

    // First non-bullet, non-date line is likely title or company
    const headerLines = block.filter(l => !l.match(/^[\s•·\-\*▪►●]/) && l.length > 2);
    if (headerLines.length >= 1) {
      // Try to split "Title at Company" or "Title, Company" or "Title | Company"
      const h = headerLines[0];
      const splitMatch = h.match(/^(.+?)(?:\s+at\s+|\s*[|,]\s*)(.+)$/i);
      if (splitMatch) {
        entry.title = splitMatch[1].trim();
        entry.company = splitMatch[2].trim();
      } else {
        entry.title = h.replace(DATE_RE, '').replace(/[,\-–—]+$/, '').trim();
      }
    }
    if (headerLines.length >= 2 && !entry.company) {
      entry.company = headerLines[1].replace(DATE_RE, '').replace(/[,\-–—]+$/, '').trim();
    }

    // Location — look for City, State/Country pattern
    for (const line of block) {
      const locMatch = line.match(/([A-Z][a-z]+(?:\s[A-Z][a-z]+)*,\s*[A-Z][a-z]+(?:\s*\d{5,6})?)/);
      if (locMatch && !line.includes('@')) {
        entry.location = locMatch[1];
        break;
      }
    }

    // Description — bullet lines
    const descLines = block.filter(l => {
      const trimL = l.trim();
      return (trimL.match(/^[\s•·\-\*▪►●]/) || (block.indexOf(l) > 1 && !DATE_RE.test(l) && l.length > 20));
    });
    entry.desc = descLines.map(l => l.replace(/^[\s•·\-\*▪►●○◆‣⦿]+/, '').trim()).filter(Boolean).join('\n');

    if (entry.title || entry.company || entry.desc) entries.push(entry);
  }

  return entries.length > 0 ? entries : [{ title: '', company: '', from: '', to: '', location: '', desc: '' }];
}

/* ── Parse education entries ── */
function parseEducationEntries(text) {
  const entries = [];
  const lines = text.split('\n').filter(l => l.trim());

  let current = null;
  for (const line of lines) {
    const yearMatch = line.match(/\b(19|20)\d{2}\b/);
    if (line.match(/diploma|degree|bachelor|master|mba|b\.tech|m\.tech|bsc|msc|phd|certificate/i) || (!current && line.length > 3)) {
      if (current) entries.push(current);
      current = { degree: line.replace(/[\d/,]+/g, '').trim(), institution: '', year: yearMatch ? yearMatch[0] : '', location: '' };
    } else if (current) {
      if (yearMatch && !current.year) current.year = yearMatch[0];
      else if (!current.institution) current.institution = line.trim();
      else if (!current.location && line.length < 40) current.location = line.trim();
    }
  }
  if (current) entries.push(current);

  return entries;
}

/* ── Parse project entries ── */
function parseProjectEntries(text) {
  const entries = [];
  const lines = text.split('\n').filter(l => l.trim());
  let current = null;

  for (const line of lines) {
    const trimmed = line.trim();
    const isBullet = /^[\s•·\-\*▪►●○◆‣⦿]/.test(trimmed);

    if (!isBullet && trimmed.length > 3 && trimmed.length < 100) {
      // Likely a project name/title line
      if (current) entries.push(current);
      // Try to split "Name — Tech" or "Name | Tech" or "Name (Tech)"
      const splitMatch = trimmed.match(/^(.+?)(?:\s*[|–—]\s*|\s*\(([^)]+)\)\s*)(.*)$/);
      if (splitMatch) {
        current = { name: splitMatch[1].trim(), tech: (splitMatch[2] || splitMatch[3] || '').trim(), desc: '' };
      } else {
        current = { name: trimmed, tech: '', desc: '' };
      }
    } else if (current) {
      const cleaned = trimmed.replace(/^[\s•·\-\*▪►●○◆‣⦿]+/, '').trim();
      if (cleaned) {
        current.desc = current.desc ? current.desc + '\n' + cleaned : cleaned;
      }
    }
  }
  if (current) entries.push(current);

  return entries;
}
