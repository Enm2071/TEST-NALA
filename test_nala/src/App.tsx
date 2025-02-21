import React from 'react';
import './App.css';
import ZoomControls from './components/zoomControls';
import { TextField } from '@mui/material';
import CardDeleteConfirmationModal from './components/dialogs/CardDeleteConfirmationModal';
import OrgCard from './components/OrgCard';
import { useOrgCard } from './hooks/useOrgCard';
import { ToastContainer } from 'react-toastify';
import {
  CARD_HEIGHT,
  CARD_WIDTH,
  EXTRA_OFFSET,
  HORIZONTAL_GAP,
  VERTICAL_MARGIN_BETWEEN_TIERS
} from './constant/card';
import useTiers from './hooks/useTiers';

const App = () => {
  const {
    openModal,
    handleOpenModal,
    handleCloseModal,
    handleConfirmDelete,
    handleAddCard,
    getSortedLevels,
    editNodeTitle
  } = useOrgCard();

  const {
    editingTier,
    getTierTitle,
    handleTierNameChange,
    handleStartEditingTier,
    handleStopEditingTier
  } = useTiers();

  const sortedLevels = getSortedLevels();
  const numLevels = sortedLevels.length;
  const maxNodesInAnyLevel = sortedLevels.reduce((acc, [_, nodes]) => Math.max(acc, nodes.length), 0);
  const dynamicWidth = maxNodesInAnyLevel * (CARD_WIDTH + HORIZONTAL_GAP) + EXTRA_OFFSET;
  const dynamicHeight = numLevels * (CARD_HEIGHT + VERTICAL_MARGIN_BETWEEN_TIERS) + EXTRA_OFFSET;

  const [scale, setScale] = React.useState(1);

  const zoomIn = () => setScale(prev => prev * 1.2);
  const zoomOut = () => setScale(prev => prev / 1.2);
  const resetTransform = () => setScale(1);

  return (
    <div>
      <ZoomControls zoomIn={zoomIn} zoomOut={zoomOut} resetTransform={resetTransform} />
      <div
        className="app"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: '0 0',
          minWidth: dynamicWidth,
          minHeight: dynamicHeight,
          backgroundColor: '#fff'
        }}
      >
        {sortedLevels.map(([level, nodesAtThisLevel]) => (
          <div key={level} className="tier-row" style={{ minHeight: '200px' }}>
            <div className="tier-label">
              {editingTier === level ? (
                <TextField
                  value={getTierTitle(level)}
                  onChange={e => handleTierNameChange(level, e.target.value)}
                  onBlur={handleStopEditingTier}
                  autoFocus
                />
              ) : (
                <p onClick={() => handleStartEditingTier(level)}>{getTierTitle(level)}</p>
              )}
            </div>
            <div className="level-row">
              {nodesAtThisLevel.map((node, index) => (
                <React.Fragment key={node.id}>
                  <div id={`card-${node.id}`} style={{ position: 'relative' }}>
                    <OrgCard
                      id={node._id!}
                      title={node.title}
                      addChild={handleAddCard}
                      deleteCard={handleOpenModal}
                      editTitle={editNodeTitle}
                    />
                  </div>
                  {index < nodesAtThisLevel.length - 1 &&
                    node.children.length > 0 &&
                    nodesAtThisLevel[index + 1].children.length > 0 && (
                      <div className="divider" />
                    )}
                </React.Fragment>
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
      <ToastContainer />
    </div>
  );
};

export default App;
