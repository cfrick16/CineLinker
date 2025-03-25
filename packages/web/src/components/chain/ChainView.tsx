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
          src={actor.imageUrl} 
          alt={actor.name}
          className={`node-image actor`}
          onError={(e) => { e.currentTarget.src = '/images/default-actor.svg' }}
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
          src={movie.imageUrl} 
          alt={movie.title}
          className={`node-image movie`}
          onError={(e) => { e.currentTarget.src = '/images/default-movie.svg' }}
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
    console.log(centerNode);
    // Show complete connected chain
    const allNodes = [...leftNodes, centerNode, ...rightNodes];
    return (
      <div className="chain-container success">
        {allNodes.map((node, idx) => renderNode(node, idx === allNodes.length - 1, false))}
      </div>
    );
  }

  return (
    <div className="chain-container">
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