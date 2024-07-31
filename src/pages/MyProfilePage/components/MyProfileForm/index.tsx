import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import dayjs from 'dayjs'

import { Card } from 'antd'

import { FormInput, FormTextArea } from '@/components'
import { DATE_TIME_FORMAT, GENDERS } from '@/constants'
import { useAppSelector } from '@/hooks'
import { Gender, StudentModel, UserRole } from '@/models'
import { selectCurrentUser } from '@/redux'

export const MyProfileForm = () => {
    const user = useAppSelector(selectCurrentUser)

    const isReadOnly = user.role?.type === UserRole.STUDENT

    const formMethods = useForm<StudentModel>()

    const { reset } = formMethods

    useEffect(() => {
        reset({
            ...user.student,
            dateOfBirth: user.student?.dateOfBirth
                ? dayjs(user.student.dateOfBirth).format(
                      DATE_TIME_FORMAT.DATE_ONLY,
                  )
                : undefined,
            gender: user.student?.gender
                ? (GENDERS[user.student.gender] as Gender)
                : undefined,
        })
    }, [user, reset])

    return (
        <FormProvider {...formMethods}>
            <Card>
                <div className="grid grid-cols-2 gap-4">
                    <FormInput
                        label="Họ và tên"
                        name="fullName"
                        readOnly={isReadOnly}
                    />
                    <FormInput
                        label="Email"
                        name="email"
                        readOnly={user.role?.type === UserRole.STUDENT}
                    />
                    <FormInput
                        label="Số điện thoại"
                        name="phoneNumber"
                        readOnly={user.role?.type === UserRole.STUDENT}
                    />
                    <FormInput
                        label="Khoa"
                        name="class.department.departmentName"
                        readOnly={user.role?.type === UserRole.STUDENT}
                    />
                    <FormInput
                        label="Lớp"
                        name="class.className"
                        readOnly={user.role?.type === UserRole.STUDENT}
                    />
                    <FormInput
                        label="Giới tính"
                        name="gender"
                        readOnly={user.role?.type === UserRole.STUDENT}
                    />
                    <FormInput
                        label="Ngày sinh"
                        name="dateOfBirth"
                        readOnly={user.role?.type === UserRole.STUDENT}
                    />
                    <div className="col-span-2">
                        <FormTextArea
                            label="Địa chỉ"
                            name="address"
                            rows={2}
                            readOnly={user.role?.type === UserRole.STUDENT}
                        />
                    </div>
                    <div className="col-span-2">
                        <FormTextArea
                            label="Ghi chú sinh viên"
                            name="note"
                            rows={4}
                            readOnly={user.role?.type === UserRole.STUDENT}
                        />
                    </div>
                </div>
                {/* <div className="flex justify-end">
                    <Button size="middle" className="mt-4">
                        Lưu thay đổi
                    </Button>
                </div> */}
            </Card>
        </FormProvider>
    )
}
