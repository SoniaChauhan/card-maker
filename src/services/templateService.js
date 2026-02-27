/**
 * Template service — CRUD for user-saved card templates via Next.js API + MongoDB.
 */

async function api(body) {
  const res = await fetch('/api/templates', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || 'Request failed');
  return data;
}

/** Strip non-serializable / oversized fields before saving. */
function sanitizeFormData(data) {
  const clean = {};
  for (const [k, v] of Object.entries(data || {})) {
    if (v instanceof File) continue;
    if (k === 'photo') continue;
    if (typeof v === 'string' && v.startsWith('data:')) continue;
    clean[k] = v;
  }
  return clean;
}

/** Save a new template. Returns the new doc id. */
export async function saveTemplate(email, cardType, templateName, formData) {
  const data = await api({
    action: 'save', email, cardType, templateName,
    formData: sanitizeFormData(formData),
  });
  return data.id;
}

/** Get all templates for a user, newest first. */
export async function getUserTemplates(email) {
  const data = await api({ action: 'getByUser', email });
  return data.templates;
}

/** Update an existing template's form data (and name). */
export async function updateTemplate(docId, templateName, formData) {
  await api({
    action: 'update', docId, templateName,
    formData: sanitizeFormData(formData),
  });
}

/** Delete a template by doc id. */
export async function deleteTemplate(docId) {
  await api({ action: 'delete', docId });
}
