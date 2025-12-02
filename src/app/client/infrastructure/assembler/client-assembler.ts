import { BaseAssembler } from '../../../shared/infrastructure/api/base-assembler';
import { Client } from '../../domain/model/client.entity';
import { ClientResource, ClientsResponse } from '../response/client-response';

export class ClientAssembler implements BaseAssembler<Client, ClientResource, ClientsResponse> {

  toEntitiesFromResponse(response: ClientsResponse): Client[] {
    return response.clients.map(resource => this.toEntityFromResource(resource as ClientResource));
  }

  toEntityFromResource(resource: ClientResource): Client {
    return new Client({
      id: resource.id,
      fullName: resource.fullName,
      dni: resource.dni,
      email: resource.email,
      phone: resource.phone,
      monthlyIncome: resource.monthlyIncome
    });
  }

  toResourceFromEntity(entity: Client): ClientResource {
    return {
      id: entity.id,
      fullName: entity.fullName,
      dni: entity.dni,
      email: entity.email,
      phone: entity.phone,
      monthlyIncome: entity.monthlyIncome
    } as ClientResource;
  }
}
