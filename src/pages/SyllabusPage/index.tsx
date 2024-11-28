import { useCallback } from 'react'

import { IoMdAdd } from 'react-icons/io'

import { App } from 'antd'
import { ImageData } from '@/models'

import {
    Breadcrumb,
    Button,
    CustomTable,
    CustomTableColumnType,
} from '@/components'
import { QUERY_KEYS } from '@/constants'
import { useDisclosure, useRole, useSearch } from '@/hooks'
import { SyllabusModel } from '@/models'
import { queryClient } from '@/providers'
import { useGetSyllabuses } from '@/queries'
import { syllabusService } from '@/services'
import { Data } from '@/types'
import { formatDateTime } from '@/utils'

import { SyllabusFormModal } from './components'
import { ENV_CONFIGS } from '@/configs'

const handlePreviewFile = (file: ImageData) => {
    console.log('handlePreviewFile  file:', file)
    let linkPreview = ''

    if (file.formats) {
        // Check for the 'large' format first
        if (file.formats.large?.url) {
            linkPreview = file.formats.large.url
        }
        // Check for other formats if 'large' is not available
        if (file.formats.medium?.url) {
            linkPreview = file.formats.medium.url
        }
        if (file.formats.small?.url) {
            linkPreview = file.formats.small.url
        }
        if (file.formats.thumbnail?.url) {
            linkPreview = file.formats.thumbnail.url
        }
    }
    // Return the main image URL if no formats are available
    if (file.url) linkPreview = file.url

    if (linkPreview)
        window.open(`${ENV_CONFIGS.BASE_URL}${linkPreview}`, '_blank')
}

const columns: CustomTableColumnType<Data<SyllabusModel>> = [
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
        title: 'Tên đề cương',
        dataIndex: 'attributes',
        key: 'name',
        render: ({ name }: SyllabusModel) => name,
        sorter: true,
        display: true,
    },
    {
        title: 'Đề cương',
        dataIndex: 'attributes',
        key: 'name',
        render: ({ files }: SyllabusModel) => (
            <ul className="list-inside list-disc">
                {files?.data?.map((file, index) => (
                    <li
                        key={index}
                        onClick={() => handlePreviewFile(file?.attributes)}
                        className="cursor-pointer font-bold hover:text-sky-500 hover:underline"
                    >
                        {file?.attributes?.name}
                    </li>
                ))}
            </ul>
        ),
        display: true,
    },
    {
        title: 'Thời gian tạo',
        dataIndex: 'attributes',
        key: 'createdAt',
        render: ({ createdAt }: SyllabusModel) =>
            createdAt ? formatDateTime(createdAt) : '___',
        sorter: true,
        display: true,
    },
    {
        title: 'Thời gian cập nhật',
        dataIndex: 'attributes',
        key: 'updatedAt',
        render: ({ updatedAt }: SyllabusModel) =>
            updatedAt ? formatDateTime(updatedAt) : '___',
        sorter: true,
        display: true,
    },
]

const SyllabusPage = () => {
    const { isOpen, toggleOpen, id } = useDisclosure()

    const { notification } = App.useApp()

    const { isStudentRole } = useRole()

    const [params] = useSearch()
    const {
        pageSize = 10,
        pageIndex = 1,
        sortBy = 'createdAt',
        asc = 'desc',
        searchText = '',
    } = params

    const { data, isLoading, isPlaceholderData, isFetching } = useGetSyllabuses(
        {
            pageIndex: Number(pageIndex),
            pageSize: Number(pageSize),
            asc: String(asc),
            searchText: String(searchText),
            sortBy: String(sortBy),
        },
    )

    const handleDeleteSyllabus = useCallback(
        async (deleteIds: number[]) => {
            try {
                const dataDeleted = await Promise.all(
                    deleteIds.map((id) => syllabusService.delete(id)),
                )
                await queryClient.refetchQueries({
                    queryKey: [QUERY_KEYS.SYLLABUS_LIST],
                })
                notification.success({
                    message: `Đã xóa thành công ${String(dataDeleted.length)} dòng dữ liệu!`,
                })
            } catch (err: unknown) {
                console.log('Syllabus delete', err)
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
                pageName="Danh sách đề cương"
                items={[
                    {
                        title: 'Danh sách đề cương',
                    },
                ]}
                renderRight={
                    isStudentRole ? (
                        <></>
                    ) : (
                        <Button
                            onClick={() => toggleOpen()}
                            className="ml-auto flex items-center"
                        >
                            <IoMdAdd />
                            Thêm
                        </Button>
                    )
                }
            />

            <CustomTable
                columns={columns}
                dataSource={data?.data}
                loading={isLoading || (isFetching && isPlaceholderData)}
                tableName="đề cương"
                isPagination
                totalElement={data?.meta?.pagination?.total}
                bordered
                searchInputProps={{
                    isDisplay: true,
                    placeholder: 'Tìm kiếm tên đề cương...',
                }}
                actionButtons={{
                    editProps: {
                        isDisplay: !isStudentRole,
                        onClick: (record: Data<SyllabusModel>) =>
                            record.id && toggleOpen(String(record.id)),
                    },
                    deleteProps: {
                        isDisplay: !isStudentRole,
                    },
                }}
                onDelete={handleDeleteSyllabus}
            />
            <SyllabusFormModal
                id={id}
                isOpen={isOpen}
                toggleOpen={toggleOpen}
            />
        </div>
    )
}

export default SyllabusPage
