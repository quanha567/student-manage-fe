import { Breadcrumb } from '@/components'

import { MyProfileForm } from './components'

const MyProfilePage = () => {
    return (
        <>
            <Breadcrumb
                pageName="Hồ sơ của bạn"
                items={[
                    {
                        title: 'Hồ sơ của bạn',
                    },
                ]}
            />
            <MyProfileForm />
        </>
    )
}

export default MyProfilePage
