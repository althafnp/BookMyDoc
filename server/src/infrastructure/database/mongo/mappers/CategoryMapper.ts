import { Category } from "../../../../domain/entities/Category";
import { ICategory } from "../models/category.schema";
import { BaseMapper } from "./BaseMapper";

export class CategoryMapper extends BaseMapper<Category, ICategory> {

    static toDomain(raw: ICategory): Category {
        return new Category(
            BaseMapper.toStringId(raw._id),
            raw.name,
            raw.status
        )
    };

    static toPersistence(domain: Category): Partial<ICategory> {
        return {
            name: domain.name,
            status: domain.status
        }
    };
}