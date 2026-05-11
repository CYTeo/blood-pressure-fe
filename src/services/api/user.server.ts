import { cache } from "react";

import { httpExternalRequest } from "@/utils/apiHelper/httpExternalRequest";

import { ENDPOINT } from "../api-endpoints";

export const serverGetUsers = async (params?: any) => {
    const usersData = await httpExternalRequest({
        endpoint: `${process.env.API_BASE_URL}${ENDPOINT.getUsers}`,
        httpMethod: "POST",
        contentType: "application/json",
        stringifyBody: JSON.stringify({
            ...params
        }),
        baseUrl: process.env.API_BASE_URL,
        retry: false,
    });
    return usersData;
};

export const serverGetProfile = cache(async () => {
    const profileData = await httpExternalRequest({
        endpoint: `${process.env.API_BASE_URL}${ENDPOINT.getProfile}`,
        httpMethod: "GET",
        contentType: "application/json",
        baseUrl: process.env.API_BASE_URL,
        retry: false,
    });
    return profileData.json();
});