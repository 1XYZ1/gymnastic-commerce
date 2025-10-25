import { gymApi } from "@/api/gymApi";
import type { AuthResponse } from "../interfaces/auth.response";

export const loginAction = async (
  email: string,
  password: string
): Promise<AuthResponse> => {
  try {
    const { data } = await gymApi.post<AuthResponse>("/auth/login", {
      email,
      password,
    });

    // console.log(data);

    return data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
