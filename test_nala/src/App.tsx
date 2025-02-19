import React, { useState } from 'react';
import OrgCard from './components/OrgCard'; // Tu componente de tarjeta
import './App.css';

interface CardNode {
  id: number;
  title: string;
  children: CardNode[];
}

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

const App = () => {
  const [cards, setCards] = useState<CardNode[]>([
    { id: 1, title: 'Root Node', children: [] },
  ]);

  const handleAddCard = (parentId: number) => {
    setCards(prevCards => {
      const addCardRecursively = (nodes: CardNode[]): CardNode[] => {
        return nodes.map(node => {
          if (node.id === parentId) {
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
            />
          ))}
        </div>
      ))}
    </div>
  );
};

export default App;
