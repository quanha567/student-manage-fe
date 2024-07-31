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
                        <p>
                            Lorem ipsum dolor sit amet consectetur adipisicing
                            elit. Laudantium laborum possimus, ad eius similique
                            exercitationem fugiat nesciunt. Est doloremque
                            labore cumque iste eaque eveniet, repudiandae
                            praesentium eos, ratione voluptates id.
                        </p>
                    </div>
                </div>
            </Card>
            <MyProfileForm />
        </div>
    )
}

export default MyProfilePage
