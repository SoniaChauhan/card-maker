import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

/* ══════════════════════════════════════════
   MODE 1 — "text"  (Fill with AI on forms)
   ══════════════════════════════════════════ */
function buildTextPrompt(cardType, data) {
  switch (cardType) {

    case 'birthday': {
      const name = data.birthdayPerson || 'the birthday person';
      const age = data.age ? ` turning ${data.age}` : '';
      const venue = data.venue ? ` at ${data.venue}` : '';
      const date = data.date || '';
      const host = data.hostName ? ` hosted by ${data.hostName}` : '';
      return {
        prompt: `Write a warm, festive birthday party invitation message (3-4 lines) for ${name}${age}. The party is${venue}${date ? ` on ${date}` : ''}${host}. Include an RSVP note. Keep it cheerful and celebratory. Write in simple English. Do NOT use any markdown, asterisks, or formatting — plain text only.`,
        fields: ['message'],
      };
    }

    case 'wedding': {
      const groom = data.groomName || 'the groom';
      const bride = data.brideName || 'the bride';
      const venue = data.weddingVenue ? ` at ${data.weddingVenue}` : '';
      const date = data.weddingDate || '';
      const groomFamily = data.groomFamily ? `Groom's family: ${data.groomFamily}. ` : '';
      const brideFamily = data.brideFamily ? `Bride's family: ${data.brideFamily}. ` : '';
      return {
        prompt: `Write a beautiful, traditional Indian wedding invitation message (4-5 lines) for the wedding of ${groom} and ${bride}. ${groomFamily}${brideFamily}The ceremony is${venue}${date ? ` on ${date}` : ''}. Make it heartfelt and respectful. Write in simple English. Do NOT use any markdown, asterisks, or formatting — plain text only.`,
        fields: ['message'],
      };
    }

    case 'anniversary': {
      const p1 = data.partner1 || 'Partner 1';
      const p2 = data.partner2 || 'Partner 2';
      const years = data.years ? `${data.years} years` : 'many years';
      return {
        prompt: `Write a heartfelt anniversary blessing message (3-4 lines) for ${p1} and ${p2} celebrating ${years} together. Make it loving and warm. Write in simple English. Do NOT use any markdown, asterisks, or formatting — plain text only.`,
        fields: ['message'],
      };
    }

    case 'jagrata': {
      const title = data.jagrataTitle || 'Spiritual Event';
      const organizer = data.organizerName || 'the organizer';
      const venue = data.venue ? ` at ${data.venue}` : '';
      const date = data.date || '';
      const purpose = data.purpose ? ` for ${data.purpose}` : '';
      return {
        prompt: `Write a devotional invitation message (3-4 lines) for "${title}" organized by ${organizer}${venue}${date ? ` on ${date}` : ''}${purpose}. Include blessings and a warm welcome. Write in simple English with a spiritual tone. Do NOT use any markdown, asterisks, or formatting — plain text only.`,
        fields: ['message'],
      };
    }

    case 'biodata': {
      const name = data.fullName || 'the person';
      const education = data.education || '';
      const occupation = data.occupation || '';
      const employer = data.employer ? ` at ${data.employer}` : '';
      const hobbies = data.hobbies || '';
      const religion = data.religion || '';
      const caste = data.caste || '';
      return {
        prompt: `You are generating content for a traditional Indian marriage biodata card. Return a JSON object with these two keys:
- "aboutMe": A warm, respectful self-introduction paragraph (3-4 lines) for ${name}. ${education ? `Education: ${education}.` : ''} ${occupation ? `Works as ${occupation}${employer}.` : ''} ${religion ? `Religion: ${religion}.` : ''} ${caste ? `Caste: ${caste}.` : ''} ${hobbies ? `Hobbies: ${hobbies}.` : ''} Suitable for a traditional Indian marriage biodata.
- "hobbies": If hobbies are empty, suggest 4-5 common hobbies as a comma-separated string based on the person's profile. If hobbies already exist, keep them as-is.

Return ONLY valid JSON, no markdown, no code blocks. Example: {"aboutMe":"...","hobbies":"..."}`,
        fields: ['aboutMe', 'hobbies'],
        jsonMode: true,
      };
    }

    case 'resume': {
      const name = data.fullName || 'the candidate';
      const jobTitle = data.jobTitle || '';
      const skills = data.skills || '';
      const expSummary = (data.experience || [])
        .filter(e => e.title || e.company)
        .map(e => `${e.title || 'Role'} at ${e.company || 'Company'}`)
        .join(', ');
      return {
        prompt: `You are generating content for a professional resume. Return a JSON object with these keys:
- "summary": A concise, professional resume summary paragraph (3-4 lines) for ${name}${jobTitle ? `, a ${jobTitle}` : ''}. ${skills ? `Key skills: ${skills}.` : ''} ${expSummary ? `Experience includes: ${expSummary}.` : ''} Highlight strengths and career aspirations. Write in third person.
- "skills": If skills are empty, suggest 6-8 relevant skills as a comma-separated string based on the job title and experience. If skills already exist, keep them as-is.

Return ONLY valid JSON, no markdown, no code blocks. Example: {"summary":"...","skills":"..."}`,
        fields: ['summary', 'skills'],
        jsonMode: true,
      };
    }

    default:
      return null;
  }
}

