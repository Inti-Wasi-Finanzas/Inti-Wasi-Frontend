import { BaseEntity } from '../../../shared/infrastructure/api/base-entity';

export class User implements BaseEntity {
  private _id: number;
  private _username: string;
  private _role: string = '';

  constructor(data: { id: number; username: string; role: string }) {
    this._id = data.id;
    this._username = data.username;
    this._role = data.role;
  }

  get id(): number { return this._id; }
  set id(value: number) { this._id = value; }

  get username(): string { return this._username; }
  set username(value: string) { this._username = value; }

  get role(): string { return this._role; }

  hasRole(role: string): boolean {
    return this._role.includes(role);
  }

  get isClient(): boolean { return this.hasRole('ROLE_CLIENT'); }
  get isAdvisor(): boolean { return this.hasRole('ROLE_ADVISOR'); }
  get isAdmin(): boolean { return this.hasRole('ROLE_ADMIN'); }
}

