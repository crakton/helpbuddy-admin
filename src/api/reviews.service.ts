import { headers } from "@/constants/http_config";
import { setLoading } from "@/redux/features/app/loading_slice";
import { setReviews } from "@/redux/features/app/review_slice";
import { TStore, store } from "@/redux/store";
import { TErrorResponse, TSuccessResponse } from "@/types/auth.types";
import { T_Service_Review } from "@/types/review";
import { handleAuthErrors } from "@/utils/auth.util";
import axios, { AxiosError } from "axios";
import { toast } from "react-toastify";

export default class Reviews {
  private store: TStore;

  constructor() {
    this.store = store;
  }

  async getReviews() {
    try {
    } catch (error) {
      handleAuthErrors(error as AxiosError<TErrorResponse>);
    } finally {
      store.dispatch(setLoading(false));
    }
  }
}
