import { Component, OnInit } from '@angular/core';
import { DefaultEditor } from 'ng2-smart-table';
import { DatePickerService } from '../../@core/services/date-picker.service';

@Component({
  selector: 'ngx-custom-datepicker',
  templateUrl: './custom-datepicker.component.html',
  styleUrls: ['./custom-datepicker.component.scss']
})
export class CustomDatepickerComponent extends DefaultEditor implements OnInit {
  inputModel; // Should be a string for date input compatibility

  constructor(private datePickerService: DatePickerService) {
    super();
  }

  ngOnInit(): void {
    if (this.cell && this.cell.newValue) {
      this.inputModel = this.cell.newValue;
    } else if (this.cell && this.cell['value']) {
      this.inputModel = this.cell['value'];
    } else {
      // ✅ Set to today's date in 'yyyy-MM-dd' format
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = String(today.getMonth() + 1).padStart(2, '0');
      const dd = String(today.getDate()).padStart(2, '0');
      this.inputModel = `${yyyy}-${mm}-${dd}`;

      // ✅ Update the cell value so the smart table knows
      this.cell.newValue = this.inputModel;
    }

    const fieldName = this.cell.getColumn().id;

    // Update selected date via service
    this.datePickerService.updateSelectedDate({ field: fieldName, date:  this.inputModel });
  }

  onDateChange() {
    const selectedDate = this.inputModel;
    const fieldName = this.cell.getColumn().id;

    // Update selected date via service
    this.datePickerService.updateSelectedDate({ field: fieldName, date: selectedDate });
  }
}
