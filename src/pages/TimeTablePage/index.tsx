import { useState } from 'react'

import { Card, Select } from 'antd'

const { Option } = Select

const TimeTablePage = () => {
    const [selectedSemester, setSelectedSemester] = useState<string | null>(
        null,
    )

    const semesters = [
        { id: 'semester1', name: 'Học kỳ 1' },
        { id: 'semester2', name: 'Học kỳ 2' },
        { id: 'semester3', name: 'Học kỳ 3' },
    ]

    const schedule = [
        {
            courseName: 'Lập trình di động',
            courseCode: '0000000001',
            day: 'Monday',
            startTime: '06:30:00.000',
            endTime: '09:00:00.000',
            room: 'N/A',
        },
        {
            courseName: 'Lập trình di động',
            courseCode: '0000000001',
            day: 'Wednesday',
            startTime: '09:00:00.000',
            endTime: '11:30:00.000',
            room: 'N/A',
        },
    ]

    const handleSemesterChange = (value: string) => {
        setSelectedSemester(value)
    }

    return (
        <Card>
            <div>
                <p className="font-bold">Học kỳ</p>
                <Select
                    className="!w-full max-w-80"
                    placeholder="- Chọn học kỳ -"
                    onChange={handleSemesterChange}
                    value={selectedSemester}
                >
                    {semesters.map((semester) => (
                        <Option key={semester.id} value={semester.id}>
                            {semester.name}
                        </Option>
                    ))}
                </Select>
            </div>

            <div className="mt-10">
                <p className="text-center text-2xl font-bold">
                    {selectedSemester
                        ? `THỜI KHÓA BIỂU ${semesters.find((s) => s.id === selectedSemester)?.name ?? ''}`
                        : 'THỜI KHÓA BIỂU'}
                </p>
                <p className="text-center text-xl font-bold">
                    MSSV - 359827458426
                </p>

                <div className="mt-6">
                    <table
                        className="w-full"
                        style={{
                            border: '1px solid black',
                            borderCollapse: 'collapse',
                        }}
                    >
                        <thead className="bg-zinc-200">
                            <tr>
                                <th
                                    className="w-32 p-2"
                                    style={tableHeaderStyle}
                                >
                                    Thứ / Tiết
                                </th>
                                {[
                                    'Monday',
                                    'Tuesday',
                                    'Wednesday',
                                    'Thursday',
                                    'Friday',
                                    'Saturday',
                                    'Sunday',
                                ].map((day) => (
                                    <th
                                        key={day}
                                        style={tableHeaderStyle}
                                        className="p-2"
                                    >
                                        {day}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {[...Array(12)].map((_, period) => {
                                // Create an object to track skipped cells for each day
                                const skipMap: { [key: string]: number } = {}

                                return (
                                    <tr key={period + 1}>
                                        <td style={tableCellStyle}>
                                            <p>Tiết {period + 1}</p>
                                            <p>{getPeriodTime(period + 1)}</p>
                                        </td>

                                        {[
                                            'Monday',
                                            'Tuesday',
                                            'Wednesday',
                                            'Thursday',
                                            'Friday',
                                            'Saturday',
                                            'Sunday',
                                        ].map((day, i) => {
                                            // Skip this cell if it's covered by a previous rowSpan
                                            if (
                                                skipMap[day] &&
                                                skipMap[day] > 0
                                            ) {
                                                skipMap[day]--
                                                return null
                                            }

                                            const course = schedule.find(
                                                (row) =>
                                                    isInTimeSlot(
                                                        row,
                                                        period + 1,
                                                        day,
                                                    ),
                                            )

                                            if (course) {
                                                const rowSpan =
                                                    calculateRowSpan(course)
                                                if (rowSpan > 0) {
                                                    // Update skipMap for future rows
                                                    skipMap[day] = rowSpan - 1
                                                    return (
                                                        <td
                                                            key={i}
                                                            style={
                                                                tableCellStyle
                                                            }
                                                            rowSpan={rowSpan}
                                                        >
                                                            <div>
                                                                <p>
                                                                    {
                                                                        course.courseName
                                                                    }
                                                                </p>
                                                                <p>
                                                                    {
                                                                        course.room
                                                                    }
                                                                </p>
                                                                <p>{`${course.startTime} - ${course.endTime}`}</p>
                                                            </div>
                                                        </td>
                                                    )
                                                }
                                            }

                                            // If there's no course or no rowSpan, leave the cell empty
                                            return (
                                                <td
                                                    key={i}
                                                    style={tableCellStyle}
                                                ></td>
                                            )
                                        })}
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </Card>
    )
}

const isInTimeSlot = (entry: any, period: number, day: string): boolean => {
    const periodTimes = [
        '06:30:00.000',
        '07:15:00.000',
        '08:00:00.000',
        '09:00:00.000',
        '09:45:00.000',
        '10:30:00.000',
        '12:30:00.000',
        '13:15:00.000',
        '14:00:00.000',
        '15:00:00.000',
        '15:45:00.000',
        '16:15:00.000',
    ]
    const periodStartTime = periodTimes[period - 1]
    const periodEndTime = periodTimes[period] || '23:59:59.999'

    // Check if the course matches the day and the time
    const courseStartTime = entry.startTime
    const courseEndTime = entry.endTime

    // If the course matches the day, and the course's time falls within the period's time range
    if (entry.day === day) {
        return (
            (courseStartTime >= periodStartTime &&
                courseStartTime < periodEndTime) || // Start time within the period
            (courseEndTime > periodStartTime &&
                courseEndTime <= periodEndTime) || // End time within the period
            (courseStartTime <= periodStartTime &&
                courseEndTime >= periodEndTime) // Course spans the whole period
        )
    }

    return false
}

const calculateRowSpan = (entry: any): number => {
    const periodTimes = [
        '06:30:00.000',
        '07:15:00.000',
        '08:00:00.000',
        '09:00:00.000',
        '09:45:00.000',
        '10:30:00.000',
        '12:30:00.000',
        '13:15:00.000',
        '14:00:00.000',
        '15:00:00.000',
        '15:45:00.000',
        '16:15:00.000',
    ]
    const startIndex = periodTimes.indexOf(entry.startTime)
    const endIndex = periodTimes.indexOf(entry.endTime)
    return endIndex - startIndex + 1 // +1 to count both periods
}

const getPeriodTime = (period: number): string => {
    const times = [
        '6:30 - 7:15',
        '7:15 - 8:00',
        '8:00 - 9:00',
        '9:00 - 9:45',
        '9:45 - 10:30',
        '10:30 - 11:30',
        '12:30 - 13:15',
        '13:15 - 14:00',
        '14:00 - 15:00',
        '15:00 - 15:45',
        '15:45 - 16:15',
        '16:15 - 17:30',
    ]
    return times[period - 1] || ''
}

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
    verticalAlign: 'top',
}

export default TimeTablePage
