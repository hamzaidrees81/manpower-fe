import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ClientService } from '../../../@core/services/client.service';

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

  constructor(private clientService: ClientService) {}

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
      },
      (error) => {
        console.error('Error adding client:', error);
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
      },
      (error) => {
        console.error('Error updating client:', error);
        event.confirm.reject();
      }
    );
  }

  // Delete client
  onDeleteConfirm(event: any): void {
    if (window.confirm('Are you sure you want to delete this client?')) {
      this.clientService.deleteClient(event.data.id).subscribe(
        () => {
          event.confirm.resolve();
        },
        (error) => {
          console.error('Error deleting client:', error);
          event.confirm.reject();
        }
      );
    } else {
      event.confirm.reject();
    }
  }
}
