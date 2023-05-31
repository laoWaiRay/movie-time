export interface FormData {
  formType: "signup" | "login"
  email: [string, boolean]
  password: [string, boolean]
  username?: [string, boolean]
  confirmPw?: [string, boolean]
  [key: string]: string | [string, boolean] | undefined
}