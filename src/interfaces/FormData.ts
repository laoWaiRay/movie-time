export interface FormData {
  formType: "signup" | "login"
  email: string
  password: string
  username?: string
  confirmPw?: string
  [key: string]: string | undefined
}