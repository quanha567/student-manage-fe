import { Dayjs } from 'dayjs'

import { Badge, Calendar, CalendarProps, Card, Table, Tabs } from 'antd'
import { TableColumnType } from 'antd/lib'

import { ENROLLMENTS_STATUSES } from '@/constants'
import { useAppSelector } from '@/hooks'
import { EnrollmentModel } from '@/models'
import { selectCurrentUser } from '@/redux'

const columns: TableColumnType<EnrollmentModel>[] = [
    {
        title: 'STT',
        key: 'index',
        align: 'center',
        render: (_row, _record, index: number) => index + 1,
    },
    {
        title: 'Tên môn học',
        key: 'name',
        render: ({ section }: EnrollmentModel) => section?.course?.name,
    },
    {
        title: 'Số tín chỉ',
        key: 'credits',
        render: ({ section }: EnrollmentModel) => section?.course?.credits,
    },
    {
        key: 'status',
        title: 'Trạng thái',
        render: ({ status }: EnrollmentModel) =>
            status ? (
                <Badge
                    color={ENROLLMENTS_STATUSES[status].color}
                    text={ENROLLMENTS_STATUSES[status].label}
                />
            ) : (
                '---'
            ),
    },
    {
        title: 'Hành động',
        key: 'status',
        render: ({ status }: EnrollmentModel) => status,
    },
]

export const CourseRegisteredCard = () => {
    const user = useAppSelector(selectCurrentUser)
    console.log('CourseRegisteredCard  user:', user)

    const getListData = (value: Dayjs) => {
        const student = user.student

        if (
            !(
                Array.isArray(student?.enrollments) &&
                student.enrollments.length > 0
            )
        )
            return []

        let listData: { type: string; content: string }[] = [] // Specify the type of listData
        switch (value.day()) {
            case 1:
                const dayName = 'Monday'

                listData = student.enrollments
                    .flatMap((enrollment) => enrollment.section)
                    .filter((section) =>
                        section?.schedules?.some(
                            (schedule) => schedule.day === dayName,
                        ),
                    )
                    .map((schedule) => ({
                        type: 'success',
                        content: schedule?.course?.name ?? '',
                    }))

                break

            default:
        }
        return listData
    }

    const getMonthData = (value: Dayjs) => {
        if (value.month() === 8) {
            return 1394
        }
    }

    const monthCellRender = (value: Dayjs) => {
        const num = getMonthData(value)
        return num ? (
            <div className="notes-month">
                <section>{num}</section>
                <span>Backlog number</span>
            </div>
        ) : null
    }

    const dateCellRender = (value: Dayjs) => {
        const listData = getListData(value)
        return (
            <ul className="list-disc">
                {listData.map((item) => (
                    <li key={item.content}>- {item.content}</li>
                ))}
            </ul>
        )
    }

    const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
        if (info.type === 'date') return dateCellRender(current)
        if (info.type === 'month') return monthCellRender(current)
        return info.originNode
    }

    return (
        <Card>
            <Tabs
                items={[
                    {
                        key: '1',
                        label: (
                            <p className="text-lg font-medium">
                                Môn học đã đăng ký
                            </p>
                        ),
                        children: (
                            <Table
                                key="id"
                                bordered
                                size="small"
                                className="mt-4"
                                columns={columns}
                                dataSource={user.student?.enrollments}
                                pagination={false}
                                footer={() => <div>Tổng số tín chỉ: {10}</div>}
                            />
                        ),
                    },
                    {
                        key: '2',
                        label: <p className="text-lg font-medium">Lịch học</p>,
                        children: <Calendar cellRender={cellRender} />,
                    },
                ]}
            />
        </Card>
    )
}
