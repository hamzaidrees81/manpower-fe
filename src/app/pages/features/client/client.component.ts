import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ClientService } from '../../../@core/services/client.service';
import { NbDialogService } from '@nebular/theme';
import { ToasterService } from '../../../@core/services/toaster.service';
import { ConfirmDialogComponent } from '../../../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss'],
})
export class ClientComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource(); // Table data source

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
      clientId: {
        title: 'Client ID',
        type: 'string',
        filter: false,
      },
      name: {
        title: 'Name',
        type: 'string',
      },
      address: {
        title: 'Address',
        type: 'string',
      },
    },
  };

  constructor(private clientService: ClientService,private dialogService: NbDialogService,private toasterService: ToasterService) {}

  ngOnInit(): void {
    this.loadClients();
  }

  // Load all clients
  loadClients(): void {
    this.clientService.getClients().subscribe(
      (data) => {
        this.source.load(data);
      },
      (error) => {
        console.error('Error loading clients:', error);
      }
    );
  }

  // Add client
  onCreateConfirm(event: any): void {
    const newClient = event.newData;
    this.clientService.addClient(newClient).subscribe(
      (data) => {
        event.confirm.resolve(data);
        this.toasterService.showSuccess('Client created successfully!');

      },
      (error) => {
        console.error('Error adding client:', error);
        this.toasterService.showError('Failed to create client.');
        event.confirm.reject();
      }
    );
  }

  // Update client
  onEditConfirm(event: any): void {
    const updatedClient = event.newData;
    this.clientService.updateClient(updatedClient.id, updatedClient).subscribe(
      (data) => {
        event.confirm.resolve(data);
        this.toasterService.showSuccess('Client updated successfully!');
      },
      (error) => {
        console.error('Error updating client:', error);
        this.toasterService.showError('Failed to update client.');
        event.confirm.reject();
      }
    );
  }

  // Delete client
  onDeleteConfirm(event: any): void {
    this.dialogService.open(ConfirmDialogComponent, {
      context: {
        title: 'Delete Confirmation',
        message: 'Are you sure you want to delete this client?',
      },
    }).onClose.subscribe((confirmed) => {
      if (confirmed) {
        this.clientService.deleteClient(event.data.id).subscribe(
          () => {
            event.confirm.resolve();
            this.toasterService.showSuccess('Client deleted successfully!');
          },
          (error) => {
            console.error('Error deleting client:', error);
            event.confirm.reject();
            this.toasterService.showError('Failed to delete client.');
          }
        );
      } else {
        event.confirm.reject();
      }
    });
  }
}
