import express from 'express';
import fetch from 'node-fetch';
import marked from 'marked';

const mainRouter = express.Router();

mainRouter.get(['/', '/download', '/downloads'], (req, res) => {
  const ua = req.headers['user-agent'];
  if (/(Intel|PPC) Mac OS X/.test(ua)) {
    res.redirect('/download/mac');
  } else if (/(Linux x86_64|Linux i686)/.test(ua)) {
    res.redirect('/download/linux');
  } else {
    res.redirect('/download/windows');
  }
});

mainRouter.get('/downloads/:platform(mac|windows|linux)', (req, res) => {
  const platform = req.params.platform;

  res.redirect(`/download/${platform}`);
});

mainRouter.get('/download/:platform(mac|windows|linux)', (req, res) => {
  const platform = req.params.platform;
  const platformName = platform.charAt(0).toUpperCase() + platform.slice(1);

  let dockName = 'dock';
  if (platform === 'windows') dockName = 'taskbar';
  if (platform === 'linux') dockName = 'launcher';

  res.render('download/index', {
    version: process.env.VERSION,
    platform,
    dockName,
    title: `Download WebCatalog for ${platformName}`,
  });
});

mainRouter.get('/release-notes', (req, res, next) => {
  fetch('https://raw.githubusercontent.com/webcatalog/webcatalog/master/RELEASE_NOTES.md')
    .then(response => response.text())
    .then((mdContent) => {
      res.render('download/release-notes', { title: 'Release Notes', releaseNotes: marked(mdContent) });
    })
    .catch(next);
});

mainRouter.get('/support', (req, res) => {
  res.redirect('/help');
});

mainRouter.get('/help', (req, res) => {
  res.render('help/index', { title: 'WebCatalog Support' });
});

module.exports = mainRouter;