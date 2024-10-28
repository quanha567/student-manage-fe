import { useState } from 'react'

import { DeleteFilled } from '@ant-design/icons'
import { useMutation } from '@tanstack/react-query'
import { Dayjs } from 'dayjs'
import { FaQuestion } from 'react-icons/fa6'

import {
    App,
    Button,
    CalendarProps,
    Card,
    Modal,
    Radio,
    Table,
    Tabs,
    Tooltip,
} from 'antd'
import { TableColumnType } from 'antd/lib'

import { useAppDispatch, useAppSelector } from '@/hooks'
import { EnrollmentModel, EnrollmentStatus } from '@/models'
import { getUserInfo, selectCurrentUser } from '@/redux'
import { enrollmentService } from '@/services'

export const CourseRegisteredCard = () => {
    const user = useAppSelector(selectCurrentUser)

    const { notification } = App.useApp()
    const dispatch = useAppDispatch()

    const [isConfirmDelete, setIsConfirmDelete] = useState<boolean>(false)
    const [enrollmentId, setEnrollmentId] = useState<number>()

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

    const toggleConfirmDelete = () => setIsConfirmDelete(!isConfirmDelete)

    const cellRender: CalendarProps<Dayjs>['cellRender'] = (current, info) => {
        if (info.type === 'date') return dateCellRender(current)
        if (info.type === 'month') return monthCellRender(current)
        return info.originNode
    }

    const handleCancelEnrollment = async () => {
        if (!enrollmentId) return

        try {
            await enrollmentService.delete(enrollmentId)
            await dispatch(getUserInfo())
        } catch (err) {
            console.log('handleCancelEnrollment  err:', err)
            notification.error({
                message: 'Có lỗi xảy ra vui lòng thử lại sau!',
            })
        } finally {
            setEnrollmentId(0)
            toggleConfirmDelete()
        }
    }

    const { mutate: deleteEnrollment, isPending: isDeletingEnrollment } =
        useMutation({
            mutationKey: ['DELETE_ENROLLMENT'],
            mutationFn: handleCancelEnrollment,
        })

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
            title: 'Hành động',
            key: 'status',
            align: 'center',
            render: ({ status, id }: EnrollmentModel) =>
                status === EnrollmentStatus.REGISTERED ? (
                    <Tooltip title="Hủy đăng ký học phần này" color="red">
                        <Radio.Button
                            value={2}
                            onClick={() => {
                                setEnrollmentId(id)
                                toggleConfirmDelete()
                            }}
                            className="text-red-500 hover:text-red-500"
                        >
                            <DeleteFilled />
                        </Radio.Button>
                    </Tooltip>
                ) : (
                    <></>
                ),
        },
    ]

    return (
        <>
            <Card>
                <Tabs
                    items={[
                        {
                            key: '1',
                            label: (
                                <p className="text-lg font-medium">
                                    Môn học đã đăng ký học kỳ này
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
                                    footer={() => (
                                        <div>
                                            Tổng số tín chỉ đã đăng ký học kỳ
                                            này:{' '}
                                            {user.student?.enrollments?.reduce(
                                                (prevTotal, enrollment) =>
                                                    prevTotal +
                                                    (enrollment.section?.course
                                                        ?.credits ?? 0),
                                                0,
                                            ) ?? 0}
                                        </div>
                                    )}
                                />
                            ),
                        },
                    ]}
                />
            </Card>
            <Modal
                centered
                open={isConfirmDelete}
                onClose={toggleConfirmDelete}
                classNames={{
                    body: 'flex flex-col items-center',
                }}
                footer={false}
            >
                <div className="flex size-28 items-center justify-center rounded-full bg-orange-200">
                    <div className="flex size-20 items-center justify-center rounded-full bg-orange-500">
                        <FaQuestion className="text-4xl text-white" />
                    </div>
                </div>
                <p className="mt-2 text-xl font-bold">
                    Xác nhận hủy đăng ký môn học
                </p>
                <p className="mt-2 text-pretty text-center text-base">
                    Bạn có chắc muốn hủy đăng ký môn học này không?
                </p>
                <div className="mt-4 grid w-full grid-cols-2 gap-4 px-6">
                    <Button
                        size="large"
                        type="default"
                        onClick={() => {
                            setEnrollmentId(0)
                            toggleConfirmDelete()
                        }}
                        className="w-full hover:!border-transparent hover:!bg-zinc-500 hover:!text-white"
                    >
                        Hủy
                    </Button>
                    <Button
                        size="large"
                        loading={isDeletingEnrollment}
                        onClick={() => deleteEnrollment()}
                        className="w-full bg-orange-500 text-white"
                    >
                        Đồng ý
                    </Button>
                </div>
            </Modal>
        </>
    )
}
