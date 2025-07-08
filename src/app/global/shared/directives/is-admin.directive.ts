import { Directive, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';

@Directive({
  selector: '[appIsAdmin]'
})
export class IsAdminDirective {

  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef,
    private authService: AuthService,
  ) { }

  ngOnInit() {
    this.isAdmin()
  }
  
  isAdmin() {
    if (this.authService.isAdmin()) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }

}
