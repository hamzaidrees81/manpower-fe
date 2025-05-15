

import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { ToasterService } from '../../../../@core/services/toaster.service';
import { DashboardService } from '../../../../@core/services/dashboard.service';
import { FormatTextPipe } from '../../../../utils/format-text.pipe';
import { ButtonViewComponent } from '../../../../shared/button-view/button-view.component';

@Component({
  selector: 'ngx-asset-statistics',
  templateUrl: './asset-statistics.component.html',
  styleUrls: ['./asset-statistics.component.scss']
})
export class AssetStatisticsComponent implements OnInit {
  source: LocalDataSource = new LocalDataSource(); // Table data source
  settings = {
    actions: {
      position: 'right', // Moves action buttons to the right
      add:false,
      edit:false,
      delete:false
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
            button: {
              title: 'View Detail',
              type: 'custom',
              filter: false,
              editable: false,
              addable: false,
              renderComponent: ButtonViewComponent,
              onComponentInitFunction(instance) {
                const sub = instance.save.subscribe(row => {
                });
      
                // ✅ Prevent memory leaks by unsubscribing
                instance.ngOnDestroy = () => sub.unsubscribe();
              }
            },
      assetName: {
        title: 'Asset Name',
        type: 'string',
      },
      status: {
        title: 'Status',
        type: 'string',
        filter:false,
        valuePrepareFunction: (value) => new FormatTextPipe().transform(value), 
      },
      activeProjects: {
        title: 'Active Projects',
        type: 'number',
        filter:false
      },
      revenueEarned: {
        title: 'Revenue (Earned)',
        type: 'number',
        filter:false
      },
      expenses: {
        title: 'Expenses',
        type: 'number',
        filter:false
      },
      profitFromAsset: {
        title: 'Profit',
        type: 'number',
        filter:false
      },
      // lastUsed: {
      //   title: 'Last Used',
      //   type: 'string',
      //   filter:false
      // },
    },
  };
  

  constructor(private dashboardService: DashboardService, private dialogService: NbDialogService, private toasterService: ToasterService) { }

  ngOnInit(): void {
    this.loadAssetStats();
  }

  // Load all AssetStats
  loadAssetStats(): void {
    this.dashboardService.getAssetsStats().subscribe(
      (data) => {
        this.source.load(data);
      },
      (error) => {
        console.error('Error loading Asset Stats:', error);
      }
    );
  }
}

