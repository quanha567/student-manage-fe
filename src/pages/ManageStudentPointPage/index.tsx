import { Card, Select } from 'antd'

import { Breadcrumb } from '@/components'
import FormField from '@/components/Forms/FormField'
import { useGetCourses } from '@/queries'

const ManageStudentPointPage = () => {
    const { data } = useGetCourses({
        pageIndex: 1,
        pageSize: 50,
        sortBy: 'name',
    })
    console.log('ManageStudentPointPage  data:', data)

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
