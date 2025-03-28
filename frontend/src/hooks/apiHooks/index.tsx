"use client";
import {
  IApiResponse,
  ILoginPayload,
  IRegisterPayload,
} from "@/types/userTypes";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { userRoutes } from "./route";
import useAxios from "./useAxios";

const handleSuccess = (response: IApiResponse) => {
  if (response?.message) {
    toast.success(response.message);
  }
  return response;
};

const handleError = (error: string) => {
  toast.error(error || "Something went wrong");
};

export const useRegister = (userType: string) => {
  const callApi = useAxios();
  return useMutation({
    mutationFn: async (data: IRegisterPayload): Promise<IApiResponse> =>
      callApi({
        method: userRoutes.register.method,
        url: userRoutes.register.url.replace(":userType", userType),
        data,
      }) as Promise<IApiResponse>,
    onError: handleError,
    onSuccess: handleSuccess,
  });
};

export const useLogin = () => {
  const callApi = useAxios();
  type LoginResponse = IApiResponse & {
    token: string;
  };
  return useMutation({
    mutationFn: async (data: ILoginPayload): Promise<LoginResponse> =>
      callApi({
        method: userRoutes.login.method,
        url: userRoutes.login.url,
        data,
      }) as Promise<LoginResponse>,
    onError: handleError,
    onSuccess: handleSuccess,
  });
};

export const useVerifyUser = (token: string) => {
  const callApi = useAxios();
  return useMutation({
    mutationFn: async (): Promise<{ message: string }> =>
      callApi({
        method: userRoutes.verifyUser.method,
        url: userRoutes.verifyUser.url.replace(":token", token),
      }) as Promise<{ message: string }>,
    onError: handleError,
    onSuccess: (res) => {
      if (res?.message) {
        toast.success(res.message);
      }
    },
  });
};
