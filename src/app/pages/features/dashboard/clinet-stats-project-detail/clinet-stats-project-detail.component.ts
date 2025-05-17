import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../../../@core/services/dashboard.service';
import { LocalDataSource } from 'ng2-smart-table';

@Component({
  selector: 'ngx-clinet-stats-project-detail',
  templateUrl: './clinet-stats-project-detail.component.html',
  styleUrls: ['./clinet-stats-project-detail.component.scss']
})
export class ClinetStatsProjectDetailComponent implements OnInit {
  projectDetail: any;
  sourceAssets: LocalDataSource = new LocalDataSource();

  assetSettings = {
    actions: false,
    columns: {
      assetName: { title: 'Asset Name', type: 'string', filter: false },
      totalEarning: { title: 'Total Earning', type: 'number', filter: false },
      assetPayable: { title: 'Asset Payable', type: 'number', filter: false },
      sponsorPayable: { title: 'Sponsor Payable', type: 'number', filter: false },
      profit: { title: 'Profit', type: 'number', filter: false }
    },
  };

  constructor(private dashboardService: DashboardService) {}

  ngOnInit(): void {
    const stored = localStorage.getItem('selectedClientProjectsStats');
    if (stored) {
      const parsed = JSON.parse(stored);
      const projectId = parsed?.projectId;
      if (projectId) {
        this.loadProjectDetails(projectId);
      }
    }
  }

  loadProjectDetails(projectId: number): void {
    this.dashboardService.getClinetProjectsStatsDetailByProjectId(projectId).subscribe(
      (data) => {
        this.projectDetail = data;
        this.sourceAssets.load(this.projectDetail.assetStats || []);
      },
      (error) => console.error('Failed to load project detail', error)
    );
  }
}
