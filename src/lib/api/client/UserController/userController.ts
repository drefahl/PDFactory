import { createUser } from './createUser.ts'
import { getUserProfile } from './getUserProfile.ts'
import { updateUserProfile } from './updateUserProfile.ts'

export function userController() {
  return { createUser, getUserProfile, updateUserProfile }
}