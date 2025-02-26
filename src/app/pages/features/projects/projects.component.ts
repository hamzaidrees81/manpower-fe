import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { SmartTableData } from '../../../@core/data/smart-table';

@Component({
  selector: 'ngx-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent {

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
    columns :{
      id: {
        title: "ID",
        type: "number",
      },
      company_id: {
        title: "Company ID",
        type: "number",
      },
      client_id: {
        title: "Client ID",
        type: "number",
      },
      project_id: {
        title: "Project ID",
        type: "string",
      },
      name: {
        title: "Project Name",
        type: "string",
      },
      location: {
        title: "Location",
        type: "string",
      },
      start_date: {
        title: "Start Date",
        type: "date",
      },
      end_date: {
        title: "End Date",
        type: "date",
      },
    }
    
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private service: SmartTableData) {
    const data = this.service.getProjects();
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
