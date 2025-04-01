import client from '@/lib/client-fetch.ts'
import type { UpdateUserProfileMutationRequest, UpdateUserProfileMutationResponse } from '../../types/UpdateUserProfile.ts'
import type { RequestConfig, ResponseErrorConfig } from '@/lib/client-fetch.ts'

export function getUpdateUserProfileUrl() {
  return "http://localhost:3000/api/users/me" as const
}

/**
 * @description Update user profile
 * {@link /api/users/me}
 */
export async function updateUserProfile(
  data?: UpdateUserProfileMutationRequest,
  config: Partial<RequestConfig<UpdateUserProfileMutationRequest>> & { client?: typeof client } = {},
) {
  const { client: request = client, ...requestConfig } = config

  const res = await request<UpdateUserProfileMutationResponse, ResponseErrorConfig<Error>, UpdateUserProfileMutationRequest>({
    method: 'PATCH',
    url: getUpdateUserProfileUrl().toString(),
    data,
    ...requestConfig,
  })
  return res
}