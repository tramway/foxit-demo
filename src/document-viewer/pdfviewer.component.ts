import { CommonModule } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  CUSTOM_ELEMENTS_SCHEMA,
  ElementRef,
  Injector,
  NO_ERRORS_SCHEMA,
  OnInit,
  TemplateRef,
  viewChild,
  ViewContainerRef,
} from '@angular/core';
import {
  createCustomElement,
  NgElement,
  WithProperties,
} from '@angular/elements';
import * as UIExtension from '@foxitsoftware/foxit-pdf-sdk-for-web-library';
import {
  FloatingControlsComponent,
  floatingControlsCustonElementName,
} from './floating-controls.component';
import { PDFViewerService } from './pdfviewer.service';

declare global {
  interface HTMLElementTagNameMap {
    'test-web-component': NgElement & WithProperties<{ content: string }>;
  }
}

@Component({
  selector: 'app-foxitpdfviewer',
  schemas: [CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA],
  standalone: true,
  imports: [CommonModule, FloatingControlsComponent],
  template: ``,
  styleUrls: ['./pdfviewer.component.scss'],
  providers: [
    {
      provide: PDFViewerService,
      useFactory: (elementRef: ElementRef) => new PDFViewerService(elementRef),
      deps: [ElementRef],
    },
  ],
})
export class PDFViewerComponent {
  content = viewChild.required(TemplateRef);
  // pdfui: UIExtension.PDFUI;
  constructor(
    private element: ElementRef,
    private viewContainer: ViewContainerRef,
    private changeDetector: ChangeDetectorRef,
    private injector: Injector,
    private readonly viewerService: PDFViewerService
  ) {
    customElements.define(
      floatingControlsCustonElementName,
      createCustomElement(FloatingControlsComponent, { injector })
    );
  }

}
