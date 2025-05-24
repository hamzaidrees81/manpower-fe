import { Component, Inject, Input } from "@angular/core";
import { NbDialogRef, NB_DIALOG_CONFIG } from "@nebular/theme";

@Component({
  selector: 'ngx-select-stock-modal',
  templateUrl: './select-stock-modal.component.html',
  styleUrls: ['./select-stock-modal.component.scss']
})
export class SelectStockModalComponent {
 salelist;
  selectedItems: any[] = [];

  @Input() initialSelected: any[] = [];
  @Input() onSelectChange: (selected: any[]) => void = () => {};

  constructor(
    protected ref: NbDialogRef<SelectStockModalComponent>,
    @Inject(NB_DIALOG_CONFIG) private config
  ) {
    this.salelist = config.salelist || [];
  }

  ngOnInit(): void {
    // Initialize selectedItems from initialSelected input
    this.selectedItems = [...this.initialSelected];
  }

  isItemSelected(item: any): boolean {
    return this.selectedItems.some(i => i.productId === item.productId);
  }

  toggleSelection(item: any, event: any) {
    if (event.target.checked) {
      if (!this.isItemSelected(item)) {
        this.selectedItems.push(item);
      }
    } else {
      this.selectedItems = this.selectedItems.filter(i => i.productId !== item.productId);
    }

    this.onSelectChange(this.selectedItems);
  }

  submit() {
    this.ref.close(this.selectedItems);
  }

  cancel() {
    this.ref.close();
  }
}
