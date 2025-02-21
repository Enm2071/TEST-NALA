interface CardNode {
  _id?: string;
  root?: boolean;
  id: number;
  title: string;
  description?: string;
  children: CardNode[];
}

/**
 * Asigna un 'level' (nivel) a cada nodo y los agrupa en levelsMap.
 * @param nodes - lista de nodos del árbol
 * @param level - nivel actual
 * @param levelsMap - mapa donde la clave es el nivel y el valor es un array de nodos
 */
function assignLevels(nodes: CardNode[], level: number, levelsMap: Map<number, CardNode[]>) {
  for (const node of nodes) {
    if (!levelsMap.has(level)) {
      levelsMap.set(level, []);
    }
    levelsMap.get(level)!.push(node);

    if (node.children.length > 0) {
      assignLevels(node.children, level + 1, levelsMap);
    }
  }
}

function removeCardRecursively(nodes: CardNode[], cardId: string): CardNode[] {
  return nodes
    .filter(node => node._id !== cardId)
    .map(node => ({
      ...node,
      children: removeCardRecursively(node.children, cardId),
    }));
}


export { assignLevels, removeCardRecursively };
export type { CardNode };
