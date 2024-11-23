import { DATE_TIME_FORMAT, GENDERS } from '@/constants'
import { USER_STATUSES } from '@/constants/userConstant'
import { useAppSelector } from '@/hooks'
import { UserStatus } from '@/models'
import { selectCurrentUser } from '@/redux'
import { formatDateTime } from '@/utils'

const FACULTY = 'Khoa Hệ thống thông tin và Viễn thám'
const EDUCATION_SYSTEM = 'DHCQ'

const Row = ({ label, value }: { label: string; value?: string }) => (
    <div className="flex flex-1 items-center divide-x-[1px]">
        <div className="w-40 px-2 py-1 font-bold">{label}</div>
        <div className="flex-1 px-3 py-2 font-medium">{value ?? '___'}</div>
    </div>
)

export const StudentForm = () => {
    const user = useAppSelector(selectCurrentUser)
    const { student } = user

    return (
        <div className="divide-y-[1px] border border-zinc-300">
            <Row label="Mã sinh viên" value={student?.studentCode} />
            <div className="flex divide-x-[1px]">
                <Row label="Họ tên" value={student?.fullName} />
                <Row
                    label="Giới tính"
                    value={
                        student?.gender ? GENDERS[student.gender] : undefined
                    }
                />
            </div>
            <div className="flex divide-x-[1px]">
                <Row
                    label="Ngày sinh"
                    value={
                        student?.dateOfBirth
                            ? formatDateTime(
                                  String(student.dateOfBirth),
                                  DATE_TIME_FORMAT.DATE_ONLY,
                              )
                            : undefined
                    }
                />
                <Row label="Nơi sinh" value={student?.placeOfBirth} />
            </div>
            <div className="flex divide-x-[1px]">
                <Row label="Lớp" value={student?.class?.className} />
                <Row
                    label="Tình trạng"
                    value={
                        student?.status && student.status in UserStatus
                            ? USER_STATUSES[student.status]
                            : undefined
                    }
                />
            </div>
            <div className="flex divide-x-[1px]">
                <Row label="Khoa" value={FACULTY} />
                <Row label="Hệ ĐT" value={EDUCATION_SYSTEM} />
            </div>
            <Row label="Email trường" value={student?.email} />
            <div className="flex divide-x-[1px]">
                <Row label="Email cá nhân" value={student?.personalEmail} />
                <Row label="Điện thoại" value={student?.phoneNumber} />
            </div>
            <div className="flex divide-x-[1px]">
                <Row label="Số CMND" value={student?.cmndNumber} />
                <Row
                    label="Ngày cấp"
                    value={
                        student?.cmndCreatedDate
                            ? formatDateTime(
                                  String(student.cmndCreatedDate),
                                  DATE_TIME_FORMAT.DATE_ONLY,
                              )
                            : undefined
                    }
                />
            </div>
            <div className="flex divide-x-[1px]">
                <Row label="Nơi cấp" value={student?.cmndPlace} />
                <Row label="Tôn giáo" value={student?.religion} />
            </div>
            <div className="flex divide-x-[1px]">
                <Row label="Dân tộc" value={student?.nation} />
                <Row label="Xuất thân" value={student?.origin} />
            </div>
            <div className="flex divide-x-[1px]">
                <Row
                    label="Ngày vào đoàn"
                    value={
                        student?.dateJoinYouthUnion
                            ? formatDateTime(
                                  String(student.dateJoinYouthUnion),
                                  DATE_TIME_FORMAT.DATE_ONLY,
                              )
                            : undefined
                    }
                />
                <Row
                    label="Ngày vào đảng"
                    value={
                        student?.dateJoinCommunistParty
                            ? formatDateTime(
                                  String(student.dateJoinCommunistParty),
                                  DATE_TIME_FORMAT.DATE_ONLY,
                              )
                            : undefined
                    }
                />
            </div>
            <div className="flex divide-x-[1px]">
                <Row label="Họ tên cha" value={student?.father?.fullName} />
                <Row label="Nghề nghiệp" value={student?.father?.job} />
            </div>
            <Row label="SĐT cha" value={student?.father?.phoneNumber} />
            <div className="flex divide-x-[1px]">
                <Row label="Họ tên mẹ" value={student?.mother?.fullName} />
                <Row label="Nghề nghiệp" value={student?.mother?.job} />
            </div>
            <Row label="SĐT mẹ" value={student?.mother?.phoneNumber} />
            <div className="flex divide-x-[1px]">
                <Row label="Họ tên bảo hộ" value={student?.nanny?.fullName} />
                <Row label="SĐT bảo hộ" value={student?.nanny?.phoneNumber} />
            </div>
            <div className="flex divide-x-[1px]">
                <Row label="Địa chỉ thường trú" value={student?.address} />
                <Row label="Phường/Xã" value={student?.ward} />
            </div>
            <div className="flex divide-x-[1px]">
                <Row label="Quận/Huyện" value={student?.district} />
                <Row label="Tỉnh/TP" value={student?.province} />
            </div>
            <Row label="ĐC cha" value={student?.father?.address} />
            <Row label="ĐC mẹ" value={student?.mother?.address} />
            <Row label="ĐC bảo hộ" value={student?.nanny?.address} />
        </div>
    )
}
