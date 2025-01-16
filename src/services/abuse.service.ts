import { headers } from "@/constants/http_config";
import { setAbuseReports } from "@/redux/features/app/abuseReport_slice";
import { setLoading } from "@/redux/features/app/loading_slice";
import { TStore, store } from "@/redux/store";
import { TErrorResponse, TSuccessResponse } from "@/types/auth.types";
import { handleAuthErrors } from "@/utils/auth.util";

export default class AbuseReports {
	private store: TStore;

	constructor() {
		this.store = store;
	}

	/**
	 * TODO
	 * 1. Create a functions that handle all abuse reports
	 */
}
