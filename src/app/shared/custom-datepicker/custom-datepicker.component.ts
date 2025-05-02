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
    if (this.cell && this.cell.newValue) {
      this.inputModel = this.cell.newValue;
    } else if (this.cell && this.cell['value']) {
      this.inputModel = this.cell['value'];
    }
  
  }

  onDateChange() {
    const selectedDate = this.inputModel;
    const fieldName = this.cell.getColumn().id;

    // Use service to update the selected date
    this.datePickerService.updateSelectedDate({ field: fieldName, date: selectedDate });
  }
}
