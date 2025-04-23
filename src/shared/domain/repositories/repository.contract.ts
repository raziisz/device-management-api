import { Entity } from '../entities/entity';
export interface RepositoryInterface<E extends Entity> {
  insert(entity: E): Promise<void | number>;
  findById(id: number): Promise<E>;
  delete(id: number): Promise<void>;
}
