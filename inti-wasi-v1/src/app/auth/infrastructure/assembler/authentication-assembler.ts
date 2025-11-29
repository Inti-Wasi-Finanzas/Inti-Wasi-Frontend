import { BaseAssembler } from '../../../shared/infrastructure/api/base-assembler';
import { User } from '../../domain/model/user.entity';
import { AuthResponse, AuthResource }from '../response/authentication-response';

export class AuthenticationAssembler implements BaseAssembler<User, AuthResource, AuthResponse> {

  toEntityFromResource(resource: AuthResource): User {
    return new User({
      id: resource.id,
      username: resource.username,
      roles: this.extractRolesFromToken(resource.token)
    });
  }

  toResourceFromEntity(entity: User): AuthResource {
    throw new Error('Not implemented - not needed for login');
  }

  toEntitiesFromResponse(response: AuthResponse): User[] {
    return [this.toEntityFromResource(response as AuthResource)];
  }

  private extractRolesFromToken(token: string): string[] {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      // Tu backend pone los roles en "scope" como string separado por espacios
      const scope = payload.scope || payload.authorities || '';
      return scope.split(' ').filter(Boolean);
    } catch (e) {
      console.warn('No se pudieron extraer roles del token', e);
      return ['ROLE_CLIENT'];
    }
  }
}
