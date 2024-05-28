(function () {
    'use strict';

    var currentIndex = 0;
    var setup = function (editor, url) {
      editor.ui.registry.addButton('a11y-links', {
        icon: 'link',
        tooltip: 'Accessible Links',
        onAction: function () {
          var links = editor.dom.select('a');
          var updateDialogContent = function () {
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
                srTextExternal: false,
                srText: 'none'
              });
            }
          };
          var dialogApi = editor.windowManager.open({
            title: 'Link Accessibility Options',
            size: 'large',
            body: {
              type: 'panel',
              items: [
                {
                  type: 'htmlpanel',
                  html: '<p style="font-family: Courier Sans;"></p>'
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
                    }
                  ]
                },
                {
                  type: 'checkbox',
                  name: 'srTextExternal',
                  label: ' external site'
                },
                {
                  type: 'listbox',
                  name: 'srText',
                  label: 'Screen-reader text',
                  items: [
                    {
                      text: 'None',
                      value: 'none'
                    },
                    {
                      text: ' opens in a new tab',
                      value: 'new-tab'
                    },
                    {
                      text: ' scrolls down this page',
                      value: 'scroll-down'
                    },
                    {
                      text: ' returns to top of page',
                      value: 'top-page'
                    }
                  ]
                }
              ]
            },
            initialData: {
              linkHtml: links.length > 0 ? editor.serializer.serialize(links[0]) : '',
              isFirstLink: true,
              isLastLink: links.length <= 1,
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
                enabled: currentIndex > 0,
                primary: false
              },
              {
                type: 'custom',
                name: 'next',
                text: 'Next',
                enabled: currentIndex < links.length - 1,
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
            onChange: function (api, details) {
              if (details.name.startsWith('symbol')) {
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
                    api.setData((_a = {}, _a[symbol] = false, _a));
                  }
                });
              }
            },
            onAction: function (api, details) {
              var data = dialogApi.getData();
              var link = links[currentIndex];
              switch (details.name) {
              case 'prev': {
                  if (currentIndex > 0) {
                    currentIndex--;
                    updateDialogContent();
                  }
                  break;
                }
              case 'next': {
                  if (currentIndex < links.length - 1) {
                    currentIndex++;
                    updateDialogContent();
                  }
                  break;
                }
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
                  var srTextContent = '';
                  if (data.srTextExternal) {
                    if (!linkContent.includes('sr-only"> external site')) {
                      srTextContent += '<span class="sr-only"> external site</span>';
                    }
                  }
                  if (data.srText !== 'none') {
                    var srTextMap = {
                      'new-tab': ' opens in a new tab',
                      'scroll-down': ' scrolls down this page',
                      'top-page': ' returns to top of page'
                    };
                    var srTextValue = srTextMap[data.srText];
                    if (!linkContent.includes('sr-only">'.concat(srTextValue))) {
                      srTextContent += '<span class="sr-only">'.concat(srTextValue, '</span>');
                    }
                  }
                  var symbolMap = {
                    noSymbol: '',
                    downArrow: '<span class="down-arrow" aria-hidden="true">&darr;</span>',
                    topPage: '<span class="top-page" aria-hidden="true">&mapstoup;</span>',
                    neArrow: '<span class="ne-arrow" aria-hidden="true">&nearr;</span>',
                    rightArrow: '<span class="right-arrow" aria-hidden="true">&#x1f517;</span>',
                    overlappingSquares: '<span class="overlapping-squares" aria-hidden="true">&#x1F5D7;</span>'
                  };
                  var selectedSymbol = [
                    'noSymbol',
                    'downArrow',
                    'topPage',
                    'neArrow',
                    'rightArrow',
                    'overlappingSquares'
                  ].find(function (symbol) {
                    return data[symbol];
                  });
                  var symbolHtml = symbolMap[selectedSymbol || 'noSymbol'];
                  linkContent += ''.concat(srTextContent).concat(symbolHtml);
                  editor.dom.setHTML(link, linkContent);
                  break;
                }
              case 'removeTarget': {
                  editor.dom.setAttrib(link, 'target', null);
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
                    updateDialogContent();
                  }
                  break;
                }
              case 'done': {
                  api.close();
                  break;
                }
              }
            }
          });
          updateDialogContent();
        }
      });
    };
    function Plugin () {
      tinymce.PluginManager.add('a11y-links', setup);
    }

    Plugin();

})();
