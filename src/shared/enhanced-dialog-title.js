import React from 'react';
import PropTypes from 'prop-types';

import CloseIcon from 'material-ui-icons/Close';
import common from 'material-ui/colors/common';
import IconButton from 'material-ui/IconButton';
import { DialogTitle } from 'material-ui/Dialog';
import { withStyles } from 'material-ui/styles';

import {
  STRING_CLOSE,
} from '../constants/strings';

const { lightBlack } = common;

const styles = {
  text: {
    color: lightBlack,
    lineHeight: '32px',
  },
  closeButton: {
    float: 'right',
    height: 32,
    width: 32,
  },
};

const EnhancedDialogTitle = (props) => {
  const {
    children,
    classes,
    onCloseButtonClick,
  } = props;

  return (
    <DialogTitle>
      <span className={classes.text}>
        {children}
      </span>
      <IconButton
        aria-label={STRING_CLOSE}
        className={classes.closeButton}
        onClick={onCloseButtonClick}
      >
        <CloseIcon />
      </IconButton>
    </DialogTitle>
  );
};

EnhancedDialogTitle.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.element,
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.string,
  ]).isRequired,
  onCloseButtonClick: PropTypes.func.isRequired,
};

export default withStyles(styles, { name: 'EnhancedDialogTitle' })(EnhancedDialogTitle);