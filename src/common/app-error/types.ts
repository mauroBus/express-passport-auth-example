export type TErrorSources = {
  path: number | string
  message: string
}[]

export type TGenericErrorResponse = {
  status: number
  message: string
  errorSources: TErrorSources
}
