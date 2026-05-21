import { apiClient, USE_MOCK_API } from './client';
import { delay } from '../utils/delay';
import { ApiError } from '../utils/apiError';
import { mockRequests } from '../mocks/requests';
import { REQUEST_STATUS } from '../constants';
import { filterRequests, sortRequests, paginate } from '../utils/filterRequests';

let requestsStore = [...mockRequests];

function findDuplicate(subjectEmail, projectId, roles) {
  const pending = requestsStore.filter(
    (r) =>
      r.status === REQUEST_STATUS.PENDING &&
      r.subjectUser.toLowerCase() === subjectEmail.toLowerCase() &&
      r.projectId === projectId
  );
  const overlappingRoles = pending.flatMap((r) =>
    r.roles.filter((role) => roles.includes(role))
  );
  return overlappingRoles.length > 0 ? overlappingRoles : null;
}

export async function createRequest(payload) {
  if (USE_MOCK_API) {
    await delay(700);
    const duplicateRoles = findDuplicate(
      payload.subjectEmail,
      payload.projectId,
      payload.roles
    );
    if (duplicateRoles) {
      throw new ApiError(
        'A pending request already exists with overlapping roles',
        409,
        { duplicateRoles }
      );
    }
    const project = requestsStore.find((r) => r.projectId === payload.projectId);
    const projectName =
      payload.projectName ||
      (project ? project.project : payload.projectId);
    const newRequest = {
      id: `req-${Date.now()}`,
      requester: payload.requester,
      subjectUser: payload.subjectEmail,
      project: projectName,
      projectId: payload.projectId,
      roles: payload.roles,
      description: payload.justification,
      startDate: payload.startDate,
      endDate: payload.endDate,
      status: REQUEST_STATUS.PENDING,
      approver: null,
      requestedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    requestsStore = [newRequest, ...requestsStore];
    return { data: newRequest, status: 201 };
  }
  const response = await apiClient.post('/requests', payload);
  return response.data;
}

export async function getRequests(params = {}) {
  if (USE_MOCK_API) {
    await delay(500);
    let filtered = filterRequests(requestsStore, params);
    filtered = sortRequests(filtered, params.sortKey, params.sortDir);
    const result = paginate(filtered, params.page || 1, params.limit || 10);
    const summary = {
      pending: requestsStore.filter((r) => r.status === REQUEST_STATUS.PENDING).length,
      approved: requestsStore.filter((r) => r.status === REQUEST_STATUS.APPROVED).length,
      declined: requestsStore.filter((r) => r.status === REQUEST_STATUS.DECLINED).length,
      activeAccess: requestsStore.filter(
        (r) =>
          r.status === REQUEST_STATUS.APPROVED &&
          new Date(r.endDate) > new Date()
      ).length,
    };
    return { data: result.data, meta: { ...result, summary } };
  }
  const response = await apiClient.get('/requests', { params });
  return response.data;
}

export function resetMockRequests() {
  requestsStore = [...mockRequests];
}
