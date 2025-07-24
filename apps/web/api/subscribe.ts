import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email } = req.body
    if (!email) return res.status(400).json({ error: 'Email required' })

    // Dummy Mailchimp simulation
    console.log(`Would send ${email} to Mailchimp`)

    return res.status(200).json({ message: 'Email added' })
  }
  res.status(405).json({ error: 'Method not allowed' })
}