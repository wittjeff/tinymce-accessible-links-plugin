(function () {
    'use strict';

    var setup = function (editor, url) {
      editor.ui.registry.addIcon('custom-links-icon', '<img src="/icons/arrow.svg " style="height: 25px; width: 25px;"/>');
      editor.ui.registry.addButton('a11y-links', {
        icon: 'custom-links-icon',
        tooltip: 'Accessible Links',
        onAction: function () {
          var links = editor.dom.select('a');
          var currentIndex = 0;
          var updateDialogContent = function (dialogApi) {
            if (links.length > 0) {
              links.forEach(function (link) {
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
                customSvgSymbol: false,
                customSvg: '<svg style="display: inline-block; width: 1em; height: 1em;" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M36 24c-1.2 0-2 0.8-2 2v12c0 1.2-0.8 2-2 2h-22c-1.2 0-2-0.8-2-2v-22c0-1.2 0.8-2 2-2h12c1.2 0 2-0.8 2-2s-0.8-2-2-2h-12c-3.4 0-6 2.6-6 6v22c0 3.4 2.6 6 6 6h22c3.4 0 6-2.6 6-6v-12c0-1.2-0.8-2-2-2z"></path><path d="M43.8 5.2c-0.2-0.4-0.6-0.8-1-1-0.2-0.2-0.6-0.2-0.8-0.2h-12c-1.2 0-2 0.8-2 2s0.8 2 2 2h7.2l-18.6 18.6c-0.8 0.8-0.8 2 0 2.8 0.4 0.4 0.8 0.6 1.4 0.6s1-0.2 1.4-0.6l18.6-18.6v7.2c0 1.2 0.8 2 2 2s2-0.8 2-2v-12c0-0.2 0-0.6-0.2-0.8z"></path></svg>'
              });
            }
          };
          var getSymbolHtml = function (data) {
            var symbolMap = {
              noSymbol: '',
              downArrow: '<span class="down-arrow" aria-hidden="true">&darr;</span>',
              topPage: '<span class="top-page" aria-hidden="true">&mapstoup;</span>',
              neArrow: '<span class="ne-arrow" aria-hidden="true">&nearr;</span>',
              rightArrow: '<span class="right-arrow" aria-hidden="true">&#x2192;</span>',
              overlappingSquares: '<span class="overlapping-squares" aria-hidden="true">&#x1F5D7;</span>',
              customSvg: data.customSvgSymbol ? data.customSvg : ''
            };
            var selectedSymbol = [
              'noSymbol',
              'downArrow',
              'topPage',
              'neArrow',
              'rightArrow',
              'overlappingSquares',
              'customSvg'
            ].find(function (symbol) {
              return data[symbol];
            });
            return symbolMap[selectedSymbol || 'noSymbol'];
          };
          var getSrTextHtml = function (data) {
            var srTextContent = '';
            if (data.srTextExternal) {
              srTextContent += '<span class="sr-only"> external site</span>';
            }
            var srTextMap = {
              srTextNone: '',
              srTextNewTab: '<span class="sr-only"> opens in a new tab</span>',
              srTextScrollDown: '<span class="sr-only"> scrolls down this page</span>',
              srTextTopPage: '<span class="sr-only"> returns to top of page</span>'
            };
            Object.keys(srTextMap).forEach(function (key) {
              if (data[key] && key !== 'srTextNone') {
                srTextContent += srTextMap[key];
              }
            });
            return srTextContent;
          };
          var pageConfig = function (isFirstPage, isLastPage) {
            return {
              title: 'Link Accessibility Options',
              size: 'medium',
              body: {
                type: 'panel',
                items: [
                  {
                    type: 'htmlpanel',
                    html: '<p id="link-display" style="font-family: Courier Sans;">'.concat(editor.serializer.serialize(links[currentIndex]), ' <span style="font-weight: bold;">(Link ').concat(currentIndex + 1, ' of ').concat(links.length, ')</span></p>')
                  },
                  {
                    type: 'htmlpanel',
                    html: '<label>Symbol</label>'
                  },
                  {
                    type: 'panel',
                    items: [
                      {
                        type: 'checkbox',
                        name: 'noSymbol',
                        label: 'No symbol'
                      },
                      {
                        type: 'checkbox',
                        name: 'downArrow',
                        label: 'Down arrow symbol'
                      },
                      {
                        type: 'checkbox',
                        name: 'topPage',
                        label: 'Top of page symbol'
                      },
                      {
                        type: 'checkbox',
                        name: 'neArrow',
                        label: 'NE pointing arrow'
                      },
                      {
                        type: 'checkbox',
                        name: 'rightArrow',
                        label: 'Right-pointing arrow'
                      },
                      {
                        type: 'checkbox',
                        name: 'overlappingSquares',
                        label: 'Overlapping squares'
                      },
                      {
                        type: 'checkbox',
                        name: 'customSvgSymbol',
                        label: 'Custom SVG symbol'
                      },
                      {
                        type: 'input',
                        name: 'customSvg',
                        label: 'Custom SVG',
                        inputType: 'textarea',
                        value: '<svg style="display: inline-block; width: 1em; height: 1em;" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M36 24c-1.2 0-2 0.8-2 2v12c0 1.2-0.8 2-2 2h-22c-1.2 0-2-0.8-2-2v-22c0-1.2 0.8-2 2-2h12c1.2 0 2-0.8 2-2s-0.8-2-2-2h-12c-3.4 0-6 2.6-6 6v22c0 3.4 2.6 6 6 6h22c3.4 0 6-2.6 6-6v-12c0-1.2-0.8-2-2-2z"></path><path d="M43.8 5.2c-0.2-0.4-0.6-0.8-1-1-0.2-0.2-0.6-0.2-0.8-0.2h-12c-1.2 0-2 0.8-2 2s0.8 2 2 2h7.2l-18.6 18.6c-0.8 0.8-0.8 2 0 2.8 0.4 0.4 0.8 0.6 1.4 0.6s1-0.2 1.4-0.6l18.6-18.6v7.2c0 1.2 0.8 2 2 2s2-0.8 2-2v-12c0-0.2 0-0.6-0.2-0.8z"></path></svg>'
                      }
                    ]
                  },
                  {
                    type: 'htmlpanel',
                    html: '<label>Screen-reader text</label>'
                  },
                  {
                    type: 'panel',
                    items: [
                      {
                        type: 'checkbox',
                        name: 'srTextExternal',
                        label: ' external site'
                      },
                      {
                        type: 'checkbox',
                        name: 'srTextNone',
                        label: 'None'
                      },
                      {
                        type: 'checkbox',
                        name: 'srTextNewTab',
                        label: ' opens in a new tab'
                      },
                      {
                        type: 'checkbox',
                        name: 'srTextScrollDown',
                        label: ' scrolls down this page'
                      },
                      {
                        type: 'checkbox',
                        name: 'srTextTopPage',
                        label: ' returns to top of page'
                      }
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
                customSvgSymbol: false,
                customSvg: '<svg style="display: inline-block; width: 1em; height: 1em;" viewBox="0 0 48 48" aria-hidden="true" focusable="false"><path d="M36 24c-1.2 0-2 0.8-2 2v12c0 1.2-0.8 2-2 2h-22c-1.2 0-2-0.8-2-2v-22c0-1.2 0.8-2 2-2h12c1.2 0 2-0.8 2-2s-0.8-2-2-2h-12c-3.4 0-6 2.6-6 6v22c0 3.4 2.6 6 6 6h22c3.4 0 6-2.6 6-6v-12c0-1.2-0.8-2-2-2z"></path><path d="M43.8 5.2c-0.2-0.4-0.6-0.8-1-1-0.2-0.2-0.6-0.2-0.8-0.2h-12c-1.2 0-2 0.8-2 2s0.8 2 2 2h7.2l-18.6 18.6c-0.8 0.8-0.8 2 0 2.8 0.4 0.4 0.8 0.6 1.4 0.6s1-0.2 1.4-0.6l18.6-18.6v7.2c0 1.2 0.8 2 2 2s2-0.8 2-2v-12c0-0.2 0-0.6-0.2-0.8z"></path></svg>'
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
                  text: 'Update',
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
                  name: 'done',
                  text: 'Done',
                  primary: false
                }
              ],
              onChange: function (dialogApi, details) {
                if (details.name.startsWith('noSymbol') || details.name.startsWith('downArrow') || details.name.startsWith('topPage') || details.name.startsWith('neArrow') || details.name.startsWith('rightArrow') || details.name.startsWith('overlappingSquares')) {
                  var symbolCheckboxes = [
                    'noSymbol',
                    'downArrow',
                    'topPage',
                    'neArrow',
                    'rightArrow',
                    'overlappingSquares'
                  ];
                  symbolCheckboxes.forEach(function (symbol) {
                    var _a;
                    if (symbol !== details.name) {
                      dialogApi.setData((_a = {}, _a[symbol] = false, _a));
                    }
                  });
                }
                if (details.name === 'customSvgSymbol') {
                  dialogApi.setData({ customSvgSymbol: details.value });
                } else if (details.name.startsWith('srText')) {
                  var srTextCheckboxes = [
                    'srTextNone',
                    'srTextNewTab',
                    'srTextScrollDown',
                    'srTextTopPage'
                  ];
                  srTextCheckboxes.forEach(function (srText) {
                    var _a;
                    if (srText !== 'srTextExternal' && srText !== details.name) {
                      dialogApi.setData((_a = {}, _a[srText] = false, _a));
                    }
                  });
                }
              },
              onAction: function (dialogApi, details) {
                var data = dialogApi.getData();
                var link = links[currentIndex];
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
                case 'update': {
                    var srOnlyElements = editor.dom.select('span.sr-only', link);
                    srOnlyElements.forEach(function (el) {
                      return editor.dom.remove(el);
                    });
                    var symbolElements = editor.dom.select('span[aria-hidden="true"]', link);
                    symbolElements.forEach(function (el) {
                      return editor.dom.remove(el);
                    });
                    var linkContent = link.innerHTML;
                    var srTextContent = getSrTextHtml(data);
                    var symbolHtml = getSymbolHtml(data);
                    linkContent += ''.concat(srTextContent).concat(symbolHtml);
                    editor.dom.setHTML(link, linkContent);
                    break;
                  }
                case 'removeTarget': {
                    editor.dom.setAttrib(link, 'target', null);
                    editor.dom.setAttrib(link, 'rel', null);
                    break;
                  }
                case 'insertTarget': {
                    editor.dom.setAttrib(link, 'target', '_blank');
                    editor.dom.setAttrib(link, 'rel', 'noopener noreferrer');
                    break;
                  }
                case 'skip': {
                    if (currentIndex < links.length - 1) {
                      currentIndex++;
                      dialogApi.redial(pageConfig(false, currentIndex === links.length - 1));
                      updateDialogContent(dialogApi);
                    }
                    break;
                  }
                case 'done': {
                    dialogApi.close();
                    break;
                  }
                }
              }
            };
          };
          var dialogApi = editor.windowManager.open(pageConfig(currentIndex === 0, currentIndex === links.length - 1));
          updateDialogContent(dialogApi);
        }
      });
    };
    function Plugin () {
      tinymce.PluginManager.add('a11y-links', setup);
    }

    Plugin();

})();
