export interface MailingModelRecord {
  id: string
  modelName: string
  subject: string
  message: string
  attachments: { url: string; filename?: string }[]
}
