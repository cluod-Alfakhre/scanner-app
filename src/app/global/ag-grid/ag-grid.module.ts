import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgGridConfigrationService } from './ag-grid-configration.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule
  ],
  providers: [AgGridConfigrationService]
})
export class AppAgGridModule {
  constructor(private config: AgGridConfigrationService) {
    // Module initialization handled by the config service
  }
}
