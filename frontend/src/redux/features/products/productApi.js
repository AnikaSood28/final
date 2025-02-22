import axiosInstance from "../../../axiosinterceptor/axiosInstance";

export const fetchProductsApi = async ({ source, gender, page = 1, limit = 10 }) => {
  let endpoint = `/api/products?page=${page}&limit=${limit}`;

  if (source && gender) {
    endpoint = `/api/products/source/gender/${source}/${gender}?page=${page}&limit=${limit}`;
  } else if (source) {
    endpoint = `/api/products/source/${source}?page=${page}&limit=${limit}`;
  } else if (gender) {
    endpoint = `/api/products/gender/${gender}?page=${page}&limit=${limit}`;
  }

  const response = await axiosInstance.get(endpoint);
  return {
    products: response.data.products,
    page,
    hasMore: response.data.hasMore,
  };
};
