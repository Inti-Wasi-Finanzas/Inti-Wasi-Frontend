import {HttpClient} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {PaymentScheduleEntry} from '../../domain/model/payment-schedule-entry.entity';
import {PaymentScheduleAssembler} from './../assembler/payment-schedule-entry-assembler';
import {PaymentScheduleEntryResource, PaymentScheduleResponse} from './../response/payment-schedule-entry-response';
import {environment} from '../../../../environments/environment';

export class PaymentScheduleApiEndpoint {

  private readonly baseUrl = `${environment.serverBaseUrl}${environment.simulationsEndpointPath}`;
  private readonly assembler = new PaymentScheduleAssembler();

  constructor(private http: HttpClient) {}

  getSchedule(simulationId: number): Observable<PaymentScheduleEntry[]> {
    const url = `${this.baseUrl}/${simulationId}/schedule`;

    return this.http.get<PaymentScheduleEntryResource[] | PaymentScheduleResponse>(url).pipe(
      map(resp => this.assembler.toEntitiesFromResponse(resp))
    );
  }

  getSchedulePdf(simulationId: number): Observable<Blob> {
    const url = `${this.baseUrl}/${simulationId}/schedule/pdf`;
    return this.http.get(url, {responseType: 'blob'});
  }
}
