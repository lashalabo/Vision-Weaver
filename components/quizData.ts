export interface QuizQuestion {
  id: number;
  dichotomy: string;
  question: string;
  choices: [
    {
      label: string;
      imageUrl: string;
      tags: string[];
    },
    {
      label: string;
      imageUrl: string;
      tags: string[];
    }
  ];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    dichotomy: 'Complexity',
    question: 'Which do you prefer?',
    choices: [
      {
        label: 'Detailed & Intricate',
        imageUrl: 'https://picsum.photos/seed/detailed/500',
        tags: ['detailed', 'intricate', 'complex patterns', 'ornate'],
      },
      {
        label: 'Simple & Minimalist',
        imageUrl: 'https://picsum.photos/seed/minimalist/500',
        tags: ['minimalist', 'simple', 'clean lines', 'uncluttered'],
      },
    ],
  },
  {
    id: 2,
    dichotomy: 'Form',
    question: 'Which form appeals to you?',
    choices: [
      {
        label: 'Geometric & Straight',
        imageUrl: 'https://picsum.photos/seed/geometric/500',
        tags: ['geometric shapes', 'straight lines', 'structured', 'symmetrical'],
      },
      {
        label: 'Organic & Curved',
        imageUrl: 'https://picsum.photos/seed/organic/500',
        tags: ['organic shapes', 'curved lines', 'flowing', 'natural'],
      },
    ],
  },
  {
    id: 3,
    dichotomy: 'Color',
    question: 'Which color palette is more you?',
    choices: [
      {
        label: 'Vibrant & Saturated',
        imageUrl: 'https://picsum.photos/seed/vibrant/500',
        tags: ['vibrant colors', 'saturated', 'high contrast', 'bold'],
      },
      {
        label: 'Muted & Desaturated',
        imageUrl: 'https://picsum.photos/seed/muted/500',
        tags: ['muted colors', 'desaturated', 'soft palette', 'subtle tones'],
      },
    ],
  },
  {
    id: 4,
    dichotomy: 'Mood',
    question: 'What mood are you going for?',
    choices: [
      {
        label: 'Dark & Moody',
        imageUrl: 'https://picsum.photos/seed/moody/500',
        tags: ['dark', 'moody', 'dramatic lighting', 'shadows', 'chiaroscuro'],
      },
      {
        label: 'Bright & Airy',
        imageUrl: 'https://picsum.photos/seed/bright/500',
        tags: ['bright', 'airy', 'light', 'high-key lighting', 'soft light'],
      },
    ],
  },
  {
    id: 5,
    dichotomy: 'Realism',
    question: 'Which reality do you envision?',
    choices: [
      {
        label: 'Photorealistic & Lifelike',
        imageUrl: 'https://picsum.photos/seed/photorealistic/500',
        tags: ['photorealistic', 'hyperrealistic', 'lifelike', '8k resolution'],
      },
      {
        label: 'Stylized & Abstract',
        imageUrl: 'https://picsum.photos/seed/stylized/500',
        tags: ['stylized', 'abstract', 'illustrative', 'painterly', 'surreal'],
      },
    ],
  },
];
