import { useChainController } from './ChainController';
import { ChainNode } from './ChainModel';
import { ChainView } from './ChainView';

export interface ChainSharedProps {
  leftNodes: ChainNode[];
  rightNodes: ChainNode[];
  centerNode: ChainNode | null;
  setLeftNodes: (nodes: ChainNode[]) => void;
  setRightNodes: (nodes: ChainNode[]) => void;
  setCenterNode: (node: ChainNode | null) => void;
} 

export function Chain({leftNodes, rightNodes, centerNode, setLeftNodes, setRightNodes, setCenterNode}: ChainSharedProps) {
  const [model, actions] = useChainController({leftNodes, rightNodes, centerNode, 
    setLeftNodes, setRightNodes, setCenterNode});

    
  return <ChainView 
    model={{...model, leftNodes, rightNodes, centerNode}} 
    actions={actions} 
  />;
}