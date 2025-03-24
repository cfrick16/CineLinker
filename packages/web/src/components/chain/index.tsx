import { useChainController } from './ChainController';
import { ChainView } from './ChainView';

export function Chain() {
  const [model, actions] = useChainController();
  return <ChainView model={model} actions={actions} />;
}