import { Component, OnInit } from '@angular/core';
import { ClientService } from '../../../@core/services/client.service';
import { AddSaleService } from '../../../@core/services/pos-services/add-sale.service';
import { ShopService } from '../../../@core/services/pos-services/shop.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-view-sale',
  templateUrl: './view-sale.component.html',
  styleUrls: ['./view-sale.component.scss']
})
export class ViewSaleComponent implements OnInit {
  shops: any[] = [];
  clients: any[] = [];
  sales: any[] = [];

  
    clientId;
    shopId;
    status: 'ACTIVE';
    startDate; 
    endDate;
  

  constructor(
    private saleService: AddSaleService,
    private shopService: ShopService,
    private clientService: ClientService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClients();
    this.loadShops();
    this.loadSales();
  }

  loadShops(): void {
    this.shopService.getShops().subscribe({
      next: (data) => this.shops = data,
      error: (err) => console.error('Error loading shops', err)
    });
  }

  editSale(sale) {
  this.router.navigate(['/pages/pos/add-sale'], {
    queryParams: { id: sale.id, mode: 'edit' }
  });
}

viewSale(sale) {
  this.router.navigate(['/pages/pos/add-sale'], {
    queryParams: { id: sale.id, mode: 'view' }
  });
}

printSale(sale) {
  this.router.navigate(['/pages/pos/print-sale-invoice'], {
    queryParams: { id: sale.id, mode: 'print' }
  });
}

  loadClients(): void {
    this.clientService.getClients().subscribe({
      next: (data) => this.clients = data,
      error: (err) => console.error('Error loading clients', err)
    });
  }

loadSales(): void {
  this.saleService.getFilteredSales(
    this.clientId,
    this.shopId,
    this.status,
    this.startDate,
    this.endDate
  ).subscribe({
    next: (data) => {
      this.sales = data;
    },
    error: (err) => {
      console.error('Error loading sales', err);
    }
  });
}


}
