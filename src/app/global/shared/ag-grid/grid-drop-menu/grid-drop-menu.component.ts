import { Component } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';
import { ContextMenuComponent, contextMenuItem } from '../../components/context-menu/context-menu.component';

@Component({
  selector: 'app-grid-drop-menu',
  imports: [
    ContextMenuComponent,
  ],
  templateUrl: './grid-drop-menu.component.html',
  styleUrl: './grid-drop-menu.component.scss'
})
export class GridDropMenuComponent implements ICellRendererAngularComp {

  params!: ICellRendererParams<any, any, any>;

  itemsMenu: contextMenuItem[] = [];

  agInit(params: any): void {
    this.params = params;
    if (params.itemsMenu) {
      this.itemsMenu = params.itemsMenu;
    }
  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return true
  }

}
