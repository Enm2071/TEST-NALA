import React, { FC } from 'react';
import { IconButton } from '@mui/material';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import styled from '@emotion/styled';

type ZoomControlsProps = {
  zoomIn: () => void;
  zoomOut: () => void;
  resetTransform: () => void;
};

const ZoomControlsContainer = styled.div`
  position: fixed;
  top: 100px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  background-color: #fff;
  padding: 8px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.15);
  z-index: 100;
`;

const ZoomControls: FC<ZoomControlsProps> = ({ zoomIn, zoomOut, resetTransform }) => {
  return (
    <ZoomControlsContainer>
      <IconButton onClick={zoomIn}>
        <ZoomInIcon />
      </IconButton>
      <IconButton onClick={zoomOut}>
        <ZoomOutIcon />
      </IconButton>
      <IconButton onClick={resetTransform}>
        <RestartAltIcon />
      </IconButton>
    </ZoomControlsContainer>
  );
};

export default ZoomControls;
