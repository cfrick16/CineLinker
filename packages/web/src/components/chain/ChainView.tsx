import { Actor, EntityType, Movie } from '@cinelinker/shared';
import { ChainModel, ChainActions, ChainNode } from './ChainModel';
import './Chain.css';

interface ChainViewProps {
  model: ChainModel;
  actions: ChainActions;
}

function ActorNode({ actor }: { actor: Actor }) {
  return (
    <div className={`chain-node actor`}>          
      <img 
          src={actor.imageUrl ?? '/images/default-actor.svg'} 
          className={`node-image actor`}
          onError={(e) => { e.currentTarget.src = '/images/default-actor.svg' }}
          alt={actor.name}
      />
      <div className="node-details">
        <h3>{actor.name}</h3>
      </div>
    </div>
  );
}

function MovieNode({ movie }: { movie: Movie }) {
  return (
    <div className={`chain-node movie`}>          
      <img 
          src={movie.imageUrl ?? '/images/default-movie.svg'} 
          className={`node-image movie`}
          onError={(e) => { e.currentTarget.src = '/images/default-movie.svg' }}
          alt={movie.title}
      />
      <div className="node-details">
        <h3>{movie.title}</h3>
        {movie.year && (
          <span className="year">({movie.year})</span>
        )}
      </div>
    </div>
  );
}

export function ChainView({ model, actions }: ChainViewProps) {
  const { rightNodes, leftNodes, centerNode } = model;

  const renderNode = (node: ChainNode, isFarRight: boolean, isRemoveable: boolean) => {
    return (
      <div key={node.entity.id} className="chain-item">
        <div className="chain-node-wrapper">
          {node.entityType === EntityType.Actor ? (
            <ActorNode actor={node.entity as Actor} />
          ) : (
            <MovieNode movie={node.entity as Movie} />
          )}
          {isRemoveable && (<button 
            className="remove-node" 
            onClick={() => actions.removeNode(node)}
            title="Remove this and following nodes"
            aria-label="Remove this and following nodes"
          >
            ×
          </button>
          )}
        </div>
        {!isFarRight && (
          <div className="chain-connection">
            <div className="connection-line" />
            <span className="connection-label"></span>
          </div>
        )}
      </div>
    );
  };

  if (centerNode != null) {
    // Show complete connected chain
    const allNodes = [...leftNodes, centerNode, ...rightNodes];
    
    // Determine if we need to stack the cards based on the number of items
    // If there are more than 6 items total, we'll stack them
    const shouldStack = allNodes.length > 6;
    
    return (
      <div className={`chain-container success ${shouldStack ? 'stacked' : ''}`}>
        {allNodes.map((node, idx) => {
          // Add a special class for the center node
          const isCenterNode = idx === Math.floor(allNodes.length / 2);
          const nodeClass = isCenterNode ? "center-node" : "";
          
          return (
            <div key={node.entity.id} className={`chain-item ${nodeClass}`}>
              <div className="chain-node-wrapper">
                {node.entityType === EntityType.Actor ? (
                  <ActorNode actor={node.entity as Actor} />
                ) : (
                  <MovieNode movie={node.entity as Movie} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    );
  }

  // Determine if we need to stack the cards based on the number of items
  // If there are more than 4 items total, we'll stack them
  const shouldStack = leftNodes.length + rightNodes.length > 4;
  
  return (
    <div className={`chain-container ${shouldStack ? 'stacked' : ''}`}>
      <div className="chain-left">
        {leftNodes.map((node, idx) => 
          renderNode(node, idx === leftNodes.length - 1, idx !== 0)
        )}
      </div>
      <div className="chain-right">
        {rightNodes.map((node, idx) => 
          renderNode(node, idx === rightNodes.length - 1, idx !== rightNodes.length - 1)
        )}
      </div>
    </div>
  );
}
