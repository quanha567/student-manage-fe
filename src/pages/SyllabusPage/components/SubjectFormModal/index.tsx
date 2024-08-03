import { useCallback, useEffect, useState } from 'react'
import { FormProvider } from 'react-hook-form'

import { InboxOutlined } from '@ant-design/icons'
import { AxiosProgressEvent } from 'axios'
import { FaFileAlt } from 'react-icons/fa'
import { IoClose } from 'react-icons/io5'

import { App, Empty, Modal, Spin, UploadProps } from 'antd'
import Dragger from 'antd/es/upload/Dragger'

import { FormInput, FormTextArea } from '@/components'
import { ENV_CONFIGS } from '@/configs'
import { ImageData } from '@/models'
import { useGetSyllabusDetail } from '@/queries'
import { fileService } from '@/services'
import { DisclosureType } from '@/types'

import { useSyllabusForm } from './useSyllabusForm'

type SyllabusFormModalProps = DisclosureType

export const SyllabusFormModal = ({
    isOpen,
    toggleOpen,
    id,
}: SyllabusFormModalProps) => {
    const [fileList, setFileList] = useState<ImageData[]>([])
    const [isUploading, setIsUploading] = useState<boolean>(false)

    const { createOrUpdate, formMethods } = useSyllabusForm(id, toggleOpen)

    const { notification } = App.useApp()

    const {
        reset,
        formState: { isDirty },
        setValue,
        getValues,
        watch,
    } = formMethods

    const fileIds = watch('data.files')

    console.log(fileIds)

    const { data, isLoading } = useGetSyllabusDetail(Number(id))

    useEffect(() => {
        if (id && data && isOpen) {
            reset({
                data: {
                    ...data.data?.attributes,
                    files: Array.isArray(data.data?.attributes?.files?.data)
                        ? data.data.attributes.files.data.map((file) =>
                              Number(file.id),
                          )
                        : [],
                },
            })
            setFileList(
                Array.isArray(data.data?.attributes?.files?.data)
                    ? data.data.attributes.files.data.map(
                          (file) =>
                              ({
                                  ...file?.attributes,
                                  id: file.id,
                              }) as ImageData,
                      )
                    : [],
            )
        } else {
            reset({
                data: {
                    description: '',
                    name: '',
                },
            })
            setFileList([])
        }
    }, [data, id, reset, isOpen])

    const handlePreviewFile = useCallback(
        (file: ImageData) => {
            let linkPreview = ''

            if (file.formats) {
                // Check for the 'large' format first
                if (file.formats.large?.url) {
                    linkPreview = file.formats.large.url
                }
                // Check for other formats if 'large' is not available
                if (file.formats.medium?.url) {
                    linkPreview = file.formats.medium.url
                }
                if (file.formats.small?.url) {
                    linkPreview = file.formats.small.url
                }
                if (file.formats.thumbnail?.url) {
                    linkPreview = file.formats.thumbnail.url
                }
            }
            // Return the main image URL if no formats are available
            if (file.url) linkPreview = file.url

            if (linkPreview)
                window.open(`${ENV_CONFIGS.BASE_URL}${linkPreview}`, '_blank')
            else
                notification.error({
                    message: 'Không tìm thấy đường dẫn cho đề cương này!',
                })
        },
        [notification],
    )

    const handleDeleteFile = useCallback(
        (file: ImageData) => {
            if (!file.id) return

            let fileIds = getValues('data.files')

            if (Array.isArray(fileIds) && fileIds.length > 0) {
                fileIds = fileIds.filter((id) => id !== file.id)
            }

            setFileList((prevFile) =>
                prevFile.filter((item) => item.id !== file.id),
            )
            setValue('data.files', fileIds, {
                shouldDirty: true,
            })
        },
        [setValue, getValues, setFileList],
    )

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const uploadImage = async (options: any) => {
        const { onSuccess, onError, file, onProgress } = options

        const fmData = new FormData()

        try {
            setIsUploading(true)
            fmData.append('files', file as Blob)
            const res = await fileService.uploadFiles(
                fmData,
                (event: AxiosProgressEvent) => {
                    onProgress({
                        percent: (event.loaded / (event.total ?? 1)) * 100,
                    })
                },
            )

            onSuccess(res)
            setFileList([...fileList, ...res])
            setValue(
                'data.files',
                [
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    ...((getValues('data.files') as number[]) || []),
                    ...res.map((file) => file.id),
                ],
                {
                    shouldDirty: true,
                },
            )
        } catch (err) {
            console.log('Error: ', err)
            onError({ err })
            notification.error({
                message: 'Có lỗi xảy ra vui lòng thử lại!',
            })
        } finally {
            setIsUploading(false)
        }
    }

    const props: UploadProps = {
        name: 'file',
        multiple: true,
        customRequest: uploadImage,
        maxCount: 10,
        showUploadList: false,
    }

    return (
        <Modal
            centered
            closable
            maskClosable
            open={isOpen}
            onCancel={() => toggleOpen()}
            okText={id ? 'Lưu thay đổi' : 'Thêm mới'}
            okButtonProps={{
                loading: formMethods.formState.isSubmitting,
                onClick: createOrUpdate,
                disabled: Boolean(!isDirty && id),
            }}
            className="!w-full xl:max-w-[50%]"
            title={
                <p className="mb-4 text-center text-xl font-bold">
                    {id ? 'Cập nhật thông tin đề cương' : 'Thêm đề cương mới'}
                </p>
            }
            classNames={{
                header: 'text-2xl',
            }}
            loading={Boolean(isLoading && id)}
        >
            <FormProvider {...formMethods}>
                <Spin spinning={isUploading}>
                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <Dragger {...props}>
                                <p className="ant-upload-drag-icon">
                                    <InboxOutlined />
                                </p>
                                <p className="ant-upload-text">
                                    Ấn hoặc kéo thả file vào đây để tải lên tài
                                    liệu
                                </p>
                                <p className="ant-upload-hint">
                                    Hỗ trợ tải lên một lần hoặc hàng loạt.
                                    Nghiêm cấm tải lên dữ liệu công ty hoặc các
                                    tệp bị cấm khác.
                                </p>
                            </Dragger>
                        </div>
                        <div className="col-span-2 space-y-4">
                            <FormInput
                                required
                                label="Tên đề cương"
                                name="data.name"
                                placeholder="Nhập tên đề cương"
                            />
                            <FormTextArea
                                allowClear
                                rows={4}
                                label="Mô tả"
                                name="data.description"
                                placeholder="Nhập mô tả đề cương"
                            />
                        </div>
                        <div className="col-span-3">
                            <p className="mb-2 font-bold">Tài liệu</p>
                            {Array.isArray(fileList) && fileList.length > 0 ? (
                                <div className="grid grid-cols-3 gap-4 transition-all">
                                    {Array.from(fileList, (file, index) => (
                                        <div
                                            key={index}
                                            onClick={() =>
                                                handlePreviewFile(file)
                                            }
                                            className="relative flex cursor-pointer items-center gap-2 rounded-lg border border-zinc-100 p-3 font-medium hover:text-blue-600"
                                        >
                                            <div
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleDeleteFile(file)
                                                }}
                                                className="absolute right-0 top-0 -translate-y-1/3 translate-x-1/3 cursor-pointer rounded-full bg-red-600 text-white"
                                            >
                                                <IoClose />
                                            </div>
                                            <FaFileAlt className="size-5" />
                                            <span className="line-clamp-1">
                                                {file.name}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-8">
                                    {Empty.PRESENTED_IMAGE_SIMPLE}
                                    <span>Chưa có tài liệu nào</span>
                                </div>
                            )}
                        </div>
                    </div>
                </Spin>
            </FormProvider>
        </Modal>
    )
}
