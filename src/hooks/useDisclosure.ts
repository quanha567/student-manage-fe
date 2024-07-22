import { useCallback, useState } from 'react'

import { DisclosureType } from '@/types'

export const useDisclosure = (): DisclosureType => {
    const [isOpen, setIsOpen] = useState<boolean>(false)

    const [id, setId] = useState<string>('')

    const toggleOpen = useCallback(
        (id?: string) => {
            setId(id ?? '')
            setIsOpen((prev) => !prev)
        },
        [setId, setIsOpen],
    )

    return { isOpen, toggleOpen, id }
}
