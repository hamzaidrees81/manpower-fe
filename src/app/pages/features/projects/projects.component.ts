import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ProjectService } from '../../../@core/services/projects.service';
import { ClientService } from '../../../@core/services/client.service';
import { CompanyService } from '../../../@core/services/company.service';
import { CustomDatepickerComponent } from '../../../shared/custom-datepicker/custom-datepicker.component';
import { SmartTableDatepickerRenderComponentComponent } from '../../../shared/smart-table-datepicker-render-component/smart-table-datepicker-render-component.component';
import { DatePickerService } from '../../../@core/services/date-picker.service';
import { NbDialogService } from '@nebular/theme';
import { ToasterService } from '../../../@core/services/toaster.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { validateRequiredFields } from '../../../utils/validation-utils';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
})
export class ProjectsComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource(); // Table data source
  companies: any[] = []; // Store company list
  clients: any[] = []; // Store client list
  settings = {
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
      // company: {
      //   title: 'Company',
      //   type: 'html',
      //   filter: false,
      //   valuePrepareFunction: (company) => company.name,
      //   editor: {
      //     type: 'list',
      //     config: {
      //       selectText: 'Select...',
      //       list: [],
      //     },
      //   },
      // },
      client: {
        title: 'Client',
        type: 'html',
        filter:false,
        editor: {
          type: 'list',
          config: {
            list: [],
          },
        },
        valuePrepareFunction: (value) => {
          const found = this.clients.find(b => b.id === value.id);
          return found ? found.name : value;
        },
      },
      projectId: {
        title: 'ID',
        type: 'string',
        filter: false,
      },
      name: {
        title: 'Name',
        type: 'string',
      },
      location: {
        title: 'Location',
        type: 'string',
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
      }
    },
  };
  customStartDate: Date;
  customEndDate: Date;


  constructor(private router:Router,private projectService: ProjectService, private clientService: ClientService, private companyService: CompanyService, private datePickerService: DatePickerService, private dialogService: NbDialogService, private toasterService: ToasterService) { }

  ngOnInit(): void {
    this.loadProjects();
    this.loadDropdowns();
  }

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

  // Load all projects
  loadProjects(): void {
    this.projectService.getProjects().subscribe(
      (data) => {
        this.source.load(data);
      },
      (error) => {
        console.error('Error loading projects:', error);
      }
    );
  }
  

  // Fetch Companies and Clients
  loadDropdowns(): void {
    // this.companyService.getCompanies().subscribe((data) => {
    //   this.companies = data;
    //   this.settings = {
    //     ...this.settings,
    //     columns: {
    //       ...this.settings.columns,
    //       company: {
    //         ...this.settings.columns.company,
    //         editor: {
    //           type: 'list',
    //           config: {
    //             selectText: 'Select...',
    //             list: data.map((c) => ({
    //               value: JSON.stringify(c), // Store whole object as string
    //               title: c.name, // Display name
    //             })),
    //           },
    //         },
    //       },
    //     },
    //   };
    // });

    this.clientService.getClients().subscribe((data) => {
      this.clients = data;
      this.settings = {
        ...this.settings,
        columns: {
          ...this.settings.columns,
          client: {
            ...this.settings.columns.client,
            editor: {
              type: 'list',
              config: {
                list: data.map((c) => ({
                  value: c.id, //Store whole object as string
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
  onCreateConfirm(event: any): void {
    // Update start and end dates
    this.handleStartDate();
    this.handleEndDate();

    const requiredFields = ["name"];

    // ✅ Validate required fields
    if (!validateRequiredFields(event.newData, requiredFields, this.toasterService)) {
      return; // Stop execution if validation fails
    }

      const updateClient = JSON.parse(event.newData.client);

    // Parse necessary fields and prepare request data
    const newProject = {
      ...event.newData,
      clientId: updateClient?.id,
      startDate: this.customStartDate,
      endDate: this.customEndDate,
    };

    delete newProject?.client;

    // Call service to add the project
    this.projectService.addProject(newProject).subscribe({
      next: (data) => {
        // event.confirm.resolve(data)
        this.reloadCurrentRoute();
        this.toasterService.showSuccess('Project created successfully!');
      },
      error: (error) => {
        console.error('Error adding project:', error);
        this.toasterService.showError('Failed to create project.');
        event.confirm.reject();
      }
    });
  }


  onEditConfirm(event: any): void {
    const requiredFields = ["name"];

    // ✅ Validate required fields
    if (!validateRequiredFields(event.newData, requiredFields, this.toasterService)) {
      return; // Stop execution if validation fails
    }
    const updateClient = JSON.parse(event.newData.client);

    // Parse necessary fields and prepare request data
    const newProject = {
      ...event.newData,
      clientId: updateClient?.id,
      startDate: this.customStartDate,
      endDate: this.customEndDate,
    };

    delete newProject?.client;

    this.projectService.updateProject(newProject.id, newProject).subscribe({
      next: (data) => {
        // event.confirm.resolve(data)
        this.reloadCurrentRoute();
        this.toasterService.showSuccess('Project updated successfully!');
      },
      error: (error) => {
        console.error('Error updating project:', error);
        this.toasterService.showError('Failed to update project.');
        event.confirm.reject();
      }
    });
  }


  reloadCurrentRoute(): void {
    const currentUrl = this.router.url;
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate([currentUrl]);
    });
  }


  // Delete project
  onDeleteConfirm(event: any): void {
    this.dialogService.open(ConfirmDialogComponent, {
      context: {
        title: 'Delete Confirmation',
        message: 'Are you sure you want to delete this project?',
      },
    }).onClose.subscribe((confirmed) => {
      if (confirmed) {
        this.projectService.deleteProject(event.data.id).subscribe(
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
