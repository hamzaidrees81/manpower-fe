import { Component, OnInit, Input, Output,EventEmitter } from "@angular/core";

@Component({
  selector: 'ngx-add-button',
  template: `
    <button nbButton  status="info" (click)="onClick()">
      <nb-icon icon="plus-outline"></nb-icon> Sponsor
    </button>
  `,
})
export class AddButtonComponent implements OnInit {
  @Input() value: any;
  @Input() rowData: any;
  @Output() save: EventEmitter<any> = new EventEmitter();

  ngOnInit() {}

  onClick() {
    this.save.emit(this.rowData);
  }
}
