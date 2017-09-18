import { Toaster, Position, Intent } from '@blueprintjs/core';
import semver from 'semver';

import customFetch from '../libs/customFetch';

/* eslint-disable no-console */
/* eslint-enable no-console */

const showUpdateToast = () =>
  customFetch('https://api.github.com/repos/webcatalog/webcatalog/releases/latest')
    .then(response => response.json())
    .then(({ tag_name }) => {
      const latestVersion = tag_name.substring(1);

      /* eslint-disable no-console */
      console.log(`Latest version: ${latestVersion}`);
      /* eslint-enable no-console */

      if (semver.gte(process.env.VERSION, latestVersion)) return;

      const toaster = Toaster.create({
        position: Position.BOTTOM_LEFT,
      });
      toaster.show({
        intent: Intent.SUCCESS,
        message: `An update (${latestVersion}) is now available.`,
        timeout: 0,
        action: {
          onClick: () => ipcRenderer.send('open-in-browser', `https://webcatalog.io?currentVersion=${process.env.VERSION}`),
          text: 'Download',
        },
      });
    })
    /* eslint-disable no-console */
    .catch(console.log);
  /* eslint-enable no-console */

export default showUpdateToast;
