export enum PlanType {
  FREE = 'FREE',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE',
}

export interface PlanLimits {
  projects: number | 'unlimited'
  aiGenerations: number | 'unlimited'
  storage: number // in MB
  exportQuality: 'HD' | '4K' | '8K'
  collaborators: number | 'unlimited'
  versionHistory: number | 'unlimited'
  prioritySupport: boolean
  watermark: boolean
  apiAccess: boolean
  customDomain: boolean
}

export const PLAN_LIMITS: Record<PlanType, PlanLimits> = {
  [PlanType.FREE]: {
    projects: 5,
    aiGenerations: 10,
    storage: 100, // 100MB
    exportQuality: 'HD',
    collaborators: 0,
    versionHistory: 3,
    prioritySupport: false,
    watermark: true,
    apiAccess: false,
    customDomain: false,
  },
  [PlanType.PRO]: {
    projects: 'unlimited',
    aiGenerations: 1000,
    storage: 10000, // 10GB
    exportQuality: '8K',
    collaborators: 10,
    versionHistory: 'unlimited',
    prioritySupport: true,
    watermark: false,
    apiAccess: true,
    customDomain: false,
  },
  [PlanType.ENTERPRISE]: {
    projects: 'unlimited',
    aiGenerations: 'unlimited',
    storage: 100000, // 100GB
    exportQuality: '8K',
    collaborators: 'unlimited',
    versionHistory: 'unlimited',
    prioritySupport: true,
    watermark: false,
    apiAccess: true,
    customDomain: true,
  },
}

export function canPerformAction(
  plan: PlanType,
  action: keyof PlanLimits,
  currentUsage: number
): boolean {
  const limit = PLAN_LIMITS[plan][action]

  if (limit === 'unlimited' || limit === true) {
    return true
  }

  if (limit === false) {
    return false
  }

  if (typeof limit === 'number') {
    return currentUsage < limit
  }

  return false
}

export function getRemainingQuota(
  plan: PlanType,
  action: keyof PlanLimits,
  currentUsage: number
): number | 'unlimited' {
  const limit = PLAN_LIMITS[plan][action]

  if (limit === 'unlimited' || limit === true) {
    return 'unlimited'
  }

  if (limit === false || typeof limit === 'string') {
    return 0
  }

  if (typeof limit === 'number') {
    return Math.max(0, limit - currentUsage)
  }

  return 0
}
