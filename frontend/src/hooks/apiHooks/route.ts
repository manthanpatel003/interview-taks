import { BASE_URL } from "@/utils/config";

export const userRoutes = {
  register: {
    url: `${BASE_URL}/user/:userType/register`,
    method: "POST",
  },
  login: {
    url: `${BASE_URL}/user/login`,
    method: "POST",
  },
  verifyUser: {
    url: `${BASE_URL}/user/verify-user/:token`,
    method: "PATCH",
  },
};
