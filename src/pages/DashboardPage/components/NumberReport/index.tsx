import { useMemo } from 'react'
import CountUp from 'react-countup'

import { MdClass } from 'react-icons/md'
import { PiChalkboardTeacherFill, PiStudentFill } from 'react-icons/pi'

import { Card, Spin } from 'antd'

import { useSummaryReport } from '@/queries'

export const NumberReport = () => {
    const { data: summaryReport, isLoading } = useSummaryReport()

    const reportData = useMemo(
        () => [
            {
                label: 'Số lớp',
                value: summaryReport?.classCount,
                icon: <MdClass className="size-10 text-primary" />,
            },
            {
                label: 'Số giáo viên',
                value: summaryReport?.teacherCount,
                icon: (
                    <PiChalkboardTeacherFill className="size-10 text-primary" />
                ),
            },
            {
                label: 'Số sinh viên',
                value: summaryReport?.studentCount,
                icon: <PiStudentFill className="size-10 text-primary" />,
            },
        ],
        [summaryReport],
    )

    return (
        <div className="grid grid-cols-3 gap-4">
            {reportData.map((data) => (
                <Spin key={data.label} spinning={isLoading}>
                    <Card
                        classNames={{
                            body: 'flex gap-4',
                        }}
                    >
                        <div className="flex aspect-square size-20 items-center justify-center rounded-full bg-primary/10 p-2">
                            {data.icon}
                        </div>
                        <div className="flex-1">
                            <p className="text-xl font-medium">{data.label}</p>
                            <p className="mt-2 text-3xl font-bold text-primary">
                                <CountUp
                                    delay={5}
                                    duration={3}
                                    end={Number(data.value ?? 0)}
                                />
                            </p>
                        </div>
                    </Card>
                </Spin>
            ))}
        </div>
    )
}
