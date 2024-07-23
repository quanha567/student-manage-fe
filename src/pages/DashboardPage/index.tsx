import { DepartmentChart, NumberReport } from './components'

const DashboardPage = () => {
    return (
        <div className="">
            <NumberReport />
            <div className="mt-4 grid grid-cols-2 gap-4">
                <DepartmentChart />
                <DepartmentChart />
                <DepartmentChart />
                <DepartmentChart />
            </div>
        </div>
    )
}

export default DashboardPage
