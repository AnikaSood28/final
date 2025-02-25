import axiosInstance from "../../../axiosinterceptor/axiosInstance";

export const fetchProductsApi = async ({
  source,
  gender,
  category,
  sale = false,
  page = 1,
  limit = 10,
  sort = "newest", // Default sort option
}) => {
  let endpoint = `/api/products?page=${page}&limit=${limit}&sort=${sort}`;

  if (sale && gender && category) {
    endpoint = `/api/products/sale/gender/category/${gender}/${category}?page=${page}&limit=${limit}&sort=${sort}`;
  }else if(sale &gender){
    endpoint = `/api/products/sale/gender/${gender}?page=${page}&limit=${limit}&sort=${sort}`;
  }
  else if(sale){
 endpoint = `/api/products/sale?page=${page}&limit=${limit}&sort=${sort}`;
  }
   else if (source && category) {
    endpoint = `/api/products/source/category/${source}/${category}?page=${page}&limit=${limit}&sort=${sort}`;
  } else if (gender && category) {
    endpoint = `/api/products/gender/category/${gender}/${category}?page=${page}&limit=${limit}&sort=${sort}`;
  } else if (source && gender) {
    endpoint = `/api/products/source/gender/${source}/${gender}?page=${page}&limit=${limit}&sort=${sort}`;
  } else if (source) {
    endpoint = `/api/products/source/${source}?page=${page}&limit=${limit}&sort=${sort}`;
  } else if (gender) {
    endpoint = `/api/products/gender/${gender}?page=${page}&limit=${limit}&sort=${sort}`;
  }
  

  const response = await axiosInstance.get(endpoint);
  return {
    products: response.data.products,
    page,
    hasMore: response.data.hasMore,
  };
};
