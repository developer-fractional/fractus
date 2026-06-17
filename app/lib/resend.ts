import { Resend } from 'resend'

// Lazy factory so the build doesn't fail when RESEND_API_KEY is absent at build time.
export function getResend() {
  return new Resend(process.env.RESEND_API_KEY)
}

export const FROM_EMAIL = 'Fractus <notifications@fractionalaeco.app>'
