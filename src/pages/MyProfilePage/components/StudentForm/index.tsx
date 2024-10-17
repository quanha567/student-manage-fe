import { FormInput, FormTextArea } from '@/components'

export const StudentForm = () => {
    return (
        <div className="grid grid-cols-3 gap-4">
            <FormInput label="Họ và tên sinh viên" name="fullName" readOnly />
            <FormInput label="Email" name="email" readOnly />
            <FormInput label="Số điện thoại" name="phoneNumber" readOnly />
            <FormInput
                label="Khoa"
                name="class.department.departmentName"
                value="Công nghệ thông tin"
                readOnly
            />
            <FormInput label="Lớp theo học" name="class.className" readOnly />
            <FormInput label="Giới tính" name="gender" readOnly />
            <FormInput label="Ngày sinh" name="dateOfBirth" readOnly />
            <FormTextArea label="Địa chỉ" name="address" rows={2} readOnly />
            <FormTextArea
                label="Ghi chú sinh viên"
                name="note"
                rows={2}
                readOnly
            />
        </div>
    )
}
