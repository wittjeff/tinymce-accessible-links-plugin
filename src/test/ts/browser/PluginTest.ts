import { TinyAssertions, TinyHooks, TinyUiActions } from '@ephox/mcagar';

import Plugin from '../../../main/ts/Plugin';

// This an example of a browser test of the editor.
describe('browser.PluginTest', () => {
  const hook = TinyHooks.bddSetup({
    plugins: 'tinymce-accessible-links-plugin',
    toolbar: 'tinymce-accessible-links-plugin'
  }, [ Plugin ]);

  it('test click on button', () => {
    const editor = hook.editor();
    TinyUiActions.clickOnToolbar(editor, 'button:contains("tinymce-accessible-links-plugin button")');
    TinyAssertions.assertContent(editor, '<p>content added from tinymce-accessible-links-plugin</p>');
  });
});
