// src\types\index.ts

export type UserWithoutPassword = {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
  role: string;
  createdAt: Date;
  updatedAt: Date;
};

export type UserWithPassword = UserWithoutPassword & {
  password: string;
};

export type PaginatedResult<T = any> = {
  data: T[];
  meta: {
    total: number;
    page: number;
    per_page: number;
    last_page: number;
  };
};

export type UserPaginatedResult = PaginatedResult<Partial<UserWithoutPassword>>;
