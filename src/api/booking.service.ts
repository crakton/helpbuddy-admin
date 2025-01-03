import { headers } from "@/constants/http_config";
import {
	setBookings,
	setRecentBookings,
} from "@/redux/features/app/booking_slice";
import { setLoading } from "@/redux/features/app/loading_slice";
import { setTotalPages } from "@/redux/features/app/util_slice";
import { TStore, store } from "@/redux/store";
import { TErrorResponse, TSuccessResponse } from "@/types/auth.types";
import { T_Bookings } from "@/types/bookings";
import { T_loading_provider } from "@/types/loader.types";
import { handleAuthErrors } from "@/utils/auth.util";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

export default class Booking {
	private store: TStore;

	constructor() {
		this.store = store;
	}
}
