import React, { useState } from 'react';
import OrgCard from './components/OrgCard';
import './App.css';
import { CardNode, assignLevels, removeCardRecursively } from './helpers/cards';
import CardDeleteConfirmationModal from './components/dialogs/CardDeleteConfirmationModal';

const App = () => {

  const [cards, setCards] = useState<CardNode[]>([
    { id: 1, title: 'Root Node', children: [] },
  ]);

  const [openModal, setOpenModal] = useState(false);
  const [cardIdToDelete, setCardIdToDelete] = useState<number | null>(null);

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
        <div key={level} className="level-row">
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
