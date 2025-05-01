import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { UserService } from '../../../@core/services/user.service';
import { NbDialogService } from '@nebular/theme';
import { ToasterService } from '../../../@core/services/toaster.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';
import { validateAndHandleNumericFields, validateRequiredFields } from '../../../utils/validation-utils';
import { FormatTextPipe } from '../../../utils/format-text.pipe';

@Component({
  selector: 'ngx-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {
  canAccess: boolean;
  source: LocalDataSource = new LocalDataSource();
  settings: { actions: { position: string; add: boolean; delete: boolean; }; add: { addButtonContent: string; createButtonContent: string; cancelButtonContent: string; confirmCreate: boolean; }; edit: { editButtonContent: string; saveButtonContent: string; cancelButtonContent: string; confirmSave: boolean; }; delete: { deleteButtonContent: string; confirmDelete: boolean; }; columns: any; };
  roleDropdownList: { value: string; title: string; }[];
 

  constructor(private userService: UserService, private dialogService: NbDialogService, private toasterService: ToasterService) { }

  ngOnInit(): void {
    this.loadUsers();
    const isAllowAccess = JSON.parse(localStorage.getItem('isAllowAccess'));
    const adminRoles = ['ADMIN', 'POS_ADMIN', 'ERP_ADMIN'];
    const isOnlyAdminRole = ['ADMIN',];

  
    const allRoles = [
      'ADMIN',
      'POS_ADMIN',
      'ERP_ADMIN',
      'POS_ERP_USER',
      'POS_USER',
      'ERP_USER',
    ];
  
    // Decide role options based on who is logged in
    let roleOptions: string[] = [];
  
    switch (isAllowAccess) {
      case 'ADMIN':
        roleOptions = allRoles;
        break;
      case 'POS_ADMIN':
        roleOptions = ['POS_ADMIN', 'POS_USER'];
        break;
      case 'ERP_ADMIN':
        roleOptions = ['ERP_ADMIN', 'ERP_USER'];
        break;
      case 'POS_ERP_USER':
        roleOptions = ['POS_ERP_USER'];
        break;
      default:
        roleOptions = [];
        break;
    }
  
    // Create dropdown list for smart-table
    this.roleDropdownList = roleOptions.map(role => ({
      value: role,
      title: new FormatTextPipe().transform(role),
    }));
  
    const baseColumns: any = {
      username: {
        title: 'Email',
        type: 'string',
      },
      password: {
        title: 'Password',
        type: 'string',
        filter: false,
      },
    };
  
    // Only show roles column if user can assign at least one role
    if (this.roleDropdownList.length > 0) {
      baseColumns.role = {
        title: 'Role',
        type: 'string',
        filter:false,
        editor: {
          type: 'list',
          config: {
            list: this.roleDropdownList,
          },
        },
        valuePrepareFunction: (value) => {
          const found = this.roleDropdownList.find(b => b.value === value);
          const rawValue = found ? new FormatTextPipe().transform(found.title) : new FormatTextPipe().transform(value);
          return rawValue;
        },
      }
    }
  
    const canAccess = adminRoles.includes(isAllowAccess || '');
    const canAccessAdmin = isOnlyAdminRole.includes(isAllowAccess || '');

  
    this.settings = {
      actions: {
        position: 'right',
        add: canAccess,
        delete: canAccessAdmin,
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
      columns: baseColumns,
    };
  }
  

  // Load users from backend
  loadUsers(): void {
    this.userService.getUsers().subscribe((data) => {
      this.source.load(data.map(user => ({
        id: user.id,
        username: user.username,
        password: user.password,
        role:user.role,
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
        title: 'Delete Confirmation',
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
