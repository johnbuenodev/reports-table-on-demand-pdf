import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CommonModule, NgIf } from '@angular/common';

import { Observable, of } from 'rxjs';

import { TableCustomComponent } from "./table-custom/table-custom.component";

export interface registros {
  id: number;
  firstName: string;
  // ...
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TableCustomComponent, CommonModule, NgIf],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'reportQintess';

  registrosObs$: Observable<registros[]> = of(
    [...Array(10_000).keys()].map((index) => ({
      id: index,
      firstName: `name_${index}`,
      // ...
    }))
  );

}
