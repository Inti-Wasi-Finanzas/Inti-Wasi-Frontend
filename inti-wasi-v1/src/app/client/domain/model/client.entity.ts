import { BaseEntity } from '../../../shared/infrastructure/api/base-entity';

export class Client implements BaseEntity {
  private _id: number;
  private _fullName: string;
  private _dni: string;
  private _email: string;
  private _phone: string;
  private _monthlyIncome: number;

  constructor(client: {
    id: number;
    fullName: string;
    dni: string;
    email: string;
    phone: string;
    monthlyIncome: number;
  }) {
    this._id = client.id;
    this._fullName = client.fullName;
    this._dni = client.dni;
    this._email = client.email;
    this._phone = client.phone;
    this._monthlyIncome = client.monthlyIncome;
  }

  get id(): number {
    return this._id;
  }
  set id(value: number) {
    this._id = value;
  }

  get fullName(): string {
    return this._fullName;
  }
  set fullName(value: string) {
    this._fullName = value;
  }

  get dni(): string {
    return this._dni;
  }
  set dni(value: string) {
    this._dni = value;
  }

  get email(): string {
    return this._email;
  }
  set email(value: string) {
    this._email = value;
  }

  get phone(): string {
    return this._phone;
  }
  set phone(value: string) {
    this._phone = value;
  }

  get monthlyIncome(): number {
    return this._monthlyIncome;
  }
  set monthlyIncome(value: number) {
    this._monthlyIncome = value;
  }
}
