/** Données partagées — Legalisation Tunis (processus + types de diplôme) */

export const LEGALISATION_PROCESS_STEPS: { fr: string; ar: string }[] = [
  {
    fr: "Identifier le type de diplôme (secondaire, universitaire, formation professionnelle, santé) pour savoir quel organisme est compétent.",
    ar: "تحديد نوع الشهادة (ثانوي، جامعي، تكوين مهني، صحي) لمعرفة الإدارة المختصة.",
  },
  {
    fr: "Se présenter au ministère, au rectorat ou au service compétent avec les documents originaux et les pièces habituellement exigées (selon chaque administration).",
    ar: "التوجه إلى الوزارة أو رئاسة الجامعة أو الإدارة المختصة مع الوثائق الأصلية والمرفقات المعتادة.",
  },
  {
    fr: "Obtenir la légalisation administrative (visa, sceaux, signatures) sur les originaux concernés.",
    ar: "الحصول على التصديق الإداري (أختام وتوقيعات) على الأصول المعنية.",
  },
  {
    fr: "Pour les diplômes universitaires : régler le timbre fiscal de 5 DT par document original au niveau du Rectorat (légalisation exclusivement au Rectorat, pas au ministère de l’Enseignement supérieur).",
    ar: "للشهادات الجامعية: أداء الطابع الجبائي 5 دنانير لكل أصل لدى رئاسة الجامعة (التصديق حصراً بالرئاسة وليس الوزارة).",
  },
  {
    fr: "Faire établir la traduction en italien par un traducteur assermenté lorsque la suite du dossier l’exige (Apostille sur la traduction également).",
    ar: "إنجاز الترجمة إلى الإيطالية عند مترجم محلف عند الحاجة (مع الأبوستيل على الترجمة أيضاً).",
  },
  {
    fr: "Passer chez le notaire pour l’Apostille de La Haye : uniquement après la légalisation ministérielle / rectorale. L’Apostille doit couvrir le diplôme, le relevé de notes et la traduction lorsque c’est requis pour l’Italie.",
    ar: "المرور على الموثّق للأبوستيل: بعد التصديق الوزاري/الجامعي. يجب أن تشمل الأبوستيل الشهادة وكشف الأعداد والترجمة عند الاقتضاء.",
  },
]

export const LEGALISATION_PROCESS_GOLDEN_RULE_FR =
  "Règle d’or : la légalisation au ministère / rectorat vient avant l’Apostille au notaire. Inverser l’ordre peut invalider la chaîne de validité du document pour le consulat."

export const LEGALISATION_DIPLOME_BLOCKS: {
  frTitle: string
  arTitle: string
  frMin: string
  arMin: string
  note?: string
}[] = [
  {
    frTitle: "Diplômes de l'enseignement secondaire (Baccalauréat) et certificats scolaires",
    arTitle: "شهادات التعليم الثانوي والبكالوريا",
    frMin: "Ministère : Ministère de l'Éducation",
    arMin: "وزارة التربية",
  },
  {
    frTitle: "Diplômes universitaires (Licence, Master, Doctorat)",
    arTitle: "الشهادات الجامعية: إجازة، ماجستير، دكتوراه",
    frMin: "Ministère : Rectorat de l'Université (uniquement)",
    arMin: "رئاسة الجامعة فقط — لا الوزارة",
    note:
      "Important : La légalisation se fait désormais exclusivement au Rectorat. Le Ministère de l'Enseignement Supérieur n'est plus compétent pour cette étape. Un timbre fiscal de 5 DT par document original est obligatoire.",
  },
  {
    frTitle: "Diplômes de formation professionnelle (BTP, BTS, Certificat de compétence)",
    arTitle: "شهادات التكوين المهني: BTP، BTS، شهادة كفاءة مهنية",
    frMin: "Ministère : Ministère de l'Emploi et de la Formation Professionnelle",
    arMin: "وزارة التشغيل والتكوين المهني",
  },
  {
    frTitle: "Diplômes et certificats dans le domaine de la santé",
    arTitle: "الشهادات في المجال الصحي",
    frMin: "Ministère : Ministère de la Santé Publique",
    arMin: "وزارة الصحة العمومية",
  },
]

export const LEGALISATION_SECTION_TITLES = {
  processFr: "Processus global (ordre à respecter)",
  processAr: "المسار العام (ترتيب إلزامي)",
  diplomeFr: "Légalisation préalable selon le type de diplôme",
  diplomeAr: "التصديق المسبق حسب نوع الشهادة",
} as const
