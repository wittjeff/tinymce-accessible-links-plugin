import { Editor, TinyMCE } from 'tinymce';

declare const tinymce: TinyMCE;

const setup = (editor: Editor, url: string): void => {
  editor.ui.registry.addButton('a11y-links', {
    icon: 'link',
    tooltip: 'Accessible Links',
    onAction: () => {
      const links = editor.dom.select('a');
      let currentIndex = 0;

      const updateDialogContent = (dialogApi: any) => {
        if (links.length > 0) {
          links.forEach(link => {
            editor.dom.setAttrib(link, 'data-mce-selected', null);
          });
          editor.dom.setAttrib(links[currentIndex], 'data-mce-selected', 'inline-boundary');

          dialogApi.setData({
            linkHtml: editor.serializer.serialize(links[currentIndex]),
            isFirstLink: currentIndex === 0,
            isLastLink: currentIndex === links.length - 1,
            noSymbol: true,
            downArrow: false,
            topPage: false,
            neArrow: false,
            rightArrow: false,
            overlappingSquares: false,
            srTextExternal: false,
            srTextNone: true,
            srTextNewTab: false,
            srTextScrollDown: false,
            srTextTopPage: false
          });
        }
      };

      const getSymbolHtml = (data: any) => {
        const symbolMap = {
          noSymbol: '',
          downArrow: '<span class="down-arrow" aria-hidden="true">&darr;</span>',
          topPage: '<span class="top-page" aria-hidden="true">&mapstoup;</span>',
          neArrow: '<span class="ne-arrow" aria-hidden="true">&nearr;</span>',
          rightArrow: '<span class="right-arrow" aria-hidden="true">&#x1f517;</span>',
          overlappingSquares: '<span class="overlapping-squares" aria-hidden="true">&#x1F5D7;</span>'
        };
        const selectedSymbol = ['noSymbol', 'downArrow', 'topPage', 'neArrow', 'rightArrow', 'overlappingSquares'].find(symbol => data[symbol]);
        return symbolMap[selectedSymbol || 'noSymbol'];
      };

      const getSrTextHtml = (data: any) => {
        let srTextContent = '';

        if (data.srTextExternal) {
          srTextContent += `<span class="sr-only"> external site</span>`;
        }

        const srTextMap = {
          srTextNone: '',
          srTextNewTab: '<span class="sr-only"> opens in a new tab</span>',
          srTextScrollDown: '<span class="sr-only"> scrolls down this page</span>',
          srTextTopPage: '<span class="sr-only"> returns to top of page</span>'
        };
        
        Object.keys(srTextMap).forEach(key => {
          if (data[key] && key !== 'srTextNone') {
            srTextContent += srTextMap[key];
          }
        });

        return srTextContent;
      };

      const pageConfig = (isFirstPage: boolean, isLastPage: boolean): any => ({
        title: 'Link Accessibility Options',
        size: 'large', // Correct type of DialogSize
        body: {
          type: 'panel',
          items: [
            {
              type: 'htmlpanel',
              html: `<p id="link-display" style="font-family: Courier Sans;">${editor.serializer.serialize(links[currentIndex])}</p>`
            },
            {
              type: 'htmlpanel',
              html: '<label>Symbol</label>'
            },
            {
              type: 'panel',
              items: [
                { type: 'checkbox', name: 'noSymbol', label: 'No symbol' },
                { type: 'checkbox', name: 'downArrow', label: 'Down arrow symbol' },
                { type: 'checkbox', name: 'topPage', label: 'Top of page symbol' },
                { type: 'checkbox', name: 'neArrow', label: 'NE pointing arrow' },
                { type: 'checkbox', name: 'rightArrow', label: 'Right-pointing arrow' },
                { type: 'checkbox', name: 'overlappingSquares', label: 'Overlapping squares' }
              ]
            },
            {
              type: 'htmlpanel',
              html: '<label>Screen-reader text</label>'
            },
            {
              type: 'panel',
              items: [
                { type: 'checkbox', name: 'srTextExternal', label: ' external site' },
                { type: 'checkbox', name: 'srTextNone', label: 'None' },
                { type: 'checkbox', name: 'srTextNewTab', label: ' opens in a new tab' },
                { type: 'checkbox', name: 'srTextScrollDown', label: ' scrolls down this page' },
                { type: 'checkbox', name: 'srTextTopPage', label: ' returns to top of page' }
              ]
            }
          ]
        },
        initialData: {
          linkHtml: links.length > 0 ? editor.serializer.serialize(links[currentIndex]) : '',
          isFirstLink: isFirstPage,
          isLastLink: isLastPage,
          noSymbol: true,
          downArrow: false,
          topPage: false,
          neArrow: false,
          rightArrow: false,
          overlappingSquares: false,
          srTextExternal: false,
          srTextNone: true,
          srTextNewTab: false,
          srTextScrollDown: false,
          srTextTopPage: false
        },
        buttons: [
          {
            type: 'custom',
            name: 'prev',
            text: 'Previous',
            enabled: !isFirstPage,
            primary: false
          },
          {
            type: 'custom',
            name: 'next',
            text: 'Next',
            enabled: !isLastPage,
            primary: false
          },
          {
            type: 'custom',
            name: 'update',
            text: 'Update as selected',
            primary: true
          },
          {
            type: 'custom',
            name: 'removeTarget',
            text: 'Remove target=_blank',
            primary: false
          },
          {
            type: 'custom',
            name: 'insertTarget',
            text: 'Insert target=_blank',
            primary: false
          },
          {
            type: 'custom',
            name: 'skip',
            text: 'Skip',
            primary: false
          },
          {
            type: 'custom',
            name: 'done',
            text: 'Done',
            primary: false
          }
        ],
        onChange: (dialogApi: any, details: any) => {
          if (details.name.startsWith('noSymbol') || details.name.startsWith('downArrow') || details.name.startsWith('topPage') || details.name.startsWith('neArrow') || details.name.startsWith('rightArrow') || details.name.startsWith('overlappingSquares')) {
            const symbolCheckboxes = ['noSymbol', 'downArrow', 'topPage', 'neArrow', 'rightArrow', 'overlappingSquares'];
            symbolCheckboxes.forEach(symbol => {
              if (symbol !== details.name) {
                dialogApi.setData({ [symbol]: false });
              }
            });
          } else if (details.name.startsWith('srText')) {
            const srTextCheckboxes = ['srTextNone', 'srTextNewTab', 'srTextScrollDown', 'srTextTopPage'];
            srTextCheckboxes.forEach(srText => {
              if (srText !== 'srTextExternal' && srText !== details.name) {
                dialogApi.setData({ [srText]: false });
              }
            });
          }
        },
        onAction: (dialogApi: any, details: any) => {
          const data = dialogApi.getData();
          const link = links[currentIndex];

          switch (details.name) {
            case 'prev':
              if (currentIndex > 0) {
                currentIndex--;
                dialogApi.redial(pageConfig(currentIndex === 0, false));
                updateDialogContent(dialogApi);
              }
              break;
            case 'next':
              if (currentIndex < links.length - 1) {
                currentIndex++;
                dialogApi.redial(pageConfig(false, currentIndex === links.length - 1));
                updateDialogContent(dialogApi);
              }
              break;
            case 'update':
              {
                // Remove existing symbols and screen-reader-only text
                const srOnlyElements = editor.dom.select('span.sr-only', link);
                srOnlyElements.forEach(el => editor.dom.remove(el));

                const symbolElements = editor.dom.select('span[aria-hidden="true"]', link);
                symbolElements.forEach(el => editor.dom.remove(el));

                let linkContent = link.innerHTML;

                const srTextContent = getSrTextHtml(data);
                const symbolHtml = getSymbolHtml(data);

                linkContent += `${srTextContent}${symbolHtml}`;
                editor.dom.setHTML(link, linkContent);
                break;
              }
            case 'removeTarget':
              {
                editor.dom.setAttrib(link, 'target', null);
                break;
              }
            case 'insertTarget':
              {
                editor.dom.setAttrib(link, 'target', '_blank');
                editor.dom.setAttrib(link, 'rel', 'noopener noreferrer');
                break;
              }
            case 'skip':
              {
                if (currentIndex < links.length - 1) {
                  currentIndex++;
                  dialogApi.redial(pageConfig(false, currentIndex === links.length - 1));
                  updateDialogContent(dialogApi);
                }
                break;
              }
            case 'done':
              {
                dialogApi.close();
                break;
              }
            default:
              break;
          }
        }
      });

      const dialogApi = editor.windowManager.open(pageConfig(currentIndex === 0, currentIndex === links.length - 1));
      updateDialogContent(dialogApi);
    }
  });
};

export default (): void => {
  tinymce.PluginManager.add('a11y-links', setup);
};
