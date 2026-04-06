export interface PaginationRequestDTO {
    page: number;
    limit: number;
}

export interface PaginationMetaDTO {
    total: number;
    page: number;
    limit: number;
    totalPages: number
}

export interface PaginatedResponseDTO<T> {
    items: T[];
    meta: PaginationMetaDTO;
}