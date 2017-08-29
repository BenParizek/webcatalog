import React from 'react';
import PropTypes from 'prop-types';
import Immutable from 'immutable';
import { connect } from 'react-redux';
import { ProgressBar, Button, Intent, Popover, Position, Classes } from '@blueprintjs/core';
import semver from 'semver';
import classNames from 'classnames';

import getServerUrl from '../libs/getServerUrl';
import extractHostname from '../libs/extractHostname';
import { LATEST_SHELL_VERSION } from '../constants/versions';

const Card = ({
  app, managedApps, token,
}) => (
  <div className="col">
    <div className="pt-card pt-elevation-1" style={{ textAlign: 'center', padding: 12, position: 'relative' }}>
      <img
        src={getServerUrl(`/s3/${app.get('id')}@128px.webp?v=${app.get('version')}`)}
        role="presentation"
        alt={app.get('name')}
        style={{
          height: 64,
          width: 64,
          marginBottom: 8,
        }}
      />
      <h5
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: 'normal',
          whiteSpace: 'nowrap',
          margin: '8px 0 0 0',
          fontSize: 15,
        }}
      >
        {app.get('name')}
      </h5>
      <p
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: 'normal',
          whiteSpace: 'nowrap',
          margin: '0 0 16px',
          fontSize: 14,
          fontWeight: 400,
        }}
      >
        {extractHostname(app.get('url'))}
      </p>
      {(() => {
        let appStatus = null;

        if (!appStatus && managedApps.has(app.get('id'))) {
          appStatus = managedApps.getIn([app.get('id'), 'status']);
        }

        if (appStatus === 'INSTALLING' || appStatus === 'UNINSTALLING' || appStatus === 'UPDATING') {
          return (
            <ProgressBar intent={Intent.PRIMARY} className="card-progress-bar" />
          );
        }
        if (appStatus === 'INSTALLED') {
          const shouldUpdate = semver.lt(managedApps.getIn([app.get('id'), 'app', 'shellVersion']), LATEST_SHELL_VERSION)
                            || app.get('version') > managedApps.getIn([app.get('id'), 'app', 'version']);

          return [
            shouldUpdate ? (
              <Button
                key="update"
                text="Update"
                iconName="download"
                intent={Intent.SUCCESS}
                onClick={() => {
                  window.Intercom('trackEvent', 'update-app', { app_id: app.get('id') });
                  ipcRenderer.send('update-app', app.get('id'), managedApps.getIn([app.get('id'), 'app']).toJS(), token);
                }}
              />
            ) : (
              <Button
                key="open"
                text="Open"
                onClick={() => {
                  window.Intercom('trackEvent', 'open-app', { app_id: app.get('id') });
                  ipcRenderer.send('open-app', app.get('id'), managedApps.getIn([app.get('id'), 'app', 'name']));
                }}
              />
            ),
            <Popover
              key="uninstall"
              content={(
                <div>
                  <h5>Are you sure?</h5>
                  <p>
                    All of your browsing data will be removed and can&#39;t be recovered.
                  </p>
                  <Button
                    text="Yes, I'm sure"
                    iconName="trash"
                    intent={Intent.DANGER}
                    style={{ marginRight: 6 }}
                    onClick={() => {
                      window.Intercom('trackEvent', 'uninstall-app', { app_id: app.get('id') });
                      ipcRenderer.send('uninstall-app', app.get('id'), managedApps.getIn([app.get('id'), 'app']).toObject());
                    }}
                  />
                  <button className={classNames(Classes.BUTTON, Classes.POPOVER_DISMISS)}>Cancel</button>
                </div>
              )}
              position={Position.BOTTOM}
              popoverClassName="pt-popover-content-sizing"
            >
              <Button
                text="Uninstall"
                iconName="trash"
                intent={Intent.DANGER}
                style={{ marginLeft: 6 }}
              />
            </Popover>,
          ];
        }
        return (
          <Button
            key="install"
            text="Install"
            iconName="download"
            intent={Intent.PRIMARY}
            onClick={() => {
              window.Intercom('trackEvent', 'install-app', { app_id: app.get('id') });
              ipcRenderer.send('install-app', app.get('id'), token);
            }}
          />
        );
      })()}
    </div>
  </div>
);

Card.propTypes = {
  app: PropTypes.instanceOf(Immutable.Map).isRequired,
  managedApps: PropTypes.instanceOf(Immutable.Map).isRequired,
  token: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
  managedApps: state.appManagement.get('managedApps'),
  token: state.auth.get('token'),
});


export default connect(
  mapStateToProps,
)(Card);
