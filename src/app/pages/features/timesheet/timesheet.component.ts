import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../../@core/data/smart-table';

@Component({
  selector: 'ngx-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss']
})
export class TimesheetComponent  implements OnInit {

  personData: any;
  selectedMonth: string;
  selectedYear: number;
  months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  years: number[] = [];
  weeks: any[] = []; // Store 4 weeks data

  sourceAsset: LocalDataSource = new LocalDataSource();
  sourceProjects: LocalDataSource = new LocalDataSource();
  timesheetSource: LocalDataSource = new LocalDataSource();
  sourceExpenses: LocalDataSource = new LocalDataSource();

  projectOptions = [
    { value: 'AI Development', title: 'AI Development' },
    { value: 'E-Commerce Platform', title: 'E-Commerce Platform' },
    { value: 'CRM System', title: 'CRM System' }
  ];

  list= [
    { value: 'Project A', title: 'Project A' },
    { value: 'Project B', title: 'Project B' },
    { value: 'Project C', title: 'Project C' }
  ]

  settingsAsset = {
    actions:false,
   hideSubHeader: true,
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
    },
  }

  settingsProjects = {
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
    columns: {
      id: {
        title: "Sr#",
        type: "number",
        editable: false,
        addable: false
      },
      project_name: {
        title: "Project Name",
        editor: {
          type: "list",
          config: { selectText: "Select...", list: this.projectOptions }
        }
      },
      position: {
        title: "Position",
        type: "string"
      },
      hourly_rate_charged: {
        title: "Hourly Rate Charged",
        type: "number"
      },
      overtime_rate_charged: {
        title: "Overtime Rate Charged",
        type: "number"
      },
      hourly_rate_paid: {
        title: "Hourly Rate Paid",
        type: "number"
      },
      overtime_rate_paid: {
        title: "Overtime Rate Paid",
        type: "number"
      },
      is_active: {
        title: "Is Active",
        type: "html",
        editor: {
          type: "checkbox"
        },
        valuePrepareFunction: (value: boolean) => {
          return value ? '<i class="nb-checkmark text-success"></i>' : '<i class="nb-close text-danger"></i>';
        }
      }
    }
  };

  settingsExpenses = {
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
    columns: {
      id: {
        title: 'S#',
        editable: false,
        addable: false,
      },
      cost: {
        title: 'Cost',
        type: 'string',
      },
      amount: {
        title: 'Amount',
        type: 'string',
      },
      status: {
        title: 'Status',
        type: 'html',
        editor: {
          type: 'checkbox',
          config: {
            true: '✔',
            false: ''
          }
        }
      },
      category: {
        title: 'Category',
        editor: {
          type: 'list',
          config: {
            selectText: 'Select',
            list: [
              { value: 'Fixed', title: 'Fixed' },
              { value: 'Variable', title: 'Variable' }
            ]
          }
        }
      },
      rateType: {
        title: 'Rate Type',
        editor: {
          type: 'list',
          config: {
            selectText: 'Select',
            list: [
              { value: 'Hourly', title: 'Hourly' },
              { value: 'Monthly', title: 'Monthly' }
            ]
          }
        }
      },
      type: {
        title: 'Type',
        type: 'string',
        defaultValue: 'Amount or Percentage'
      },
      value: {
        title: 'Value',
        type: 'string',
      }
    }
  };

  tableSettings = {
    hideSubHeader: true,
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      srNo: { title: 'S#', type: 'number', editable: false },
      projectName: { title: 'Project Name', type: 'string', editor: { type: 'list', config: { list: this.list } } },
      rateType: { title: 'Rate Type', type: 'string', editor: { type: 'list', config: { list: [{ value: 'Regular', title: 'Regular' }, { value: 'OT', title: 'OT' }] } } },
      mon: { title: 'Mon', type: 'string' },
      tue: { title: 'Tue', type: 'string' },
      wed: { title: 'Wed', type: 'string' },
      thu: { title: 'Thu', type: 'string' },
      fri: { title: 'Fri', type: 'string' },
      sat: { title: 'Sat', type: 'string' },
      sun: { title: 'Sun', type: 'string' },
    }
  };


  constructor(private service: SmartTableData) {}

  ngOnInit(): void {
    
    this.getExpenses();
    this.initYears();
    this.getProject();
    this.getAsset();

  }

  getExpenses(){
    const data = this.service.getExpenses();
    this.sourceExpenses.load(data);
  }

  getProject(){
    const projectData = [
      { id: 1, project_name: "AI Development", position: "Developer", hourly_rate_charged: 50, overtime_rate_charged: 75, hourly_rate_paid: 40, overtime_rate_paid: 60, is_active: true },
      { id: 2, project_name: "E-Commerce Platform", position: "Manager", hourly_rate_charged: 60, overtime_rate_charged: 90, hourly_rate_paid: 50, overtime_rate_paid: 70, is_active: false }
    ];
    this.sourceProjects.load(projectData);
  }

  getAsset(){
    const storedData = localStorage.getItem('selectedPerson');
    if (storedData) {
      this.personData = JSON.parse(storedData);
    }
    this.sourceAsset.load([this.personData]);
  }

  initYears() {
    const currentYear = new Date().getFullYear();
    for (let i = currentYear - 10; i <= currentYear + 1; i++) {
      this.years.push(i);
    }
    this.selectedYear = currentYear;
    this.selectedMonth = this.months[new Date().getMonth()];
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onDeleteExpenseConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
  

  loadSheets() {
      this.weeks = [];
      for (let i = 1; i <= 4; i++) {
        this.weeks.push({
          weekNumber: i,
          data: new LocalDataSource([
            { srNo: 1, projectName: this.list[0].value, rateType: 'Regular', mon: 2, tue: 3, wed: 5, thu: 4, fri: 2, sat: 0, sun: 1 },
            { srNo: 1, projectName: this.list[0].value, rateType: 'OT', mon: 1, tue: 2, wed: 2, thu: 3, fri: 1, sat: 0, sun: 0 }
          ])
        });
      }
    }
  
    // Add row function (adds 2 rows: Regular & OT)
  onAddRow(weekIndex: number) {
      let maxId = this.weeks[weekIndex].data['data'].length > 0 
        ? Math.max(...this.weeks[weekIndex].data['data'].map((row: any) => row.srNo)) + 1 
        : 1;
  
      const newRegularRow = {
        srNo: maxId,
        projectName: 'Project B', // Dummy Data
        rateType: 'Regular',
        mon: Math.floor(Math.random() * 5),
        tue: Math.floor(Math.random() * 5),
        wed: Math.floor(Math.random() * 5),
        thu: Math.floor(Math.random() * 5),
        fri: Math.floor(Math.random() * 5),
        sat: Math.floor(Math.random() * 3),
        sun: Math.floor(Math.random() * 3)
      };
  
      const newOTRow = {
        srNo: maxId,
        projectName: 'Project B', // Dummy Data
        rateType: 'OT',
        mon: Math.floor(Math.random() * 3),
        tue: Math.floor(Math.random() * 3),
        wed: Math.floor(Math.random() * 3),
        thu: Math.floor(Math.random() * 3),
        fri: Math.floor(Math.random() * 3),
        sat: Math.floor(Math.random() * 2),
        sun: Math.floor(Math.random() * 2)
      };
  
      this.weeks[weekIndex].data.add(newRegularRow);
      this.weeks[weekIndex].data.add(newOTRow);
    }
  
    // Delete function to remove both rows with the same Sr#
  onDelete(event: any, weekIndex: number) {
      let srNo = event.data.srNo;
      let currentData = this.weeks[weekIndex].data['data'];
  
      // Filter out rows with the same Sr#
      let updatedData = currentData.filter((row: any) => row.srNo !== srNo);
      this.weeks[weekIndex].data.load(updatedData);
    }
    
    loadTimesheet() {
      this.weeks = [];
      for (let i = 1; i <= 4; i++) {
        this.weeks.push({
          weekNumber: i,
          data: new LocalDataSource([
            { srNo: 1, projectName: 'Project A', rateType: 'Regular', mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' },
            { srNo: 2, projectName: 'Project A', rateType: 'OT', mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' }
          ])
        });
      }
    }
  
    addRow(weekIndex: number) {
      const week = this.weeks[weekIndex];
  
      // Ensure source data is properly updated
      week.data.getAll().then(data => {
        const newSrNo = data.length + 1;
        const newRows = [
          { srNo: newSrNo, projectName: this.list[0].value, rateType: 'Regular', mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' },
          { srNo: newSrNo, projectName: this.list[0].value, rateType: 'OT', mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' }
        ];
  
        // Update the table data properly
        week.data.load([...data, ...newRows]);
      });
    }
  
    onDeleteExpense(event, weekIndex: number) {
      if (window.confirm('Are you sure you want to delete?')) {
        const rowToDelete = event.data.srNo;
      event.confirm.resolve();
  
      const week = this.weeks[weekIndex];
      week.data.getAll().then(data => {
        const remaining = data.filter(row => row.srNo !== rowToDelete);
        week.data.load(remaining);
      });
        event.confirm.resolve();
      } else {
        event.confirm.reject();
      }
    }
}

