type PageInfo = {
    page: number,
    total: number,
    perPage: number
}

export default class PaginatedResponse<T> {
    page: number
    total: number
    data: T

    static PER_PAGE_DEFAULT = 10
    perPage: number = PaginatedResponse.PER_PAGE_DEFAULT

    static fromData<T>(data: T, count: number, page: number): PaginatedResponse<T> {
        const response = new PaginatedResponse<T>();
        response.page = page;
        response.total = count;
        response.data = data;
        return response;
    }

    toJson(): object {
        return {
            data: this.data,
            page: this.page,
            total: this.total
        }
    }
}