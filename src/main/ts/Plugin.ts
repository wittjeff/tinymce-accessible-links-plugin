import { Editor, TinyMCE,} from 'tinymce';

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
            srText: 'none'
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
            { type: 'checkbox', name: 'srTextExternal', label: ' external site' },
            {
              type: 'listbox',
              name: 'srText',
              label: 'Screen-reader text',
              items: [
                { text: 'None', value: 'none' },
                { text: ' opens in a new tab', value: 'new-tab' },
                { text: ' scrolls down this page', value: 'scroll-down' },
                { text: ' returns to top of page', value: 'top-page' }
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
          srText: 'none'
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
          if (details.name.startsWith('symbol')) {
            const symbolCheckboxes = ['noSymbol', 'downArrow', 'topPage', 'neArrow', 'rightArrow', 'overlappingSquares'];
            symbolCheckboxes.forEach(symbol => {
              if (symbol !== details.name) {
                dialogApi.setData({ [symbol]: false });
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
                let srTextContent = '';

                if (data.srTextExternal) {
                  if (!linkContent.includes('sr-only"> external site')) {
                    srTextContent += `<span class="sr-only"> external site</span>`;
                  }
                }

                if (data.srText !== 'none') {
                  const srTextMap = {
                    'new-tab': ' opens in a new tab',
                    'scroll-down': ' scrolls down this page',
                    'top-page': ' returns to top of page'
                  };
                  const srTextValue = srTextMap[data.srText];
                  if (!linkContent.includes(`sr-only">${srTextValue}`)) {
                    srTextContent += `<span class="sr-only">${srTextValue}</span>`;
                  }
                }

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
