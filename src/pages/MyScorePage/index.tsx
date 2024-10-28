import { useQuery } from '@tanstack/react-query'

import { Card, Empty } from 'antd'

import { Breadcrumb } from '@/components'
import { QUERY_KEYS } from '@/constants'
import { useAppSelector } from '@/hooks'
import { selectCurrentUser } from '@/redux'
import { studentService } from '@/services'

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
                {Array.isArray(data) && data.length > 0 ? (
                    data.map((item) => (
                        <div>
                            <div className="bg-zinc-300 px-4 py-2 text-center text-base font-medium">
                                {item.subjectName}
                            </div>
                            <div className="grid auto-cols-auto grid-flow-col divide-x-[1px] border">
                                {item.scores.map((score) => (
                                    <div className="divide-y-[1px]">
                                        <div className="px-2 py-1 text-center font-medium">
                                            {score.name}
                                        </div>
                                        <div className="px-2 py-1 text-center">
                                            {score.score}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))
                ) : (
                    <Empty description="Bạn chưa có kết quả học tập nào!" />
                )}
            </Card>
        </>
    )
}

export default MyScorePage
