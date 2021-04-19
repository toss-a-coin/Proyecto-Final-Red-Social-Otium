import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Componentes
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { HomeComponent } from './components/home/home.component';
import { UserEditComponent } from './components/user-edit/user-edit.component';
import { UsersComponent } from './components/users/users.component';
import { TimelineComponent } from './components/timeline/timeline.component';
import { ProfileComponent } from './components/profile/profile.component';


// Guard
import { UserGuard } from './services/user.guard';


const routes: Routes = [
	{path: '', component: HomeComponent},		//--> página principal
	{path: 'home', component: HomeComponent},
	{path: 'login', component: LoginComponent},
	{path: 'register', component: RegisterComponent},
	{path: 'mis-datos', component: UserEditComponent, canActivate:[UserGuard]},
	{path: 'gente', component: UsersComponent, canActivate:[UserGuard]},
	{path: 'gente/:page', component: UsersComponent, canActivate:[UserGuard]},
	{path: 'timeline', component: TimelineComponent, canActivate:[UserGuard]},
	{path: 'perfil/:id', component: ProfileComponent, canActivate:[UserGuard]},
	{path: 'perfil/:id/:section', component: ProfileComponent, canActivate:[UserGuard]},
	{path: '**', redirectTo:'/home'}		//--> cuando hay un error
];

export const appRoutingProviders: any[] = [];

export const routing: ModuleWithProviders<any> = RouterModule.forRoot(routes);	//--> así carga todo.
