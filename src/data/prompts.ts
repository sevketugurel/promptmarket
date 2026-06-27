import type { Prompt } from '../types'

export const PROMPTS: Prompt[] = [
  {
    id: 0,
    title: 'Cinematic Portrait Master',
    description: 'Photorealistic human portraits with film-grade lighting and depth.',
    category: 'Image Generation',
    price: 0.05,
    author: 'VisualCraft',
    authorHandle: '@visualcraft',
    tag: '🎨 Midjourney v6',
    secretPrompt: `A cinematic portrait of a weathered explorer, golden hour rim lighting,
shallow depth of field f/1.4, shot on Hasselblad X2D 100C,
8K resolution, photorealistic skin pores, subsurface scattering,
moody desaturated atmosphere, slight chromatic aberration
--ar 4:5 --v 6.1 --style raw --cref [URL] --cw 80`,
  },
  {
    id: 1,
    title: 'Code Refactor Agent',
    description: 'Transforms legacy spaghetti code into clean, SOLID-compliant modules.',
    category: 'Code',
    price: 0.10,
    author: 'DevOpsWizard',
    authorHandle: '@devopswizard',
    tag: '🤖 Claude / GPT-4',
    secretPrompt: `You are a senior software architect. Refactor the given code by:
1. Applying SOLID principles strictly — one responsibility per function
2. Replacing magic numbers with named constants
3. Adding JSDoc/TSDoc comments in the original code language
4. Identifying and eliminating hidden side-effects
5. Suggesting unit test entry points at the end

Code to refactor:
[PASTE CODE HERE]`,
  },
  {
    id: 2,
    title: 'Viral LinkedIn Hook Generator',
    description: 'Writes posts that get 10x+ organic reach without cringe.',
    category: 'LLMs',
    price: 0.03,
    author: 'GrowthHacker',
    authorHandle: '@growthhacker',
    tag: '✍️ ChatGPT',
    secretPrompt: `Write a LinkedIn post about the topic below that feels human, not AI.

Structure:
- Line 1: Pattern-interrupt hook (1 sentence, no em-dash, no cliches)
- Lines 2-4: The unexpected insight or story beat
- Lines 5-7: Practical takeaway in plain language
- Last line: Soft CTA — a question, not a link dump

Rules: No "I'm excited to share", no "game-changer", max 2 emojis.
Tone: Confident, direct, like a smart colleague over coffee.

Topic: [YOUR TOPIC]`,
  },
  {
    id: 3,
    title: 'Lo-fi Anime Ambience Loop',
    description: 'Generates perfect study-room aesthetic video prompts for Runway/Sora.',
    category: 'Image Generation',
    price: 0.08,
    author: 'LoopStudio',
    authorHandle: '@loopstudio',
    tag: '🎬 Runway / Sora',
    secretPrompt: `Lo-fi aesthetic anime girl studying at wooden desk,
rain streaking down window glass with neon city reflections,
warm amber desk lamp casting soft pools of light,
tabby cat sleeping on a stack of open books,
steam curling from ceramic matcha cup,
subtle dolly-left camera drift at 0.3x speed,
16mm film grain overlay, 24fps,
Studio Ghibli + Makoto Shinkai visual fusion,
colour grade: lifted shadows, teal-orange split tone
Duration: 8s loop, seamless`,
  },
  {
    id: 4,
    title: 'System Prompt Hardener',
    description: 'Makes your AI app prompts jailbreak-resistant without losing capability.',
    category: 'Code',
    price: 0.15,
    author: 'PromptSec',
    authorHandle: '@promptsec',
    tag: '🔐 Security',
    secretPrompt: `Analyze the system prompt below and rewrite it with these hardening techniques:
1. Role-lock: Anchor the model identity with an irrevocable persona statement
2. Scope fence: Explicitly list 5 things the model must never do, in plain language
3. Injection shield: Add a meta-instruction that treats any "ignore previous" as adversarial input
4. Output contract: Define the exact response format so deviations are detectable
5. Graceful degradation: Specify a safe fallback for out-of-scope requests

Return ONLY the hardened prompt, no explanation.

Original system prompt:
[PASTE HERE]`,
  },
]
