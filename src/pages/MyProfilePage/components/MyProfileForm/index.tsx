import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import dayjs from 'dayjs'

import { Card } from 'antd'

import { CustomImage, FormInput, FormTextArea } from '@/components'
import { DATE_TIME_FORMAT, GENDERS } from '@/constants'
import { useAppSelector } from '@/hooks'
import { Gender, StudentModel, TeacherModel, UserRole } from '@/models'
import { selectCurrentUser } from '@/redux'

export const MyProfileForm = () => {
    const user = useAppSelector(selectCurrentUser)
    const isStudent = user.role?.type === UserRole.STUDENT
    const isTeacher = user.role?.type === UserRole.TEACHER

    const isReadOnly = user.role?.type === UserRole.STUDENT

    const formMethods = useForm<StudentModel | TeacherModel>()

    const { reset } = formMethods

    useEffect(() => {
        reset({
            ...user.student,
            ...user.teacher,
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
                <div className="mx-auto mb-6 w-fit">
                    <CustomImage
                        src={user.student?.avatar}
                        alt={user.student?.fullName}
                        className="aspect-square object-cover"
                        containerClass="overflow-hidden rounded-full"
                        size="thumbnail"
                        imgSize={100}
                    />
                </div>
                <div className="grid grid-cols-3 gap-4">
                    <FormInput
                        label="Họ và tên"
                        name="fullName"
                        readOnly={isReadOnly}
                    />
                    <FormInput
                        label="Email"
                        name="email"
                        readOnly={isReadOnly}
                    />
                    <FormInput
                        label="Số điện thoại"
                        name="phoneNumber"
                        readOnly={isReadOnly}
                    />
                    <FormInput
                        label="Khoa"
                        name="class.department.departmentName"
                        readOnly={isReadOnly}
                    />
                    <FormInput
                        label="Lớp"
                        name="class.className"
                        readOnly={isReadOnly}
                    />
                    <FormInput
                        label="Giới tính"
                        name="gender"
                        readOnly={isReadOnly}
                    />
                    <FormInput
                        label="Ngày sinh"
                        name="dateOfBirth"
                        readOnly={isReadOnly}
                    />
                    <FormTextArea
                        label="Địa chỉ"
                        name="address"
                        rows={2}
                        readOnly={isReadOnly}
                    />
                    <FormTextArea
                        label="Ghi chú sinh viên"
                        name="note"
                        rows={2}
                        readOnly={isReadOnly}
                    />
                </div>
            </Card>
        </FormProvider>
    )
}
