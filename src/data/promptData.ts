export type OutputType =
  | "text"
  | "image"
  | "code"
  | "json"
  | "video"
  | "audio"
  | "markdown";

export type PromptVersion = {
  id: number;
  note: string;
  prompt: string;
  output: {
    type: OutputType;
    content: string;
  };
  date: string;
  promptTokens: number;
  outputTokens: number;
  metadata?: {
    temperature?: number;
    topP?: number;
    frequencyPenalty?: number;
    presencePenalty?: number;
    maxTokens?: number;
    style?: string;
    quality?: string;
    resolution?: string;
    sampleRate?: number;
    bitRate?: number;
  };
  tags?: string[];
};

export type PromptVariation = {
  name: "Production" | "Testing";
  description?: string;
  versions: PromptVersion[];
};

export type PromptCollection = {
  id: number;
  name: string;
  icon: string;
  model: string;
  description: string;
  createdDate: string;
  lastModified: string;
  author: string;
  variations: PromptVariation[];
  tags: string[];
  isPublic: boolean;
  forkCount: number;
  starCount: number;
};

export const promptCollections: PromptCollection[] = [
  {
    id: 1,
    name: "Enterprise Code Assistant",
    icon: "⚡",
    model: "GPT-4-Turbo",
    description: "Enterprise-grade code and documentation generation system",
    createdDate: "2024-08-01",
    lastModified: "2024-10-08",
    author: "TechLead",
    tags: ["development", "documentation", "enterprise"],
    isPublic: true,
    forkCount: 234,
    starCount: 1892,
    variations: [
      {
        name: "Production",
        description: "Production-ready code generation",
        versions: [
          {
            id: 1,
            note: "Full-stack component generator",
            prompt:
              "Generate a {language} {componentType} with {features}. Include:\n- TypeScript interfaces\n- Error handling\n- Unit tests\n- API documentation\n- Logging integration\n- Performance monitoring\nFollow {company} standards and {framework} best practices.",
            output: {
              type: "code",
              content:
                "export class UserService implements IUserService {\n  private logger: Logger;\n  // ... implementation\n}",
            },
            date: "2024-10-01",
            promptTokens: 45,
            outputTokens: 250,
            metadata: {
              temperature: 0.3,
              topP: 0.9,
            },
            tags: ["typescript", "clean-code"],
          },
        ],
      },
      {
        name: "Testing",
        description: "Experimental features and patterns",
        versions: [
          {
            id: 1,
            note: "AI-powered code review",
            prompt:
              "Review this {language} code for:\n- Security vulnerabilities\n- Performance issues\n- Code smells\n- Architecture patterns\n- Test coverage\nProvide specific recommendations for {framework} best practices.",
            output: {
              type: "markdown",
              content:
                "## Code Review Summary\n\n### Security Issues Found\n...",
            },
            date: "2024-10-05",
            promptTokens: 55,
            outputTokens: 400,
            tags: ["code-review", "security"],
          },
        ],
      },
    ],
  },
  {
    id: 2,
    name: "Creative Image Generator",
    icon: "🎨",
    model: "DALL-E 3",
    description: "Advanced image generation with style control and composition",
    createdDate: "2024-08-15",
    lastModified: "2024-10-07",
    author: "ArtDirector",
    tags: ["image", "art", "design"],
    isPublic: true,
    forkCount: 567,
    starCount: 2341,
    variations: [
      {
        name: "Production",
        description: "Stable, tested image generation prompts",
        versions: [
          {
            id: 1,
            note: "Product visualization",
            prompt:
              "Create a {perspective} view of {product} in {style} style. Set in {environment} with {lighting} lighting. Include {features} and emphasize {focal_point}. Style reference: {reference_artist}. Additional details: {specific_requirements}",
            output: {
              type: "image",
              content:
                "https://replicate.delivery/yhqm/albaypwzh46aJZfq0f9PwosJiPzHB3VAPjFDzik6SPbDEWpTA/R8_sd3.5L_00001_.webp",
            },
            date: "2024-09-15",
            promptTokens: 60,
            outputTokens: 0,
            metadata: {
              quality: "hd",
              resolution: "1024x1024",
              style: "product-photography",
            },
            tags: ["product", "commercial"],
          },
          {
            id: 2,
            note: "Character design",
            prompt:
              "Generate a {shot_type} of a {character_type} wearing {outfit} in {art_style}. Character has {features} and expresses {emotion}. Setting: {environment} with {time_of_day} lighting. Include {props} and {background_elements}.",
            output: {
              type: "image",
              content:
                "https://replicate.delivery/yhqm/PMawGj2JwA58MpmZKkCNE4adlQfMLRJ0wZG6VH5JtY648q0JA/R8_sd3.5L_00001_.webp",
            },
            date: "2024-10-01",
            promptTokens: 65,
            outputTokens: 0,
            metadata: {
              quality: "ultimate",
              resolution: "2048x2048",
              style: "character-art",
            },
            tags: ["character", "illustration"],
          },
        ],
      },
      {
        name: "Testing",
        description: "Experimental image generation techniques",
        versions: [
          {
            id: 1,
            note: "Style fusion experiment",
            prompt:
              "Create a {subject} combining {style1} and {style2} artistic styles. Implement {technique} for texture. Use color palette inspired by {reference}. Apply {effect} effect at {intensity}% strength.",
            output: {
              type: "image",
              content: "/style-fusion.png",
            },
            date: "2024-10-05",
            promptTokens: 50,
            outputTokens: 0,
            metadata: {
              quality: "development",
              resolution: "1024x1024",
            },
            tags: ["experimental", "fusion"],
          },
        ],
      },
    ],
  },
  {
    id: 3,
    name: "Audio Production Suite",
    icon: "🎵",
    model: "AudioCraft",
    description: "Professional audio generation and processing system",
    createdDate: "2024-09-01",
    lastModified: "2024-10-08",
    author: "SoundEngineer",
    tags: ["audio", "music", "sound-effects"],
    isPublic: true,
    forkCount: 423,
    starCount: 1756,
    variations: [
      {
        name: "Production",
        description: "Production-ready audio generation",
        versions: [
          {
            id: 1,
            note: "Music composition",
            prompt:
              "Compose a {genre} track with {tempo} BPM. Include:\n- Main melody: {melody_description}\n- Harmony: {chord_progression}\n- Rhythm: {rhythm_pattern}\n- Instruments: {instrument_list}\nMood: {emotional_quality}\nDuration: {length} seconds",
            output: {
              type: "audio",
              content: "/composed-track.wav",
            },
            date: "2024-09-20",
            promptTokens: 70,
            outputTokens: 0,
            metadata: {
              sampleRate: 48000,
              bitRate: 320,
              quality: "studio",
            },
            tags: ["music", "composition"],
          },
          {
            id: 2,
            note: "Sound effect generation",
            prompt:
              "Generate a {effect_type} sound effect for {use_case}. Characteristics:\n- Duration: {length}s\n- Primary frequency range: {frequency_range}\n- Modulation: {modulation_type}\n- Space: {reverb_setting}\n- Dynamic range: {dynamics}",
            output: {
              type: "audio",
              content: "/sound-effect.wav",
            },
            date: "2024-10-01",
            promptTokens: 55,
            outputTokens: 0,
            metadata: {
              sampleRate: 96000,
              bitRate: 512,
              quality: "cinematic",
            },
            tags: ["sfx", "sound-design"],
          },
        ],
      },
      {
        name: "Testing",
        description: "Experimental audio generation",
        versions: [
          {
            id: 1,
            note: "AI voice synthesis",
            prompt:
              "Synthesize {voice_type} voice speaking: {script}\nEmotion: {emotion}\nAccent: {accent}\nAge: {age}\nSpeaking style: {style}\nBackground ambiance: {ambient_setting}",
            output: {
              type: "audio",
              content: "/synthesized-voice.wav",
            },
            date: "2024-10-05",
            promptTokens: 60,
            outputTokens: 0,
            metadata: {
              sampleRate: 48000,
              bitRate: 256,
              quality: "broadcast",
            },
            tags: ["voice", "synthesis"],
          },
        ],
      },
    ],
  },
];
