import { Resend } from 'resend';

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Redaksi Pilar Bangsa <redaksi@mediapilarbangsa.web.id>';
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'ukmpilarbangsa@gmail.com';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mediapilarbangsa.web.id';

/**
 * Mendapatkan instance Resend client secara dinamis pada saat runtime Serverless/Edge.
 */
export function getResendClient(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey || apiKey.trim() === '') {
    return null;
  }
  return new Resend(apiKey);
}

/**
 * Memeriksa kesiapan konfigurasi email di server.
 */
export function checkEmailConfiguration() {
  const apiKey = process.env.RESEND_API_KEY;
  const isKeyConfigured = Boolean(apiKey && apiKey.trim() !== '');
  const fromEmail = FROM_EMAIL;
  const adminEmail = ADMIN_EMAIL;
  const siteUrl = SITE_URL;

  return {
    isConfigured: isKeyConfigured,
    apiKeyPreview: isKeyConfigured ? `${apiKey!.slice(0, 7)}...${apiKey!.slice(-4)}` : null,
    fromEmail,
    adminEmail,
    siteUrl,
  };
}

// Backward compatibility for existing direct imports
export const resend = new Proxy({} as Resend, {
  get(_target, prop) {
    const client = getResendClient();
    if (!client) {
      throw new Error('RESEND_API_KEY belum disetel pada Environment Variables server.');
    }
    return (client as any)[prop];
  },
});
