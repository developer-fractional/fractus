import { jsPDF } from 'jspdf'
import type { Profile, Education, WorkExperience, Credential } from './types'

const MONTH_NAMES = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

function formatMonthYear(month: number | null, year: number | null) {
  if (!year) return ''
  return month ? `${MONTH_NAMES[month] ?? ''} ${year}`.trim() : String(year)
}

function dateRange(startMonth: number | null, startYear: number | null, endMonth: number | null, endYear: number | null, isCurrent?: boolean | null) {
  const start = formatMonthYear(startMonth, startYear)
  const end = isCurrent ? 'Present' : formatMonthYear(endMonth, endYear)
  if (!start && !end) return ''
  if (!end) return start
  return `${start} – ${end}`
}

// Builds the resume PDF for a given profile + sections. Shared by the
// "my own resume" route (session-authenticated) and the public per-talent
// route used from talent profile pages.
export function buildResumePdf(
  profile: Profile,
  education: Education[],
  workExperience: WorkExperience[],
  credentials: Credential[]
): { bytes: ArrayBuffer; fileName: string } {
  const doc = new jsPDF({ unit: 'pt', format: 'letter' })
  const pageWidth = doc.internal.pageSize.getWidth()
  const marginX = 50
  const maxWidth = pageWidth - marginX * 2
  let y = 56

  function ensureSpace(needed: number) {
    const pageHeight = doc.internal.pageSize.getHeight()
    if (y + needed > pageHeight - 50) {
      doc.addPage()
      y = 56
    }
  }

  function heading(text: string) {
    ensureSpace(28)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(13)
    doc.setTextColor(20, 20, 20)
    doc.text(text, marginX, y)
    y += 6
    doc.setDrawColor(200, 200, 200)
    doc.line(marginX, y, pageWidth - marginX, y)
    y += 16
  }

  function subheading(text: string) {
    ensureSpace(16)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.setTextColor(20, 20, 20)
    doc.text(text, marginX, y)
    y += 14
  }

  function metaLine(text: string) {
    if (!text) return
    ensureSpace(14)
    doc.setFont('helvetica', 'italic')
    doc.setFontSize(10)
    doc.setTextColor(90, 90, 90)
    doc.text(text, marginX, y)
    y += 14
  }

  function bodyText(text: string) {
    if (!text) return
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    doc.setTextColor(50, 50, 50)
    const lines = doc.splitTextToSize(text, maxWidth)
    ensureSpace(lines.length * 13)
    doc.text(lines, marginX, y)
    y += lines.length * 13 + 8
  }

  // Header
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(20, 20, 20)
  doc.text(profile.name || 'Resume', marginX, y)
  y += 22

  const contactBits = [profile.discipline, profile.location, profile.email].filter(Boolean)
  if (contactBits.length) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10.5)
    doc.setTextColor(80, 80, 80)
    doc.text(contactBits.join('  •  '), marginX, y)
    y += 18
  }

  const linkBits = [profile.linkedin_url, profile.portfolio_url].filter(Boolean) as string[]
  if (linkBits.length) {
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9.5)
    doc.setTextColor(70, 90, 150)
    doc.text(linkBits.join('   '), marginX, y)
    y += 18
  }

  y += 4

  // Summary / bio
  if (profile.bio) {
    heading('Summary')
    bodyText(profile.bio)
  }

  // Skills
  if (profile.skills) {
    heading('Skills')
    bodyText(profile.skills)
  }

  // Work experience
  if (workExperience.length > 0) {
    heading('Work Experience')
    for (const job of workExperience) {
      subheading(`${job.title} — ${job.company}`)
      const range = dateRange(job.start_month, job.start_year, job.end_month, job.end_year, job.is_current)
      const metaBits = [range, job.location, job.employment_type].filter(Boolean)
      metaLine(metaBits.join('  •  '))
      bodyText(job.description || '')
    }
  }

  // Education
  if (education.length > 0) {
    heading('Education')
    for (const edu of education) {
      subheading(edu.degree ? `${edu.degree} — ${edu.school}` : edu.school)
      const range = [edu.start_year, edu.end_year].filter(Boolean).join(' – ')
      const metaBits = [edu.field_of_study, range].filter(Boolean)
      metaLine(metaBits.join('  •  '))
      bodyText(edu.description || '')
    }
  }

  // Licenses & certifications
  if (credentials.length > 0) {
    heading('Licenses & Certifications')
    for (const cred of credentials) {
      subheading(cred.name)
      const metaBits = [
        cred.issuing_organization,
        cred.license_number ? `License #${cred.license_number}` : null,
        cred.state,
        cred.issue_year ? `Issued ${cred.issue_year}` : null,
        cred.expiration_year ? `Expires ${cred.expiration_year}` : null,
      ].filter(Boolean)
      metaLine(metaBits.join('  •  '))
    }
  }

  const pdfBytes = doc.output('arraybuffer')
  const fileName = `${(profile.name || 'resume').replace(/[^a-z0-9]+/gi, '-').toLowerCase()}-resume.pdf`

  return { bytes: pdfBytes, fileName }
}
