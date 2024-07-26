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
    attributes?: T
    id?: number
}

export interface SingleMetaData<T> {
    data?: Data<T>
    meta?: PaginationMeta
}
export interface SingleData<T> {
    data?: Data<T>
}

export interface ListData<T> {
    data?: Data<T>[]
}

export type ListResponse<T> = Pagination & ListData<T>

export interface CreateResponse<T> {
    data?: T
}

export interface CreateRequest<T> {
    data?: T
}
