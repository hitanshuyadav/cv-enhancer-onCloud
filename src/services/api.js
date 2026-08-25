// Determine base URL: use /api Vite proxy during local development to bypass browser CORS OPTIONS preflight limits
const API_DIRECT_URL = 'https://x37c06glcb.execute-api.ap-south-1.amazonaws.com';
const API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost'
  ? '/api'
  : API_DIRECT_URL;

/**
 * Submit resume and job description to start AI analysis
 * @param {string} resume - Resume text content
 * @param {string} jobDescription - Job description text content
 * @returns {Promise<{success: boolean, request_id: string, status: string, message?: string}>}
 */
export async function submitResume(resume, jobDescription) {
  console.log(`[API] Submitting CV for analysis via ${API_BASE_URL}/analyze-cv...`);
  try {
    const response = await fetch(`${API_BASE_URL}/analyze-cv`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        resume: resume.trim(),
        job_description: jobDescription.trim(),
      }),
    });

    const data = await response.json();
    console.log('[API] Submit response:', data);

    if (!response.ok) {
      throw new Error(data.message || `Server returned status code ${response.status}`);
    }

    if (data.success === false) {
      throw new Error(data.message || 'Submission failed according to response body');
    }

    return data;
  } catch (error) {
    console.error('[API Error] submitResume failed:', error);
    if (error.message && error.message.includes('Failed to fetch')) {
      console.warn('[CORS Warning] Browser blocked cross-origin request. Vite dev proxy handles /api to bypass preflight OPTIONS checks.');
    }
    throw error;
  }
}

/**
 * Fetch analysis result for a given request_id
 * @param {string} requestId - The unique ID returned from POST /analyze-cv
 * @returns {Promise<{success: boolean, status: string, request_id?: string, analysis?: string, processed_at?: string, message?: string}>}
 */
export async function getAnalysis(requestId) {
  console.log(`[API] Checking analysis for request_id: ${requestId} via ${API_BASE_URL}/analysis/${requestId}`);
  try {
    const response = await fetch(`${API_BASE_URL}/analysis/${encodeURIComponent(requestId)}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    const data = await response.json();
    console.log(`[API] Poll response for ${requestId}:`, data);

    if (!response.ok) {
      throw new Error(data.message || `Server returned status code ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`[API Error] getAnalysis failed for request ID ${requestId}:`, error);
    throw error;
  }
}
