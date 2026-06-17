export function brandedEmail({
  greeting,
  bodyHtml,
  buttonText,
  buttonUrl,
}: {
  greeting: string
  bodyHtml: string
  buttonText: string
  buttonUrl: string
}) {
  return `
  <div style="font-family: 'Nunito Sans', Arial, sans-serif; background: #F4F6F5; padding: 40px 20px;">
    <div style="max-width: 480px; margin: 0 auto; background: #FFFFFF; border-radius: 16px; overflow: hidden; border: 1px solid #E2EAE7;">
      <div style="padding: 32px 32px 0;">
        <span style="font-family: Georgia, serif; font-size: 24px; font-weight: 800; color: #F6981F;">Fractus</span>
      </div>
      <div style="padding: 24px 32px 32px; color: #0F1117;">
        <p style="font-size: 16px; font-weight: 700; margin: 0 0 16px;">${greeting}</p>
        <div style="font-size: 15px; line-height: 1.6; color: #4A5568; margin-bottom: 28px;">
          ${bodyHtml}
        </div>
        <a href="${buttonUrl}" style="display: inline-block; background: #F6981F; color: #FFFFFF; text-decoration: none; font-weight: 700; font-size: 14px; padding: 12px 24px; border-radius: 100px;">
          ${buttonText}
        </a>
      </div>
      <div style="padding: 20px 32px; background: #F7FAF9; border-top: 1px solid #E2EAE7;">
        <p style="font-size: 12px; color: #8892A4; margin: 0;">Powered by Fractional AECO</p>
      </div>
    </div>
  </div>
  `
}
