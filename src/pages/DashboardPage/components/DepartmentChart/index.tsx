import { Bar } from 'react-chartjs-2'

import { useQuery } from '@tanstack/react-query'

import { Card, Spin } from 'antd'

import { QUERY_KEYS } from '@/constants'
import { statisticService } from '@/services'

export const DepartmentChart = () => {
    const { isLoading, data } = useQuery({
        queryKey: [QUERY_KEYS.NUMBER_STUDENT_REPORT],
        queryFn: statisticService.numberStudentReport,
    })

    return (
        <Spin spinning={isLoading}>
            <Card>
                <Bar
                    data={{
                        labels: data?.labels ?? [],
                        datasets: [
                            {
                                data: data?.data ?? [],
                                backgroundColor: data?.backgroundColor ?? [],
                                borderColor: data?.borderColor ?? [],
                                borderWidth: 2,
                                borderRadius: 4,
                                barThickness: 15,
                            },
                        ],
                    }}
                    options={{
                        plugins: {
                            title: {
                                display: true,
                                text: 'Biểu đồ thể hiện số lượng sinh viên theo từng lớp',
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
