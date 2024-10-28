import { Doughnut } from 'react-chartjs-2'

import { useQuery } from '@tanstack/react-query'

import { Card, Spin } from 'antd'

import { QUERY_KEYS } from '@/constants'
import { statisticService } from '@/services'

export const SexChart = () => {
    const { isLoading, data } = useQuery({
        queryKey: [QUERY_KEYS.GENDER_REPORT],
        queryFn: statisticService.genderReport,
    })

    return (
        <Spin spinning={isLoading}>
            <Card>
                <Doughnut
                    data={{
                        labels: data?.labels ?? [],
                        datasets: [
                            {
                                label: 'Tỉ lệ',
                                data: data?.data ?? [],
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
