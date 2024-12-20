import { Component, computed, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common'
import { RouterLink, RouterLinkActive } from '@angular/router';

/* Angular Material */
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon'

/* Componente customizado */
import { MenuItemComponent } from "../menu-item/menu-item.component";

/* Element of menu */
export type MenuItem = {
  icon: string;
  label: string;
  route?: string;
  subItems?: MenuItem[];
}

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, MatListModule, MatIconModule, MenuItemComponent],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss'
})
export class MenuComponent {

  sideNavCollapsed=signal(false);
  @Input() set collapsed(val: boolean){
    this.sideNavCollapsed.set(val);
  }

  menuItems = signal<MenuItem[]>([
    {
      icon: 'list_alt',
      label: 'Listado',
      route: 'task-list',
    },
    {
      icon: 'summarize',
      label: 'Reportes',
      route: 'reports',
      subItems: [
        {
          icon: 'face',
          label: 'Cliente',
          route: 'client',
        },
        {
          icon: 'square_dot',
          label: 'Producto',
          route: 'product',
        }
      ]
    },
    {
      icon: 'dashboard',
      label: 'Dashboard',
      route: 'dashboard',
    },
    {
      icon: 'edit_document',
      label: 'Administracion',
      route: 'administration',
      subItems: [
        {
          icon: 'account_box',
          label: 'Usuarios',
          route: 'users',
        },
        {
          icon: 'settings',
          label: 'Settings',
          route: 'settings',
        }
      ]
    }
  ]);

  profilePicSize= computed(()=> this.sideNavCollapsed() ? '32' : '100');
}
