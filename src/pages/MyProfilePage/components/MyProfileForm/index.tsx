import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { Card } from 'antd'

import { Button, FormInput, FormTextArea } from '@/components'
import { useAppSelector } from '@/hooks'
import { StudentModel } from '@/models'
import { selectCurrentUser } from '@/redux'

export const MyProfileForm = () => {
    const user = useAppSelector(selectCurrentUser)

    const formMethods = useForm<StudentModel>()

    const { reset } = formMethods

    useEffect(() => {
        reset({ ...user.student })
    }, [user, reset])

    return (
        <FormProvider {...formMethods}>
            <Card>
                <div className="grid grid-cols-2 gap-4">
                    <FormInput label="Họ và tên" name="fullName" readOnly />
                    <FormInput label="Email" name="email" />
                    <FormInput label="Số điện thoại" name="phoneNumber" />
                    <FormInput label="Giới tính" name="gender" />
                    <FormInput label="Ngày sinh" name="dateOfBirth" />
                    <div className="col-span-2">
                        <FormTextArea
                            label="Ghi chú sinh viên"
                            name="note"
                            rows={4}
                        />
                    </div>
                </div>
                <div className="flex justify-end">
                    <Button size="middle" className="mt-4">
                        Lưu thay đổi
                    </Button>
                </div>
            </Card>
        </FormProvider>
    )
}
