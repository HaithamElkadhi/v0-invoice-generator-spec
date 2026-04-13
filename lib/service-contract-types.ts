export type ContractCurrency = "EUR" | "USD" | "TND"

export type ServiceContractData = {
  clientName: string
  sharedEmail: string
  maxUniversities: string
  currency: ContractCurrency
  formulaAcompte: boolean
  amountAcompte: string
  formulaAcceptation: boolean
  amountAcceptation: string
  formulaAcompteBourse: boolean
  amountAcompteBourse: string
  formulaClotureBourse: boolean
  amountClotureBourse: string
  faitA: string
  contractDate: string
  signatureClientName: string
  /** Texte libre inséré avant le bloc de signature (modifications / précisions) */
  additionalClauses: string
}
