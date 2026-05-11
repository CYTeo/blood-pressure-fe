import { ENDPOINT } from "../api-endpoints";
import http from "../http";

export const subscribeWebPush = async (params: { subscription: PushSubscription}) => {
    return await http.post(ENDPOINT.subscribeWebPush, params);
};