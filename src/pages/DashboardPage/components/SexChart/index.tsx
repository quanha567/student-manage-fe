import { useEffect, useState } from 'react'
import { Doughnut } from 'react-chartjs-2'

import { Card, Spin } from 'antd'

export const SexChart = () => {
    const random = (max: number) => Math.ceil(Math.random() * max)

    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        const timer = setInterval(() => {
            setIsLoading(false)
        }, random(5000))

        return () => {
            clearInterval(timer)
        }
    }, [])

    return (
        <Spin spinning={isLoading}>
            <Card>
                <Doughnut
                    data={{
                        labels: ['Nam', 'Nữ', 'Khác'],
                        datasets: [
                            {
                                label: 'Tỉ lệ',
                                data: [3, 5, 2],
                                backgroundColor: [
                                    'rgb(255, 99, 132, 0.2)',
                                    'rgb(54, 162, 235, 0.2)',
                                    'rgb(255, 205, 86, 0.2)',
                                ],
                                borderColor: [
                                    'rgb(255, 99, 132)',
                                    'rgb(54, 162, 235)',
                                    'rgb(255, 205, 86)',
                                ],
                                hoverOffset: 4,
                                borderWidth: 2,
                                borderRadius: 4,
                            },
                        ],
                    }}
                    options={{
                        plugins: {
                            title: {
                                display: true,
                                text: 'Biểu đồ thể hiện tỉ lệ giới tính sinh viên',
                            },
                        },
                        aspectRatio: 16 / 9,
                    }}
                />
            </Card>
        </Spin>
    )
}
