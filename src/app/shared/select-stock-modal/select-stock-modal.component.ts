import { Component, Inject, Input } from '@angular/core';
import { NbDialogRef, NB_DIALOG_CONFIG } from '@nebular/theme';

@Component({
  selector: 'ngx-select-stock-modal',
  templateUrl: './select-stock-modal.component.html',
  styleUrls: ['./select-stock-modal.component.scss'],
})
export class SelectStockModalComponent {
  salelist: any[] = [];
  filteredList;
   isSale: boolean = false;

  selectedItems: any[] = [];
  searchTerm = '';

  @Input() initialSelected: any[] = [];
  @Input() onSelectChange: (selected: any[]) => void = () => {};

  constructor(
    protected ref: NbDialogRef<SelectStockModalComponent>,
    @Inject(NB_DIALOG_CONFIG) private config: any
  ) {
    this.salelist = config.salelist || [];
    this.initialSelected = config.initialSelected || [];
    this.isSale = config.isSale || false;
    this.onSelectChange = config.onSelectChange || (() => {});
  }

  ngOnInit(): void {
    this.salelist = this.salelist.map(item => ({
      ...item,
      selected: this.initialSelected.some(sel => sel.productId === item.productId),
    }));

    this.filteredList = [...this.salelist];
    this.selectedItems = this.salelist.filter(item => item.selected);
  }

  filterTable(): void {
    const term = this.searchTerm.toLowerCase();
    this.filteredList = this.salelist.filter(item =>
      item.product?.name?.toLowerCase().includes(term)
    );
  }

  onCheckboxChange(item: any): void {
    if (item.selected) {
      this.selectedItems.push(item);
    } else {
      this.selectedItems = this.selectedItems.filter(i => i.productId !== item.productId);
    }

    this.onSelectChange(this.selectedItems);
  }

  submit(): void {
    this.ref.close(this.selectedItems);
  }

  cancel(): void {
    this.ref.close();
  }
}
