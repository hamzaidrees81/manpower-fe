import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DatePickerService {
  private selectedStartDateSource = new BehaviorSubject<{ field: string; date: Date } | null>(null);
  private selectedEndDateSource = new BehaviorSubject<{ field: string; date: Date } | null>(null);

  private selectediqamaExpiryDateSource = new BehaviorSubject<{ field: string; date: Date } | null>(null);
  private selectedjoiningDateDateSource = new BehaviorSubject<{ field: string; date: Date } | null>(null);
  private selectedpassportExpiryDateSource = new BehaviorSubject<{ field: string; date: Date } | null>(null);

  selectedStartDate$ = this.selectedStartDateSource.asObservable();
  selectedEndDate$ = this.selectedEndDateSource.asObservable();

  selectedIqamaExpiryDate$ = this.selectediqamaExpiryDateSource.asObservable();
  selectedJoiningDateDate$ = this.selectedjoiningDateDateSource.asObservable();
  selectedPassportExpiryDate$ = this.selectedpassportExpiryDateSource.asObservable();

  updateSelectedDate(data: { field: string; date: Date }) {
    debugger;
    if(data?.field === 'startDate'){
      this.selectedStartDateSource.next(data);
    }else if(data?.field === 'endDate'){
      this.selectedEndDateSource.next(data);
    }else if(data?.field === 'iqamaExpiry'){
      this.selectediqamaExpiryDateSource.next(data);
    }else if(data?.field === 'joiningDate'){
      this.selectedjoiningDateDateSource.next(data);
    }else if(data?.field === 'passportExpiry'){
      this.selectedpassportExpiryDateSource.next(data);
    }else{
      return
    }
  }
}
