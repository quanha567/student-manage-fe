import { API_URL } from '@/constants'
import { ChartReportResponse, SummaryReportResponse } from '@/models'

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
    genderReport: (): Promise<ChartReportResponse> => {
        return axiosService()<ChartReportResponse>({
            method: 'GET',
            url: API_URL.GENDER_REPORT,
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
    numberStudentReport: (): Promise<ChartReportResponse> => {
        return axiosService()<ChartReportResponse>({
            method: 'GET',
            url: API_URL.NUMBER_STUDENT_REPORT,
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            })
    },
}
