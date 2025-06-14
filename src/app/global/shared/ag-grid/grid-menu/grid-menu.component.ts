import { Component } from '@angular/core';
import { ContextMenuComponent, contextMenuItem } from '../../components/context-menu/context-menu.component';
import { ICellRendererAngularComp } from 'ag-grid-angular';
import { ICellRendererParams } from 'ag-grid-community';

@Component({
  selector: 'app-grid-menu',
  imports: [
    ContextMenuComponent,
  ],
  templateUrl: './grid-menu.component.html',
  styleUrl: './grid-menu.component.scss'
})
export class GridMenuComponent implements ICellRendererAngularComp {

  params!: ICellRendererParams<any, any, any>;

  itemsMenu: contextMenuItem[] = [];

  agInit(params: any): void {
    this.params = params;
    console.log(params.itemsMenu);
    if (params.itemsMenu) {
      
      this.itemsMenu = params.itemsMenu;
    }
  }

  refresh(params: ICellRendererParams<any, any, any>): boolean {
    return true
  }

}
