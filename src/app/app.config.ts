import { ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { ConfigsService } from './global/services/general/configs.service';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { tokenInterceptor } from './global/services/token-interceptor.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([tokenInterceptor])),
    provideAppInitializer(() => {
      const configService = inject(ConfigsService);
      return configService.LoadConfigrations()
    }),
  ],
};
