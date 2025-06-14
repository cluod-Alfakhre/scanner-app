import { Component, inject, provideAppInitializer } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NgbModal, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppAgGridModule } from './global/ag-grid/ag-grid.module';
import { ConfigsService } from './global/services/general/configs.service';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

const intializeAppFn = () => {
  const configService = inject(ConfigsService);
  console.log("Initializing app");
  return configService.LoadConfigrations();
};

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    NgbModule,
    AppAgGridModule,
    CommonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  constructor(private modalService: NgbModal) {
  }

  public open(modal: any): void {
    this.modalService.open(modal);
  };
}
