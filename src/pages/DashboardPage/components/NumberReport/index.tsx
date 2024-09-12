import { useMemo } from 'react'
import CountUp from 'react-countup'

import { AiFillProduct } from 'react-icons/ai'
import { MdClass } from 'react-icons/md'
import { PiChalkboardTeacherFill, PiStudentFill } from 'react-icons/pi'

import { Card, Spin } from 'antd'

import { useSummaryReport } from '@/queries'

export const NumberReport = () => {
    const { data: summaryReport, isLoading } = useSummaryReport()

    const reportData = useMemo(
        () => [
            {
                label: 'Số khoa',
                value: summaryReport?.departmentCount,
                icon: <AiFillProduct className="size-6" />,
            },
            {
                label: 'Số lớp',
                value: summaryReport?.classCount,
                icon: <MdClass className="size-6" />,
            },
            {
                label: 'Số giáo viên',
                value: summaryReport?.teacherCount,
                icon: <PiChalkboardTeacherFill className="size-6" />,
            },
            {
                label: 'Số sinh viên',
                value: summaryReport?.studentCount,
                icon: <PiStudentFill className="size-6" />,
            },
        ],
        [summaryReport],
    )

    return (
        <div className="grid grid-cols-4 gap-4">
            {reportData.map((data) => (
                <Spin key={data.label} spinning={isLoading}>
                    <Card>
                        <p className="flex items-center gap-2 text-xl font-medium">
                            {data.icon}
                            <span>{data.label}</span>
                        </p>
                        <p className="mt-2 text-3xl font-bold text-primary">
                            <CountUp
                                delay={5}
                                duration={3}
                                end={Number(data.value ?? 0)}
                            />
                        </p>
                    </Card>
                </Spin>
            ))}
        </div>
    )
}
