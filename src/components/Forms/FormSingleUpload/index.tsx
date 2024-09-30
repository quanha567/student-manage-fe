import {
    ChangeEvent,
    DragEvent,
    MouseEvent,
    useEffect,
    useId,
    useMemo,
    useRef,
    useState,
} from 'react'
import {
    Controller,
    FieldValues,
    RegisterOptions,
    useFormContext,
} from 'react-hook-form'

import { FaCloudDownloadAlt, FaCloudUploadAlt } from 'react-icons/fa'
import { MdDelete } from 'react-icons/md'
import { RiEyeFill } from 'react-icons/ri'

import { App } from 'antd'

import { ImagePreview, Progress } from '@/components'

import FormField from '../FormField'

interface FormSingleUploadProps {
    acceptType?: string[] | string
    className?: string
    isCircle?: boolean
    isCompact?: boolean
    label?: string
    name: string
    resizeMode?: 'object-contain' | 'object-cover' | 'object-fill'
    rules?:
        | Omit<
              RegisterOptions<FieldValues, string>,
              'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
          >
        | undefined
    setDeleteImageIds?: () => void
    showPreview?: boolean
}

export const FormSingleUpload = ({
    label,
    name,
    rules,
    isCircle,
    className,
    resizeMode,
    isCompact,
    showPreview = true,
    acceptType = ['image/png', 'image/jpg', 'image/jpeg', 'image/gif'],
    setDeleteImageIds,
}: FormSingleUploadProps) => {
    const uploadId = useId()

    const timer = useRef<NodeJS.Timeout>()

    const prevProgress = useRef<number>(0)

    const { notification } = App.useApp()

    const fileUploadRef = useRef<HTMLInputElement>(null)

    const [currentProgress, setCurrentProgress] = useState<number>(0)

    const [isOpenPreview, setIsOpenPreview] = useState<boolean>(false)

    const [isDraggingFile, setIsDraggingFile] = useState<boolean>(false)

    const { control, setValue, watch } = useFormContext()

    const currentFile = watch(name)

    useEffect(() => {
        window.addEventListener('dragenter', handleDragFile)
        window.addEventListener('dragleave', handleDragFile)
        window.addEventListener('dragover', handleDragFile)
        window.addEventListener('drop', handleDropOnWindow)
        window.addEventListener('blur', handleDropOnWindow)

        return () => {
            window.removeEventListener('dragleave', handleDragFile)
            window.removeEventListener('dragenter', handleDragFile)
            window.removeEventListener('dragover', handleDragFile)
            window.addEventListener('drop', handleDropOnWindow)
            window.addEventListener('blur', handleDropOnWindow)
        }
    }, [])

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDropOnWindow = (e: any) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDraggingFile(false)
    }

    const fileUrl = useMemo(() => {
        try {
            return typeof currentFile === 'string'
                ? currentFile
                : currentFile instanceof Blob
                  ? URL.createObjectURL(currentFile)
                  : ''
        } catch (err) {
            return ''
        }
    }, [currentFile])

    const uploadFile = (file?: Blob) => {
        if (currentFile) {
            setValue(name, null, {
                shouldDirty: true,
            })
        }

        timer.current = setInterval(() => {
            if (prevProgress.current < 100) {
                prevProgress.current += Math.ceil(
                    Math.random() * 5 + currentProgress + 1,
                )
                setCurrentProgress(prevProgress.current)

                return
            }

            if (file && fileUploadRef.current) {
                setValue(name, file, {
                    shouldDirty: true,
                })
                fileUploadRef.current.value = ''
                setCurrentProgress(0)
                prevProgress.current = 0
                // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                clearInterval(timer.current)
            }
        }, 15)
    }

    const handleUploadFile = (e: ChangeEvent<HTMLInputElement>) => {
        uploadFile(e.target.files?.[0])
    }

    const handleClearFile = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        setDeleteImageIds && setDeleteImageIds()
        setValue(name, null, { shouldDirty: true })
    }

    const handlePreviewFile = (e: MouseEvent<HTMLDivElement>) => {
        e.preventDefault()
        setIsOpenPreview(true)
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const handleDragFile = (e: any) => {
        console.log('dragenter')

        e.preventDefault()
        e.stopPropagation()

        if (
            (e.type === 'dragenter' || e.type === 'dragover') &&
            (e.clientX && e.clientY && e.screenX && e.screenY) > 0
        ) {
            setIsDraggingFile(true)
        }
    }

    const handleDropFile = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
        e.stopPropagation()
        setIsDraggingFile(false)

        const targetFile = e.dataTransfer.files[0]

        if (
            acceptType === targetFile.type ||
            acceptType === '*' ||
            acceptType.includes(targetFile.type)
        ) {
            uploadFile(e.dataTransfer.files[0])
        } else {
            notification.warning({
                message: 'Định dạng file không được hỗ trợ!',
            })
        }
    }

    const handlePreventDragImage = (e: DragEvent<HTMLDivElement>) => {
        e.preventDefault()
    }

    return (
        <div>
            <FormField
                label={label}
                renderField={() => (
                    <Controller
                        control={control}
                        name={name}
                        rules={rules}
                        render={({ fieldState: { error } }) => (
                            <div>
                                <div
                                    className={`relative w-full ${
                                        isCircle ? 'pt-[100%]' : 'pt-[56.65%]'
                                    } ${className ?? ''}`}
                                >
                                    <label
                                        htmlFor={uploadId}
                                        className="absolute bottom-0 left-0 right-0 top-0"
                                    >
                                        <div
                                            className={`form-upload-container relative flex h-full w-full cursor-pointer select-none flex-col items-center justify-center overflow-hidden border-2 border-dashed border-zinc-300 p-1 text-zinc-300 transition-all hover:border-zinc-400 hover:text-zinc-400 ${
                                                error?.message
                                                    ? '!border-danger hover:border-danger'
                                                    : ''
                                            } ${isCircle ? 'rounded-full' : 'rounded-lg'}`}
                                            onDragEnter={handleDragFile}
                                            onDragLeave={handleDragFile}
                                            onDragOver={handleDragFile}
                                            onDrop={handleDropFile}
                                        >
                                            {fileUrl &&
                                            !isDraggingFile &&
                                            showPreview ? (
                                                <>
                                                    <img
                                                        onDragStart={
                                                            handlePreventDragImage
                                                        }
                                                        alt="Upload Image"
                                                        className={`h-full w-full transition-all duration-500 hover:scale-110 ${
                                                            isCircle
                                                                ? 'rounded-full'
                                                                : ''
                                                        } ${
                                                            (resizeMode ??
                                                            isCircle)
                                                                ? 'object-cover'
                                                                : 'object-contain'
                                                        }`}
                                                        src={fileUrl}
                                                    />
                                                    <div className="form-upload-action absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 gap-2">
                                                        <div
                                                            className="h-7 w-7 rounded bg-white p-1 transition-all hover:scale-150 hover:bg-sky-500 hover:text-white"
                                                            onClick={
                                                                handlePreviewFile
                                                            }
                                                        >
                                                            <RiEyeFill className="h-full w-full" />
                                                        </div>
                                                        <div
                                                            className="hover:bg-danger h-7 w-7 rounded bg-white p-1 transition-all hover:scale-150 hover:bg-red-500 hover:text-white"
                                                            onClick={
                                                                handleClearFile
                                                            }
                                                        >
                                                            <MdDelete className="h-full w-full" />
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="flex w-full flex-col items-center py-2">
                                                    <div
                                                        className={`aspect-square ${
                                                            isCompact
                                                                ? 'w-3/5'
                                                                : 'w-1/2 md:w-[15%]'
                                                        }`}
                                                    >
                                                        <FaCloudUploadAlt className="h-full w-full" />
                                                    </div>
                                                    {!isCompact && (
                                                        <>
                                                            <p className="hidden text-center text-[10px] text-current md:block md:text-xs lg:text-sm">
                                                                Kéo và thả file
                                                                vào đây
                                                            </p>
                                                            <div className="relative mx-auto my-[4%] hidden h-[1px] w-2/5 bg-current md:block">
                                                                <span className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 bg-white px-2 text-[10px] md:text-xs">
                                                                    hoặc
                                                                </span>
                                                            </div>
                                                        </>
                                                    )}

                                                    {currentProgress ? (
                                                        <Progress
                                                            percent={
                                                                currentProgress
                                                            }
                                                            className="px-[10%]"
                                                        />
                                                    ) : isCompact ? (
                                                        <></>
                                                    ) : (
                                                        <div className="hidden w-full max-w-[96px] rounded bg-zinc-200 p-[1%] text-center text-[10px] text-sm font-bold text-zinc-700 transition-all hover:bg-primary hover:text-white md:block md:text-xs lg:text-sm">
                                                            CHỌN FILE
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                            {isDraggingFile && (
                                                <div className="absolute bottom-0.5 left-0.5 right-0.5 top-0.5 flex flex-col items-center justify-center bg-white">
                                                    <div className="aspect-square w-[15%]">
                                                        <FaCloudDownloadAlt />
                                                    </div>
                                                    <p className="text-lg font-medium text-zinc-400">
                                                        Thả file vào đây
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </label>
                                    <input
                                        id={uploadId}
                                        type="file"
                                        ref={fileUploadRef}
                                        className="hidden"
                                        onChange={handleUploadFile}
                                        accept={
                                            typeof acceptType === 'string'
                                                ? acceptType
                                                : acceptType.join(', ')
                                        }
                                    />
                                </div>
                                <span className="text-danger text-xs">
                                    {error?.message}
                                </span>
                                {/* {!showPreview && currentFile && (
                                    <div className="mt-2 flex items-center rounded border border-dashed border-zinc-200 p-1">
                                        <SVG
                                            src={getFileIcon()}
                                            className="h-7 w-7"
                                        />
                                        <p className="mx-2 line-clamp-1 flex-1 font-medium">
                                            {currentFile instanceof Blob
                                                ? (currentFile as any)?.name
                                                : typeof currentFile ===
                                                    'string'
                                                  ? currentFile
                                                  : 'Unknown'}
                                        </p>
                                        <div
                                            onClick={handleClearFile}
                                            className="hover:bg-danger h-7 w-7 cursor-pointer rounded p-1.5 transition-all hover:scale-105 hover:text-white"
                                        >
                                            <SVG
                                                src={TrashBinSvg}
                                                className="h-full w-full"
                                            />
                                        </div>
                                    </div>
                                )} */}
                            </div>
                        )}
                    />
                )}
            />
            {fileUrl ? (
                <ImagePreview
                    visible={isOpenPreview}
                    onClose={() => {
                        setIsOpenPreview(false)
                    }}
                    src={fileUrl}
                />
            ) : (
                <></>
            )}
        </div>
    )
}
