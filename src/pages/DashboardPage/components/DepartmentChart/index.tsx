import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'

import { Card, Spin } from 'antd'

export const DepartmentChart = () => {
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
                <Bar
                    data={{
                        labels: [
                            'CNTT',
                            'Điện',
                            'May',
                            'Ngoại ngữ',
                            'BC & TT',
                            'ATTT',
                            'Nghệ thuật',
                        ],
                        datasets: [
                            {
                                data: [
                                    random(10000),
                                    random(10000),
                                    random(10000),
                                    random(10000),
                                    random(10000),
                                    random(10000),
                                    random(10000),
                                ],
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.2)',
                                    'rgba(255, 159, 64, 0.2)',
                                    'rgba(255, 205, 86, 0.2)',
                                    'rgba(75, 192, 192, 0.2)',
                                    'rgba(54, 162, 235, 0.2)',
                                    'rgba(153, 102, 255, 0.2)',
                                    'rgba(201, 203, 207, 0.2)',
                                ],
                                borderColor: [
                                    '#ff000088',
                                    'rgb(255, 159, 64)',
                                    'rgb(255, 205, 86)',
                                    'rgb(75, 192, 192)',
                                    'rgb(54, 162, 235)',
                                    'rgb(153, 102, 255)',
                                    'rgb(201, 203, 207)',
                                ],
                                borderWidth: 2,
                                borderRadius: 4,
                                barThickness: 50,
                            },
                        ],
                    }}
                    options={{
                        plugins: {
                            title: {
                                display: true,
                                text: 'Biểu đồ thể hiện số lượng sinh viên theo từng khoa',
                            },
                            legend: {
                                display: false,
                            },
                        },
                        aspectRatio: 16 / 9,
                    }}
                />
            </Card>
        </Spin>
    )
}
