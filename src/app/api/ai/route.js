import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

/* ─── Prompt builders per card type ─── */
function buildPrompt(cardType, data) {
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
        prompt: `Write a short marriage biodata self-introduction paragraph (3-4 lines) for ${name}. ${education ? `Education: ${education}.` : ''} ${occupation ? `Works as ${occupation}${employer}.` : ''} ${religion ? `Religion: ${religion}.` : ''} ${caste ? `Caste: ${caste}.` : ''} ${hobbies ? `Hobbies: ${hobbies}.` : ''} Keep it respectful, positive, and suitable for a traditional Indian marriage biodata. Write in simple English. Do NOT use any markdown, asterisks, or formatting — plain text only.`,
        fields: ['aboutMe'],
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
        prompt: `Write a concise, professional resume summary paragraph (3-4 lines) for ${name}${jobTitle ? `, a ${jobTitle}` : ''}. ${skills ? `Key skills: ${skills}.` : ''} ${expSummary ? `Experience includes: ${expSummary}.` : ''} Highlight strengths and career aspirations. Write in third person. Do NOT use any markdown, asterisks, or formatting — plain text only.`,
        fields: ['summary'],
      };
    }

    default:
      return null;
  }
}

/* ─── POST handler ─── */
export async function POST(request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: 'AI service is not configured. Please add GEMINI_API_KEY to environment variables.' },
        { status: 500 }
      );
    }

    const { cardType, data } = await request.json();
    if (!cardType || !data) {
      return NextResponse.json({ error: 'cardType and data are required.' }, { status: 400 });
    }

    const promptData = buildPrompt(cardType, data);
    if (!promptData) {
      return NextResponse.json({ error: `Unknown card type: ${cardType}` }, { status: 400 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const result = await model.generateContent(promptData.prompt);
    const text = result.response.text().trim();

    // Build the response — map the generated text to the target field(s)
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
