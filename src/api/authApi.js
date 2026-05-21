import { apiClient, USE_MOCK_API } from './client';
import { delay } from '../utils/delay';
import { ApiError } from '../utils/apiError';
import { mockUser } from '../mocks/user';

let mockSession = null;

export async function getMe() {
  if (USE_MOCK_API) {
    await delay(600);
    if (!mockSession) {
      throw new ApiError('Not authenticated', 401);
    }
    return { data: mockSession };
  }
  const response = await apiClient.get('/auth/me');
  return response.data;
}

export async function signInWithGoogle() {
  if (USE_MOCK_API) {
    await delay(800);
    mockSession = { ...mockUser };
    return { data: mockSession };
  }
  const response = await apiClient.post('/auth/google');
  return response.data;
}

export async function signOut() {
  if (USE_MOCK_API) {
    await delay(300);
    mockSession = null;
    return { data: { success: true } };
  }
  const response = await apiClient.post('/auth/logout');
  return response.data;
}

export function setMockSession(user) {
  mockSession = user;
}
