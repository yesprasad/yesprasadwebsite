// Site-wide settings. Edit these instead of hunting through templates.
export const site = {
  brand: 'YES Prasad',
  fullName: 'Eshwar Sowbhagya Prasad Yaddanapudi',
  shortName: 'Eshwar Prasad Yaddanapudi',
  title: 'YES Prasad — Eshwar Prasad Yaddanapudi',
  description:
    'I build the structural intelligence layer that AI-driven software is missing, so every change an engineer or an agent makes comes with its consequences visible before it ships.',
  writingSince: 2005,
  focus: ['AI engineering', 'Code intelligence', 'Dependency graphs', 'RAG & agents', 'Developer infrastructure'],
  links: {
    cv: '', // add the PDF to /public and put its path here, e.g. '/cv.pdf'
    github: 'https://github.com/yesprasad',
    linkedin: 'https://www.linkedin.com/in/eshwarprasadyaddanapudi/',
    youtube: 'https://www.youtube.com/@NodejsEveryday',
    email: '', // e.g. 'mailto:you@example.com'
  },
};

export const nav = [
  { label: 'Platforms', href: '/platforms/' },
  { label: 'Research', href: '/research/' },
  { label: 'Talks', href: '/talks/' },
  { label: 'Leadership', href: '/leadership/' },
  { label: 'Writing', href: '/writing/' },
  { label: 'About', href: '/about/' },
];

export const sections = {
  essay: { label: 'Essay', plural: 'Essays' },
  lab: { label: 'Lab', plural: 'Engineering Lab' },
  notes: { label: 'Notes', plural: 'Field Notes' },
  margins: { label: 'Margins', plural: 'Margins' },
} as const;
