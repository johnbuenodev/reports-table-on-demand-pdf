import {
  Component,
  ElementRef,
  Input,
  TrackByFunction,
  ViewChild,
  computed,
  signal,
} from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { CommonModule, NgIf } from '@angular/common';

import jsPDF from 'jspdf';

import { registros } from '../app.component';
import { ScrollNearEndDirective } from '../scroll-near-end.directive';
import { LoadingComponent } from '../loading/loading.component';

@Component({
  selector: 'app-table-custom',
  standalone: true,
  imports: [MatTableModule, ScrollNearEndDirective, CommonModule, NgIf, LoadingComponent],
  templateUrl: './table-custom.component.html',
  styleUrl: './table-custom.component.css',
})
export class TableCustomComponent {
  @Input({ required: true }) set registrosData(data: registros[]) {
    console.log(data);
    this.registrosSignal.set(data);
    this.limitSignal.set(30);
  }

  enableAction: boolean = false;

  @ViewChild('report', { static: false }) report!: ElementRef<any>;

  private registrosSignal = signal<registros[]>([]);

  private limitSignal = signal<number>(30);

  dataSourceSignal = computed(() => {

    const data = this.registrosSignal().slice(0, this.limitSignal());

    console.log('tamanho do objeto');
    console.log(this.registrosSignal().length);

    return new MatTableDataSource<registros>(data);
  });

  displayedColumns: string[] = ['id', 'firstName'];

  identity: TrackByFunction<registros> = (_, item: registros) => item.id;

  onNearEndScroll(): void {
    console.log('Recebendo');
    this.limitSignal.update((val) => val + 30);
  }

  button() {
    console.log(this.limitSignal());

    if (this.limitSignal() != this.registrosSignal().length) {
      this.limitSignal.update((val) => this.registrosSignal().length);
    }

    setTimeout(() => {
      this.genReport();
    }, 2000);
  }

  async genReport() {
    this.enableAction = true;

    const input = document.getElementById('report');
    var clientHeight = input?.clientHeight;
    var clientWidth = input?.clientWidth;

    let pdf = new jsPDF('l', 'pt', [clientWidth!, clientHeight!]); //landscape  portrait //a4

    await pdf.html(this.report.nativeElement, {
      callback: async (pdfGen) => {
        await pdfGen.save('novo-relatorio.pdf');
      },
    });

    this.enableAction = false;

  }
}
