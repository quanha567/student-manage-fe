import { PlusOutlined } from '@ant-design/icons'
import { ColumnType } from 'antd/es/table'

import { Card, Table } from 'antd'

import { Breadcrumb, Button } from '@/components'
import { StudentModel } from '@/models'

const StudentPage = () => {
    const studentTableColumns: ColumnType<StudentModel>[] = [
        {
            title: 'Tên sinh viên',
        },
        {
            title: 'Số điện thoại',
        },
        {
            title: 'Email',
        },
        {
            title: 'Khoa',
        },
        {
            title: 'Lớp',
        },
    ]

    return (
        <div>
            <Breadcrumb pageName="Danh sách sinh viên" />
            <Card className="mt-4">
                <div className="mb-2 flex justify-end">
                    <Button size="middle">
                        <PlusOutlined />
                        Thêm sinh viên
                    </Button>
                </div>
                <Table
                    bordered
                    columns={studentTableColumns}
                    dataSource={[{}, {}]}
                />
            </Card>
        </div>
    )
}

export default StudentPage
