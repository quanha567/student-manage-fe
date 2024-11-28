import { useQuery } from '@tanstack/react-query'

import { App, Card, Empty } from 'antd'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Breadcrumb, Button } from '@/components'
import { QUERY_KEYS } from '@/constants'
import { useAppSelector } from '@/hooks'
import { selectCurrentUser } from '@/redux'
import { studentService } from '@/services'
import StudentScores from './StudentScores'
import { useRef } from 'react'

const MyScorePage = () => {
    const user = useAppSelector(selectCurrentUser)
    const scoreListRef = useRef<HTMLDivElement>(null)

    const { notification } = App.useApp()

    const { data, isLoading } = useQuery({
        queryKey: [QUERY_KEYS.MY_SCORE],
        queryFn: async () =>
            studentService.getMyScore(Number(user.student?.id)),
        enabled: Boolean(user.student?.id),
    })

    const handleGeneratePdf = async () => {
        if (!scoreListRef.current) {
            notification.error({
                message: 'Không thể xuất PDF! Vui lòng thử lại.',
            })
            return
        }

        try {
            // Define A4 size in pixels (at 96 DPI)
            const A4_WIDTH = 210 // mm
            const A4_HEIGHT = 297 // mm

            const pdf = new jsPDF('p', 'mm', [A4_WIDTH, A4_HEIGHT])

            // Render the HTML content to a canvas
            const canvas = await html2canvas(scoreListRef.current, {
                scale: 2, // Improve quality
                useCORS: true,
                backgroundColor: '#ffffff', // Ensure a solid background
                width: pdf.internal.pageSize.getWidth() * 4, // Adjust for higher resolution
            })

            const imgData = canvas.toDataURL('image/png')

            // Scale the image to fit A4 size
            const pageWidth = pdf.internal.pageSize.getWidth()
            const pageHeight = pdf.internal.pageSize.getHeight()

            const imgWidth = pageWidth
            const imgHeight = (canvas.height / canvas.width) * imgWidth

            // Check if content overflows the page
            if (imgHeight > pageHeight) {
                const pages = Math.ceil(imgHeight / pageHeight)
                for (let i = 0; i < pages; i++) {
                    const positionY = -i * pageHeight

                    pdf.addImage(
                        imgData,
                        'PNG',
                        0,
                        positionY,
                        imgWidth,
                        imgHeight,
                    )

                    if (i < pages - 1) {
                        pdf.addPage()
                    }
                }
            } else {
                pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
            }

            pdf.save(`Bang-diem-hoc-sinh-${new Date().toISOString()}.pdf`)

            notification.success({
                message: 'Xuất PDF thành công!',
            })
        } catch (error) {
            console.error('Error exporting PDF:', error)
            notification.error({
                message: 'Có lỗi xảy ra khi xuất PDF!',
            })
        }
    }

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
                    <>
                        <div className="flex justify-end">
                            <Button onClick={handleGeneratePdf}>
                                In bảng điểm
                            </Button>
                        </div>
                        <StudentScores data={data} />
                        <div className="fixed left-full top-0 w-screen">
                            <div className="a4" ref={scoreListRef}>
                                <StudentScores data={data} />
                            </div>
                        </div>
                    </>
                ) : (
                    <Empty description="Bạn chưa có kết quả học tập nào!" />
                )}
            </Card>
        </>
    )
}

export default MyScorePage
