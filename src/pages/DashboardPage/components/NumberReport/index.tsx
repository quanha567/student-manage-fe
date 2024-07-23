import { useEffect, useState } from 'react'
import CountUp from 'react-countup'

import { AiFillProduct } from 'react-icons/ai'
import { MdClass } from 'react-icons/md'
import { PiChalkboardTeacherFill, PiStudentFill } from 'react-icons/pi'

import { Card, Spin } from 'antd'

export const NumberReport = () => {
    const random = (max: number) => Math.ceil(Math.random() * max)

    const [isLoading, setIsLoading] = useState<boolean>(true)

    const [reportData] = useState([
        {
            label: 'Số khoa',
            value: random(99999),
            icon: <AiFillProduct className="size-6" />,
        },
        {
            label: 'Số lớp',
            value: random(99999),
            icon: <MdClass className="size-6" />,
        },
        {
            label: 'Số giáo viên',
            value: random(99999),
            icon: <PiChalkboardTeacherFill className="size-6" />,
        },
        {
            label: 'Số sinh viên',
            value: random(99999),
            icon: <PiStudentFill className="size-6" />,
        },
    ])

    useEffect(() => {
        const timer = setInterval(() => {
            setIsLoading(false)
        }, 5000)

        return () => {
            clearInterval(timer)
        }
    }, [])

    return (
        <div className="grid grid-cols-4 gap-4">
            {reportData.map((data) => (
                <Spin spinning={isLoading}>
                    <Card>
                        <p className="flex items-center gap-2 text-xl font-medium">
                            {data.icon}
                            <span>{data.label}</span>
                        </p>
                        <p className="mt-2 text-3xl font-bold text-primary">
                            <CountUp end={data.value} duration={3} delay={5} />
                        </p>
                    </Card>
                </Spin>
            ))}
        </div>
    )
}
