/**
 * Jeux de données « pire cas » pour tester le carrousel d'avis (outil de test, jamais utilisé en production).
 * Activation : PUBLIC_BREAK_UI=worst | one | many | empty au moment du build ou du dev (voir testimonials.ts).
 * Sans cette variable, ce module n'est pas importé par le site (élagué au build).
 * Tous les cas sont plausibles : noms à particules et longs noms composés, écritures non latines (arabe, chinois,
 * cyrillique), emoji, URL dans un avis, avis très court / très long, champs optionnels absents, note absente ou à 1.
 */
import type { Testimonial } from './testimonials';

export const worstCase: Testimonial[] = [
  {
    name: 'Abdelmoumen Ould Sidi Mohamed El Hadj Bouazza-Benkirane',
    role: 'Directrice des ressources humaines et du développement des compétences',
    company: 'Société Marocaine de Distribution et de Services Numériques Associés',
    formation: 'Media Buying : tracking, scaling & optimisation du ROAS',
    quote:
      "Grâce à cette formation, toute l'équipe des ressources humaines a pu automatiser la préparation des fiches de poste, la synthèse des entretiens annuels et le suivi des demandes de formation. Nous avons aussi mis en place une charte d'usage de l'IA validée par la direction juridique, puis formé trois filiales supplémentaires en l'espace d'un trimestre, avec des résultats mesurables sur le temps de traitement des dossiers et la qualité des réponses envoyées aux collaborateurs.",
    rating: 5,
    demo: true,
  },
  { name: 'Jo', quote: 'Top.', demo: true },
  {
    name: 'نور الهدى بن عبد الرحمن',
    role: 'مديرة مشاريع',
    company: 'مجموعة الدار البيضاء للخدمات',
    quote:
      'ساعدتني الدورة على فهم أدوات الذكاء الاصطناعي واستخدامها في عملي اليومي بثقة أكبر، وأصبحت أنجز مهامي في وقت أقل.',
    rating: 4,
    demo: true,
  },
  {
    name: '🚀 Karim',
    role: 'Fondateur 🎓',
    quote: "Super formation 👏👏 j'ai appris à automatiser mes devis en une après-midi 🔥",
    demo: true,
  },
  { name: '', quote: '', demo: true },
  {
    name: '李明',
    role: '产品经理',
    company: '上海数字科技有限公司',
    quote: '课程内容实用，帮助我把人工智能工具应用到日常工作中。',
    rating: 1,
    demo: true,
  },
  {
    name: 'Ольга Иванова-Петровская',
    role: 'Руководитель отдела обучения',
    quote: 'Курс помог нам внедрить искусственный интеллект в процессы обучения сотрудников.',
    demo: true,
  },
  {
    name: 'Samir Taïbi',
    role: 'Responsable digital',
    quote:
      'Tout est détaillé ici : https://www.exemple-de-longue-adresse-de-formation.com/avis/formation-ia-niveau-3-automatisation-workflows?source=newsletter&campagne=printemps-2026',
    demo: true,
  },
];

export const oneCase: Testimonial[] = [worstCase[0]];
export const manyCase: Testimonial[] = Array.from({ length: 12 }, (_, i) => ({
  ...worstCase[(i + 1) % worstCase.length],
  name: `${worstCase[(i + 1) % worstCase.length].name || 'Anonyme'}`.trim() || 'Anonyme',
  demo: true,
}));
export const emptyCase: Testimonial[] = [];
