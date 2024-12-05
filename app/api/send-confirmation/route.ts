import { NextResponse } from 'next/server'
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: Request) {
  const { personalInfo, badgeImage } = await req.json()

  try {
    const attachments = badgeImage
      ? [
          {
            filename: 'badge.jpg',
            content: badgeImage.split(',')[1] || badgeImage,
          },
        ]
      : []

    const { data, error } = await resend.emails.send({
      from: 'Camp Adventure <onboarding@resend.dev>',
      to: [personalInfo.email],
      subject: 'Camp Adventure Registration Confirmation',
      html: `
        <h1>Welcome to Camp Adventure, ${personalInfo.firstName}!</h1>
        <p>Your registration has been received. We're excited to see you at the camp!</p>
        <p>Your badge image is attached to this email.</p>
      `,
      attachments: attachments,
    })

    if (error) {
      console.error('Error sending email:', error)
      return NextResponse.json({ success: false, error: 'Failed to send email' }, { status: 500 })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json({ success: false, error: 'An unexpected error occurred' }, { status: 500 })
  }
}

