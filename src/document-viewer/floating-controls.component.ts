import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { PDFViewerService } from './pdfviewer.service';

export const floatingControlsCustonElementName = 'wcl-floating-controls';
@Component({
  selector: 'wcl-pdf-floating-controls',
  template: `
    <div>Floating container</div>
    <button (click)="zoomIn()">Zoom in</button>
    <button (click)="zoomOut()">Zoom out</button>
    <button (click)="fitPage()">Fit page</button>
    <button (click)="goToPage(2)">Go to page 2</button>
    <input #searchInput placeholder="search" (input)="search(searchInput.value)"/>
    <div>Found {{searchResults()?.length ?? 0}} occurences</div>
  `,
  styleUrls: ['./floating-controls.component.scss'],
  imports: [CommonModule],
  standalone: true,
})
export class FloatingControlsComponent {
  searchResults = signal<string[]|undefined>([])
  constructor(private readonly pdfService: PDFViewerService) {}
  zoomIn(): void {
    this.pdfService.zoomIn();
  }
  zoomOut(): void {
    this.pdfService.zoomOut();
  }
  fitPage(): void {
    this.pdfService.fitPage();
  }
  goToPage(page: number): void {
    this.pdfService.goToPage(page);
  }
  search(text: string) {
    this.pdfService.search(text).then(searchResults => {
      this.searchResults.set(searchResults);
    });

  }
}
