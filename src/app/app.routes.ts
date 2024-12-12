import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { TaskListComponent } from './task-list/task-list.component';
import { AdministracionComponent } from './administracion/administracion.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    //{ path: '', component: HomeComponent },
    {
        path: 'home', component: HomeComponent,
        children: [
            { path: 'task-list', component: TaskListComponent },
            { path: 'administracion', component: AdministracionComponent },
            { path: 'dashboard', component: DashboardComponent },
        ]
    },
    { path: '**', component: LoginComponent },
];
