import React, { useState } from 'react';
import OrgCard from './components/OrgCard';
import './App.css';
import { CardNode, assignLevels, removeCardRecursively } from './helpers/cards';
import CardDeleteConfirmationModal from './components/dialogs/CardDeleteConfirmationModal';
import { TextField } from '@mui/material';

const App = () => {
  const [cards, setCards] = useState<CardNode[]>([
    { id: 1, title: 'Root Node', children: [] },
  ]);
  const [openModal, setOpenModal] = useState(false);
  const [cardIdToDelete, setCardIdToDelete] = useState<number | null>(null);
  const [tierNames, setTierNames] = useState<{ [level: number]: string }>({});
  const [editingTier, setEditingTier] = useState<number | null>(null);

  const getTierName = (level: number) => {
    return tierNames[level] ?? `TIER ${level + 1}`;
  };

  const handleTierNameChange = (level: number, newName: string) => {
    setTierNames(prev => ({
      ...prev,
      [level]: newName,
    }));
  };

  const handleStartEditingTier = (level: number) => {
    setEditingTier(level);
  };

  const handleStopEditingTier = () => {
    setEditingTier(null);
  };

  const handleOpenModal = (id: number) => {
    setCardIdToDelete(id);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setCardIdToDelete(null);
  };

  const handleConfirmDelete = () => {
    if (cardIdToDelete !== null) {
      handleDeleteCard(cardIdToDelete);
    }
    handleCloseModal();
  };

  const handleAddCard = (parentId: number) => {
    setCards(prevCards => {
      const addCardRecursively = (nodes: CardNode[]): CardNode[] => {
        return nodes.map(node => {
          if (node.id === parentId) {
            if (node.children.length >= 3) {
              alert('Este padre ya tiene 3 hijos. No se pueden agregar más.');
              return node;
            }
            return {
              ...node,
              children: [
                ...node.children,
                { id: Date.now(), title: 'New Card', children: [] },
              ],
            };
          }
          return { ...node, children: addCardRecursively(node.children) };
        });
      };
      return addCardRecursively(prevCards);
    });
  };

  const handleDeleteCard = (cardId: number) => {
    setCards(prevCards => removeCardRecursively(prevCards, cardId));
  };

  const levelsMap = new Map<number, CardNode[]>();
  assignLevels(cards, 0, levelsMap);
  const sortedLevels = Array.from(levelsMap.entries()).sort(
    ([levelA], [levelB]) => levelA - levelB
  );

  return (
    <div className="app">
      {sortedLevels.map(([level, nodesAtThisLevel]) => (
        <div key={level} className="tier-row">
          <div className="tier-label">
            {editingTier === level ? (
              <TextField
                value={getTierName(level)}
                onChange={(e) => handleTierNameChange(level, e.target.value)}
                onBlur={handleStopEditingTier}
                autoFocus
              />
            ) : (
              <p onClick={() => handleStartEditingTier(level)}>
                {getTierName(level)}
              </p>
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
  );
};

export default App;
