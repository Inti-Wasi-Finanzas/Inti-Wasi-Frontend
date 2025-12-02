import { BaseResource, BaseResponse } from '../../../shared/infrastructure/api/base-response';

export interface AuthResponse extends BaseResponse {
  id: number;
  username: string;
  role: string;
  token: string;
}

export interface AuthResource extends BaseResource {
  id: number;
  username: string;
  role: string;
  token: string;
}
