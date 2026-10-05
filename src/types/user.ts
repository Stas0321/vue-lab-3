export interface UserName {
  first: string
  last: string
}

export interface UserDob {
  date: string
  age: number
}

export interface User {
  id: number
  name: UserName
  gender: 'male' | 'female'
  location: string
  email: string
  phone: string
  picture: string
  dob: UserDob
  hobbies: string[]
  details: string
}