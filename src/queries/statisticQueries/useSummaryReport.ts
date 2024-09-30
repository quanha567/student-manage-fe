import { useQuery } from '@tanstack/react-query'

import { QUERY_KEYS } from '@/constants'
import { SummaryReportResponse } from '@/models/statisticModel'
import { statisticService } from '@/services'

export const useSummaryReport = () => {
    return useQuery<SummaryReportResponse, Error, SummaryReportResponse>({
        queryKey: [QUERY_KEYS.SUMMARY_REPORT],
        queryFn: statisticService.summaryReport,
    })
}
