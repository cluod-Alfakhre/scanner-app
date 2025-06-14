import { effect, Injectable } from '@angular/core';
import { CellStyleModule, ClientSideRowModelModule, GridOptions, ModuleRegistry, PaginationModule, RowSelectionModule, TextFilterModule, ValidationModule, colorSchemeDark, colorSchemeDarkBlue, colorSchemeDarkWarm, provideGlobalGridOptions, themeQuartz } from 'ag-grid-community';
import { ToggleThemeModeService } from '../services/toggle-theme-mode.service';



@Injectable()
export class AgGridConfigrationService {

  private defaultGridOptions: GridOptions = {
    defaultColDef: {
      sortable: true,
      resizable: true,
      filter: true,
      editable: false,
    },
    pagination: true,
    paginationPageSize: 20,
    animateRows: true,
    rowSelection: 'multiple',
    suppressRowClickSelection: true,
    suppressCellFocus: true,
    suppressDragLeaveHidesColumns: true,
    suppressMenuHide: true,
    domLayout: 'autoHeight',
    theme: 'legacy',
    enableRtl: true,
    overlayNoRowsTemplate: `
    <h2>لم يتم العثور على بيانات!</h2>
    `,
  }

  constructor(
    private toggleThemeModeService: ToggleThemeModeService,
  ) {
    this.registerRequiredModules();
    provideGlobalGridOptions(this.defaultGridOptions)

    effect(() => {
      this.toggleAgGridTheme(toggleThemeModeService.isDarkMode())
    })

  }

  private registerRequiredModules(): void {
    ModuleRegistry.registerModules([ClientSideRowModelModule, ValidationModule, TextFilterModule, RowSelectionModule, PaginationModule, CellStyleModule]);
  }

  public getDefaultOptions(): GridOptions {
    return JSON.parse(JSON.stringify(this.defaultGridOptions));
  }

  public mergeWithDefaults(options: GridOptions): GridOptions {
    return { ...this.defaultGridOptions, ...options };
  }

  protected getTheme(): string {
    return 'ag-theme-alpine'; // or your preferred theme
  }

  private toggleAgGridTheme(isDarkMode: boolean) {
    /* if (isDarkMode) {
      this.defaultGridOptions = this.mergeWithDefaults({ theme: themeQuartz.withPart(colorSchemeDarkBlue) })
      provideGlobalGridOptions(this.defaultGridOptions)
    }
    else {      
      this.defaultGridOptions = this.mergeWithDefaults({ theme: themeQuartz})
      provideGlobalGridOptions(this.defaultGridOptions)
    } */
    const body = document.body;
    body.classList.remove('ag-theme-quartz', 'ag-theme-quartz-dark');
    body.classList.add(isDarkMode ? 'ag-theme-quartz-dark' : 'ag-theme-quartz');
  }

}
