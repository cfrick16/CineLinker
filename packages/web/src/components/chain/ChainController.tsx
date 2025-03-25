import { ChainSharedProps } from ".";
import { ChainModel, ChainNode } from "./ChainModel";
import { ChainActions } from "./ChainModel";

export function useChainController(
  {leftNodes, rightNodes, centerNode, setLeftNodes, setRightNodes, setCenterNode}: ChainSharedProps
): [ChainModel, ChainActions] {

  const removeNode = (chainNode: ChainNode) => {
    const leftIndex = leftNodes.findIndex(node => node.entity.id === chainNode.entity.id);
    if(leftIndex >= 0){
      setLeftNodes(leftNodes.slice(0, leftIndex));
    } 
    const rightIndex = rightNodes.findIndex(node => node.entity.id === chainNode.entity.id);
    if(rightIndex >= 0){
  
      setRightNodes(rightNodes.slice(rightIndex + 1, rightNodes.length));
    }
    setCenterNode(null);
  };

  return [
    {leftNodes, rightNodes, centerNode},
    {removeNode}
  ];
}
