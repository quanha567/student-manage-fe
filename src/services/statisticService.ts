import { API_URL } from '@/constants'
import { SummaryReportResponse } from '@/models'

import { axiosService } from './axiosService'

export const statisticService = {
    summaryReport: (): Promise<SummaryReportResponse> => {
        return axiosService()<SummaryReportResponse>({
            method: 'GET',
            url: API_URL.SUMMARY_REPORT,
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
}
