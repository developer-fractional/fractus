import { NextRequest, NextResponse } from 'next/server'

const IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const RESUME_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']

interface BucketRule {
  types: string[]
  maxBytes: number
  error: string
}

// Single source of truth for upload limits. The client mirrors these checks
// before uploading (for instant feedback); this route is the server-side
// gate that can't be bypassed by editing client code.
const BUCKET_RULES: Record<string, BucketRule> = {
  avatars: {
    types: IMAGE_TYPES,
    maxBytes: 5 * 1024 * 1024,
    error: 'Please upload a JPG, PNG, or WebP image under 5MB',
  },
  covers: {
    types: IMAGE_TYPES,
    maxBytes: 10 * 1024 * 1024,
    error: 'Please upload a JPG, PNG, or WebP image under 10MB',
  },
  resumes: {
    types: RESUME_TYPES,
    maxBytes: 10 * 1024 * 1024,
    error: 'Please upload a PDF, DOC, or DOCX file under 10MB',
  },
  // No UI uses this bucket yet, but the rule is defined so the moment a
  // portfolio-images component ships, server-side enforcement is already in place.
  portfolio: {
    types: IMAGE_TYPES,
    maxBytes: 8 * 1024 * 1024,
    error: 'Please upload a JPG, PNG, or WebP image under 8MB',
  },
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { bucket, fileType, fileSize } = body ?? {}

    if (typeof bucket !== 'string' || !(bucket in BUCKET_RULES)) {
      return NextResponse.json({ valid: false, error: 'Unknown upload destination.' }, { status: 400 })
    }
    if (typeof fileSize !== 'number' || !Number.isFinite(fileSize) || fileSize <= 0) {
      return NextResponse.json({ valid: false, error: 'Invalid file size.' }, { status: 400 })
    }

    const rule = BUCKET_RULES[bucket]

    if (typeof fileType !== 'string' || !rule.types.includes(fileType)) {
      return NextResponse.json({ valid: false, error: rule.error })
    }
    if (fileSize > rule.maxBytes) {
      return NextResponse.json({ valid: false, error: rule.error })
    }

    return NextResponse.json({ valid: true })
  } catch (err) {
    console.error('[validate-upload] error:', err)
    return NextResponse.json({ valid: false, error: 'Could not validate file. Please try again.' }, { status: 500 })
  }
}
