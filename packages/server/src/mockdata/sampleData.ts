import { EntityType } from '@cinelinker/shared';   

export const startNodes: Map<string, {id: string, entityType: EntityType, title: string}[]> = new Map([
  ['2025-03-27', [{id: '192', entityType: EntityType.Actor, title: 'Morgan Freeman'}, {id: '1245', entityType: EntityType.Actor, title: 'Scarlett Johanson'}]],
  ['2025-03-28', [{id: '4491', entityType: EntityType.Actor, title: 'Jennifer Aniston'}, {id: '8691', entityType: EntityType.Actor, title: 'Zoe Saldana'}]],
  ['2025-03-29', [{id: '1253360', entityType: EntityType.Actor, title: 'Pedro Pascal'}, {id: '2888', entityType: EntityType.Actor, title: 'Will Smith'}]],
  ['2025-03-30', [{id: '70160', entityType: EntityType.Movie, title: 'Hunger Games'}, {id: '16535', entityType: EntityType.Movie, title: 'Titanic'}]],
  ['2025-03-31', [{id: '234352', entityType: EntityType.Actor, title: 'Margot Robbie'}, {id: '73457', entityType: EntityType.Actor, title: 'Chris Pratt'}]],
  ['2025-04-01', [{id: '1373737', entityType: EntityType.Actor, title: 'Florence Pugh'}, {id: '31', entityType: EntityType.Actor, title: 'Tom Hanks'}]],
  ['2025-04-02', [{id: '23659', entityType: EntityType.Actor, title: 'Will Ferell'}, {id: '24428', entityType: EntityType.Movie, title: 'The Avengers'}]],
]);