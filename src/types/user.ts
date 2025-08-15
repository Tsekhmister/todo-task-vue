export interface User {
  id: number
  name: string
  username: string
  email: string
  phone: string
  website: string
  address: {
    street: string
    suite: string
    city: string
    zipcode: string
    geo: {
      lat: string
      lng: string
    }
  }
  company: {
    name: string
    catchPhrase: string
    bs: string
  }
}

export interface LoginCredentials {
  username: string
  phoneNumber: string
}

export interface LoginResponse {
  success: boolean
  user?: User
  error?: string
}
