import React from 'react'

import {
    DownloadOutlined,
    RotateLeftOutlined,
    RotateRightOutlined,
    SwapOutlined,
    ZoomInOutlined,
    ZoomOutOutlined,
} from '@ant-design/icons'

import { App, Image, Space } from 'antd'

interface ImagePreviewProps {
    className?: string
    onClose?: () => void
    src?: string
    visible?: boolean
}

export const ImagePreview: React.FC<ImagePreviewProps> = ({
    visible = false,
    onClose,
    src,
    className,
}) => {
    const { notification } = App.useApp()
    const onDownload = async (src: string) => {
        try {
            await fetch(src)
                .then((response) => response.blob())
                .then((blob) => {
                    const url = URL.createObjectURL(new Blob([blob]))

                    const link = document.createElement('a')

                    link.href = url
                    link.download = 'image.png'
                    document.body.appendChild(link)
                    link.click()
                    URL.revokeObjectURL(url)
                    link.remove()
                })
            notification.success({
                message: 'Tải hình ảnh thành công',
            })
        } catch (error) {
            notification.error({
                message: 'Lỗi khi tải hình ảnh',
            })
            console.log('🚀 ~ onDownload ~ error:', error)
        }
    }

    return (
        <Image
            preview={{
                visible: visible,
                src: src,
                className: `flex justify-center items-center ${className ?? ''}`,
                onVisibleChange: () => {
                    onClose?.()
                },
                toolbarRender: (
                    _,
                    {
                        transform: { scale },
                        actions: {
                            onFlipY,
                            onFlipX,
                            onRotateLeft,
                            onRotateRight,
                            onZoomOut,
                            onZoomIn,
                        },
                    },
                ) => (
                    <Space size={12} className="toolbar-wrapper">
                        <DownloadOutlined
                            onClick={() => src && onDownload(src)}
                        />
                        <SwapOutlined rotate={90} onClick={onFlipY} />
                        <SwapOutlined onClick={onFlipX} />
                        <RotateLeftOutlined onClick={onRotateLeft} />
                        <RotateRightOutlined onClick={onRotateRight} />
                        <ZoomOutOutlined
                            disabled={scale === 1}
                            onClick={onZoomOut}
                        />
                        <ZoomInOutlined
                            disabled={scale === 50}
                            onClick={onZoomIn}
                        />
                    </Space>
                ),
            }}
        />
    )
}
