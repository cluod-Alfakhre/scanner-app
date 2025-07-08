import { Component, inject, provideAppInitializer } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppAgGridModule } from './global/ag-grid/ag-grid.module';
import { ConfigsService } from './global/services/general/configs.service';
import { CommonModule } from '@angular/common';
import { LoadingSpinnerComponent } from './core/loading-spinner/loading-spinner.component';
import { LoadingService } from './global/services/loading-service.service';
import { Observable } from 'rxjs';

const intializeAppFn = () => {
  const configService = inject(ConfigsService);
  console.log("Initializing app");
  return configService.LoadConfigrations();
};

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    AppAgGridModule,
    CommonModule,
    LoadingSpinnerComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {

  loading$!: Observable<any>;

  constructor(
    private loadingService: LoadingService
  ) {


  }

  ngOnInit() {
    this.loading$ = this.loadingService.loading$;
  }

}
