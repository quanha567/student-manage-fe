interface BreadcrumbProps {
    pageName: string
}

export const Breadcrumb = ({ pageName }: BreadcrumbProps) => {
    return (
        <div>
            <h1 className="text-3xl font-bold">{pageName}</h1>
        </div>
    )
}
