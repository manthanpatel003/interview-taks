"use client";
import {
  ApiCallParams,
  ErrorResponse,
  ErrResponse,
} from "@/types/useAxiosTypes";
import axios, { AxiosError } from "axios";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useCallback } from "react";
import { toast } from "sonner";

const useAxios = () => {
  const router = useRouter();

  const callApi = useCallback(
    async ({ headers, ...rest }: ApiCallParams): Promise<unknown> => {
      try {
        const authToken = Cookies.get("token");

        const response = await axios({
          headers: {
            "Content-Type": "application/json",
            ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
            ...headers,
            maxContentLength: Infinity,
            maxBodyLength: Infinity,
          },
          ...rest,
          validateStatus: (status) => status >= 200 && status <= 299,
        });

        return response?.data;
      } catch (err) {
        const axiosError = err as AxiosError;

        if (axiosError.isAxiosError) {
          if (axiosError.code === "ERR_NETWORK") {
            Cookies.remove("token");
            localStorage.clear();
            router.push("/");
            toast.error(
              "Server is under maintenance mode. Please try again later."
            );
            return;
          } else if (axiosError?.response?.status === 401) {
            localStorage.clear();
            Cookies.remove("token");
            setTimeout(() => {
              router.push("/");
            }, 4);

            const errorResponse = axiosError.response?.data as ErrorResponse;
            toast.error(errorResponse.message || "Unauthorized");
            return;
          } else if (axiosError.response?.status === 503) {
            router.replace("/404");
            toast.error("Service unavailable");
          }
        }

        throw (
          (axiosError?.response as ErrResponse)?.data?.message ??
          (axiosError?.response as ErrResponse)?.message ??
          "Something went wrong"
        );
      }
    },
    [router]
  );

  return callApi;
};

export default useAxios;
