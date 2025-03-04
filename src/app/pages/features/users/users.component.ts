import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { SmartTableData } from '../../../@core/data/smart-table';
import { UserService } from '../../../@core/services/user.service';

@Component({
  selector: 'ngx-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss'],
})
export class UsersComponent {

  settings = {
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
        title: 'Username',
        type: 'string',
      },
      password: {
        title: 'Password',
        type: 'string',
        filter: false,
      },
      createDate: {
        title: 'Created Date',
        type: 'string',
        filter: false,
        editable: false, // 👈 Disable editing
        addable: false, // 👈 Hide in add form
      },
      updateDate: {
        title: 'Updated Date',
        type: 'string',
        filter: false,
        editable: false, // 👈 Disable editing
        addable: false, // 👈 Hide in add form
      },
      company: {
        title: 'Company ID',
        type: 'number',
        filter: false,
        
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private userService: UserService) {}

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
        company: user.company.id, // Extract company ID
        createDate: user.createDate ? new Date(user.createDate).toLocaleString() : '',
        updateDate: user.updateDate ? new Date(user.updateDate).toLocaleString() : ''
      })));
    });
  }

  // Add user
  onCreateConfirm(event): void {
    const newData = event.newData;

  // Transform data
  const requestData = {
    ...newData,
    company: { id: newData.company }, // Convert company to an object
  };

  // Remove unwanted fields
  if (!requestData.createDate) delete requestData.createDate;
  if (!requestData.updateDate) delete requestData.updateDate;
    this.userService.addUser(requestData).subscribe(() => {
      event.confirm.resolve(event.newData);
    });
  }

  // Edit user
  onEditConfirm(event): void {
    const newData = event.newData;

  // Transform data
  const requestData = {
    ...newData,
    company: { id: newData.company }, // Convert company to an object
  };

  // Remove unwanted fields
  if (!requestData.createDate) delete requestData.createDate;
  if (!requestData.updateDate) delete requestData.updateDate;
    this.userService.updateUser(newData.id, requestData).subscribe(() => {
      event.confirm.resolve(event.newData);
    });
  }

  // Delete user
  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.userService.deleteUser(event.data.id).subscribe(() => {
        event.confirm.resolve();
      });
    } else {
      event.confirm.reject();
    }
  }
}
