const { Menu, shell, app } = require('electron');
const isDev = require('electron-is-dev');

const sendMessageToWindow = require('./send-message-to-window');
const clearBrowsingData = require('./clear-browsing-data');

function createMenu() {
  let currentZoom = 1;
  const ZOOM_INTERVAL = 0.1;

  const template = [
    {
      label: 'Navigate',
      submenu: [
        {
          label: 'Home',
          accelerator: 'Alt+H',
          click: () => {
            sendMessageToWindow('go-home');
          },
        },
        {
          label: 'Back',
          accelerator: 'CmdOrCtrl+[',
          click: () => {
            sendMessageToWindow('go-back');
          },
        },
        {
          label: 'Forward',
          accelerator: 'CmdOrCtrl+]',
          click: () => {
            sendMessageToWindow('go-forward');
          },
        },
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            sendMessageToWindow('reload');
          },
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        {
          label: 'Undo',
          accelerator: 'CmdOrCtrl+Z',
          role: 'undo',
        },
        {
          label: 'Redo',
          accelerator: 'Shift+CmdOrCtrl+Z',
          role: 'redo',
        },
        {
          type: 'separator',
        },
        {
          label: 'Cut',
          accelerator: 'CmdOrCtrl+X',
          role: 'cut',
        },
        {
          label: 'Copy',
          accelerator: 'CmdOrCtrl+C',
          role: 'copy',
        },
        {
          label: 'Copy Current URL',
          accelerator: 'CmdOrCtrl+L',
          click: () => {
            sendMessageToWindow('copy-url');
          },
        },
        {
          label: 'Paste',
          accelerator: 'CmdOrCtrl+V',
          role: 'paste',
        },
        {
          label: 'Select All',
          accelerator: 'CmdOrCtrl+A',
          role: 'selectall',
        },
        {
          type: 'separator',
        },
        {
          label: 'Find In Page...',
          accelerator: 'CmdOrCtrl+F',
          click: () => {
            sendMessageToWindow('toggle-find-in-page-dialog');
          },
        },
      ],
    },
    {
      label: 'View',
      submenu: [
        {
          label: 'Toggle Navigation Bar',
          click: () => {},
        },
        {
          type: 'separator',
        },
        {
          label: 'Toggle Full Screen',
          accelerator: (() => {
            if (process.platform === 'darwin') {
              return 'Ctrl+Command+F';
            }
            return 'F11';
          })(),
          click: (item, focusedWindow) => {
            if (focusedWindow) {
              focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
            }
          },
        },
        {
          label: 'Zoom In',
          accelerator: (() => {
            if (process.platform === 'darwin') {
              return 'Command+=';
            }
            return 'Ctrl+=';
          })(),
          click: () => {
            currentZoom += ZOOM_INTERVAL;
            sendMessageToWindow('change-zoom', currentZoom);
          },
        },
        {
          label: 'Zoom Out',
          accelerator: (() => {
            if (process.platform === 'darwin') {
              return 'Command+-';
            }
            return 'Ctrl+-';
          })(),
          click: () => {
            currentZoom -= ZOOM_INTERVAL;
            sendMessageToWindow('change-zoom', currentZoom);
          },
        },
        {
          label: 'Developer Tools',
          accelerator: (() => {
            if (process.platform === 'darwin') {
              return 'Alt+Command+I';
            }
            return 'Ctrl+Shift+I';
          })(),
          click: () => {
            sendMessageToWindow('toggle-dev-tools');
          },
        },
      ],
    },
    {
      label: 'Tools',
      role: 'tools',
      submenu: [
        {
          label: 'Settings...',
          accelerator: process.platform === 'darwin' ? 'Cmd+,' : 'Ctrl+P',
          click: () => sendMessageToWindow('toggle-setting-dialog'),
        },
        {
          type: 'separator',
        },
        {
          label: 'Clear Browsing Data...',
          click: () => clearBrowsingData(),
        },
      ],
    },
  ];

  if (isDev) {
    template[3].submenu.push(
      {
        type: 'separator',
      },
      {
        label: 'Debug...',
        click: (item, focusedWindow) => {
          if (focusedWindow) {
            focusedWindow.toggleDevTools();
          }
        },
      /* eslint-disable comma-dangle */
      }
      /* eslint-enable comma-dangle */
    );
  }

  template.push({
    role: 'window',
    submenu: [
      {
        accelerator: 'CmdOrCtrl+M',
        role: 'minimize',
      },
      {
        accelerator: 'CmdOrCtrl+W',
        role: 'close',
      },
    ],
  });

  const helpMenu = {
    role: 'help',
    submenu: [
      {
        label: 'Help',
        click: () => {
          shell.openExternal('https://getwebcatalog.com/help');
        },
      },
      {
        label: 'Website',
        click: () => {
          shell.openExternal('https://getwebcatalog.com');
        },
      },
    ],
  };

  if (process.platform !== 'darwin') {
    helpMenu.submenu.push({
      label: `About ${app.getName()}`,
      click: () => {},
    });
  }

  template.push(helpMenu);

  if (process.platform === 'darwin') {
    template.unshift({
      submenu: [
        {
          label: `About ${app.getName()}`,
          click: () => {},
        },
        {
          role: 'services',
          submenu: [],
        },
        {
          type: 'separator',
        },
        {
          label: `Hide ${app.getName()}`,
          accelerator: 'Command+H',
          role: 'hide',
        },
        {
          accelerator: 'Command+Shift+H',
          role: 'hideothers',
        },
        {
          role: 'unhide',
        },
        {
          type: 'separator',
        },
        {
          label: 'Quit',
          accelerator: 'Command+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    });
    template[5].submenu.push(
      {
        type: 'separator',
      },
      {
        role: 'front',
      },
    );
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

module.exports = createMenu;
