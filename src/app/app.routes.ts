import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { TaskListComponent } from './task-list/task-list.component';
import { ReportsComponent } from './reports/reports.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ReportsByClientsComponent } from './reports/reports-by-clients/reports-by-clients.component';
import { ReportsByProductsComponent } from './reports/reports-by-products/reports-by-products.component';
import { AdministrationComponent } from './administration/administration.component';
import { UsersComponent } from './administration/users/users.component';
import { SettingsComponent } from './administration/settings/settings.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    //{ path: '', component: HomeComponent },       
    {
        path: 'home', component: HomeComponent,
        children: [
            { path: 'task-list', component: TaskListComponent }, 
            { path: 'reports', component: ReportsComponent, 
                children: [
                    { path: 'client', component: ReportsByClientsComponent }, 
                    { path: 'product', component: ReportsByProductsComponent },
                ]
            },
            { path: 'dashboard', component: DashboardComponent },
            { path: 'administration', component: AdministrationComponent, 
                children: [
                    { path: 'users', component: UsersComponent }, 
                    { path: 'settings', component: SettingsComponent },
                ]
            },
        ]
    },
    { path: '**', component: LoginComponent },
];