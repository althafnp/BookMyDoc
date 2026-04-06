import { injectable } from "inversify";
import { Category } from "../../../../domain/entities/Category";
import { CategoryFindAllOptions, CategoryFindAllResult, ICategoryRepository } from "../../../../domain/repositories/ICategoryRepository";
import { CategoryMapper } from "../mappers/CategoryMapper";
import { CategoryModel } from "../models/category.schema";

@injectable()
export class MongoCategoryRepository implements ICategoryRepository {
    async create(category: Category): Promise<Category> {
        const persistence = CategoryMapper.toPersistence(category);

        const doc = await CategoryModel.create(persistence);

        return CategoryMapper.toDomain(doc);
    }

    async findById(id: string): Promise<Category | null> {
        const doc = await CategoryModel.findById(id);
        return doc ? CategoryMapper.toDomain(doc) : null;
    }

    async findByName(name: string): Promise<Category | null> {
        const doc = await CategoryModel.findOne({ name });
        return doc ? CategoryMapper.toDomain(doc) : null;
    }

    async update(category: Category): Promise<Category | null> {
        const persistence = CategoryMapper.toPersistence(category);

        const doc = await CategoryModel.findByIdAndUpdate(
            category.id,
            persistence,
            { returnDocument: 'after' }
        );

        return doc ? CategoryMapper.toDomain(doc) : null;
    }

    async findAll(options: CategoryFindAllOptions): Promise<CategoryFindAllResult> {
        const { page, limit, sortBy, sortOrder, search, status } = options;

        const filter: Record<string, unknown> = {};

        if(status) {
            filter.status = status;
        }

        if(search) {
            filter.name = { $regex: search, $options: "i" };
        }

        const skip = (page - 1) * limit;
        const sortDirection = sortOrder === "asc" ? 1 : -1;

        const [docs, total] = await Promise.all([
            CategoryModel.find(filter)
                .sort({ [sortBy]: sortDirection })
                .skip(skip)
                .limit(limit),
            CategoryModel.countDocuments(filter),
        ]);

        const categories = docs.map(CategoryMapper.toDomain);

        return { categories, total };
    }
}