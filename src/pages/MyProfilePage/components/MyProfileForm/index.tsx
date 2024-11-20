import { useEffect } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import dayjs from 'dayjs'

import { Card } from 'antd'

import { CustomImage } from '@/components'
import { DATE_TIME_FORMAT, GENDERS } from '@/constants'
import { useAppSelector } from '@/hooks'
import { Gender, StudentModel, TeacherModel, UserRole } from '@/models'
import { selectCurrentUser } from '@/redux'

import { StudentForm } from '../StudentForm'
import { TeacherForm } from '../TeacherForm'

export const MyProfileForm = () => {
    const user = useAppSelector(selectCurrentUser)
    const isStudent = user.role?.type === UserRole.STUDENT

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
                        src={user.student?.avatar ?? user.teacher?.avatar}
                        alt={user.student?.fullName ?? user.teacher?.fullName}
                        className="aspect-square object-cover"
                        containerClass="overflow-hidden rounded-full"
                        size="thumbnail"
                        imgSize={100}
                    />
                </div>
                {isStudent ? <StudentForm /> : <TeacherForm />}
            </Card>
        </FormProvider>
    )
}
