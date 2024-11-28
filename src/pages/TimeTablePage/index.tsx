import { Card, Empty, Select, Spin } from 'antd'

import React, { useEffect, useState } from 'react'

import { TimetableModel } from '../../models/timetableModel'

import { DATE_TIME_FORMAT, QUERY_KEYS } from '@/constants'
import { useAppSelector, useRole } from '@/hooks'
import { useSemesterOptions } from '@/queries'
import { selectCurrentUser } from '@/redux'
import { studentService, teacherService } from '@/services'
import { useQuery } from '@tanstack/react-query'

import moment from 'moment'
import './styles.css'

const TimeTablePage: React.FC = () => {
    const [semester, setSemester] = useState<string | null>(null)

    const user = useAppSelector(selectCurrentUser)

    const { isStudentRole } = useRole()

    const {
        isLoadingSemesterOptions,
        semesterOptions,
        loadMoreSemesterOptions,
        semesterSearchText,
        setSemesterSearchText,
    } = useSemesterOptions()

    const { data: timetableData, isLoading: isLoadingTimetableData } = useQuery(
        {
            queryKey: [QUERY_KEYS.MY_TIMETABLE, semester, user.student?.id],
            queryFn: () =>
                isStudentRole
                    ? studentService.getTimetable(
                          String(semester),
                          Number(user.student?.id),
                      )
                    : teacherService.getTimetable(
                          String(semester),
                          Number(user.teacher?.id),
                      ),
            enabled: !!semester && (!!user.student?.id || !!user.teacher?.id),
        },
    )

    const currentSemester = semesterOptions?.find(
        (option) => option.value === semester,
    )

    const weekDays = [
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
        'Sunday',
    ]

    const weekVietnameseDays = [
        'Thứ 2',
        'Thứ 3',
        'Thứ 4',
        'Thứ 5',
        'Thứ 6',
        'Thứ 7',
        'Chủ nhật',
    ]

    useEffect(() => {
        if (semesterOptions?.[0]) {
            setSemester(semesterOptions[0].value as string)
        }
    }, [semesterOptions])

    const renderClassSession = (session: TimetableModel[] | undefined) => {
        if (!session) return null

        return (
            <div className="flex flex-col items-start justify-start gap-2">
                {session.map((s, index) => (
                    <div
                        key={index}
                        className="w-full rounded-md border bg-zinc-50 p-2 text-base"
                    >
                        <p className="font-bold">{s.courseCode}</p>
                        <p className="text-lg font-bold">{s.courseName}</p>

                        <p className="text-base font-bold">{s.teacherName}</p>
                        <p className="">P.{s.room}</p>
                        <p className="text-sm font-medium">
                            Thời gian:{' '}
                            {moment(s.startTime, 'HH:mm:ss.SSS').format(
                                DATE_TIME_FORMAT.HOUR_AND_MINUTE,
                            )}{' '}
                            -{' '}
                            {moment(s.endTime, 'HH:mm:ss.SSS').format(
                                DATE_TIME_FORMAT.HOUR_AND_MINUTE,
                            )}
                        </p>
                        {s.courseStartTime && (
                            <p className="text-sm font-medium">
                                BĐ:{' '}
                                {moment(s.courseStartTime).format(
                                    DATE_TIME_FORMAT.DATE_ONLY,
                                )}
                            </p>
                        )}
                        {s.courseEndTime && (
                            <p className="text-sm font-medium">
                                KT:{' '}
                                {moment(s.courseEndTime).format(
                                    DATE_TIME_FORMAT.DATE_ONLY,
                                )}
                            </p>
                        )}
                    </div>
                ))}
            </div>
        )
    }

    return (
        <Card loading={isLoadingSemesterOptions}>
            <div className="timetable-page">
                <div className="timetable-filters">
                    <div className="filter-item">
                        <label>Học kỳ</label>
                        <Select
                            value={semester}
                            onChange={setSemester}
                            options={semesterOptions}
                            loading={isLoadingSemesterOptions}
                            onSearch={setSemesterSearchText}
                            searchValue={semesterSearchText}
                            onPopupScroll={loadMoreSemesterOptions}
                            allowClear
                            showSearch
                            placeholder="Chọn học kỳ"
                        />
                    </div>
                </div>

                <div className="mb-8 mt-4">
                    <p className="text-center text-2xl font-bold uppercase">
                        THỜI KHÓA BIỂU {currentSemester?.label}
                    </p>
                    <p className="mt-2 text-center text-xl font-bold">
                        MSSV: {user.student?.studentCode}
                    </p>
                </div>
                <Spin spinning={isLoadingTimetableData}>
                    <div className="timetable-container bg-white">
                        <table className="timetable">
                            <thead>
                                <tr>
                                    {weekVietnameseDays.map((day) => (
                                        <th key={day}>{day}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    {Array.isArray(timetableData) &&
                                    timetableData.length > 0 ? (
                                        weekDays.map((day) => {
                                            const allCourseInDay = timetableData
                                                .filter((s) => s.day === day)
                                                .sort((a, b) => {
                                                    const aTime = a.startTime
                                                        ? Number(a.startTime)
                                                        : 0
                                                    const bTime = b.startTime
                                                        ? Number(b.startTime)
                                                        : 0
                                                    return aTime - bTime
                                                })

                                            return (
                                                <td key={day}>
                                                    {renderClassSession(
                                                        allCourseInDay,
                                                    )}
                                                </td>
                                            )
                                        })
                                    ) : (
                                        <td colSpan={7}>
                                            <Empty description="Không có thời khóa biểu nào trong học kỳ này" />
                                        </td>
                                    )}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </Spin>
            </div>
        </Card>
    )
}

export default TimeTablePage
