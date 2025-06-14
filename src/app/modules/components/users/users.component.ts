import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AgGridModule } from 'ag-grid-angular';
import { ColDef } from 'ag-grid-community';

@Component({
  selector: 'app-users',
  imports: [
    AgGridModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './users.component.html',
  styleUrl: './users.component.scss'
})
export class UsersComponent {

  rowData = [
    { make: "Tesla", model: "Model Y", price: 64950, electric: true },
    { make: "Ford", model: "F-Series", price: 33850, electric: false },
    { make: "Toyota", model: "Corolla", price: 29600, electric: false },
  ];

  // Column Definitions: Defines the columns to be displayed.
  colDefs: ColDef[] = [
    {
      field: "make",
      headerName: 'اسم المالك',
    },
    {
      field: "model",
      headerName: 'الرقم الوطني',
    },
    {
      field: "price",
      headerName: 'رقم الهاتف',
    },
    {
      field: "electric",
      headerName: 'تاريخ الإضافة',
    },
    {
      field: "electric",
      headerName: 'تاريخ التعديل',
    },
  ];


}
