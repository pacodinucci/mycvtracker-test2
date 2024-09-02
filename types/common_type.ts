export type Paginable<T> = {
  totalElements: number;
  totalPages: number;
  items: T[];
  currentPage: number;
};
