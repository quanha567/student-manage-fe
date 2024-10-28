import { useMemo } from 'react'

import { useQuery } from '@tanstack/react-query'

import { Card, Select } from 'antd'

import { Breadcrumb } from '@/components'
import FormField from '@/components/Forms/FormField'
import { useAppSelector, useRole } from '@/hooks'
import { useGetCourses } from '@/queries'
import { selectCurrentUser } from '@/redux'

const ManageStudentPointPage = () => {
    const user = useAppSelector(selectCurrentUser)

    const { isAdminRole, isTeacherRole } = useRole()

    const { data } = useGetCourses({
        pageIndex: 1,
        pageSize: 50,
        sortBy: 'name',
    })
    console.log('🚀 -> ManageStudentPointPage -> data:', data)

    const courseOptions = useMemo(() => {
        if (isAdminRole) {
            return data?.data?.map((course) => ({
                title: course.attributes?.name,
                label: course.attributes?.name,
                options: course.attributes?.sections?.data?.map((section) => ({
                    label: `${course.attributes?.name ?? ''} - (${section.attributes?.code ?? ''})`,
                })),
            }))
        }
    }, [data, isAdminRole, isTeacherRole])

    console.log('🚀 -> courseOptions -> courseOptions:', courseOptions)
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
            <Card>
                <div className="grid gap-4 lg:grid-cols-2">
                    <FormField
                        label="Lớp học"
                        renderField={() => (
                            <Select
                                className="w-full"
                                placeholder="Chọn lớp học..."
                                options={courseOptions}
                            />
                        )}
                    />
                    <FormField
                        label="Môn học"
                        renderField={() => (
                            <Select
                                className="w-full"
                                placeholder="Chọn môn học..."
                            />
                        )}
                    />
                </div>
            </Card>
        </>
    )
}

export default ManageStudentPointPage
