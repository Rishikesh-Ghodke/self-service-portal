import { apiClient, USE_MOCK_API } from './client';
import { delay } from '../utils/delay';
import { ApiError } from '../utils/apiError';
import { mockRolesByProject } from '../mocks/roles';

export async function getRolesByProject(projectId) {
  if (USE_MOCK_API) {
    await delay(300);
    const roles = mockRolesByProject[projectId];
    if (!roles) {
      throw new ApiError('Project not found', 404);
    }
    return { data: roles };
  }
  const response = await apiClient.get(`/projects/${projectId}/roles`);
  return response.data;
}
