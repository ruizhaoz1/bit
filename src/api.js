/** @flow */

import { getScopeComponent } from './api/consumer/index';
import { scopeList } from './api/scope/index';
import Extension from './extensions/extension';
import HooksManager from './hooks';
import ExtensionConfig from './extensions/extension-config';

HooksManager.init();

module.exports = {
  show: (scopePath: string, id: string, opts: Object) =>
    getScopeComponent({ scopePath, id, allVersions: opts && opts.versions }).then((c) => {
      if (Array.isArray(c)) {
        return c.map(v => v.toObject());
      }
      return c.toObject();
    }),
  list: (scopePath: string) => scopeList(scopePath).then(components => components.map(c => c.id.toString())),
  /**
   * Load extension programmatically
   */
  loadExtension: async (
    extensionName: string,
    extensionFilePath: string,
    extensionRawConfig: Object
  ): Promise<Extension> => {
    const config = ExtensionConfig.fromRawConfig(extensionRawConfig);
    const extension = await Extension.loadFromFile({
      name: extensionName,
      filePath: extensionFilePath,
      config
    });
    return Promise.resolve(extension);
  }
};
