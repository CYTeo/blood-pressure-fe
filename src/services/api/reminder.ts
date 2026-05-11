import { sprintf } from "sprintf-js";

import { ENDPOINT } from "../api-endpoints";
import http from "../http";

export const listReminder = async (params?: any) => {
    const res = await http.get(ENDPOINT.listReminder, { params });
    return res?.data;
};

export const createReminder = async (params: any) => {
    const res = await http.post(ENDPOINT.createReminder, params);
    return res?.data;
};

export const getReminder = async (id: string | number) => {
    const res = await http.get(sprintf(ENDPOINT.getReminder, id));
    return res?.data;
};

export const updateReminder = async (id: string | number, params: any) => {
    const res = await http.put(sprintf(ENDPOINT.updateReminder, id), params);
    return res?.data;
};

export const deleteReminder = async (id: string | number) => {
    const res = await http.delete(sprintf(ENDPOINT.deleteReminder, id));
    return res?.data;
};
