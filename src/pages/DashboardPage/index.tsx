import { DepartmentChart, NumberReport, SexChart } from './components'

const DashboardPage = () => {
    return (
        <div className="">
            <NumberReport />
            <div className="mt-4 grid gap-4 xl:grid-cols-2">
                <SexChart />
                <DepartmentChart />
            </div>
        </div>
    )
}

export default DashboardPage
