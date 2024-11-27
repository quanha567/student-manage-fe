import { useQuery } from '@tanstack/react-query'

import { Card, Empty } from 'antd'

import { Breadcrumb } from '@/components'
import { QUERY_KEYS } from '@/constants'
import { useAppSelector } from '@/hooks'
import { selectCurrentUser } from '@/redux'
import { studentService } from '@/services'
import StudentScores from './StudentScores'

const MyScorePage = () => {
    const user = useAppSelector(selectCurrentUser)

    const { data, isLoading } = useQuery({
        queryKey: [QUERY_KEYS.MY_SCORE],
        queryFn: async () =>
            studentService.getMyScore(Number(user.student?.id)),
        enabled: Boolean(user.student?.id),
    })

    return (
        <>
            <Breadcrumb
                pageName="Kết quả học tập"
                items={[
                    {
                        title: 'Kết quả học tập',
                    },
                ]}
            />
            <Card className="mt-4" loading={isLoading}>
                {data ? (
                    <StudentScores data={data} />
                ) : (
                    <Empty description="Bạn chưa có kết quả học tập nào!" />
                )}
            </Card>
        </>
    )
}

export default MyScorePage
