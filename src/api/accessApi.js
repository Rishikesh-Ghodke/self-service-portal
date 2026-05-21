import { apiClient, USE_MOCK_API } from './client';
import { delay } from '../utils/delay';
import { mockAccessRecords } from '../mocks/access';
import { filterAccessRecords, groupAccessByUser, paginateGroups } from '../utils/filterAccess';

export async function getAccess(params = {}) {
  if (USE_MOCK_API) {
    await delay(450);
    const filtered = filterAccessRecords(mockAccessRecords, params.search || '');
    const grouped = groupAccessByUser(filtered);
    const result = paginateGroups(grouped, params.page || 1, params.limit || 5);
    return { data: result.data, meta: result };
  }
  const response = await apiClient.get('/access', { params });
  return response.data;
}
