import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { DatePickerService } from '../../../@core/services/date-picker.service';
import { SmartTableDatepickerRenderComponentComponent } from '../../../shared/smart-table-datepicker-render-component/smart-table-datepicker-render-component.component';
import { CustomDatepickerComponent } from '../../../shared/custom-datepicker/custom-datepicker.component';
import { ProjectService } from '../../../@core/services/projects.service';
import { DesignationService } from '../../../@core/services/designation.service';
import { AssetService } from '../../../@core/services/asset.service';
import { TimesheetService } from '../../../@core/services/timesheet.service';
import { ToasterService } from '../../../@core/services/toaster.service';
import { NbDialogService } from '@nebular/theme';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { SponsorModalComponent } from '../sponsor-modal/sponsor-modal.component';
import { AddButtonComponent } from '../../../shared/add-button/add-button.component';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-timesheet',
  templateUrl: './timesheet.component.html',
  styleUrls: ['./timesheet.component.scss']
})
export class TimesheetComponent  implements OnInit {
  projects: any[] = []; // Store company list
  designation: any[] = []; // Store company list
  assetData: any;
  isTimeSheetSubmit = false;
  timeSheetCollection: any[] = []; // Array to store timesheet data

  sourceProjects: LocalDataSource = new LocalDataSource();
  sourceExpenses: LocalDataSource = new LocalDataSource();

