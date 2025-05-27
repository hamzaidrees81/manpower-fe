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
  isSelectedShop: any;

  constructor(
    protected ref: NbDialogRef<SelectStockModalComponent>,
    @Inject(NB_DIALOG_CONFIG) private config: any
  ) {
    this.salelist = config.salelist || [];
    this.initialSelected = config.initialSelected || [];
    this.isSale = config.isSale || false;
    this.isSelectedShop = config.isSelectedShop || false;
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
  this.filteredList = this.salelist.filter(item => {
    const nameMatch = item.product?.name?.toLowerCase().includes(term);
    const codeMatch = item.product?.productCode?.toLowerCase().includes(term);
    return nameMatch || codeMatch;
  });
}

handleRowClick(event: MouseEvent, item: any): void {
  const target = event.target as HTMLElement;
  const row = target.closest('tr');
  const cell = target.closest('td');

  if (!row || !cell) return;

  const cellIndex = Array.from(row.children).indexOf(cell);

  // If clicked on the first column (checkbox), do nothing
  if (cellIndex === 0) {
    return;
  }

  // Otherwise, add and close
  if (!this.selectedItems.find(i => i.productId === item.productId)) {
    item.selected = true;
    this.selectedItems.push(item);
    this.onSelectChange(this.selectedItems);
  }

  this.cancel(); // Replace this with actual close logic
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
