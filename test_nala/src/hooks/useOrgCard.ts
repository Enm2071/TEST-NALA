import { useState, useRef, useEffect } from 'react';
import { CardNode, assignLevels, removeCardRecursively } from '../helpers/cards';
import { useToastify } from './useToastify';
import { API_URL } from '../libs/config';

export function useOrgCard() {
  const [cards, setCards] = useState<CardNode[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [cardIdToDelete, setCardIdToDelete] = useState<string | null>(null);
  const errorNotifiedRef = useRef(false);
  const { notifyError, notifySuccess } = useToastify();
  useEffect(() => {
    errorNotifiedRef.current = false;
  });

  useEffect(() => {
    const fetchNodes = async () => {
      try {
        const response = await fetch(`${API_URL}/orgCards`);
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

  function handleOpenModal(id: string) {
    setCardIdToDelete(id);
    setOpenModal(true);
  }

  function handleCloseModal() {
    setOpenModal(false);
    setCardIdToDelete(null);
  }

  async function editNodeTitle(id: string, newTitle: string) {
    try {
      const response = await fetch(`${API_URL}/orgCards/${id}/${newTitle}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error(`Error en la API: ${response.status}`);
      }

      notifySuccess('Título actualizado correctamente.');
    }
    catch (error) {
      console.error('❌ Error al actualizar el título del nodo:', error);
      notifyError('No se pudo actualizar el título del nodo.');
    }
  }

  function handleConfirmDelete() {
    if (cardIdToDelete !== null) {
      handleDeleteCard(cardIdToDelete);

    }
    handleCloseModal();
  }

  function handleAddCard(parentId: string) {
    let timeoutId: any;
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const currentCards = cards;

    const addCardRecursively = (nodes: CardNode[]): CardNode[] => {
      return nodes.map(node => {
        if (node._id === parentId) {
          if (node.children.length >= 3) {
            if (!errorNotifiedRef.current) {
              notifyError('Este padre ya tiene 3 hijos. No se pueden agregar más.');
              errorNotifiedRef.current = true;
            }
            return node;
          }
          errorNotifiedRef.current = false;
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
    const newCards = addCardRecursively(currentCards);

    if (!!errorNotifiedRef.current) return;
    timeoutId = setTimeout(async () => {
      try {
        const rootId = cards.find(card => card.root)?._id;
        const response = await fetch(`${API_URL}/orgCards/${rootId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newCards)
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        setCards(newCards);
        notifySuccess('Nodo agregado correctamente.');
      } catch (error) {
        notifyError('Error al actualizar los nodos.');
      }
    }, 500);

  }

  async function handleDeleteCard(cardId: string) {
    try {
      const response = await fetch(`${API_URL}/orgCards/delete/${cardId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      });
  
      if (!response.ok) {
        throw new Error(`Error en la API: ${response.status}`);
      }
  
      setCards(prevCards => removeCardRecursively(prevCards, cardId));
      notifySuccess('Nodo y sus hijos eliminados correctamente.');
    } catch (error) {
      console.error('❌ Error al eliminar el nodo:', error);
      notifyError('No se pudo eliminar el nodo.');
    }
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
    handleOpenModal,
    handleCloseModal,
    handleConfirmDelete,
    handleAddCard,
    handleDeleteCard,
    getSortedLevels,
    setCards,
    editNodeTitle,
  };
}
