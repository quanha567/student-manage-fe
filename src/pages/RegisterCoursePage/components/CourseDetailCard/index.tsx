import { useCallback, useState } from 'react'

import moment from 'moment'

import { App, Button, Card, Empty, Table } from 'antd'
import { ColumnType } from 'antd/es/table'

import { globalLoading } from '@/components'
import { DATE_TIME_FORMAT } from '@/constants'
import { useAppDispatch, useAppSelector } from '@/hooks'
import { CourseModel, EnrollmentStatus, SectionModel } from '@/models'
import { getUserInfo, selectCurrentUser } from '@/redux'
import { enrollmentService } from '@/services'
import { Data } from '@/types'
import { formatDateTime } from '@/utils'

type CourseDetailCardProps = CourseModel

const sectionColumns: ColumnType<Data<SectionModel>>[] = [
    {
        title: 'Mã lớp học phần',
        key: 'code',
        dataIndex: 'attributes',
        render: ({ code }: SectionModel) => code,
    },
    {
        title: 'Lịch học',
        key: 'code',
        dataIndex: 'attributes',
        render: ({ schedules }: SectionModel) => (
            <div className="space-y-2 divide-y-[1px] divide-zinc-100 text-sm">
                {schedules?.map(({ id, day, endTime, room, startTime }) => (
                    <div key={id}>
                        <p>Phòng: {room}</p>
                        <div className="flex gap-2">
                            Thời gian: {day}, từ{' '}
                            {formatDateTime(
                                moment(startTime, DATE_TIME_FORMAT.TIME_ONLY),
                                DATE_TIME_FORMAT.HOUR_AND_MINUTE,
                            )}{' '}
                            đến{' '}
                            {formatDateTime(
                                moment(endTime, DATE_TIME_FORMAT.TIME_ONLY),
                                DATE_TIME_FORMAT.HOUR_AND_MINUTE,
                            )}
                        </div>
                    </div>
                ))}
            </div>
        ),
    },
]

export const CourseDetailCard = ({
    name,
    code,
    credits,
    sections,
}: CourseDetailCardProps) => {
    const user = useAppSelector(selectCurrentUser)

    const dispatch = useAppDispatch()

    const [sectionSelected, setSectionSelected] = useState<number>()

    const { notification } = App.useApp()

    const handleRegisterCourseSection = useCallback(async () => {
        if (!sectionSelected) return
        try {
            globalLoading.current?.show()
            await enrollmentService.create({
                data: {
                    section: sectionSelected,
                    student: Number(user.student?.id),
                    status: EnrollmentStatus.REGISTERED,
                },
            })
            await dispatch(getUserInfo())
            notification.success({
                message: `Đăng ký môn học ${name ?? ''} thành công!`,
            })
        } catch (err) {
            console.log('handleRegisterCourseSection  err:', err)
            notification.error({
                message: 'Có lỗi xảy ra vui lòng thử lại sau!',
            })
        } finally {
            globalLoading.current?.close()
        }
    }, [dispatch, name, notification, sectionSelected, user.student?.id])

    return (
        <Card
            classNames={{
                body: 'text-sm',
            }}
        >
            <p className="text-lg font-bold">Thông tin học phần</p>
            <div className="mt-4 space-y-2">
                <div>
                    <span className="font-bold">Mã học phần:</span> {code}
                </div>
                <div>
                    <span className="font-bold">Tên học phần:</span> {name}
                </div>
                <div>
                    <span className="font-bold">Số tín chỉ:</span> {credits}
                </div>
                <div>
                    <p className="mb-1 font-bold">Lớp học chờ đăng ký</p>
                    <Table
                        bordered
                        size="small"
                        rowKey="id"
                        columns={sectionColumns}
                        dataSource={sections?.data}
                        pagination={false}
                        rowSelection={{
                            type: 'radio',
                            onChange: (ids) =>
                                setSectionSelected(Number(ids[0])),
                            selectedRowKeys: sectionSelected
                                ? [sectionSelected]
                                : [],
                        }}
                        onRow={(record: SectionModel) => ({
                            onClick: () =>
                                record.id && setSectionSelected(record.id),
                        })}
                        locale={{
                            emptyText: (
                                <Empty description="Chọn một môn học để xem danh sách lớp đăng ký" />
                            ),
                        }}
                    />
                </div>
                <Button
                    type="primary"
                    disabled={!sectionSelected}
                    onClick={handleRegisterCourseSection}
                >
                    Đăng ký
                </Button>
            </div>
        </Card>
    )
}
