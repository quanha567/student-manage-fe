import moment from 'moment'

import { DATE_TIME_FORMAT } from '@/constants'

export const formatDateTime = (
    dateTime?: string,
    format: DATE_TIME_FORMAT = DATE_TIME_FORMAT.FULL_DATE_TIME,
) => moment(dateTime).format(format)
