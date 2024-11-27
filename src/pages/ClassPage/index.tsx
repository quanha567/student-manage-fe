import { useCallback, useEffect, useRef, useState } from 'react'

import { ExportOutlined } from '@ant-design/icons'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import { IoMdAdd } from 'react-icons/io'

import { App } from 'antd'

import {
    Breadcrumb,
    Button,
    CustomTable,
    CustomTableColumnType,
} from '@/components'
import { useDisclosure, useSearch } from '@/hooks'
import { ClassModel, DepartmentModel } from '@/models'
import { useGetClasses } from '@/queries'
import { classService } from '@/services'
import { Data } from '@/types'
import { formatDateTime } from '@/utils'

import { ClassFormModal } from './components'

const PageName = 'lớp học'

const columns: CustomTableColumnType<Data<ClassModel>> = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 80,
        align: 'center',
        sorter: true,
        display: true,
    },
    {
        title: `Tên ${PageName}`,
        dataIndex: 'attributes',
        key: 'className',
        render: ({ className }: ClassModel) => className,
        sorter: true,
        display: true,
    },
    {
        title: 'Thời gian tạo',
        dataIndex: 'attributes',
        key: 'createdAt',
        render: ({ createdAt }: ClassModel) =>
            createdAt ? formatDateTime(createdAt) : '___',
        sorter: true,
        display: true,
    },
    {
        title: 'Thời gian cập nhật',
        dataIndex: 'attributes',
        key: 'updatedAt',
        render: ({ updatedAt }: ClassModel) =>
            updatedAt ? formatDateTime(updatedAt) : '___',
        sorter: true,
        display: true,
    },
]

const ClassPage = () => {
    const { isOpen, toggleOpen, id } = useDisclosure()
    const { notification } = App.useApp()
    const studentListRef = useRef<HTMLDivElement>(null)

    const [classExport, setClassExport] = useState<ClassModel | null>(null)

    const [params] = useSearch()
    const {
        pageSize = 10,
        pageIndex = 1,
        sortBy = 'createdAt',
        asc = 'desc',
        searchText = '',
    } = params

    const {
        data: classs,
        isLoading: isLoadingDepartments,
        isPlaceholderData: isPlaceholderDepartments,
        refetch,
    } = useGetClasses({
        pageIndex: Number(pageIndex),
        pageSize: Number(pageSize),
        asc: String(asc),
        searchText: String(searchText),
        sortBy: String(sortBy),
    })

    const handleDeleteDepartment = useCallback(
        async (deleteIds?: number[]) => {
            if (!deleteIds || deleteIds.length === 0) return

            try {
                await Promise.all(
                    deleteIds.map((id) => classService.delete(id)),
                )
                await refetch()
                notification.success({
                    message: `Xóa dữ liệu thành công!`,
                })
            } catch (err: unknown) {
                console.log('Department delete', err)
            }
        },
        [notification],
    )

    useEffect(() => {
        if (classExport) {
            void handleGeneratePdf()
        }
    }, [JSON.stringify(classExport)])

    const handleGeneratePdf = async () => {
        if (!studentListRef.current) {
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
            const canvas = await html2canvas(studentListRef.current, {
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

            pdf.save(`Danh-sach-hoc-sinh-${new Date().toISOString()}.pdf`)

            notification.success({
                message: 'Xuất PDF thành công!',
            })
        } catch (error) {
            console.error('Error exporting PDF:', error)
            notification.error({
                message: 'Có lỗi xảy ra khi xuất PDF!',
            })
        } finally {
            setClassExport(null)
        }
    }

    return (
        <>
            <div>
                <Breadcrumb
                    pageName={`Danh sách ${PageName}`}
                    items={[
                        {
                            title: `Danh sách ${PageName}`,
                        },
                    ]}
                    renderRight={
                        <Button
                            onClick={() => toggleOpen()}
                            className="ml-auto flex items-center"
                        >
                            <IoMdAdd />
                            Thêm
                        </Button>
                    }
                />

                <CustomTable
                    isPagination
                    tableName={PageName}
                    columns={columns}
                    dataSource={classs?.data}
                    loading={isLoadingDepartments || isPlaceholderDepartments}
                    totalElement={classs?.meta?.pagination?.total}
                    bordered
                    searchInputProps={{
                        isDisplay: true,
                        placeholder: `Tìm kiếm tên ${PageName}...`,
                    }}
                    actionButtons={{
                        editProps: {
                            isDisplay: true,
                            onClick: (record: Data<DepartmentModel>) =>
                                record.id && toggleOpen(String(record.id)),
                        },
                        deleteProps: {
                            isDisplay: true,
                        },
                        extraProps: {
                            Icon: <ExportOutlined />,
                            isDisplay: true,
                            title: 'Xuất danh sách lớp',
                            onClick: (data) =>
                                setClassExport(data.attributes ?? null),
                        },
                    }}
                    onDelete={handleDeleteDepartment}
                />
                <ClassFormModal
                    id={id}
                    isOpen={isOpen}
                    toggleOpen={toggleOpen}
                    onRefetch={refetch}
                />
            </div>
            <div className="fixed left-full top-0 w-screen">
                <div ref={studentListRef} className="a4">
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
                        DANH SÁCH HỌC SINH
                    </p>
                    <p className="text-base font-bold">
                        LỚP: {classExport?.className}
                    </p>
                    <p className="text-base font-bold">
                        GIẢNG VIÊN:{' '}
                        {classExport?.teacher?.data?.attributes?.fullName}
                    </p>

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
                                        padding: '8px 8px',
                                    }}
                                    className="border border-black px-2 py-1"
                                >
                                    GHI CHÚ
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {classExport?.students?.data?.map(
                                (student, index) => (
                                    <tr
                                        key={student.id}
                                        className="text-center"
                                    >
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
                                            {student.attributes?.studentCode}
                                        </td>
                                        <td
                                            style={{
                                                border: '1px solid black',
                                                padding: '8px 8px',
                                            }}
                                            className="border border-black px-2 py-1"
                                        >
                                            {student.attributes?.fullName}
                                        </td>
                                        <td
                                            style={{
                                                border: '1px solid black',
                                                padding: '8px 8px',
                                            }}
                                            className="border border-black px-2 py-1"
                                        >
                                            {student.attributes?.note}
                                        </td>
                                    </tr>
                                ),
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

export default ClassPage
