import { useCallback } from 'react'

import { IoMdAdd } from 'react-icons/io'

import { App } from 'antd'

import {
    Breadcrumb,
    Button,
    CustomTable,
    CustomTableColumnType,
} from '@/components'
import { DATE_TIME_FORMAT, EXAM_TYPE_NAMES, QUERY_KEYS } from '@/constants'
import { useDisclosure, useSearch } from '@/hooks'
import { ExamModel } from '@/models'
import { queryClient } from '@/providers'
import { useGetExams } from '@/queries'
import { semesterService } from '@/services'
import { Data } from '@/types'
import { formatDateTime } from '@/utils'

import { ExamFormModal } from './components'

const columns: CustomTableColumnType<Data<ExamModel>> = [
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
        title: 'Tên bài kiểm tra, bài khi',
        dataIndex: 'attributes',
        key: 'examName',
        render: ({ examName }: ExamModel) => examName,
        sorter: true,
        display: true,
    },
    {
        title: 'Thời gian',
        dataIndex: 'attributes',
        key: 'examDate',
        render: ({ examDate }: ExamModel) => (
            <span>
                {formatDateTime(
                    String(examDate),
                    DATE_TIME_FORMAT.SHORT_DATE_TIME,
                )}
            </span>
        ),
        sorter: true,
        display: true,
    },
    {
        title: 'Môn học',
        dataIndex: 'attributes',
        key: 'courseName',
        render: ({ course }: ExamModel) => course?.data?.attributes?.name,
        display: true,
    },
    {
        title: 'Loại',
        dataIndex: 'attributes',
        key: 'type',
        render: ({ type }: ExamModel) => (type ? EXAM_TYPE_NAMES[type] : '---'),
        display: true,
        sorter: true,
    },
    {
        title: 'Thời gian tạo',
        dataIndex: 'attributes',
        key: 'createdAt',
        render: ({ createdAt }: ExamModel) =>
            createdAt ? formatDateTime(createdAt) : '___',
        sorter: true,
        display: true,
    },
    {
        title: 'Thời gian cập nhật',
        dataIndex: 'attributes',
        key: 'updatedAt',
        render: ({ updatedAt }: ExamModel) =>
            updatedAt ? formatDateTime(updatedAt) : '___',
        sorter: true,
        display: true,
    },
]

const ExamPage = () => {
    const { isOpen, toggleOpen, id } = useDisclosure()

    const { notification } = App.useApp()

    const [params] = useSearch()

    const {
        pageSize = 10,
        pageIndex = 1,
        sortBy = 'createdAt',
        asc = 'desc',
        searchText = '',
    } = params

    const {
        data,
        isLoading: isLoadingExams,
        isPlaceholderData: isPlaceholderExams,
    } = useGetExams({
        pageIndex: Number(pageIndex),
        pageSize: Number(pageSize),
        asc: String(asc),
        searchText: String(searchText),
        sortBy: String(sortBy),
    })

    const handleDeleteExam = useCallback(
        async (deleteIds: number[]) => {
            try {
                const dataDeleted = await Promise.all(
                    deleteIds.map((id) => semesterService.delete(id)),
                )
                await queryClient.refetchQueries({
                    queryKey: [QUERY_KEYS.SUBJECT_LIST],
                })
                notification.success({
                    message: `Đã xóa thành công ${String(dataDeleted.length)} dòng dữ liệu!`,
                })
            } catch (err: unknown) {
                console.log('Exam delete', err)
                notification.error({
                    message: `Có lỗi xảy ra vui lòng thử lại sau!`,
                })
            }
        },
        [notification],
    )

    return (
        <div>
            <Breadcrumb
                pageName="Danh sách bài kiểm tra, bài khi"
                items={[
                    {
                        title: 'Danh sách bài kiểm tra, bài khi',
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
                columns={columns}
                dataSource={data?.data}
                loading={isLoadingExams || isPlaceholderExams}
                tableName="bài kiểm tra, bài khi"
                isPagination
                totalElement={data?.meta?.pagination?.total}
                bordered
                searchInputProps={{
                    isDisplay: true,
                    placeholder: 'Tìm kiếm tên bài kiểm tra, bài khi...',
                }}
                actionButtons={{
                    editProps: {
                        isDisplay: true,
                        onClick: (record: Data<ExamModel>) =>
                            record.id && toggleOpen(String(record.id)),
                    },
                    deleteProps: {
                        isDisplay: true,
                    },
                }}
                onDelete={handleDeleteExam}
            />
            <ExamFormModal id={id} isOpen={isOpen} toggleOpen={toggleOpen} />
        </div>
    )
}

export default ExamPage
