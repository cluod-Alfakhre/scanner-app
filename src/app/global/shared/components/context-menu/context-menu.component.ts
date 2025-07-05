import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { RouterLink } from '@angular/router';

export type contextMenuItem = {
  label: string;
  icon?: string;
  route?: string;
  onClick?: () => any;
}

@Component({
  selector: 'app-context-menu',
  imports: [
    MatMenuModule,
    MatIconModule,
    MatButtonModule,
    CommonModule,
    RouterLink,
  ],
  templateUrl: './context-menu.component.html',
  styleUrl: './context-menu.component.scss'
})
export class ContextMenuComponent {

  @Input() btnClass: string = 'tertiary';
  @Input() btnLable: string = '';
  @Input() btnIcon: string = 'more_horiz';

  @Input() matMenuList!: contextMenuItem[];

}
