

import { Component, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { ToasterService } from '../../../../@core/services/toaster.service';
import { DashboardService } from '../../../../@core/services/dashboard.service';
import { FormatTextPipe } from '../../../../utils/format-text.pipe';
import { ButtonViewComponent } from '../../../../shared/button-view/button-view.component';

@Component({
  selector: 'ngx-project-statistics',
  templateUrl: './project-statistics.component.html',
  styleUrls: ['./project-statistics.component.scss']
})
export class ProjectStatisticsComponent  implements OnInit {
  source: LocalDataSource = new LocalDataSource(); // Table data source
  settings = {
    actions: {
      position: 'right',
      add: false,
      edit: false,
      delete: false
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
      clientName: {
        title: 'Client Name',
        type: 'string',
      },
      totalProjects: {
        title: 'Total Projects',
        type: 'number',
        filter: false
      },
      activeProjects: {
        title: 'Active Projects',
        type: 'number',
        filter: false
      },
      totalRevenue: {
        title: 'Total Revenue',
        type: 'number',
        filter: false
      },
      totalReceived: {
        title: 'Total Received',
        type: 'number',
        filter: false
      },
      outstandingAmount: {
        title: 'Outstanding Amount',
        type: 'number',
        filter: false
      },
      profit: {
        title: 'Profit',
        type: 'number',
        filter: false
      },
      profitabilityRatio: {
        title: 'Profitability Ratio (%)',
        type: 'number',
        filter: false,
        // valuePrepareFunction: (value) => `${value.toFixed(2)}%`
      },
    }
  };
  
  

  constructor(private dashboardService: DashboardService, private dialogService: NbDialogService, private toasterService: ToasterService) { }

  ngOnInit(): void {
    this.loadAssetStats();
  }

  // Load all AssetStats
  loadAssetStats(): void {
    this.dashboardService.getProjectsStats().subscribe(
      (data) => {
        this.source.load(data);
      },
      (error) => {
        console.error('Error loading Asset Stats:', error);
      }
    );
  }
}

