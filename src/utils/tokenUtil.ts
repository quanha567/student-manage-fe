import { JwtPayload, jwtDecode } from 'jwt-decode'

interface DecodedToken extends JwtPayload {
    exp: number
}

export const isTokenExpired = (token?: string): boolean => {
    if (!token) return true

    try {
        const decodedToken = jwtDecode<DecodedToken>(token)
        const currentTime = Date.now() / 1000
        return decodedToken.exp < currentTime
    } catch (error) {
        console.error('Error decoding token:', error)
        return true
    }
}
