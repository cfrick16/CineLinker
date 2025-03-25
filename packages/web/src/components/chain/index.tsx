import { useChainController } from './ChainController';
import { ChainNode } from './ChainModel';
import { ChainView } from './ChainView';

interface ChainSharedProps {
  leftNodes: ChainNode[];
  rightNodes: ChainNode[];
  centerNode: ChainNode | null;
} 

export function Chain({leftNodes, rightNodes, centerNode}: ChainSharedProps) {
  const [model, actions] = useChainController();
  return <ChainView model={{...model, leftNodes, rightNodes, centerNode}} actions={actions} />;
}