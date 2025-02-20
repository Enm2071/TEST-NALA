import React, { FC } from 'react';
import { IconButton } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';

import './zoomControls.css';

type ZoomControlsProps = {
  zoomIn: () => void;
  zoomOut: () => void;
  resetTransform: () => void;
};

const ZoomControls: FC<ZoomControlsProps> = ({ zoomIn, zoomOut, resetTransform }) => {
  return (
    <div className="zoom-controls">
      <IconButton onClick={() => zoomIn()}>
        <ZoomInIcon />
      </IconButton>
      <IconButton onClick={() => zoomOut()}>
        <ZoomOutIcon />
      </IconButton>
      <IconButton onClick={() => resetTransform()}>
        <RestartAltIcon />
      </IconButton>
    </div>
  );
};

export default ZoomControls;
