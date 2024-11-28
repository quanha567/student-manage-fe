import axios from 'axios'
import { TimetableData } from '../models/timetableModel'
import { API_URL } from '../constants/urlConstant'

export const getTimetable = async (
    semester: string,
    academicYear: string,
): Promise<TimetableData> => {
    const response = await axios.get(`${API_URL}/timetable`, {
        params: {
            semester,
            academicYear,
        },
    })
    return response.data
}
