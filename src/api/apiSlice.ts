import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { urlConfig } from "../config/url.config";
import { RootState } from "../store/store";
import { logOut, setCredentials } from "../store/auth/authSlice";

const baseQuery = fetchBaseQuery({
    baseUrl: urlConfig.baseUrl,
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
        const token = (getState() as RootState).auth.token;
        if (token) {
            headers.set('Authorization', `Bearer ${token}`);
        } else {
            headers.set('Access-Control-Allow-Credentials', 'true');
        }
        return headers;
    }
})

const baseQueryWithReauth = async (args: any, api: any, extraOptions: any) => {
    let result = await baseQuery(args, api, extraOptions);

    //@ts-ignore
    if (result?.error?.originalStatus === 401) {
        const refreshResult = await baseQuery('/refresh-token', api, extraOptions);
        if (refreshResult?.data) {
            api.dispatch(setCredentials({
                ...(refreshResult.data as Object)
            }))
            result = await baseQuery(args, api, extraOptions);
        } else {
            if(api.auth.user) {
                api.dispatch(logOut());
            }
        }
    }
    return result;
}

export const apiSlice = createApi({
    reducerPath: 'api',
    baseQuery: baseQueryWithReauth,
    endpoints: builder => ({})
})