import { sprintf } from "sprintf-js";

import { ENDPOINT } from "../api-endpoints";
import http from "../http";

export const getBPList = async (params: { page: number; limit: number; search?: string }) => {
    const res = await http.post(ENDPOINT.listBP, params);
    return res?.data;
};

export const createBP = async (params: any) => {
    const res = await http.post(ENDPOINT.createBP, params);
    return res?.data;
};

export const getBP = async (id: number) => {
    const res = await http.get(sprintf(ENDPOINT.getBP, id));
    return res?.data;
};

export const updateBP = async (id: number, params: any) => {
    const res = await http.put(sprintf(ENDPOINT.updateBP, id), params);
    return res?.data;
};