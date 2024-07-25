import { ReactNode } from 'react'
import { useNavigate } from 'react-router-dom'

import { Breadcrumb as AntdBreadcrumb } from 'antd'

import { PAGE_PATHS } from '@/constants'

interface BreadcrumbProps {
    pageName: string
    renderRight?: ReactNode
}

export const Breadcrumb = ({ pageName, renderRight }: BreadcrumbProps) => {
    const navigate = useNavigate()
    return (
        <div className="mb-4 flex items-end justify-between">
            <div>
                <h1 className="text-3xl font-bold">{pageName}</h1>
                <AntdBreadcrumb
                    items={[
                        {
                            title: 'Trang chủ',
                            onClick: () => {
                                navigate(PAGE_PATHS.DASHBOARD)
                            },
                        },
                        {
                            title: 'Danh sách khoa',
                        },
                    ]}
                />
            </div>
            {renderRight}
        </div>
    )
}
