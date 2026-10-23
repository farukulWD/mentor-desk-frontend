import type { AuthResponse, User } from "@/types";
import type { LoginValues, SignupValues } from "@/lib/validations/auth";

import { baseApi } from "./baseApi";
import { tagTypes } from "./tagTypes";

export const authApi = baseApi.injectEndpoints({
  endpoints: (build) => ({
    getMe: build.query<User, void>({
      query: () => ({ url: "/auth/me" }),
      providesTags: [tagTypes.me],
    }),
    login: build.mutation<AuthResponse, LoginValues>({
      query: (data) => ({ url: "/auth/login", method: "POST", data }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(authApi.util.upsertQueryData("getMe", undefined, data.user));
        } catch {}
      },
    }),
    signup: build.mutation<AuthResponse, SignupValues>({
      query: ({ name, email, password }) => ({
        url: "/auth/signup",
        method: "POST",
        data: { name, email, password },
      }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(authApi.util.upsertQueryData("getMe", undefined, data.user));
        } catch {}
      },
    }),
    logout: build.mutation<null, void>({
      query: () => ({ url: "/auth/logout", method: "POST" }),
      async onQueryStarted(_args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch {
        } finally {
          dispatch(baseApi.util.resetApiState());
        }
      },
    }),
  }),
});

export const {
  useGetMeQuery,
  useLoginMutation,
  useSignupMutation,
  useLogoutMutation,
} = authApi;
