import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { SmartTableData } from '../../../@core/data/smart-table';

@Component({
  selector: 'ngx-asset',
  templateUrl: './asset.component.html',
  styleUrls: ['./asset.component.scss'],
})
export class AssetComponent {

  settings = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns : {
      id: {
        title: "ID",
        type: "number",
      },
      company_id: {
        title: "Company ID",
        type: "number",
      },
      sponsored_by: {
        title: "Sponsored By",
        type: "number",
      },
      name: {
        title: "Name",
        type: "string",
      },
      id_number: {
        title: "ID Number",
        type: "string",
      },
      iqama_expiry: {
        title: "Iqama Expiry",
        type: "string",
      },
      phone: {
        title: "Phone",
        type: "string",
      },
      designation: {
        title: "Designation",
        type: "string",
      },
      passport: {
        title: "Passport",
        type: "number",
      },
      passport_expiry: {
        title: "Passport Expiry",
        type: "string",
      },
      joining_date: {
        title: "Joining Date",
        type: "string",
      },
      asset_type: {
        title: "Asset Type",
        type: "number",
      },
      asset_number: {
        title: "Asset Number",
        type: "number",
      }, 
    
    }
  }

  source: LocalDataSource = new LocalDataSource();

  constructor(private service: SmartTableData) {
    const data = this.service.getAsset();
    this.source.load(data);
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
}
