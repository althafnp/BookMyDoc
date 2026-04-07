import { Status } from "../../../domain/enums/Auth";
import { PaginatedResponseDTO, PaginationRequestDTO } from "../shared/pagination.dto";

export interface GetAllUsersRequestDTO extends PaginationRequestDTO {
    sortBy: "name" | "createdAt";
    sortOrder: "asc" | "desc";
    status?: Status;
    search?: string
}

export interface UserItemDTO {
    id: string;
    name: string;
    email: string;
    status: Status
}

export type GetAllUsersResponseDTO = PaginatedResponseDTO<UserItemDTO>;


export interface ToggleUserStatusRequestDTO {
    id: string;
}
export interface ToggleUserStatusResponseDTO {
    id: string;
    name: string;
    email: string;
    status: Status;
}