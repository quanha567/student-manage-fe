import { Card } from 'antd'

import { CustomImage } from '@/components'
import { useAppSelector } from '@/hooks'
import { selectCurrentUser } from '@/redux'

import { MyProfileForm } from './components'

const MyProfilePage = () => {
    const { student } = useAppSelector(selectCurrentUser)

    return (
        <div className="grid grid-cols-[1fr_2fr] gap-4">
            <Card>
                <div className="flex flex-col items-center">
                    <CustomImage
                        src={student?.avatar}
                        alt={student?.fullName}
                        className="aspect-square object-cover"
                        containerClass="overflow-hidden rounded-full"
                        size="thumbnail"
                        imgSize={100}
                    />
                    <p className="mt-4 text-center text-xl font-bold">
                        {student?.fullName}
                    </p>
                    <p>{student?.email}</p>
                    <div className="mt-4 w-full">
                        <p className="text-base font-bold">Giới thiệu:</p>
                        <p>{student?.note}</p>
                    </div>
                </div>
            </Card>
            <MyProfileForm />
        </div>
    )
}

export default MyProfilePage
