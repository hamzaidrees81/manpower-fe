import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { SmartTableData } from '../../../@core/data/smart-table';
import { UserService } from '../../../@core/services/user.service';
import { NbDialogService } from '@nebular/theme';
import { ToasterService } from '../../../@core/services/toaster.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { validateAndHandleNumericFields, validateRequiredFields } from '../../../utils/validation-utils';

@Component({
  selector: 'ngx-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {

  settings = {
    actions: {
      position: 'right', // Moves action buttons to the right
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true, // Enable confirmation on add
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmSave: true, // Enable confirmation on edit
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      username: {
        title: 'Email',
        type: 'string',
      },
      password: {
        title: 'Password',
        type: 'string',
        filter: false,
      },
      // createDate: {
      //   title: 'Created Date',
      //   type: 'string',
      //   filter: false,
      //   editable: false, // 👈 Disable editing
      //   addable: false, // 👈 Hide in add form
      // },
      // updateDate: {
      //   title: 'Updated Date',
      //   type: 'string',
      //   filter: false,
      //   editable: false, // 👈 Disable editing
      //   addable: false, // 👈 Hide in add form
      // },
      // company: {
      //   title: 'Company ID',
      //   type: 'number',
      //   filter: false,

      // },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private userService: UserService, private dialogService: NbDialogService, private toasterService: ToasterService) { }

  ngOnInit(): void {
    this.loadUsers();
  }

  // Load users from backend
  loadUsers(): void {
    this.userService.getUsers().subscribe((data) => {
      this.source.load(data.map(user => ({
        id: user.id,
        username: user.username,
        password: user.password,
        // company: user.company.id, 
        createDate: user.createDate ? new Date(user.createDate).toLocaleString() : '',
        updateDate: user.updateDate ? new Date(user.updateDate).toLocaleString() : ''
      })));
    });
  }

  // Add user
  onCreateConfirm(event): void {
    const newData = event.newData;

    // const numericFields = ["company"];
    const requiredFields = ["username", "password"];

    // ✅ Validate required fields
    if (!validateRequiredFields(event.newData, requiredFields, this.toasterService)) {
      return; // Stop execution if validation fails
    }

    // if (!validateAndHandleNumericFields(event.newData, numericFields, this.toasterService, event)) {
    //   return; // Stop execution if validation fails
    // }

    // Transform data
    const requestData = {
      ...newData,
      // company: { id: newData.company }, // Convert company to an object
    };

    // Remove unwanted fields
    if (!requestData.createDate) delete requestData.createDate;
    if (!requestData.updateDate) delete requestData.updateDate;

    this.userService.addUser(requestData).subscribe(
      () => {
        event.confirm.resolve(event.newData);
        this.toasterService.showSuccess('User created successfully!');
      },
      (error) => {
        console.error('Error creating user:', error);
        event.confirm.reject();
        this.toasterService.showError('Failed to create user.');
      }
    );
  }

  // Edit user
  onEditConfirm(event): void {
    // const numericFields = ["company"];
    const requiredFields = ["username", "password"];

    // ✅ Validate required fields
    if (!validateRequiredFields(event.newData, requiredFields, this.toasterService)) {
      return; // Stop execution if validation fails
    }

    // if (!validateAndHandleNumericFields(event.newData, numericFields, this.toasterService, event)) {
    //   return; // Stop execution if validation fails
    // }
    const newData = event.newData;

    // Transform data
    const requestData = {
      ...newData,
      // company: { id: newData.company }, // Convert company to an object
    };

    // Remove unwanted fields
    if (!requestData.createDate) delete requestData.createDate;
    if (!requestData.updateDate) delete requestData.updateDate;

    this.userService.updateUser(newData.id, requestData).subscribe(
      () => {
        event.confirm.resolve(event.newData);
        this.toasterService.showSuccess('User updated successfully!');
      },
      (error) => {
        console.error('Error updating user:', error);
        event.confirm.reject();
        this.toasterService.showError('Failed to update user.');
      }
    );
  }

  // Delete user
  onDeleteConfirm(event: any): void {
    this.dialogService.open(ConfirmDialogComponent, {
      context: {
        title: 'Delete User',
        message: 'Are you sure you want to delete this user?',
      },
    }).onClose.subscribe((confirmed) => {
      if (confirmed) {
        this.userService.deleteUser(event.data.id).subscribe(
          () => {
            event.confirm.resolve();
            this.toasterService.showSuccess('User deleted successfully!');
          },
          (error) => {
            console.error('Error deleting user:', error);
            event.confirm.reject();
            this.toasterService.showError('Failed to delete user.');
          }
        );
      } else {
        event.confirm.reject();
      }
    });
  }
}
