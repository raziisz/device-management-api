import { Entity } from '../entities/entity';
export interface RepositoryInterface<E extends Entity> {
  insert(entity: E): Promise<void | number>;
  delete(id: number): Promise<void>;
}
