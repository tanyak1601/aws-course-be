import { AppRequest } from '../models';

/**
 * @param {AppRequest} request
 * @returns {string}
 */
export function getUserIdFromRequest(request: AppRequest): string {
  return request.user && request.user.id;
}

export function getUserIdFromQueryParams(request: AppRequest): string {
  return request?.query?.userId as string;
}