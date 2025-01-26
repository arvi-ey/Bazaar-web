// import { URL } from "@/config";
import { createAsyncThunk, createSlice, isRejectedWithValue } from "@reduxjs/toolkit";
import axios from "axios";
import { RemoveFromCart } from "./cartSlicer";
import { URL } from "../../config"


export interface OrderData {
    productId: string;
    userId: string;
    totalPrice: number;
    quantity: number;
    deliveryTime: number;
    size: string;
    image: string;
    productTitle: string;
    paymentMode: string;
    paymentStatus: 'PAID' | 'PENDING' | 'REFUNDED';
    orderStatus: 'PLACED' | 'SHIPPED' | 'OUT' | 'DELIVERED' | 'CANCELLED' | 'RETURNED';
    _id?: any
}


export interface UpdateData {
    _id: string,
    paymentStatus?: string,
    orderStatus?: string
}

export const PlaceOrder = createAsyncThunk(
    'order/placeorder', async (data: OrderData) => {
        try {
            const response = await axios.post(URL + `order/placeorder`, data)
            // console.log(response.data)
            if (response.data && response.data.order === true) return response.data.data
        }
        catch (error: any) {
            console.log(error.response.data)
            return error.response.data
        }
    }
)


export const GetUserOrder = createAsyncThunk(
    'order/getuserorder', async (id: string) => {
        try {
            const response = await axios.get(URL + `order/getorder/${id}`)
            if (response.data && response.data.success === true) return response.data.data
        }
        catch (error: any) {
            return error.response.data
        }
    }
)

export const GetAllOrders = createAsyncThunk(
    'order/getallorder', async () => {
        try {
            const response = await axios.get(URL + `order/gettallorder`)
            if (response.data && response.data.success === true) return response.data.data
        }
        catch (error: any) {
            console.log(error.response)
            return error.response.data
        }
    }
)

export const UpdateOrder = createAsyncThunk(
    "order/updateorder", async (data: UpdateData) => {
        const requestbody = {
            paymentStatus: data.paymentStatus,
            orderStatus: data.orderStatus
        }
        console.log(data)
        try {
            const response = await axios.patch(URL + `order/updateorder/${data._id}`, requestbody)
            if (response.data && response.data.success === true) return response.data.data
        }
        catch (error: any) {
            return error.response.data
        }
    }
)

export const orderSlice = createSlice({
    name: "order",
    initialState: {
        orderItems: [] as OrderData[],
        loading: false,
        error: null
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(PlaceOrder.pending, (state, action) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(PlaceOrder.fulfilled, (state, action) => {
                state.loading = false,
                    // console.log(action.payload)
                    state.orderItems = [...state.orderItems, action.payload]
            })
            .addCase(PlaceOrder.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload as any
            })
            .addCase(GetUserOrder.pending, (state, action) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(GetUserOrder.fulfilled, (state, action) => {
                state.loading = false
                state.orderItems = action.payload
            })
            .addCase(GetUserOrder.rejected, (state, action) => {
                state.loading = false,
                    state.error = action.payload as any
            })
            .addCase(GetAllOrders.pending, (state, action) => {
                state.loading = true,
                    state.error = null
            })
            .addCase(GetAllOrders.fulfilled, (state, action) => {
                state.loading = false,
                    state.orderItems = action.payload
            })
            .addCase(GetAllOrders.rejected, (state, action) => {
                state.loading = false
                state.error = action.payload as any
            })
            .addCase(UpdateOrder.pending, (state, action) => {
                state.loading = true,
                    state.error = null

            })
            .addCase(UpdateOrder.fulfilled, (state, action) => {
                state.loading = false;
                const updatedOrder = action.payload;
                state.orderItems = state.orderItems.map((order) =>
                    order._id === updatedOrder._id ? { ...order, ...updatedOrder } : order
                );
            })


    }
})

export const orderReducer = orderSlice.reducer