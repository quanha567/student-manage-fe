import { Button } from '@/components'
import { DATE_TIME_FORMAT, GENDERS } from '@/constants'
import { useAppSelector } from '@/hooks'
import { selectCurrentUser } from '@/redux'
import { formatDateTime } from '@/utils'
import React, { useRef } from 'react'

interface Course {
    courseId: number
    courseName: string
    courseCode: string
    credits: number
    scoreQT: number
    scoreGK: number
    scoreTH: number
    scoreCK: number
    totalScore: string
    gpaScore: number
    remarks: string
}

interface Semester {
    semesterId: number
    semesterName: string
    year: string
    totalCredits: number
    gpaAverage: string
    courses: Course[]
}

interface StudentData {
    studentName: string
    studentCode: string
    dob: string
    gender: string
    program: string
    department: string
    class: string
    faculty: string
    groupedScores: Semester[]
}

interface Props {
    data: StudentData
}

const RowData = ({ label, value }) => {
    return (
        <div
            style={{
                borderRight: '1px solid black',
            }}
            className="flex flex-1 items-center"
        >
            <div
                style={{ borderRight: '1px solid black' }}
                className="flex-1 p-2 font-medium"
            >
                {label}:
            </div>
            <div className="flex-1 p-2 font-bold">{value}</div>
        </div>
    )
}

const AcademicReport: React.FC<Props> = ({ data }) => {
    const user = useAppSelector(selectCurrentUser)

    return (
        <>
            <div style={{ padding: '20px' }}>
                <h2
                    style={{ textAlign: 'center' }}
                    className="mb-4 text-2xl font-bold"
                >
                    BẢNG ĐIỂM SINH VIÊN
                </h2>
                {/* Student Information */}
                <div
                    style={{
                        border: '1px solid black',
                    }}
                >
                    <div
                        style={{
                            borderBottom: '1px solid black',
                        }}
                        className="flex"
                    >
                        <RowData
                            label="Họ và tên"
                            value={user?.student?.fullName}
                        />{' '}
                        <RowData
                            label="Ngày sinh"
                            value={
                                user?.student?.dateOfBirth
                                    ? formatDateTime(
                                          String(user?.student?.dateOfBirth),
                                          DATE_TIME_FORMAT.DATE_ONLY,
                                      )
                                    : ''
                            }
                        />
                        <RowData
                            label="Giới tính"
                            value={
                                user?.student?.gender
                                    ? GENDERS[user?.student?.gender]
                                    : ''
                            }
                        />
                    </div>{' '}
                    <div
                        className="flex"
                        style={{
                            borderBottom: '1px solid black',
                        }}
                    >
                        <RowData
                            label="Mã SV"
                            value={user?.student?.studentCode}
                        />{' '}
                        <RowData
                            label="Lớp sinh hoạt"
                            value={
                                user?.student?.class?.data?.attributes
                                    ?.className
                            }
                        />
                        <RowData label="Hệ đào tạo" value={'DHCQ'} />
                    </div>{' '}
                    <div className="flex">
                        <RowData label="Bậc đào tạo" value={'Đại học'} />{' '}
                        <div className="flex flex-[2]">
                            <div
                                style={{
                                    borderRight: '1px solid black',
                                }}
                                className="min-w-20 p-2 font-medium"
                            >
                                Khoa
                            </div>
                            <div className="flex-1 p-2 font-bold">
                                Khoa Công nghệ thông tin
                            </div>
                        </div>
                    </div>
                </div>
                <div>
                    <table
                        style={{
                            width: '100%',
                            borderCollapse: 'collapse',
                            fontSize: '14px',
                        }}
                    >
                        <thead>
                            <tr>
                                <th style={tableHeaderStyle}>Mã HP</th>
                                <th style={tableHeaderStyle}>Tên học phần</th>
                                <th style={tableHeaderStyle}>Tín chỉ</th>
                                <th style={tableHeaderStyle}>Điểm QT</th>
                                <th style={tableHeaderStyle}>Điểm GK</th>
                                <th style={tableHeaderStyle}>Điểm TH</th>
                                <th style={tableHeaderStyle}>Điểm CK</th>
                                <th style={tableHeaderStyle}>Điểm HP</th>
                                <th style={tableHeaderStyle}>Điểm hệ 4</th>
                                <th style={tableHeaderStyle}>Ghi chú</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.groupedScores.map((semester) => (
                                <>
                                    <tr
                                        style={{
                                            border: '1px solid black',
                                        }}
                                    >
                                        <td colSpan={10} className="p-1">
                                            {semester.semesterName}
                                        </td>
                                    </tr>

                                    {semester.courses.map((course) => (
                                        <tr key={course.courseId}>
                                            <td style={tableCellStyle}>
                                                {course.courseCode}
                                            </td>
                                            <td style={tableCellStyle}>
                                                {course.courseName}
                                            </td>
                                            <td style={tableCellStyle}>
                                                {course.credits}
                                            </td>
                                            <td style={tableCellStyle}>
                                                {course.scoreQT}
                                            </td>
                                            <td style={tableCellStyle}>
                                                {course.scoreGK}
                                            </td>
                                            <td style={tableCellStyle}>
                                                {course.scoreTH}
                                            </td>
                                            <td style={tableCellStyle}>
                                                {course.scoreCK}
                                            </td>
                                            <td style={tableCellStyle}>
                                                {course.totalScore}
                                            </td>
                                            <td style={tableCellStyle}>
                                                {course.gpaScore}
                                            </td>
                                            <td style={tableCellStyle}>
                                                {course.remarks}
                                            </td>
                                        </tr>
                                    ))}
                                    <tr
                                        style={{
                                            border: '1px solid black',
                                        }}
                                    >
                                        <td style={tableCellStyle}></td>
                                        <td
                                            style={tableCellStyle}
                                            className="p-1 font-bold"
                                        >
                                            Trung bình học kỳ
                                        </td>
                                        <td
                                            style={tableCellStyle}
                                            className="p-1"
                                        >
                                            {semester.totalCredits}
                                        </td>
                                        <td style={tableCellStyle}></td>
                                        <td style={tableCellStyle}></td>
                                        <td style={tableCellStyle}></td>
                                        <td style={tableCellStyle}></td>
                                        <td style={tableCellStyle}>
                                            {semester.gpaAverage}
                                        </td>
                                        <td style={tableCellStyle}>
                                            {semester.gpaAverage}
                                        </td>
                                    </tr>
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    )
}

// Table Styling
const tableHeaderStyle: React.CSSProperties = {
    border: '1px solid black',
    padding: '8px',
    backgroundColor: '#f1f1f1',
    textAlign: 'center',
}

const tableCellStyle: React.CSSProperties = {
    border: '1px solid black',
    padding: '8px',
    textAlign: 'center',
}

export default AcademicReport
