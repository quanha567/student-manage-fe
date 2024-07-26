import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

import { Breadcrumb as AntdBreadcrumb } from 'antd'

import { PAGE_PATHS } from '@/constants'

interface BreadcrumbItem {
    path?: string
    title: string
}

interface BreadcrumbProps {
    items?: BreadcrumbItem[]
    pageName: string
    renderRight?: ReactNode
}

export const Breadcrumb = ({
    pageName,
    renderRight,
    items,
}: BreadcrumbProps) => {
    const navigate = useNavigate()
    return (
        <div className="mb-4 flex items-end justify-between">
            <div>
                <h1 className="text-3xl font-bold">{pageName}</h1>
                <AntdBreadcrumb
                    items={[
                        {
                            title: 'Trang chủ',
                            onClick: () => navigate(PAGE_PATHS.DASHBOARD),
                            className: 'cursor-pointer ',
                        },
                        ...(items ?? []).map((item) => ({
                            title: item.title,
                            onClick: () => item.path && navigate(item.path),
                            className: item.path ? 'cursor-pointer' : '',
                        })),
                    ]}
                />
            </div>
            {renderRight}
        </div>
    )
}
