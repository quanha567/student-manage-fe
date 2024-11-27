import { useMemo, useRef, useState } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { useQuery } from '@tanstack/react-query'

import { App, Button, Card, Empty, Select, Table } from 'antd'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { Breadcrumb, FormInput } from '@/components'
import FormField from '@/components/Forms/FormField'
import { QUERY_KEYS } from '@/constants'
import { useAppSelector, useRole } from '@/hooks'
import { useGetCourses } from '@/queries'
import { selectCurrentUser } from '@/redux'
import { sectionService } from '@/services'
import moment from 'moment'

const ManageStudentPointPage = () => {
    const [selectedSection, setSelectedSection] = useState<number>()

    const { notification } = App.useApp()

    const user = useAppSelector(selectCurrentUser)

    const [listExport, setListExport] = useState(null)
    const scoreListRef = useRef<HTMLDivElement>(null)

    const formMethods = useForm()

    const today = moment()

    const {
        handleSubmit,
        reset,
        formState: { isDirty, isSubmitting },
        watch,
    } = formMethods

    const { isAdminRole } = useRole()

    const { data } = useGetCourses({
        pageIndex: 1,
        pageSize: 50,
        sortBy: 'name',
    })

    const {
        data: sectionDetail,
        isLoading,
        refetch,
    } = useQuery({
        queryKey: [QUERY_KEYS.SECTION_DETAIL, selectedSection],
        queryFn: async () => {
            if (!selectedSection) return null
            const response =
                await sectionService.getSectionDetail(selectedSection)
            reset({ ...response })

            return response
        },
        enabled: Boolean(selectedSection),
    })

    const currentCourse = useMemo(() => {
        return data?.data?.find((section) =>
            section?.attributes?.sections?.data?.some(
                (section) => section?.id === selectedSection,
            ),
        )
    }, [selectedSection, data])

    const courseOptions = useMemo(() => {
        if (isAdminRole) {
            return data?.data?.map((course) => ({
                title: course.attributes?.name,
                label: course.attributes?.name,
                options: course.attributes?.sections?.data?.map((section) => ({
                    label: `${course.attributes?.name ?? ''} - (Mã lớp ${section.attributes?.code ?? ''})`,
                    value: section.id,
                })),
            }))
        } else {
            const options = data?.data
                ?.flatMap((course) => course.attributes?.sections ?? [])
                .flatMap((section) => section.data)
                .filter(
                    (section) =>
                        section?.attributes?.teacher?.data?.id ===
                        user.teacher?.id,
                )
                .map((section) => ({
                    label: `${section?.attributes?.course?.data?.attributes?.name ?? ''} - (Mã lớp ${section?.attributes?.code ?? ''})`,
                    value: section?.id,
                }))

            return options
        }
    }, [data, isAdminRole, user.id])

    const tableColumns = useMemo(() => {
        return [
            {
                title: 'STT',
                render: (_id: unknown, _record: unknown, index: number) =>
                    index + 1,
                width: 100,
                align: 'center',
            },
            {
                title: 'Mã sinh viên',
                dataIndex: 'studentCode',
            },
            {
                title: 'Họ và tên',
                dataIndex: 'studentName',
            },
            {
                title: 'Điểm QT',
                align: 'center',
                render: (_row, _record, index: number) => (
                    <FormInput
                        max={10}
                        min={0}
                        name={`studentScores.${String(index)}.scoreQT`}
                        size="small"
                        className="py-1"
                    />
                ),
            },
            {
                title: 'Điểm GK',
                align: 'center',
                render: (_row, _record, index: number) => (
                    <FormInput
                        max={10}
                        min={0}
                        name={`studentScores.${String(index)}.scoreGK`}
                        size="small"
                        className="py-1"
                    />
                ),
            },
            {
                title: 'Điểm TH',
                align: 'center',
                render: (_row, _record, index: number) => (
                    <FormInput
                        max={10}
                        min={0}
                        name={`studentScores.${String(index)}.scoreTH`}
                        size="small"
                        className="py-1"
                    />
                ),
            },
            {
                title: 'Điểm CK',
                align: 'center',
                render: (_row, _record, index: number) => (
                    <FormInput
                        max={10}
                        min={0}
                        name={`studentScores.${String(index)}.scoreCK`}
                        size="small"
                        className="py-1"
                    />
                ),
            },
            {
                title: 'Điểm HP',
                align: 'center',
                render: (_row, _record, index: number) => {
                    const score = watch
                    return (
                        <FormInput
                            disabled
                            name={`studentScores.${String(index)}.finalScore`}
                            size="small"
                            className="py-1"
                        />
                    )
                },
            },
            {
                title: 'Điểm hệ 4',
                align: 'center',
                render: (_row, _record, index: number) => (
                    <FormInput
                        disabled
                        name={`studentScores.${String(index)}.grade`}
                        size="small"
                        className="py-1"
                    />
                ),
            },
            {
                title: 'Ghi chú',
                align: 'center',
                dataIndex: 'note',
                render: (_row, _record, index: number) => (
                    <FormInput
                        name={`studentScores.${String(index)}.note`}
                        size="small"
                        className="py-1"
                    />
                ),
            },
        ]
    }, [selectedSection])

    const handleSubmitData = async (data: unknown) => {
        console.log('handleSubmitData  data:', JSON.stringify(data, null, 2))
        if (!selectedSection) return

        try {
            await sectionService.importScore(data, selectedSection)
            await refetch()
            notification.success({
                message: 'Lưu kết quả điểm sinh viên thành công!',
            })
        } catch (err) {
            console.log('handleSubmitData  err:', err)
            notification.error({
                message: 'Có lỗi xảy ra vui lòng thử lại sau!',
            })
        }
    }

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

            pdf.save(`Danh-sach-diem-${new Date().toISOString()}.pdf`)

            notification.success({
                message: 'Xuất PDF thành công!',
            })
        } catch (error) {
            console.error('Error exporting PDF:', error)
            notification.error({
                message: 'Có lỗi xảy ra khi xuất PDF!',
            })
        } finally {
            setListExport(null)
        }
    }

    return (
        <>
            <Breadcrumb
                pageName="Quản lý điểm sinh viên"
                items={[
                    {
                        title: 'Quản lý điểm sinh viên',
                    },
                ]}
            />
            <Card loading={isSubmitting}>
                <div className="mb-4 grid gap-4 lg:grid-cols-2">
                    <FormField
                        label="Lớp học"
                        renderField={() => (
                            <Select
                                allowClear
                                className="w-full"
                                placeholder="Chọn lớp học..."
                                options={courseOptions}
                                value={selectedSection}
                                onChange={setSelectedSection}
                            />
                        )}
                    />
                </div>
                <FormProvider {...formMethods}>
                    <Table
                        bordered
                        rowKey="id"
                        loading={isLoading}
                        columns={tableColumns}
                        scroll={{
                            y: 1000,
                        }}
                        dataSource={
                            selectedSection
                                ? (sectionDetail?.studentScores ?? [])
                                : []
                        }
                        locale={{
                            emptyText: (
                                <Empty description="Không có dữ liệu nào" />
                            ),
                        }}
                        size="small"
                        pagination={false}
                    />
                </FormProvider>
                <div className="mt-4 flex justify-end gap-2">
                    <Button
                        disabled={
                            !(
                                Array.isArray(sectionDetail?.studentScores) &&
                                sectionDetail.studentScores.length > 0
                            )
                        }
                        type="primary"
                        onClick={handleGeneratePdf}
                    >
                        Xuất bảng điểm
                    </Button>{' '}
                    <Button
                        type="primary"
                        disabled={
                            !(
                                Array.isArray(sectionDetail?.studentScores) &&
                                sectionDetail.studentScores.length > 0
                            ) || !isDirty
                        }
                        onClick={handleSubmit(handleSubmitData)}
                    >
                        Lưu thay đổi
                    </Button>
                </div>
            </Card>
            <div className="fixed left-full top-0 w-screen">
                <div ref={scoreListRef} className="a4">
                    <div className="grid grid-cols-2 gap-4 text-[15px]">
                        <div>
                            <p className="text-center font-medium">
                                BỘ TÀI NGUYÊN VÀ MÔI TRƯỜNG
                            </p>
                            <p className="text-center font-bold">
                                TRƯỜNG ĐẠI HỌC TÀI NGUYÊN VÀ MÔI TRƯỜNG TP.HỒ
                                CHÍ MINH
                            </p>
                            <p className="text-center font-bold">
                                KHOA HTTT & VT
                            </p>
                        </div>
                        <div>
                            <p className="text-center font-bold">
                                CỘNG HÒA XÃ HỘI CHỦ NGHĨA VIỆT NAM
                            </p>
                            <p className="text-center font-bold underline">
                                Độc lập - Tự do - Hạnh phúc
                            </p>
                        </div>
                    </div>
                    <p className="mt-4 text-center text-2xl font-bold">
                        BẢNG ĐIỂM HỌC PHẦN
                    </p>
                    <div className="mt-4 grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-base font-bold">
                                HỌC PHẦN: {currentCourse?.attributes?.name}
                            </p>
                            <p className="text-base font-bold">
                                GIẢNG VIÊN:{' '}
                                {
                                    currentCourse?.attributes?.sections?.data?.find(
                                        (section) =>
                                            section?.id === selectedSection,
                                    )?.attributes?.teacher?.data?.attributes
                                        ?.fullName
                                }
                            </p>
                        </div>
                        <div>
                            <p className="text-base font-bold">
                                SỐ TÍN CHỈ: {currentCourse?.attributes?.credits}
                            </p>
                            <p className="text-base font-bold">
                                HỌC KỲ:{' '}
                                {
                                    currentCourse?.attributes?.semester?.data
                                        ?.attributes?.name
                                }
                            </p>
                        </div>
                    </div>

                    <table
                        className="mt-4 w-full border-collapse border border-black text-base"
                        style={{
                            border: '1px solid black',
                            padding: '8px 8px',
                            borderCollapse: 'collapse',
                        }}
                    >
                        <thead>
                            <tr className="text-center font-bold">
                                <th
                                    style={{
                                        border: '1px solid black',
                                        padding: '8px 8px',
                                    }}
                                    className="border border-black px-2 py-1"
                                >
                                    STT
                                </th>
                                <th
                                    style={{
                                        border: '1px solid black',
                                        padding: '8px 8px',
                                    }}
                                    className="border border-black px-2 py-1"
                                >
                                    MASV
                                </th>
                                <th
                                    style={{
                                        border: '1px solid black',
                                        padding: '8px 8px',
                                    }}
                                    className="border border-black px-2 py-1"
                                >
                                    HỌ VÀ TÊN
                                </th>
                                <th
                                    style={{
                                        border: '1px solid black',
                                    }}
                                    className="border border-black"
                                >
                                    <div className="px-2 py-1">ĐIỂM QT</div>
                                    <div
                                        style={{
                                            borderTop: '1px solid black',
                                        }}
                                        className="px-2 py-1"
                                    >
                                        40%
                                    </div>
                                </th>
                                <th
                                    style={{
                                        border: '1px solid black',
                                    }}
                                    className="border border-black"
                                >
                                    <div className="px-2 py-1">
                                        ĐIỂM THI KT HP
                                    </div>
                                    <div
                                        style={{
                                            borderTop: '1px solid black',
                                        }}
                                        className="px-2 py-1"
                                    >
                                        60%
                                    </div>
                                </th>
                                <th
                                    style={{
                                        border: '1px solid black',
                                    }}
                                    className="border border-black"
                                >
                                    <div className="px-2 py-1">
                                        ĐIỂM TỔNG KẾT
                                    </div>
                                    <div
                                        style={{
                                            borderTop: '1px solid black',
                                        }}
                                        className="grid grid-cols-2"
                                    >
                                        <div
                                            style={{
                                                borderRight: '1px solid black',
                                            }}
                                            className="px-2 py-1"
                                        >
                                            HỆ 10
                                        </div>
                                        <div className="px-2 py-1">HỆ 4</div>
                                    </div>
                                </th>
                                <th
                                    style={{
                                        border: '1px solid black',
                                        padding: '8px 8px',
                                    }}
                                    className="border border-black px-2 py-1"
                                >
                                    GHI CHÚ
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {sectionDetail?.studentScores?.map(
                                (student, index) => (
                                    <tr key={index} className="text-center">
                                        <td
                                            style={{
                                                border: '1px solid black',
                                                padding: '8px 8px',
                                            }}
                                            className="border border-black px-2 py-1"
                                        >
                                            {index + 1}
                                        </td>
                                        <td
                                            style={{
                                                border: '1px solid black',
                                                padding: '8px 8px',
                                            }}
                                            className="border border-black px-2 py-1"
                                        >
                                            {student?.studentCode}
                                        </td>
                                        <td
                                            style={{
                                                border: '1px solid black',
                                                padding: '8px 8px',
                                            }}
                                            className="border border-black px-2 py-1"
                                        >
                                            {student?.studentName}
                                        </td>{' '}
                                        <td
                                            style={{
                                                border: '1px solid black',
                                                padding: '8px 8px',
                                            }}
                                            className="border border-black px-2 py-1"
                                        >
                                            {student?.scoreQT}
                                        </td>
                                        <td
                                            style={{
                                                border: '1px solid black',
                                                padding: '8px 8px',
                                            }}
                                            className="border border-black px-2 py-1"
                                        >
                                            {student?.scoreCK}
                                        </td>
                                        <td
                                            style={{
                                                border: '1px solid black',
                                            }}
                                        >
                                            <div
                                                style={{
                                                    borderRight:
                                                        '1px solid black',
                                                }}
                                                className="inline-block w-1/2 p-2"
                                            >
                                                {student?.finalScore}
                                            </div>
                                            <div className="inline-block w-1/2 p-2">
                                                {student?.grade}
                                            </div>
                                        </td>
                                        <td
                                            style={{
                                                border: '1px solid black',
                                                padding: '8px 8px',
                                            }}
                                            className="border border-black px-2 py-1"
                                        >
                                            {student?.note}
                                        </td>
                                    </tr>
                                ),
                            )}
                        </tbody>
                    </table>
                    <div className="mt-4 font-bold">
                        <div
                            className="flex w-1/2 items-center"
                            style={{
                                border: '1px solid black',
                            }}
                        >
                            <div
                                className="min-w-60 flex-1 p-2"
                                style={{
                                    borderRight: '1px solid black',
                                }}
                            >
                                Cộng danh sách gồm
                            </div>
                            <div
                                className="flex-1 p-2"
                                style={{
                                    borderRight: '1px solid black',
                                }}
                            >
                                {sectionDetail?.totalStudents}
                            </div>
                            <div className="p-2">100%</div>
                        </div>
                        <div
                            className="flex w-1/2 items-center"
                            style={{
                                border: '1px solid black',
                            }}
                        >
                            <div
                                className="min-w-60 flex-1 p-2"
                                style={{
                                    borderRight: '1px solid black',
                                }}
                            >
                                Số sinh viên đạt
                            </div>
                            <div
                                className="flex-1 p-2"
                                style={{
                                    borderRight: '1px solid black',
                                }}
                            >
                                {sectionDetail?.passedStudents}
                            </div>
                            <div className="p-2">
                                {sectionDetail?.passPercentage}
                            </div>
                        </div>
                        <div
                            className="flex w-1/2 items-center"
                            style={{
                                border: '1px solid black',
                            }}
                        >
                            <div
                                className="min-w-60 flex-1 p-2"
                                style={{
                                    borderRight: '1px solid black',
                                }}
                            >
                                Số sinh viên không đạt
                            </div>
                            <div
                                className="flex-1 p-2"
                                style={{
                                    borderRight: '1px solid black',
                                }}
                            >
                                {sectionDetail?.failedStudents}
                            </div>
                            <div className="p-2">
                                {sectionDetail?.failPercentage}
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 grid grid-cols-2 font-bold">
                        <div className="text-center">TRƯỞnG KHOA / BỘ MÔN</div>
                        <div className="flex flex-col items-center">
                            <p>
                                Tp.Hồ Chí Minh, Ngày {today.date()} tháng{' '}
                                {today.month() + 1} năm {today.year()}
                            </p>
                            <p>GV GIẢNG DẠY</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ManageStudentPointPage
