import { useCallback } from 'react'
import { useForm } from 'react-hook-form'

import { yupResolver } from '@hookform/resolvers/yup'
import { HttpStatusCode, isAxiosError } from 'axios'
import { isDayjs } from 'dayjs'
import { ObjectSchema, number, object, string } from 'yup'

import { App } from 'antd'

import { DATE_TIME_FORMAT, QUERY_KEYS } from '@/constants'
import { queryClient } from '@/providers'
import {
    StudentCreateRequest,
    fileService,
    studentService,
    userService,
} from '@/services'

const formStudentValidate: ObjectSchema<StudentCreateRequest> = object().shape({
    data: object({
        fullName: string().required('Vui lòng nhập tên học sinh!'),
        classId: number().required('Vui lòng chọn lớp học!'),
        email: string()
            .required('Vui lòng nhập email!')
            .email('Email không đúng định dạng!'),
    }),
})

export const useStudentForm = (studentId?: string, closeModel?: () => void) => {
    const formMethods = useForm<StudentCreateRequest>({
        resolver: yupResolver(formStudentValidate),
    })

    const { notification } = App.useApp()

    const { handleSubmit } = formMethods

    const handleCreateOrUpdateStudent = useCallback(
        async (data: StudentCreateRequest) => {
            if (!data.data?.email) return

            try {
                let dataSubmit: StudentCreateRequest = {
                    data: {
                        ...data.data,
                        class: data.data.classId,
                        dateOfBirth:
                            data.data.dateOfBirth &&
                            isDayjs(data.data.dateOfBirth)
                                ? data.data.dateOfBirth.format(
                                      DATE_TIME_FORMAT.DATE_ONLY_REVERSE_HYPHEN,
                                  )
                                : '',
                    },
                }

                if (data.data.avatar instanceof Blob) {
                    const formData = new FormData()

                    formData.append('files', data.data.avatar)
                    const imageUploaded =
                        await fileService.uploadFiles(formData)
                    dataSubmit = {
                        data: {
                            ...dataSubmit.data,
                            avatar: imageUploaded[0]?.id ?? '',
                        },
                    }
                } else if (dataSubmit.data?.avatar !== null) {
                    delete dataSubmit.data?.avatar
                }

                if (studentId) {
                    await studentService.update(Number(studentId), dataSubmit)
                } else {
                    // create account for this student
                    const userResponse = await userService.create({
                        email: data.data.email,
                        username: data.data.email,
                        password: '000000', // this is default password
                        role: 4,
                    })

                    dataSubmit = {
                        data: {
                            ...dataSubmit.data,
                            user: userResponse.id,
                        },
                    }
                    await studentService.create(dataSubmit)
                }
                await queryClient.refetchQueries({
                    queryKey: [QUERY_KEYS.STUDENT_LIST],
                })
                notification.success({
                    message: studentId
                        ? 'Cập nhật thông tin sinh viên thành công'
                        : 'Thêm sinh viên mới thành công!',
                })
                closeModel?.()
            } catch (err: unknown) {
                console.log('err', err)
                if (
                    isAxiosError(err) &&
                    err.response?.status === HttpStatusCode.BadRequest
                ) {
                    formMethods.setError('data.email', {
                        type: 'validate',
                        message: 'Email này đã được sử dụng!',
                    })
                } else {
                    notification.error({
                        message: 'Có lỗi xảy ra vui lòng thử lại sau!',
                    })
                    closeModel?.()
                }
            }
        },
        [studentId, notification, closeModel, formMethods],
    )

    return {
        formMethods,
        createOrUpdate: handleSubmit(handleCreateOrUpdateStudent),
    } as const
}
