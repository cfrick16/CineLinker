import { Actor, EntityType, Movie } from '@cinelinker/shared';
import { ChainModel, ChainActions, ChainNode } from './ChainModel';
import './Chain.css';

interface ChainViewProps {
  model: ChainModel;
  actions: ChainActions;
}

function ActorNode({ actor }: { actor: Actor }) {
  return (
    <div className={`chain-node actor}`}>          
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
      <div className={`chain-node movie}`}>          
        <img 
            src={movie.imageUrl} 
            alt={movie.title}
            className={`node-image movieß`}
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
  const { rightNodes, leftNodes } = model;

  console.debug(actions)
  const renderNode = (node: ChainNode, isLastNode: boolean) => {

    return (
      <div key={node.entity.id} className="chain-item">
        {node.entityType === EntityType.Actor ? (
          <ActorNode actor={node.entity as Actor} />
        ) : (
          <MovieNode movie={node.entity as Movie} />
        )}
        {!isLastNode && (
          <div className="chain-connection">
            <div className="connection-line" />
            <span className="connection-label">
            </span>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="chain-container">
      <div className="chain-left">
        {leftNodes.map((node, idx) => renderNode(node, idx === leftNodes.length - 1))}
      </div>
      <div className="chain-right">
        {rightNodes.map((node, idx) => renderNode(node, idx === rightNodes.length - 1))}
      </div>
    </div>
  );
} 