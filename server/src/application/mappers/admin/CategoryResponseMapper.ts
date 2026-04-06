import { Category } from "../../../domain/entities/Category";
import { CategoryItemDTO } from "../../dtos/admin/category.dto";

export class CategoryResponseMapper {
    static toDTO(category: Category): CategoryItemDTO {
        return {
            id: category.id,
            name: category.name,
            status: category.status
        };
    }
}