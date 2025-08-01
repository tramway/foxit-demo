import { Component } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';
import { PDFViewerComponent } from './document-viewer/pdfviewer.component';

@Component({
  selector: 'app-root',
  template: `
    <app-foxitpdfviewer/>
  `,
  standalone: true,
  imports: [
    PDFViewerComponent
  ]
})
export class App {
  name = 'Angular';
}

bootstrapApplication(App);
