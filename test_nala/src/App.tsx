import React from 'react';
import './App.css';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import ZoomControls from './components/zoomControls';
import { TextField } from '@mui/material';
import CardDeleteConfirmationModal from './components/dialogs/CardDeleteConfirmationModal';
import OrgCard from './components/OrgCard';
import { useOrgCard } from './hooks/useOrgCard';
import { CARD_HEIGHT, CARD_WIDTH, EXTRA_OFFSET, HORIZONTAL_GAP, VERTICAL_MARGIN_BETWEEN_TIERS } from './constant/card';
import { ToastContainer } from 'react-toastify';

const App = () => {
  const {
    openModal,
    editingTier,
    getTierName,
    handleTierNameChange,
    handleStartEditingTier,
    handleStopEditingTier,
    handleOpenModal,
    handleCloseModal,
    handleConfirmDelete,
    handleAddCard,
    getSortedLevels
  } = useOrgCard();

  const sortedLevels = getSortedLevels();
  const numLevels = sortedLevels.length;
  const maxNodesInAnyLevel = sortedLevels.reduce((acc, [_, nodes]) => Math.max(acc, nodes.length), 0);
  const dynamicWidth = maxNodesInAnyLevel * (CARD_WIDTH + HORIZONTAL_GAP) + EXTRA_OFFSET;
  const dynamicHeight = numLevels * (CARD_HEIGHT + VERTICAL_MARGIN_BETWEEN_TIERS) + EXTRA_OFFSET;

  return (
    <TransformWrapper initialScale={1} initialPositionX={0} initialPositionY={0} limitToBounds={false}>
      {({ zoomIn, zoomOut, resetTransform }) => (
        <>
          <ZoomControls zoomIn={zoomIn} zoomOut={zoomOut} resetTransform={resetTransform} />
          <TransformComponent>
            <div className="app" style={{ minWidth: dynamicWidth, minHeight: dynamicHeight, backgroundColor: '#fff' }}>
              {sortedLevels.map(([level, nodesAtThisLevel]) => (
                <div key={level} className="tier-row">
                  <div className="tier-label">
                    {editingTier === level ? (
                      <TextField
                        value={getTierName(level)}
                        onChange={e => handleTierNameChange(level, e.target.value)}
                        onBlur={handleStopEditingTier}
                        autoFocus
                      />
                    ) : (
                      <p onClick={() => handleStartEditingTier(level)}>{getTierName(level)}</p>
                    )}
                  </div>
                  <div className="level-row">
                    {nodesAtThisLevel.map(node => (
                      <OrgCard
                        key={node.id}
                        id={node.id}
                        title={node.title}
                        addChild={() => handleAddCard(node.id)}
                        deleteCard={() => handleOpenModal(node.id)}
                      />
                    ))}
                  </div>
                </div>
              ))}
              <CardDeleteConfirmationModal
                openModal={openModal}
                handleCloseModal={handleCloseModal}
                handleConfirmDelete={handleConfirmDelete}
              />
            </div>
            
          </TransformComponent>
          <ToastContainer />
        </>
      )}
      
    </TransformWrapper>
  );
};

export default App;
