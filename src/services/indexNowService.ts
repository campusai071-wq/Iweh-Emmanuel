import { getApiUrl } from './utils';
import { ADMIN_TOKEN } from '../lib/adminAuth';

export const INDEXNOW_HOST = 'campusai.com.ng';
// Keep key references for backward compatibility with components
export const INDEXNOW_KEY = '14fbbbae19ab4b788d8153edd1d2550e';
export const INDEXNOW_KEY_LOCATION = `https://${INDEXNOW_HOST}/${INDEXNOW_KEY}.txt`;

/**
 * Submits a list of relative or absolute URLs to the server-side IndexNow proxy
 * for instant indexing on Bing, Yandex, Seznam, Naver, etc.
 * The actual IndexNow secret key is managed and verified server-side.
 */
export async function submitToIndexNow(urls: string[]): Promise<{ success: boolean; status: number; message: string }> {
  if (!urls || urls.length === 0) {
    return { success: false, status: 400, message: 'No URLs provided for IndexNow submission' };
  }

  // Format URLs to ensure they are full canonical non-www URLs
  const formattedUrls = urls.map(url => {
    if (url.startsWith('http://') || url.startsWith('https://')) {
      return url.replace('www.campusai.com.ng', INDEXNOW_HOST);
    }
    const cleanPath = url.startsWith('/') ? url : `/${url}`;
    return `https://${INDEXNOW_HOST}${cleanPath}`;
  });

  const payload = {
    urls: formattedUrls,
    urlList: formattedUrls
  };

  try {
    const apiUrl = getApiUrl('/api/indexnow');
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };

    if (ADMIN_TOKEN) {
      headers['x-admin-token'] = ADMIN_TOKEN;
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));

    if (response.ok && data.success !== false) {
      return { 
        success: true, 
        status: response.status, 
        message: data.message || `Successfully submitted ${formattedUrls.length} URLs to IndexNow!` 
      };
    } else {
      return {
        success: false,
        status: response.status,
        message: data.message || `IndexNow submission returned status ${response.status}`
      };
    }
  } catch (err: any) {
    console.error('IndexNow submission error:', err);
    return {
      success: false,
      status: 0,
      message: `Failed to submit to IndexNow: ${err?.message || 'Network error'}`
    };
  }
}

