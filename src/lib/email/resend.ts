import { Resend } from 'resend';

export const resend = new Resend(process.env.RESEND_API_KEY);

export const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Redaksi Pilar Bangsa <redaksi@mediapilarbangsa.web.id>';
export const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'ukmpilarbangsa@gmail.com';
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.mediapilarbangsa.web.id';
