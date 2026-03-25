import { Category } from "../entities/Category";

export interface CategoryFindAllOptions {
    page: number;
    limit: number;
    sortBy: "name" | "createdAt";
    sortOrder: "asc" | "desc";
    status?: "ACTIVE" | "INACTIVE";
    search?: string;
};

export interface CategoryFindAllResult {
    categories: Category[];
    total: number;
}

export interface ICategoryRepository {
    create(category: Category): Promise<Category>;
    findById(id: string): Promise<Category | null>;
    findByName(name: string): Promise<Category | null>;
    update(category: Category): Promise<Category | null>;
    findAll(options: CategoryFindAllOptions): Promise<CategoryFindAllResult>;
}