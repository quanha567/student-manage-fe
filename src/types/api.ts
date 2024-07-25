export type SearchParams = Record<string, unknown> & {
    pageSize?: number
    page?: number
    sort?: 'asc' | 'desc'
    populate?: string
}

export interface Pagination {
    meta?: PaginationMeta
}

interface PaginationMeta {
    pagination?: {
        page?: number
        'pagination[pageSize]'?: number
        'pagination[page]'?: number
        pageCount?: number
        total?: number
    }
}

export interface Data<T> {
    attributes: T
    id: number
}

export interface SingleData<T> {
    data?: Data<T>
    meta?: PaginationMeta
}

export type ListResponse<T> = Pagination & {
    data: Data<T>[]
}

export interface CreateResponse<T> {
    data: T
}

export interface CreateRequest<T> {
    data?: T
}
