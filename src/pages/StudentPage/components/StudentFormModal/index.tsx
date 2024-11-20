import { useEffect, useState } from 'react'
import { FormProvider } from 'react-hook-form'

import { QueryObserverResult, RefetchOptions } from '@tanstack/react-query'
import dayjs from 'dayjs'

import { Modal, Tabs, TabsProps } from 'antd'

import {
    FormDatePicker,
    FormInput,
    FormSelect,
    FormSingleUpload,
    FormTextArea,
} from '@/components'
import { GENDER_OPTIONS } from '@/constants'
import { USER_STATUS_OPTIONS } from '@/constants/userConstant'
import {
    useAcademicYearOptions,
    useClassOptions,
    useGetStudentDetail,
} from '@/queries'
import { StudentListResponse } from '@/services'
import { DisclosureType } from '@/types'
import { getPreviewUrl } from '@/utils'

import { useStudentForm } from './useStudentForm'

type ClassFormModalProps = DisclosureType & {
    onRefetch: (
        options?: RefetchOptions,
    ) => Promise<QueryObserverResult<StudentListResponse>>
}

export const ClassFormModal = ({
    isOpen,
    toggleOpen,
    id: studentId,
    onRefetch,
}: ClassFormModalProps) => {
    const [tabKey, setTabKey] = useState<string>('1')
    const { createOrUpdate, formMethods } = useStudentForm(
        studentId,
        toggleOpen,
        onRefetch,
    )
    const {
        reset,
        formState: { isDirty },
    } = formMethods

    const { data, isLoading } = useGetStudentDetail(Number(studentId))

    const {
        classOptions,
        classSearchText,
        isLoadingClassOptions,
        loadMoreClassOptions,
        setClassSearchText,
    } = useClassOptions()

    const {
        academicYearOptions,
        academicYearSearchText,
        isLoadingAcademicYearOptions,
        loadMoreAcademicYearOptions,
        setAcademicYearSearchText,
    } = useAcademicYearOptions()

    useEffect(() => {
        if (studentId && data && isOpen) {
            reset({
                data: {
                    ...data.data?.attributes,
                    avatar: getPreviewUrl(data.data?.attributes?.avatar),
                    classId: data.data?.attributes?.class?.data?.id,
                    academicYear: data.data?.attributes?.academicYear?.data?.id,
                    dateOfBirth: data.data?.attributes?.dateOfBirth
                        ? dayjs(data.data.attributes.dateOfBirth)
                        : undefined,
                    dateJoinYouthUnion: data.data?.attributes
                        ?.dateJoinYouthUnion
                        ? dayjs(data.data.attributes.dateJoinYouthUnion)
                        : undefined,
                    dateJoinCommunistParty: data.data?.attributes
                        ?.dateJoinCommunistParty
                        ? dayjs(data.data.attributes.dateJoinCommunistParty)
                        : undefined,
                    cmndCreatedDate: data.data?.attributes?.cmndCreatedDate
                        ? dayjs(data.data.attributes.cmndCreatedDate)
                        : undefined,
                    class: undefined,
                },
            })
        } else {
            reset({})
        }
        setTabKey('1')
    }, [data, studentId, reset, isOpen])

    const tabs: TabsProps['items'] = [
        {
            key: '1',
            label: 'Thông tin cá nhân',
            children: (
                <div className="grid grid-cols-5 gap-4">
                    <div className="row-span-4">
                        <FormSingleUpload
                            label="Avatar"
                            name="data.avatar"
                            isCircle
                        />
                    </div>
                    <FormSelect
                        required
                        showSearch
                        label="Lớp"
                        name="data.classId"
                        loading={isLoadingClassOptions}
                        placeholder="- Chọn lớp học -"
                        options={classOptions}
                        searchValue={classSearchText}
                        onSearch={setClassSearchText}
                        onPopupScroll={loadMoreClassOptions}
                    />
                    <FormSelect
                        required
                        label="Trạng thái học tập"
                        name="data.status"
                        placeholder="- Chọn trạng thái học tập -"
                        options={USER_STATUS_OPTIONS}
                    />
                    <FormInput
                        required
                        label="Họ và tên"
                        name="data.fullName"
                        placeholder="Nhập họ và tên"
                    />
                    <FormSelect
                        label="Giới tính"
                        name="data.gender"
                        options={GENDER_OPTIONS}
                        placeholder="- Chọn giới tính -"
                    />
                    {studentId && (
                        <FormInput
                            required
                            disabled
                            label="Email"
                            name="data.email"
                            type="email"
                            placeholder="example@gmail.com"
                        />
                    )}
                    <FormInput
                        label="Email cá nhân"
                        name="data.personalEmail"
                        type="email"
                        placeholder="example@gmail.com"
                    />
                    <FormInput
                        label="Số điện thoại"
                        name="data.phoneNumber"
                        placeholder="Nhập số điện thoại"
                    />
                    <FormInput
                        label="Số CMND"
                        name="data.cmndNumber"
                        placeholder="Nhập số điện thoại"
                    />
                    <FormDatePicker
                        label="Ngày cấp CMND"
                        name="data.cmndCreatedDate"
                        placeholder="- Chọn ngày cấp -"
                    />
                    <FormTextArea
                        label="Nơi cấp CMND"
                        name="data.cmndPlace"
                        placeholder="Nhập nơi cấp"
                    />
                    <FormInput
                        label="Tôn giáo"
                        name="data.religion"
                        placeholder="Nhập tôn giáo"
                    />
                    <FormInput
                        label="Dân tộc"
                        name="data.nation"
                        placeholder="Nhập dân tộc"
                    />
                    <FormInput
                        label="Xuất thân"
                        name="data.origin"
                        placeholder="Nhập xuất thân"
                    />
                    <FormSelect
                        label="Niên khóa"
                        name="data.academicYear"
                        options={academicYearOptions}
                        loading={isLoadingAcademicYearOptions}
                        onSearch={setAcademicYearSearchText}
                        searchValue={academicYearSearchText}
                        onPopupScroll={loadMoreAcademicYearOptions}
                        placeholder="- Chọn niên khóa -"
                    />
                    <FormDatePicker
                        label="Ngày sinh"
                        name="data.dateOfBirth"
                        placeholder="- Chọn ngày sinh -"
                    />
                    <FormDatePicker
                        label="Ngày vào đoàn"
                        name="data.dateJoinYouthUnion"
                        placeholder="- Chọn ngày vào đoàn -"
                    />
                    <FormDatePicker
                        label="Ngày vào đảng"
                        name="data.dateJoinCommunistParty"
                        placeholder="- Chọn ngày vào đảng -"
                    />
                    <FormTextArea
                        label="Nơi sinh"
                        name="data.placeOfBirth"
                        placeholder="Thêm nơi sinh.."
                    />
                    <FormTextArea
                        label="Địa chỉ"
                        name="data.address"
                        placeholder="Thêm địa chỉ nhà cho sinh viên này..."
                    />
                    <FormTextArea
                        label="Phường/Xã"
                        name="data.ward"
                        placeholder="Thêm phường, xã"
                    />
                    <FormTextArea
                        label="Quận/Huyện"
                        name="data.district"
                        placeholder="Thêm quận, huyện"
                    />
                    <FormTextArea
                        label="Tỉnh/Thành phố"
                        name="data.province"
                        placeholder="Thêm tỉnh, thành phố"
                    />
                    <FormTextArea
                        label="Ghi chú"
                        name="data.note"
                        placeholder="Thêm ghi chú cho sinh viên này..."
                    />
                </div>
            ),
        },
        {
            key: '2',
            label: 'Thông tin người thân',
            children: (
                <div className="grid grid-cols-4 gap-4">
                    <FormInput
                        label="Họ tên cha"
                        name="data.father.fullName"
                        placeholder="Nhập họ và tên cha"
                    />
                    <FormInput
                        label="Số điện thoại cha"
                        name="data.father.phoneNumber"
                        placeholder="Nhập số điện thoại cha"
                    />
                    <FormInput
                        label="Nghề nghiệp cha"
                        name="data.father.job"
                        placeholder="Nhập nghề nghiệp cha"
                    />
                    <FormTextArea
                        label="Địa chỉ cha"
                        name="data.father.address"
                        placeholder="Nhập địa chỉ cha"
                    />
                    <FormInput
                        label="Họ tên mẹ"
                        name="data.mother.fullName"
                        placeholder="Nhập họ và tên mẹ"
                    />
                    <FormInput
                        label="Số điện thoại mẹ"
                        name="data.mother.phoneNumber"
                        placeholder="Nhập số điện thoại mẹ"
                    />
                    <FormInput
                        label="Nghề nghiệp mẹ"
                        name="data.mother.job"
                        placeholder="Nhập nghề nghiệp mẹ"
                    />
                    <FormTextArea
                        label="Địa chỉ mẹ"
                        name="data.mother.address"
                        placeholder="Nhập địa chỉ mẹ"
                    />
                    <FormInput
                        label="Họ tên bảo mẫu"
                        name="data.nanny.fullName"
                        placeholder="Nhập họ và tên bảo mẫu"
                    />
                    <FormInput
                        label="Số điện thoại bảo mẫu"
                        name="data.nanny.phoneNumber"
                        placeholder="Nhập số điện thoại bảo mẫu"
                    />
                    <FormInput
                        label="Nghề nghiệp bảo mẫu"
                        name="data.nanny.job"
                        placeholder="Nhập nghề nghiệp bảo mẫu"
                    />
                    <FormTextArea
                        label="Địa chỉ bảo mẫu"
                        name="data.nanny.address"
                        placeholder="Nhập địa chỉ bảo mẫu"
                    />
                </div>
            ),
        },
    ]

    return (
        <Modal
            centered
            open={isOpen}
            onCancel={() => {
                toggleOpen()
            }}
            maskClosable
            closable
            okText={studentId ? 'Lưu thay đổi' : 'Thêm mới'}
            okButtonProps={{
                loading: formMethods.formState.isSubmitting,
                onClick: createOrUpdate,
                disabled: Boolean(!isDirty && studentId),
            }}
            title={
                <p className="mb-4 text-center text-xl font-bold">
                    {studentId
                        ? 'Cập nhật thông tin sinh viên'
                        : 'Thêm sinh viên mới'}
                </p>
            }
            width={'90%'}
            classNames={{
                header: 'text-2xl',
            }}
            loading={Boolean(isLoading && studentId)}
        >
            <FormProvider {...formMethods}>
                <Tabs items={tabs} activeKey={tabKey} onChange={setTabKey} />
            </FormProvider>
        </Modal>
    )
}
