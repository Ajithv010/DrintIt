import api from "./api";

export const getProducts = async (params = {}) => {
    const response = await api.get("/products", {
        params: {
            keyword: params.keyword,
            categoryId: params.categoryId,
            minPrice: params.minPrice,
            maxPrice: params.maxPrice,
            inStock: params.inStock,
            page: params.page ?? 0,
            size: params.size ?? 10,
            sortBy: params.sortBy ?? "name",
            direction: params.direction ?? "asc",
        },
    });

    return response.data;
};