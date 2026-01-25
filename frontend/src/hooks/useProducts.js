import { useQuery } from "@tanstack/react-query";
import useApi from "./useApi";

export default function useProducts(
  search = "",
  category = "",
  minPrice = "",
  maxPrice = "",
) {
  const { api } = useApi();

  const fetchProducts = async () => {
    const params = {};
    if (search) params.search = search;
    if (category) params.category = category;
    if (minPrice !== "") params.minPrice = minPrice;
    if (maxPrice !== "") params.maxPrice = maxPrice;

    const response = await api.get("/products", { params });
    return response.data;
  };

  const {
    data: products = [],
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["products", search, category, minPrice, maxPrice],
    queryFn: fetchProducts,
  });

  return { products, loading, error: error?.message || null, refetch };
}
