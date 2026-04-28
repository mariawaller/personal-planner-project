import { Routes } from '@angular/router';
import { DashboardComponent } from '../components/dashboard/dashboard';
import { GroupPageComponent } from '../components/group-page-component/group-page-component';
import { LoginPageComponent } from '../components/login-page-component/login-page-component';

export const routes: Routes = [
    {
        path: "login",
        component: LoginPageComponent,
        title: "Login",
    },
    {
        path: "",
        component: DashboardComponent,
        title: "Dashboard",
    },
    {
        path: "groups",
        component: GroupPageComponent,
        title: "Groups",
    }
];
