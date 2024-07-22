export interface DisclosureType {
    id?: string
    isOpen: boolean
    toggleOpen: (id?: string) => void
}
