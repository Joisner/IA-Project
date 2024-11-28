import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-branding',
  standalone: true,
  imports: [RouterModule],
  template: `
    <div class="branding">
      <a [routerLink]="['/']">
        <img
          src="./assets/images/logos/PanteraAI.png"
          class="align-middle m-2"
          alt="logo" style="max-width: 50%;"
        />
      </a>
    </div>
  `,
  styles: [`.branding{
     margin-left: 60px;
  }`]
})
export class BrandingComponent {
  constructor() { }
}