/* ══════════════════════════════════════════
   MODE 2 — "magic"  (AI Magic Input)
   User describes what they want → AI picks card type, template, colors, fills form data
   ══════════════════════════════════════════ */
function buildMagicPrompt(description) {
  return `You are an AI assistant for a card maker app. The user said: "${description}"

Based on this, determine:
1. cardType — MUST be one of: birthday, wedding, anniversary, jagrata, biodata, resume
2. formData — an object with pre-filled form fields for that card type.

Here are the form fields per card type:
- birthday: { birthdayPerson, age, hostName, date, time, venue, venueAddress, message, guestName }
- wedding: { groomName, brideName, groomFamily, brideFamily, weddingDate, weddingTime, weddingVenue, weddingVenueAddress, message, guestName, familyMembers }
- anniversary: { partner1, partner2, years, date, message }
- jagrata: { religion (hindu/sikh/jain/buddhist/general), organizerName, jagrataTitle, date, startTime, venue, venueAddress, purpose, prasad, message, guestName }
- biodata: { fullName, dob, age, height, weight, religion, caste, education, occupation, employer, hobbies, aboutMe, fatherName, motherName, contactPhone }
- resume: { fullName, jobTitle, email, phone, location, summary, skills, languages }

Fill in as many fields as you can infer from the user's description. Generate a heartfelt message/text for the message or aboutMe or summary field. Leave fields empty string "" if you cannot determine them.

Return ONLY valid JSON in this exact format, no markdown, no code blocks:
{"cardType":"...","formData":{...}}`;
}

/* ══════════════════════════════════════════
   MODE 3 — "suggest"  (AI Layout Suggestions)
   Given card type → suggest template number + bgColor combos
   ══════════════════════════════════════════ */
function buildSuggestPrompt(cardType, currentTemplate, currentBgColor) {
  const templateRanges = {
    birthday: '1-6',
    wedding: '1-7',
    anniversary: '1-5',
    jagrata: '1',
    biodata: '1',
    resume: '1',
  };
  const range = templateRanges[cardType] || '1-5';

  return `You are suggesting design variations for a ${cardType} card.
Current template: ${currentTemplate || 1}, current background color: ${currentBgColor || 'default'}.

Suggest 4 DIFFERENT style combinations. Each should have:
- template: a number from ${range}
- bgColor: a hex color code (e.g. "#fce4ec") or "" for default
- label: a short name like "Royal Gold", "Blush Pink", "Midnight Blue", etc.

Make sure all 4 are visually different from each other and from the current selection.

Return ONLY valid JSON array, no markdown, no code blocks:
[{"template":2,"bgColor":"#fce4ec","label":"Blush Pink"},...]`;
}

/* ══════════════════════════════════════════
   POST handler — routes to the correct mode
   ══════════════════════════════════════════ */
export async function POST(request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI service is not configured. Please add GEMINI_API_KEY to environment variables.' },
        { status: 500 }
      );
    }

    const body = await request.json();
    const { mode = 'text' } = body;

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    /* ── MODE: magic ── */
    if (mode === 'magic') {
      const { description } = body;
      if (!description) return NextResponse.json({ error: 'description is required.' }, { status: 400 });

      const prompt = buildMagicPrompt(description);
      const result = await model.generateContent(prompt);
      let text = result.response.text().trim();
      // Strip markdown code fences if present
      text = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
      const parsed = JSON.parse(text);
      return NextResponse.json(parsed);
    }

    /* ── MODE: suggest ── */
    if (mode === 'suggest') {
      const { cardType, currentTemplate, currentBgColor } = body;
      if (!cardType) return NextResponse.json({ error: 'cardType is required.' }, { status: 400 });

      const prompt = buildSuggestPrompt(cardType, currentTemplate, currentBgColor);
      const result = await model.generateContent(prompt);
      let text = result.response.text().trim();
      text = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
      const suggestions = JSON.parse(text);
      return NextResponse.json({ suggestions });
    }

    /* ── MODE: text (default — existing Fill with AI) ── */
    const { cardType, data } = body;
    if (!cardType || !data) {
      return NextResponse.json({ error: 'cardType and data are required.' }, { status: 400 });
    }

    const promptData = buildTextPrompt(cardType, data);
    if (!promptData) {
      return NextResponse.json({ error: `Unknown card type: ${cardType}` }, { status: 400 });
    }

    const result = await model.generateContent(promptData.prompt);
    let text = result.response.text().trim();

    // For JSON mode prompts, parse the JSON
    if (promptData.jsonMode) {
      text = text.replace(/^```json\s*/i, '').replace(/```\s*$/i, '').trim();
      const parsed = JSON.parse(text);
      return NextResponse.json({ fields: parsed });
    }

    // For plain text prompts, map to single field
    const fields = {};
    promptData.fields.forEach(f => { fields[f] = text; });
    return NextResponse.json({ fields });

  } catch (err) {
    console.error('[AI Route Error]', err);
    return NextResponse.json(
      { error: err.message || 'Failed to generate AI content.' },
      { status: 500 }
    );
  }
}
