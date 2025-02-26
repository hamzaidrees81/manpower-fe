import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FeaturesComponent } from './features.component';
import { AssetComponent } from './asset/asset.component';
import { CompanyComponent } from './company/company.component';
import { ProjectsComponent } from './projects/projects.component';
import { UsersComponent } from './users/users.component';

const routes: Routes = [{
  path: '',
  component: FeaturesComponent,
  children: [
    {
      path: 'company',
      component: CompanyComponent,
    },
    {
      path: 'users',
      component: UsersComponent,
    },
    {
      path: 'projects',
      component: ProjectsComponent,
    },
    {
      path: 'asset',
      component: AssetComponent,
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FeaturesRoutingModule { }

export const routedComponents = [
  FeaturesComponent,
  AssetComponent,
  CompanyComponent,
  ProjectsComponent,
  UsersComponent
];
