import axiosInstance from "../../../axiosinterceptor/axiosInstance";

export const fetchProductsApi = async ({
  source,
  gender,
  category,
  sale = false,
  page = 1,
  limit = 10,
}) => {
  let endpoint = `/api/products?page=${page}&limit=${limit}`;

  if (sale && gender && category) {
    // Use the sale-price filtering endpoint
    endpoint = `/api/products/sales/gender/category/${gender}/${category}?page=${page}&limit=${limit}`;
  } else if (source && category) {
    // Use the endpoint filtering by source and category
    endpoint = `/api/products/source/category/${source}/${category}?page=${page}&limit=${limit}`;
  } else if (gender && category) {
    // Use the endpoint filtering by gender and category
    endpoint = `/api/products/gender/category/${gender}/${category}?page=${page}&limit=${limit}`;
  } else if (source && gender) {
    // Use the endpoint filtering by source and gender
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
