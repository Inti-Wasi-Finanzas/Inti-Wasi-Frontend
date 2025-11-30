import { BaseResource, BaseResponse } from '../../../shared/infrastructure/api/base-response';

export interface ClientResource extends BaseResource {
  fullName: string;
  dni: string;
  email: string;
  phone: string;
  monthlyIncome: number;
}

export interface ClientsResponse extends BaseResponse {
  clients: ClientResource[];
}
