import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { SmartTableData } from '../../../@core/data/smart-table';
import { DatePickerService } from '../../../@core/services/date-picker.service';
import { SmartTableDatepickerRenderComponentComponent } from '../../../components/smart-table-datepicker-render-component/smart-table-datepicker-render-component.component';
import { CustomDatepickerComponent } from '../../../components/custom-datepicker/custom-datepicker.component';
import { ProjectService } from '../../../@core/services/projects.service';
import { DesignationService } from '../../../@core/services/designation.service';
import { AssetService } from '../../../@core/services/asset.service';

@Component({
  selector: 'ngx-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss']
})
export class TimesheetComponent  implements OnInit {
  projects: any[] = []; // Store company list
  designation: any[] = []; // Store company list
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
      company: {
        title: "Company ID",
        type: "number",
      },
      sponsoredBy: {
        title: "Sponsored By",
        type: "number",
      },
      name: {
        title: "Name",
        type: "string",
      },
      idNumber: {
        title: "ID Number",
        type: "string",
        filter: false,
      },
      iqamaExpiry: {
        title: "Iqama Expiry",
        type: "string",
        filter: false,
      },
      phone: {
        title: "Phone",
        type: "string",
        filter: false,
      },
      designation: {
        title: "Designation",
        type: "string",
      },
      passport: {
        title: "Passport",
        type: "number",
        filter: false,
      },
      passportExpiry: {
        title: "Passport Expiry",
        type: "string",
        filter: false,
      },
      joiningDate: {
        title: "Joining Date",
        type: "string",
        filter: false,
      },
      assetType: {
        title: "Asset Type",
        type: "number",
        filter: false,
      },
      assetNumber: {
        title: "Asset Number",
        type: "number",
        filter: false,
      }, 
    },
  }

  settingsProjects = {
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
      
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true,
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      // name: {
      //   title: "Asset Name",
      //   type: "string"
      // },
      project: {
        title: 'Project Name',
        type: 'html',
        valuePrepareFunction: (project) => project.name,
        editor: {
          type: 'list',
          config: {
            selectText: 'Select...',
            list: [],
          },
        },
      },
      designation: {
        title: 'Designation',
        type: 'html',
        valuePrepareFunction: (designation) => designation.name,
        editor: {
          type: 'list',
          config: {
            selectText: 'Select...',
            list: [],
          },
        },
      },
      regularRate: {
        title: "RegularRate",
        type: "number",
        filter: false,
      },
      overtimeRate: {
        title: "Over Time Rate",
        type: "number",
        filter: false,
      },
      regularRatePaid: {
        title: "Regular Rate Paid",
        type: "number",
        filter: false,
      },
      overtimeRatePaid: {
        title: "Over Time Rate Paid",
        type: "number",
        filter: false,
      },
      startDate: {
        title: 'Start Time',
        type: 'custom',
        renderComponent: SmartTableDatepickerRenderComponentComponent,
        filter: false,
        editor: {
          type: 'custom',
          component: CustomDatepickerComponent,
        }
      },
      endDate: {
        title: 'End Time',
        type: 'custom',
        renderComponent: SmartTableDatepickerRenderComponentComponent,
        filter: false,
        editor: {
          type: 'custom',
          component: CustomDatepickerComponent,
        },
      },
      isActive: {
        title: "Is Active",
        type: "html",
        filter: false,
        editor: {
          type: "checkbox"
        },
        valuePrepareFunction: (value: boolean) => {
          return value ? '<i class="nb-checkmark text-success"></i>' : '<i class="nb-close text-danger"></i>';
        }
      },
      status: {
        title: "Status",
        type: "html",
        filter: false,
        editor: {
          type: "checkbox"
        },
        valuePrepareFunction: (value: boolean) => {
          return value ? '<i class="nb-checkmark text-success"></i>' : '<i class="nb-close text-danger"></i>';
        }
      },
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
  customStartDate: Date;
  customEndDate: Date;


  constructor(private service: SmartTableData,private datePickerService: DatePickerService,private projectService:ProjectService,private designationService:DesignationService,private assetService:AssetService) {}

  ngOnInit(): void {
    
    this.getExpenses();
    this.initYears();
    this.getAsset();

    this.loadDropdowns();
    this.loadAssetProjects();

  }

  // Load all Assets Projects
  loadAssetProjects(): void {
    this.assetService.getAssetProjects().subscribe(
      (data) => {
        this.sourceProjects.load(data);
      },
      (error) => {
        console.error('Error loading projects:', error);
      }
    );
  }

  getExpenses(){
    const data = this.service.getExpenses();
    this.sourceExpenses.load(data);
  }

  getAsset(){
    const storedData = localStorage.getItem('selectedPerson');
    if (storedData) {
      this.personData = JSON.parse(storedData);
    }
    const updatedAssetData = {
      ...this.personData,
      company:this.personData.company.name,
      sponsoredBy:this.personData.sponsoredBy.name
    }
    this.sourceAsset.load([updatedAssetData]);
    console.log("44",this.personData);
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
  
    if (!this.selectedMonth || !this.selectedYear) {
      return;
    }
  
    const monthIndex = this.months.indexOf(this.selectedMonth);
    const firstDay = new Date(this.selectedYear, monthIndex, 1);
    const lastDay = new Date(this.selectedYear, monthIndex + 1, 0);
    let currentDay = new Date(firstDay);
    let weekCounter = 1;
  
    while (currentDay <= lastDay) {
      let weekStart = new Date(currentDay);
      let weekEnd = new Date(currentDay);
      weekEnd.setDate(weekEnd.getDate() + 6);
      if (weekEnd > lastDay) {
        weekEnd = lastDay;
      }
  
      this.weeks.push({
        weekNumber: weekCounter,
        dateRange: `${weekStart.toDateString()} - ${weekEnd.toDateString()}`,
        data: new LocalDataSource([
          { srNo: 1, projectName: this.list[0].value, rateType: 'Regular', mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' },
          { srNo: 1, projectName: this.list[0].value, rateType: 'OT', mon: '', tue: '', wed: '', thu: '', fri: '', sat: '', sun: '' }
        ])
      });
  
      currentDay.setDate(currentDay.getDate() + 7);
      weekCounter++;
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


    // -------- PROJECTS 
    handleStartDate() {
      // START DATE
      this.datePickerService.selectedStartDate$.subscribe(event => {
        if (event) {
          this.customStartDate = event.date;
        }
      });
    }
  
    handleEndDate() {
      // START DATE
      this.datePickerService.selectedEndDate$.subscribe(event => {
        if (event) {
          this.customEndDate = event.date;
        }
      });
    }
      // Fetch Companies and Clients
  loadDropdowns(): void {
    this.projectService.getProjects().subscribe((data) => {
      this.projects = data;
      this.settingsProjects = {
        ...this.settingsProjects,
        columns: {
          ...this.settingsProjects.columns,
          project: {
            ...this.settingsProjects.columns.project,
            editor: {
              type: 'list',
              config: {
                selectText: 'Select...',
                list: data.map((c) => ({
                  value: JSON.stringify(c), // Store whole object as string
                  title: c.name, // Display name
                })),
              },
            },
          },
        },
      };
    });

    this.designationService.getDesignations().subscribe((data) => {
      this.designation = data;
      this.settingsProjects = {
        ...this.settingsProjects,
        columns: {
          ...this.settingsProjects.columns,
          designation: {
            ...this.settingsProjects.columns.designation,
            editor: {
              type: 'list',
              config: {
                selectText: 'Select...',
                list: data.map((c) => ({
                  value: JSON.stringify(c), // Store whole object as string
                  title: c.name, // Display name
                })),
              },
            },
          },
        },
      };
    });
  }
      // Add project
onProjectCreateConfirm(event: any): void {
  // Update start and end dates
  this.handleStartDate();
  this.handleEndDate();

  // Parse necessary fields and prepare request data
  const newProject = {
    ...event.newData,
    designation: JSON.parse(event.newData.designation),
    project: JSON.parse(event.newData.project),
    startDate: this.customStartDate,
    endDate: this.customEndDate,
    asset: {id:this.personData.id},
    company: {id:this.personData.company.id},
    status: event.newData.status === true ? 1 : 0, // Convert boolean to number
    isActive: event.newData.isActive === true ? 1 : 0, // Convert boolean to number
  };

  // Call service to add the project
  this.assetService.addAssetProject(newProject).subscribe({
    next: (data) => event.confirm.resolve(data),
    error: (error) => {
      console.error('Error adding project:', error);
      event.confirm.reject();
    }
  });
}

  
onProjectEditConfirm(event: any): void {
  const updatedProject = {
    ...event.newData,
    designation: JSON.parse(event.newData.designation),
    project: JSON.parse(event.newData.project),
    startDate: this.customStartDate,
    endDate: this.customEndDate,
    asset: {id:this.personData.id},
    company: {id:this.personData.company.id},
    status: event.newData.status === true ? 1 : 0, // Convert boolean to number
    isActive: event.newData.isActive === true ? 1 : 0, // Convert boolean to number
  };

  this.assetService.updateAssetProject(updatedProject.id, updatedProject).subscribe({
    next: (data) => event.confirm.resolve(data),
    error: (error) => {
      console.error('Error updating project:', error);
      event.confirm.reject();
    }
  });
}

  
  

  // Delete project
  onProjectDeleteConfirm(event: any): void {
    if (window.confirm('Are you sure you want to delete this project?')) {
      this.assetService.deleteAssetProject(event.data.id).subscribe(
        () => {
          event.confirm.resolve();
        },
        (error) => {
          console.error('Error deleting project:', error);
          event.confirm.reject();
        }
      );
    } else {
      event.confirm.reject();
    }
  }
}

