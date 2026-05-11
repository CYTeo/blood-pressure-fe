

import { httpExternalRequest } from "@/utils/apiHelper/httpExternalRequest";

import { ENDPOINT } from "../api-endpoints";

export const serverLogout = async () => {
    const res = await httpExternalRequest({
        endpoint: ENDPOINT.logout,
        httpMethod: "POST",
        contentType: "application/json",
        retry: false,
    });
    return res.json();
}