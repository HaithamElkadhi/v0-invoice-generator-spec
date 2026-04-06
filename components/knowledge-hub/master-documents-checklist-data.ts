/** Liste DSL — documents Master Italie ; ids stables pour persistance locale */

export type MasterDocItem = {
  id: string
  fr: string
  ar: string
}

export type MasterDocSection = {
  id: string
  titleFr: string
  titleAr: string
  items: MasterDocItem[]
}

export const MASTER_DOCUMENTS_CHECKLIST_STORAGE_KEY = "jeexpert_kh_master_docs_checklist_v1"

/** Case « document en italien » (IT) par id de document */
export const MASTER_DOCUMENTS_ITALIAN_STORAGE_KEY = "jeexpert_kh_master_docs_italian_v1"

/** Inclure dans l’e-mail le bloc « Processus global » (Legalisation Tunis) */
export const MASTER_DOCS_MAIL_INCLUDE_PROCESS_KEY = "jeexpert_kh_master_mail_include_process_v1"

/** Inclure dans l’e-mail le bloc « Légalisation par type de diplôme » */
export const MASTER_DOCS_MAIL_INCLUDE_LEGALISATION_KEY = "jeexpert_kh_master_mail_include_legalisation_v1"

export const MASTER_DOCUMENTS_SECTIONS: MasterDocSection[] = [
  {
    id: "general",
    titleFr: "1. Documents généraux obligatoires",
    titleAr: "الوثائق العامة الأساسية",
    items: [
      {
        id: "g-passport",
        fr: "Passeport valide (minimum 2 ans recommandé)",
        ar: "جواز سفر ساري المفعول (يفضل سنتين على الأقل)",
      },
      {
        id: "g-cv",
        fr: "CV (format Europass recommandé)",
        ar: "سيرة ذاتية (يفضل بصيغة Europass)",
      },
      {
        id: "g-motivation",
        fr: "Lettre de motivation (personnalisée pour chaque université)",
        ar: "رسالة تحفيزية (مخصصة لكل جامعة)",
      },
      {
        id: "g-lang",
        fr: "Certificat de langue (anglais ou italien – IELTS / MOI / autre)",
        ar: "شهادة اللغة (إنجليزية أو إيطالية – IELTS أو MOI أو غيرها)",
      },
      {
        id: "g-photo",
        fr: "Photo d’identité récente",
        ar: "صورة شخصية حديثة",
      },
    ],
  },
  {
    id: "bac",
    titleFr: "2. Niveau Baccalauréat",
    titleAr: "مستوى البكالوريا",
    items: [
      {
        id: "bac-diploma",
        fr: "Diplôme du Baccalauréat",
        ar: "شهادة البكالوريا",
      },
      {
        id: "bac-transcript",
        fr: "Relevé de notes du Bac",
        ar: "كشف أعداد البكالوريا",
      },
    ],
  },
  {
    id: "licence",
    titleFr: "3. Niveau Licence",
    titleAr: "مستوى الإجازة",
    items: [
      {
        id: "lic-diploma",
        fr: "Diplôme de Licence",
        ar: "شهادة الإجازة",
      },
      {
        id: "lic-transcripts",
        fr: "Relevés de notes (toutes les années)",
        ar: "كشوف الأعداد لكل السنوات",
      },
      {
        id: "lic-syllabus",
        fr: "Programme des études / syllabus",
        ar: "محتوى الدراسة أو البرنامج الدراسي",
      },
    ],
  },
  {
    id: "master",
    titleFr: "4. Niveau Master (si applicable)",
    titleAr: "مستوى الماجستير (إن وجد)",
    items: [
      {
        id: "m-diploma",
        fr: "Diplôme de Master",
        ar: "شهادة الماجستير",
      },
      {
        id: "m-transcripts",
        fr: "Relevés de notes Master",
        ar: "كشوف أعداد الماجستير",
      },
      {
        id: "m-program",
        fr: "Programme des études Master",
        ar: "برنامج الدراسة",
      },
    ],
  },
  {
    id: "complement",
    titleFr: "5. Documents complémentaires (fortement recommandés)",
    titleAr: "وثائق إضافية (مهمة)",
    items: [
      {
        id: "x-letters",
        fr: "Lettres de recommandation (professeurs ou employeurs)",
        ar: "رسائل توصية (من أساتذة أو أصحاب عمل)",
      },
      {
        id: "x-internship",
        fr: "Certificats de stage",
        ar: "شهادات تدريب",
      },
      {
        id: "x-work",
        fr: "Attestation de travail",
        ar: "شهادة خبرة مهنية",
      },
      {
        id: "x-training",
        fr: "Certificats de formations",
        ar: "شهادات دورات أو تكوين",
      },
      {
        id: "x-events",
        fr: "Participation à des conférences / séminaires",
        ar: "مشاركات في دورات أو ملتقيات",
      },
    ],
  },
]

export function collectAllItemIds(): string[] {
  return MASTER_DOCUMENTS_SECTIONS.flatMap((s) => s.items.map((i) => i.id))
}
