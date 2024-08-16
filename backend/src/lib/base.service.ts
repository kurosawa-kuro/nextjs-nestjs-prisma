// src/lib/base.service.ts

export interface BaseService<T> {
  create(attributes: any): Promise<T>;
  all(options?: any): Promise<T[]>;
  find(id: number): Promise<T | null>;
  findBy(attributes: any): Promise<T | null>;
  where(attributes: any): Promise<T[]>;
  update(id: number, attributes: any): Promise<T>;
  destroy(id: number): Promise<T>;
  count(options?: any): Promise<number>;
  first(options?: any): Promise<T | null>;
  last(options?: any): Promise<T | null>;
}
