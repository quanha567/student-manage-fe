import axios from 'axios'

import { API_URL } from '@/constants'
import { StudentLoginRequestModel, StudentLoginResponseModel } from '@/models'

export const studentService = {
    login: (
        data: StudentLoginRequestModel,
    ): Promise<StudentLoginResponseModel> =>
        axios<StudentLoginResponseModel>({
            baseURL: API_URL.STUDENT_LOGIN,
            method: 'POST',
            data,
        })
            .then((res) => res.data)
            .catch((err: unknown) => {
                throw err
            }),
}
