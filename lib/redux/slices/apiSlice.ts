import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Product, Order, User, Review, Category, Role } from '@/lib/types';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: '/api' }),
  tagTypes: ['Product', 'Order', 'User', 'Review', 'Category', 'Role'],
  endpoints: (builder) => ({
    // Products
    getProducts: builder.query<{ products: Product[], total: number } | Product[], void>({
      query: () => '/products',
      providesTags: ['Product'],
    }),
    getProduct: builder.query<Product, string>({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: 'Product', id }],
    }),
    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (body) => ({
        url: '/products',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Product'],
    }),
    updateProduct: builder.mutation<Product, { id: string; data: Partial<Product> }>({
      query: ({ id, data }) => ({
        url: `/products/${id}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Product', id }, 'Product'],
    }),
    deleteProduct: builder.mutation<void, string>({
      query: (id) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Product'],
    }),

    // Users
    getUsers: builder.query<User[], void>({
      query: () => '/users',
      providesTags: ['User'],
    }),
    getUser: builder.query<User, string>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'User', id }],
    }),
    deleteUser: builder.mutation<void, string>({
      query: (id) => ({
        url: `/users/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    // Orders
    getOrders: builder.query<Order[], void>({
      query: () => '/orders',
      providesTags: ['Order'],
    }),
    updateOrderStatus: builder.mutation<Order, { id: string; status: string }>({
      query: ({ id, status }) => ({
        url: `/orders/${id}`,
        method: 'PUT',
        body: { status },
      }),
      invalidatesTags: ['Order'],
    }),

    // Reviews
    getReviews: builder.query<Review[], void>({
      query: () => '/reviews',
      providesTags: ['Review'],
    }),
    deleteReview: builder.mutation<void, string>({
      query: (id) => ({
        url: `/reviews/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Review'],
    }),

    // Categories
    getCategories: builder.query<Category[], void>({
      query: () => '/categories',
      providesTags: ['Category'],
    }),

    // Roles
    getRoles: builder.query<Role[], void>({
      query: () => '/roles',
      providesTags: ['Role'],
    }),
  }),
});

export const {
  useGetProductsQuery,
  useGetProductQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetUsersQuery,
  useGetUserQuery,
  useDeleteUserMutation,
  useGetOrdersQuery,
  useUpdateOrderStatusMutation,
  useGetReviewsQuery,
  useDeleteReviewMutation,
  useGetCategoriesQuery,
  useGetRolesQuery,
} = apiSlice;
