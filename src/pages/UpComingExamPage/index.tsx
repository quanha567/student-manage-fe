import { useQuery } from '@tanstack/react-query'

import { Table } from 'antd'

import { Breadcrumb } from '@/components'
import { DATE_TIME_FORMAT, QUERY_KEYS } from '@/constants'
import { useAppSelector } from '@/hooks'
import { ExamType } from '@/models'
import { selectCurrentUser } from '@/redux'
import { examService } from '@/services'
import { formatDateTime } from '@/utils'

const UpComingExamPage = () => {
    const user = useAppSelector(selectCurrentUser)

    const { data, isLoading } = useQuery({
        queryKey: [QUERY_KEYS.UPCOMING_EXAMS],
        queryFn: () => examService.getUpcomingExams(String(user.student?.id)),
        enabled: !!user.student?.id,
    })

    const EXAM_NAMES: Record<ExamType, string> = {
        [ExamType.FIFTEEN_MINUTE]: '15 phút',
        [ExamType.FORTY_FIVE_MINUTE]: '45 phút',
        [ExamType.FINALS]: 'Kỳ thi',
        [ExamType.MID_TERM]: 'Giữa kỳ',
    }

    return (
        <>
            <Breadcrumb
                pageName="Bài kiểm tra sắp diễn ra"
                items={[{ title: 'Bài kiểm tra sắp diễn ra' }]}
            />
            <Table
                bordered
                loading={isLoading}
                dataSource={data?.exams}
                columns={[
                    {
                        title: 'Tên bài kiểm tra',
                        dataIndex: 'examName',
                        key: 'examName',
                    },
                    {
                        title: 'Thời gian bắt đầu',
                        dataIndex: 'examDate',
                        key: 'examDate',
                        render: (_, record) => (
                            <span>
                                {formatDateTime(
                                    record.examDate,
                                    DATE_TIME_FORMAT.SHORT_DATE_TIME,
                                )}
                            </span>
                        ),
                    },
                    {
                        title: 'Loại bài kiểm tra',
                        dataIndex: 'type',
                        key: 'type',
                        render: (_, record) =>
                            record.type && record.type in EXAM_NAMES ? (
                                <span>{EXAM_NAMES[record.type]}</span>
                            ) : (
                                ''
                            ),
                    },
                ]}
                pagination={false}
            />
        </>
    )
}

export default UpComingExamPage
