import { Component, OnInit } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';
import { DatePickerService } from '../../@core/services/date-picker.service';

@Component({
  selector: 'ngx-custom-datepicker',
  templateUrl: './custom-datepicker.component.html',
  styleUrls: ['./custom-datepicker.component.scss']
})
export class CustomDatepickerComponent extends DefaultEditor implements OnInit {
  inputModel;

  constructor(private datePickerService: DatePickerService) {
    super();
  }

  ngOnInit(): void {
  }

  onDateChange() {
    const selectedDate = this.inputModel;
    const fieldName = this.cell.getColumn().id;

    // Use service to update the selected date
    this.datePickerService.updateSelectedDate({ field: fieldName, date: selectedDate });
  }
}
