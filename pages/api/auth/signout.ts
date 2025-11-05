import type { NextApiRequest, NextApiResponse } from 'next'
import { deleteSession } from '@/lib/auth'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    await deleteSession()

    return res.status(200).json({
      success: true,
      message: 'Signed out successfully',
    })
  } catch (error: any) {
    console.error('Signout error:', error)
    return res.status(500).json({
      error: 'Internal server error',
    })
  }
}
