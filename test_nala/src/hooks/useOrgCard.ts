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
      notifyError('No se pudo actualizar el título del nodo.');
    }
  }

  async function editNodeDescription(id: string, newDescription: string) {
    try {
      await fetch(`${API_URL}/orgCards/add/description/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: newDescription }),
      });
    }
    catch (error) {
      notifyError('No se pudo actualizar la descripción del nodo.');
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
          return {
            ...node,
            children: [
              ...node.children,
              { id: Date.now(), title: 'Nueva Posición', children: [] }
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
        const resData = await response.json();
        const currentCards = cards;
        currentCards[0] = resData;
        setCards(() => [...currentCards]);
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
      notifyError('No se pudo eliminar el nodo.');
    }
  }

  function getSortedLevels() {
    const levelsMap = new Map<number, CardNode[]>();
    assignLevels(cards, 0, levelsMap);
    return Array.from(levelsMap.entries()).sort(([a], [b]) => a - b);
  }

  function getOneLevelUp(nodeId: string): any | null {
    function findParent(currentNodes: any[]): any | null {
      for (const node of currentNodes) {
        if (node.children.some((child: any) => child._id === nodeId)) {
          return node;
        }
        const foundInChildren = findParent(node.children);
        if (foundInChildren) return foundInChildren;
      }
      return null;
    }
  
    return findParent(cards);
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
    editNodeDescription,
    getOneLevelUp
  };
}
