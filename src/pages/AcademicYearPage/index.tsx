import { useCallback } from 'react'

import { IoMdAdd } from 'react-icons/io'

import { App } from 'antd'

import {
    Breadcrumb,
    Button,
    CustomTable,
    CustomTableColumnType,
} from '@/components'
import { useDisclosure, useSearch } from '@/hooks'
import { AcademicYearModel } from '@/models'
import { useGetAcademicYears } from '@/queries'
import { academicYearService } from '@/services'
import { Data } from '@/types'
import { formatDateTime } from '@/utils'

import { AcademicYearFormModal } from './components'

const PageName = 'Niên khóa'

const columns: CustomTableColumnType<Data<AcademicYearModel>> = [
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
        key: 'name',
        render: ({ name }: AcademicYearModel) => name,
        sorter: true,
        display: true,
    },
    {
        title: 'Thời gian tạo',
        dataIndex: 'attributes',
        key: 'createdAt',
        render: ({ createdAt }: AcademicYearModel) =>
            createdAt ? formatDateTime(createdAt) : '___',
        sorter: true,
        display: true,
    },
    {
        title: 'Thời gian cập nhật',
        dataIndex: 'attributes',
        key: 'updatedAt',
        render: ({ updatedAt }: AcademicYearModel) =>
            updatedAt ? formatDateTime(updatedAt) : '___',
        sorter: true,
        display: true,
    },
]

const AcademicYearPage = () => {
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
        data: academicYears,
        isLoading: isLoadingAcademicYears,
        isPlaceholderData: isPlaceholderAcademicYears,
        refetch: refetchAcademicYears,
    } = useGetAcademicYears({
        pageIndex: Number(pageIndex),
        pageSize: Number(pageSize),
        asc: String(asc),
        searchText: String(searchText),
        sortBy: String(sortBy),
    })

    const handleDeleteAcademicYear = useCallback(
        async (deleteIds: number[]) => {
            const firstId = deleteIds[0]
            if (!firstId) return

            try {
                const academicYearDeleted =
                    await academicYearService.delete(firstId)
                await refetchAcademicYears()
                notification.success({
                    message: `Xóa ${PageName} ${academicYearDeleted.data?.attributes?.name ?? ''} thành công!`,
                })
            } catch (err: unknown) {
                console.log('AcademicYear delete', err)
            }
        },
        [notification],
    )

    return (
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
                dataSource={academicYears?.data}
                loading={isLoadingAcademicYears || isPlaceholderAcademicYears}
                totalElement={academicYears?.meta?.pagination?.total}
                bordered
                searchInputProps={{
                    isDisplay: true,
                    placeholder: `Tìm kiếm tên ${PageName}...`,
                }}
                actionButtons={{
                    editProps: {
                        isDisplay: true,
                        onClick: (record: Data<AcademicYearModel>) =>
                            record.id && toggleOpen(String(record.id)),
                    },
                    deleteProps: {
                        isDisplay: true,
                    },
                }}
                onDelete={handleDeleteAcademicYear}
            />
            <AcademicYearFormModal
                id={id}
                isOpen={isOpen}
                toggleOpen={toggleOpen}
                onRefetch={refetchAcademicYears}
            />
        </div>
    )
}

export default AcademicYearPage
