import { ENDPOINT } from "../api-endpoints";
import http from "../http";

export const getUsers = async (params?: any) => {
    const res = await http.post(ENDPOINT.getUsers, params);
    return res?.data;
};

export const updateProfile = async (params: any) => {
    const res = await http.put(ENDPOINT.updateProfile, params);
    return res?.data;
};