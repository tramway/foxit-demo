import { ElementRef, Injectable } from '@angular/core';
import * as UIExtension from '@foxitsoftware/foxit-pdf-sdk-for-web-library';
@Injectable()
export class PDFViewerService {
  private readonly pdfUI: UIExtension.PDFUI;

  constructor(private readonly elementRef: ElementRef) {
    const CustomAppearance = UIExtension.appearances.Appearance.extend({
      getLayoutTemplate: () => {
        return `
        <webpdf>
            <div class="fv__ui-body" name="viewer">
                <viewer @touch-to-scroll ></viewer>
            </div>
          <template name="template-container">
            <default-annot-contextmenu></default-annot-contextmenu>
          </template>

        </webpdf>
`;
      },
      getDefaultFragments: function () {
        return [
          {
            target: 'viewer',
            action: 'append',
            template: `<wcl-floating-controls></wcl-floating-controls>`,
          },
        ];
      },
    });
    this.pdfUI = new UIExtension.PDFUI({
      viewerOptions: {
        // TODO:   should it be accessible in browser? any other way to do that?
        libPath: '/foxit-lib',
        jr: {
          // @ts-ignore
          ...require('./license-key.js'),
          fontPath: location.origin + '/assets/external/brotli/',
        },
      },
      appearance: CustomAppearance,
      // appearance: UIExtension.appearances.adaptive,
      renderTo: this.elementRef.nativeElement,
      addons: UIExtension.PDFViewCtrl.DeviceInfo.isMobile
        ? '/foxit-lib/uix-addons/allInOne.mobile.js'
        : '/foxit-lib/uix-addons/allInOne.js',
    });

    const loadTestFile = async () => {
      var test = { ExportDataFile: 'assets/loremIpsum.pdf', ImportDatafile: 'http://pathToTargetFile.pdf' };
      var resp = await fetch(test.ExportDataFile);
      var file = await resp.blob();

      var pdfViewer = await this.pdfUI.getPDFViewer();
      var pdfdoc = await pdfViewer.openPDFByFile(file);
    };

    loadTestFile();
  }

  async zoomIn() {
    const docRenderer = await this.pdfUI.getPDFDocRender();
    const scale = (await docRenderer?.getOffsetInfo())!.scale;
    this.pdfUI.zoomTo(scale * 1.1);
  }
  async zoomOut() {
    const docRenderer = await this.pdfUI.getPDFDocRender();
    const scale = (await docRenderer?.getOffsetInfo())!.scale;
    this.pdfUI.zoomTo(scale * 0.9);
  }
  async fitPage() {
    const docRenderer = await this.pdfUI.getPDFDocRender();
    const scale = (await docRenderer?.getOffsetInfo())!.scale;
    this.pdfUI.zoomTo('fitHeight');
  }
  async goToPage(page: number) {
    const docRenderer = await this.pdfUI.getPDFDocRender();
    docRenderer?.goToPage(page);
  }
  async search(text: string) {
    const doc = await this.pdfUI.getCurrentPDFDoc();
    if (!doc) return;
    const searchResult: string[] = [];
    const textSearch = doc.getTextSearch(text, 0);
    async function recursion() {
      const match = await textSearch.findNext();
      if (!match) {
        return;
      } else {
        searchResult.push('<li>' + '<span> Page' + (match.getPageIndex() + 1) + ' </span>' + '<div> ' + match.getSentence() + ' </div>' + ' </li>')
        await recursion();
      }
    }
    await recursion();
    return searchResult;
  }
}
