import { useState, useRef, useEffect } from 'react';
import { CardNode, assignLevels, removeCardRecursively } from '../helpers/cards';
import { useToastify } from './useToastify';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1/orgCards';

export function useOrgCard() {
  const [cards, setCards] = useState<CardNode[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [cardIdToDelete, setCardIdToDelete] = useState<number | null>(null);
  const [tierNames, setTierNames] = useState<{ [level: number]: string }>({});
  const [editingTier, setEditingTier] = useState<number | null>(null);
  const { notifyError } = useToastify();
  const errorNotifiedRef = useRef(false);

  useEffect(() => {
    errorNotifiedRef.current = false;
  });

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data: CardNode[] = await response.json();
        setCards(data);
      } catch (error) {
        console.error('❌ Error al obtener nodos:', error);
        notifyError('Error al cargar los nodos.');
      }
    };

    fetchNodes();
  }, []);

  function getTierName(level: number) {
    return tierNames[level] ?? `TIER ${level + 1}`;
  }

  function handleTierNameChange(level: number, newName: string) {
    setTierNames(prev => ({ ...prev, [level]: newName }));
  }

  function handleStartEditingTier(level: number) {
    setEditingTier(level);
  }

  function handleStopEditingTier() {
    setEditingTier(null);
  }

  function handleOpenModal(id: number) {
    setCardIdToDelete(id);
    setOpenModal(true);
  }

  function handleCloseModal() {
    setOpenModal(false);
    setCardIdToDelete(null);
  }

  function handleConfirmDelete() {
    if (cardIdToDelete !== null) {
      handleDeleteCard(cardIdToDelete);
    }
    handleCloseModal();
  }

  function handleAddCard(parentId: number) {
    setCards(prevCards => {
      const addCardRecursively = (nodes: CardNode[]): CardNode[] => {
        return nodes.map(node => {
          if (node.id === parentId) {
            if (node.children.length >= 3) {
              if (!errorNotifiedRef.current) {
                notifyError('Este padre ya tiene 3 hijos. No se pueden agregar más.');
                errorNotifiedRef.current = true;
              }
              return node;
            }
            return {
              ...node,
              children: [
                ...node.children,
                { id: Date.now(), title: 'New Card', children: [] }
              ]
            };
          }
          return { ...node, children: addCardRecursively(node.children) };
        });
      };
      return addCardRecursively(prevCards);
    });
  }

  function handleDeleteCard(cardId: number) {
    setCards(prevCards => removeCardRecursively(prevCards, cardId));
  }

  function getSortedLevels() {
    const levelsMap = new Map<number, CardNode[]>();
    assignLevels(cards, 0, levelsMap);
    return Array.from(levelsMap.entries()).sort(([a], [b]) => a - b);
  }

  return {
    cards,
    openModal,
    cardIdToDelete,
    tierNames,
    editingTier,
    getTierName,
    handleTierNameChange,
    handleStartEditingTier,
    handleStopEditingTier,
    handleOpenModal,
    handleCloseModal,
    handleConfirmDelete,
    handleAddCard,
    handleDeleteCard,
    getSortedLevels,
    setCards
  };
}
