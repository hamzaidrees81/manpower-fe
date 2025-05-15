import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../../@core/services/dashboard.service';
import { LocalDataSource } from 'ng2-smart-table';
import { FormatTextPipe } from '../../../../utils/format-text.pipe';

@Component({
  selector: 'ngx-project-statistics-detail',
  templateUrl: './project-statistics-detail.component.html',
  styleUrls: ['./project-statistics-detail.component.scss']
})
export class ProjectStatisticsDetailComponent implements OnInit {
  clientStats: any;
  sourceProjects: LocalDataSource = new LocalDataSource();

  projectSettings = {
    actions: false,
    columns: {
      projectId: { title: 'Project ID', type: 'number', filter: false },
      projectName: { title: 'Project Name', type: 'string', filter: false },
      startDate: { title: 'Start Date', type: 'string', filter: false },
      endDate: { title: 'End Date', type: 'string', filter: false },
      status: {
        title: 'Status',
        type: 'string',
        filter: false,
        valuePrepareFunction: (value) => new FormatTextPipe().transform(value),
      },
      totalAssets: { title: 'Total Assets', type: 'number', filter: false }
    },
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    const clientId = localStorage.getItem('selectedProjectStats');
    if (clientId) {
      this.loadClientStats(JSON.parse(clientId));
    }
  }

  loadClientStats(clientId): void {
    this.dashboardService.getProjectsStatsDetailByProjectId(clientId?.clientId).subscribe(
      (data) => {
        this.clientStats = data;
        this.sourceProjects.load(this.clientStats?.projectSummaries || []);
      },
      (error) => console.error('Failed to load client stats', error)
    );
  }
}
