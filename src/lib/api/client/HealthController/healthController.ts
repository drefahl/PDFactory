import { healthCheck } from './healthCheck.ts'

export function healthController() {
  return { healthCheck }
}