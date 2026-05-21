import { apiClient, USE_MOCK_API } from './client';
import { delay } from '../utils/delay';
import { mockProjects } from '../mocks/projects';

export async function getProjects() {
  if (USE_MOCK_API) {
    await delay(350);
    return { data: mockProjects };
  }
  const response = await apiClient.get('/projects');
  return response.data;
}