  list: { id: string; name: string }[] = [];
  settingsProjects = {
    actions: {
      position: 'right', // Moves action buttons to the right
    },
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
        valuePrepareFunction: (project) => project.name ,
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
        title: 'Start Date',
        type: 'custom',
        renderComponent: SmartTableDatepickerRenderComponentComponent,
        filter: false,
        editor: {
          type: 'custom',
          component: CustomDatepickerComponent,
        }
      },
      endDate: {
        title: 'End Date',
        type: 'custom',
        renderComponent: SmartTableDatepickerRenderComponentComponent,
        filter: false,
        editor: {
          type: 'custom',
          component: CustomDatepickerComponent,
        },
      },
      addSponsorButton: {
        title: 'Add Sponsor',
        type: 'custom',
        filter: false,
        editable: false,
        addable: false,
        renderComponent: AddButtonComponent,
        onComponentInitFunction: (instance) => {
          const sub = instance.save.subscribe(row => {
            this.openSponsorModal(row); // ✅ this refers to your component class
          });
        
          instance.ngOnDestroy = () => sub.unsubscribe();
        }
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
      // status: {
      //   title: "Status",
      //   type: "html",
      //   filter: false,
      //   editor: {
      //     type: "checkbox"
      //   },
      //   valuePrepareFunction: (value: boolean) => {
      //     return value ? '<i class="nb-checkmark text-success"></i>' : '<i class="nb-close text-danger"></i>';
      //   }
      // },
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


  // TIME SHEET CONFIG
  customStartDate: Date;
  customEndDate: Date;

  months = [
    { name: 'January', value: 1 }, { name: 'February', value: 2 },
    { name: 'March', value: 3 }, { name: 'April', value: 4 },
    { name: 'May', value: 5 }, { name: 'June', value: 6 },
    { name: 'July', value: 7 }, { name: 'August', value: 8 },
    { name: 'September', value: 9 }, { name: 'October', value: 10 },
    { name: 'November', value: 11 }, { name: 'December', value: 12 }
  ];
  
  years: number[] = [];
  selectedMonth = new Date().getMonth() + 1;
  selectedYear = new Date().getFullYear();
  weeks: any[] = [];
  getProjects: { projectId: string; projectName: string }[] = [];

  // TIME SHEET CONFIG END


  constructor(private router: Router,private dialogService: NbDialogService,private toasterService: ToasterService,private datePickerService: DatePickerService,private projectService:ProjectService,private designationService:DesignationService,private assetService:AssetService,private timesheetService : TimesheetService) {}

  ngOnInit(): void {
    
    this.getExpenses();
    this.getAsset();
    this.loadAssetProjects();
    this.loadDropdowns();
    this.populateYears();

  }

  populateYears() {
    const currentYear = new Date().getFullYear();
    this.years = Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
  }

  openSponsorModal(row: any) {
    this.dialogService.open(SponsorModalComponent, {
      context: row,
      closeOnBackdropClick: false,
    });
  }
  
  async loadSheet() {
    this.timeSheetCollection = [];
    this.isTimeSheetSubmit = true;
    this.weeks = [];
  
    let date = new Date(this.selectedYear, this.selectedMonth - 1, 1);
    const defaultProjectId = this.getProjects.length > 0 ? this.getProjects[0].projectId : '';
  
    if (date.getDay() !== 1) {
      date.setDate(date.getDate() - (date.getDay() === 0 ? 6 : date.getDay() - 1));
    }
  
    let weekIndex = 1;
    let srNo = 1; // Serial number starts from 1
  
    while (date.getMonth() === this.selectedMonth - 1 || (weekIndex === 1 && date.getDate() !== 1)) {
      let startOfWeek = new Date(date);
      let endOfWeek = new Date(startOfWeek);
      endOfWeek.setDate(startOfWeek.getDate() + 6);
  
      if (endOfWeek.getMonth() !== this.selectedMonth - 1) {
        endOfWeek = new Date(this.selectedYear, this.selectedMonth, 0);
      }
  
      const weekData = {
        title: `Week ${weekIndex}`,
        weekIndex: weekIndex,
        days: this.getWeekDays(startOfWeek, weekIndex),
        rows: []
      };
  
      const id = Date.now();
  
      weekData.rows.push({
        id: id,
        rowSrNo: srNo, // Same SR No for both rows
        weekIndex: weekIndex, // Store the week index
        projectName: defaultProjectId,
        rateType: 'Regular',
        days: {}
      });
  
      weekData.rows.push({
        id: id, // Different ID but same SR No
        rowSrNo: srNo, // Same SR No for both rows
        weekIndex: weekIndex, // Store the week index
        projectName: defaultProjectId,
        rateType: 'OT',
        days: {}
      });
  
      this.weeks.push(weekData);
      srNo++; // Increment SR No for the next pair
      weekIndex++;
      date.setDate(date.getDate() + 7);
    }
  
    await this.getTimeSheetList(); 
    this.mapTimesheetData();
  
  }
  
  mapTimesheetData() {
    if (!this.timeSheetCollection || !this.weeks) return;
  
    this.weeks.forEach(week => {
      const weekData = this.timeSheetCollection.filter(item => item.weekIndex === week.weekIndex);
  
      weekData.forEach(item => {
        const formattedDate = this.formatDateToDisplay(item.timesheetDate);
  
        // Find the corresponding row based on rowSrNo AND rateType
        let targetRow = week.rows.find(row => row.rowSrNo === item.rowSrNo && row.rateType === (item.rateType === 1 ? 'Regular' : 'OT'));
  
        // If the row doesn't exist, add it
        if (!targetRow) {
          this.addMoreRows(week);
          targetRow = week.rows.find(row => row.rowSrNo === item.rowSrNo && row.rateType === (item.rateType === 1 ? 'Regular' : 'OT'));
        }
  
        // Assign hours to the correct date in the correct row
        if (targetRow) {
          targetRow.days[formattedDate] = item.hours;
        }
      });
    });
  }
  
  
  
  formatDateToDisplay(dateString: string): string {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { weekday: "short" }; // Get short weekday name (e.g., "Tue")
    const day = date.getDate(); // Get day number (e.g., 1)
  
    return `${date.toLocaleDateString("en-US", options)} (${day})`; // Format "Tue (1)"
  }
  
  getTimeSheetList(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.timesheetService.getTimesheetByEmpIdYearMonth(this.assetData?.id, this.selectedYear, this.selectedMonth)
        .subscribe(
          (data) => {
            this.timeSheetCollection = data;
            resolve(data); // ✅ Resolve the Promise when data is received
          },
          (error) => {
            console.error('❌ Error loading projects:', error);
            reject(error); // ❌ Reject the Promise if there's an error
          }
        );
    });
  }
  goToAnotherPage() {
    // Navigate to the desired route
    this.router.navigate(['pages/features/sponsor']);
  }
  addMoreRows(week: any,) {
    const defaultProjectId = this.getProjects.length > 0 ? this.getProjects[0].projectId : '';
  
    // Find the next SR No
    let srNo = week.rows.length > 0 ? Math.max(...week.rows.map(r => r.rowSrNo)) + 1 : 1;
  
    const id = Date.now();
  
    week.rows.push({
      id: id,
      rowSrNo: srNo,  // Same SR No for both rows
      weekIndex: week?.weekIndex,  // Store the week index
      projectName: defaultProjectId,
      rateType: 'Regular',
      days: {}
    });
    week.rows.push({
      id: id,  // Different ID but same SR No
      rowSrNo: srNo,  // Same SR No for both rows
      weekIndex: week?.weekIndex,  // Store the week index
      projectName: defaultProjectId,
      rateType: 'OT',
      days: {}
    });
  }
 
  updateProjectSelection(row: any) {
    if (!row.projectName) return;
  
    this.timeSheetCollection.forEach((item) => {
      if (
        item.weekIndex === row.weekIndex &&  // Match week
        item.rowSrNo === row.rowSrNo &&            // Match serial number
        item.rateType === (row.rateType === "Regular" ? "1" : "2") // Match rate type
      ) {
        item.assetProject.id = row.projectName; // Update project ID
      }
    });
  }
  
  
  updateTimesheet(projectId: number, rateType: string, date: string, hours: number,row:any) {
    if (!projectId || !rateType || !date) return;
  
    const formattedDate = this.extractDate(date); // Convert date to YYYY-MM-DD
    const rateTypeValue = rateType === "Regular" ? "1" : "2";
  
    const existingIndex = this.timeSheetCollection.findIndex(
      item => item.timesheetDate === formattedDate && item.rateType === rateTypeValue && item.assetProject.id === projectId && item.rowSrNo === row.rowSrNoValue
    );
  
    if (hours > 0) {
      const newEntry = {
        asset: { id: this.assetData?.id },
        assetProject: { id: projectId },
        timesheetDate: formattedDate,
        rateType: rateTypeValue,
        hours,
        rowSrNo:row.rowSrNo,
        weekIndex:row.weekIndex,
        invoiceNumber: 0,
      };
  
      if (existingIndex !== -1) {
        this.timeSheetCollection[existingIndex] = newEntry;
      } else {
        this.timeSheetCollection.push(newEntry);
      }
    } else {
      if (existingIndex !== -1) {
        this.timeSheetCollection.splice(existingIndex, 1);
      }
    }
  
  }
  
  extractDate(dateString: string): string {
    const match = dateString.match(/\d+/); // Extracts the numeric part (day)
    if (!match) return "";
  
    const day = parseInt(match[0], 10);
    const currentMonth = this.selectedMonth.toString().padStart(2, "0");
    const currentYear = this.selectedYear;
  
    return `${currentYear}-${currentMonth}-${day.toString().padStart(2, "0")}`; // Format YYYY-MM-DD
  }
  

  deleteRow(week: any, rowIndex: number) {
    if (!week || !week.rows[rowIndex]) return; // Safety check
    
    const deletedRow = week.rows[rowIndex]; 
    const srNoToDelete = deletedRow.rowSrNo;
    const weekIndexToDelete = week.weekIndex;
  
    // Find all matching entries in timeSheetCollection to delete from backend
    const rowsToDelete = this.timeSheetCollection.filter(
      entry => entry.weekIndex === weekIndexToDelete && entry.rowSrNo === srNoToDelete
    );
    // Call backend delete function for each entry
    rowsToDelete.forEach(entry => {
      this.onDeleteTimesheetWeekData(entry.id); // Assuming 'id' exists in timesheet data
    });
  
    // Remove the row pair (Regular & OT)
    if (rowIndex % 2 === 0) {
      week.rows.splice(rowIndex, 2);
    } else {
      week.rows.splice(rowIndex - 1, 2);
    }
  
    // Remove corresponding data from timeSheetCollection
    this.timeSheetCollection = this.timeSheetCollection.filter(
      entry => !(entry.weekIndex === weekIndexToDelete && entry.rowSrNo === srNoToDelete)
    );
  
  }
  

  onDeleteTimesheetWeekData(id: number) {
    if (!id) return;
  
    this.timesheetService.deleteTimesheet(id).subscribe({
      next: () => {
        this.toasterService.showSuccess("Timesheet entry deleted successfully!");
      },
      error: (err) => {
        console.error("Error deleting timesheet entry:", err);
        this.toasterService.showError("Failed to delete timesheet entry. Please try again.");
      }
    });
  }
  
  
  
  getWeekDays(startOfWeek: Date, weekIndex: number) {
    const days = [];
    for (let i = 0; i < 7; i++) {
      let day = new Date(startOfWeek);
      day.setDate(startOfWeek.getDate() + i);
  
      let isDisabled = day.getMonth() !== this.selectedMonth - 1;
      let isWeekend = day.getDay() === 6 || day.getDay() === 0;
  
      days.push({
        date: `${day.toLocaleDateString('en-US', { weekday: 'short' })} (${day.getDate()})`,
        isDisabled,
        isWeekend
      });
    }
    return days;
  }
  
  

  // Load all Assets Projects
  loadAssetProjects(): void {
    this.assetService.getAssetProjectsByAssetAndActiveStatus(this.assetData?.id,'ACTIVE').subscribe(
      (data) => {
        console.log("data",data);
        const newData = data.map(item => ({
          ...item,
          project:{
            id: item?.projectId,
            name: item?.projectName,
          },
          designation:{
            id: item?.designationId,
            name: item?.designationName,
          }
        }));
        
        this.sourceProjects.load(newData);
        this.getProjects = data
        console.log("this.getProjects",this.getProjects);
      },
      (error) => {
        console.error('Error loading projects:', error);
      }
    );
  }

  submitTimeSheet() {
    if (!this.timeSheetCollection || this.timeSheetCollection.length === 0) {
      console.warn("No timesheet data to submit.");
      return;
    }
  
    this.timesheetService.updateTimesheet(this.timeSheetCollection).subscribe({
      next: (response) => {
        console.log("Timesheet submitted successfully:", response);
        this.toasterService.showSuccess('Timesheet submitted successfully!');
      },
      error: (error) => {
        console.error("Error submitting timesheet:", error);
        this.toasterService.showError('Failed to submit timesheet.');
      }
    });
  }
  

  getExpenses(){
    // const data = this.service.getExpenses();
    // this.sourceExpenses.load(data);
  }

  getAsset(){
    const storedData = localStorage.getItem('selectedPerson');
    if (storedData) {
      this.assetData = JSON.parse(storedData);
    }
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
   
    // Delete function to remove both rows with the same Sr#
  onDelete(event: any, weekIndex: number) {
      let srNo = event.data.srNo;
      let currentData = this.weeks[weekIndex].data['data'];
  
      // Filter out rows with the same Sr#
      let updatedData = currentData.filter((row: any) => row.srNo !== srNo);
      this.weeks[weekIndex].data.load(updatedData);
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
  const designationId = JSON.parse(event.newData.designation);
  const projectId =  JSON.parse(event.newData.project);
  // Update start and end dates
  this.handleStartDate();
  this.handleEndDate();

  // Parse necessary fields and prepare request data
  const newProject = {
    ...event.newData,
    designationId: designationId?.id,
    projectId:projectId?.id,
    startDate: this.customStartDate,
    endDate: this.customEndDate,
    assetId: this.assetData.id,
    // company: {id:this.assetData.company.id},
    // status: event.newData.status === true ? 'ACTIVE' : 'INACTIVE', 
    isActive: event.newData.isActive === true ? "ACTIVE" : "INACTIVE", 
  };

  delete newProject?.project;
  delete newProject?.designation;

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
  const designationId = JSON.parse(event.newData.designation);
  const projectId =  JSON.parse(event.newData.project);
  const updatedProject = {
    ...event.newData,
    designationId: designationId?.id,
    projectId:projectId?.id,
    startDate: this.customStartDate,
    endDate: this.customEndDate,
    assetId: this.assetData.id,
    // company: {id:this.assetData.company.id},
    // status: event.newData.status === true ? 1 : 0, 
    isActive: event.newData.isActive === true ? "ACTIVE" : "INACTIVE", 
  };

  delete updatedProject?.project;
  delete updatedProject?.designation;

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
    this.dialogService.open(ConfirmDialogComponent, {
      context: {
        title: 'Delete Confirmation',
        message: 'Are you sure you want to delete this project?',
      },
    }).onClose.subscribe((confirmed) => {
      if (confirmed) {
        this.assetService.deleteAssetProject(event.data.id).subscribe(
          () => {
            event.confirm.resolve();
            this.toasterService.showSuccess('Project deleted successfully!');
          },
          (error) => {
            console.error('Error deleting project:', error);
            event.confirm.reject();
            this.toasterService.showError('Failed to delete project.');
          }
        );
      } else {
        event.confirm.reject();
      }
    });
  }
}

