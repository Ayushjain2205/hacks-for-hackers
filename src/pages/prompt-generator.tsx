import React, { useState, useCallback } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import CustomCodeEditor from "@/components/CustomCodeEditor";
import { PrismLight as SyntaxHighlighter } from "react-syntax-highlighter";
import copy from "copy-to-clipboard";
import { Loader2, Copy, Check, WandSparkles, Code } from "lucide-react";

// Import languages you want to use
import javascript from "react-syntax-highlighter/dist/cjs/languages/prism/javascript";
import python from "react-syntax-highlighter/dist/cjs/languages/prism/python";
import bash from "react-syntax-highlighter/dist/cjs/languages/prism/bash";

// Register the languages you want to use
SyntaxHighlighter.registerLanguage("javascript", javascript);
SyntaxHighlighter.registerLanguage("python", python);
SyntaxHighlighter.registerLanguage("bash", bash);

export default function PromptGenerator() {
  const [input, setInput] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("javascript");

  const handleGenerate = useCallback(async () => {
    setIsGenerating(true);
    // Simulating API call with setTimeout
    setTimeout(() => {
      const prompt =
        "Choose a natural setting for your poem: {setting}\n2. Select a season or time of day: {timeOfDay}\n3. Identify one simple, everyday observation or activity: {observation}\n4. Consider how this observation connects to a deeper human truth: {humanTruth}\n\nSTRUCTURAL ELEMENTS\n1. Length: 4-5 stanzas\n2. Rhythm: Use natural speech patterns with these guidelines:\n   * Write in iambic meter (alternating unstressed/stressed syllables)\n   * Aim for 8-10 syllables per line\n   * Allow occasional variations for emphasis\n\nSTYLISTIC APPROACH\n1. Begin with a concrete image or scene: {openingImage}\n2. Use simple, conversational language\n3. Include specific details from rural New England life\n4. Incorporate natural sounds and silence: {naturalSounds}\n5. End with a quiet revelation or philosophical turn: {ending}\n\nTECHNICAL CONSIDERATIONS\n1. Choose a rhyme scheme: {rhymeScheme}\n   * AABA BBCB\n   * ABAB\n   * AABB\n2. Use alliteration sparingly\n3. Include at least one metaphor drawn from nature: {natureMetaphor}\n4. End with lines that echo but deepen the opening image\n\nWRITING PROCESS\n1. First draft: Focus on the narrative and images\n2. Second draft: Refine meter and rhyme\n3. Third draft: Add subtle sound patterns\n4. Final draft: Ensure the ending resonates with meaning\n\nFINAL PROMPT TEMPLATE:\nWrite a poem about {subject} set in {setting} during {timeOfDay}. Begin with {openingImage} and end with a reflection on {humanTruth}. Use {rhymeScheme} rhyme scheme and natural speech patterns. Include details about {naturalSounds} and their relationship to {observation}. Incorporate a metaphor comparing {natureMetaphor} to reflect on {ending}.\n\nQUESTIONS TO CONSIDER WHILE WRITING\n1. What everyday moment reveals something universal?\n2. How does the natural setting mirror human emotion?\n3. What simple words carry deeper meaning?\n4. What sounds in nature echo the poem's mood?\n5. How does the ending transform the opening image?";
      setGeneratedPrompt(prompt);
      setIsGenerating(false);
    }, 2000);
  }, [input]);

  const handleCopy = useCallback((text: string) => {
    copy(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const codeSnippets = {
    javascript: `import OpenAI from "openai";

const openai = new OpenAI();

async function main() {
    const stream = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: "${generatedPrompt}" }],
        stream: true,
    });
    for await (const chunk of stream) {
        process.stdout.write(chunk.choices[0]?.delta?.content || "");
    }
}`,
    python: `from openai import OpenAI
client = OpenAI()

response = client.chat.completions.create(
    messages=[{
        "role": "user",
        "content": "${generatedPrompt}",
    }],
    model="gpt-4o-mini",
)
`,
    bash: `curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $OPENAI_API_KEY" \
  -d '{
     "model": "gpt-4o-mini",
     "messages": [{"role": "user", "content": ${generatedPrompt}"}],
     "temperature": 0.7
   }'`,
  };

  return (
    <Layout>
      <div className="container mx-auto">
        <div className="flex flex-row items-center gap-4">
          <img
            src="/prompt-generator.svg"
            alt="Logo"
            className="w-16 h-16 mb-4"
          />
          <h1 className="text-3xl font-bold mb-8">Prompt Generator</h1>
        </div>
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>What are you generating a prompt for?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input">Your topic</Label>
                <Input
                  id="input"
                  placeholder="Enter your topic here..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                />
              </div>
              <div className="flex justify-end">
                <Button
                  onClick={handleGenerate}
                  disabled={isGenerating || !input}
                  className="bg-[#FF6B2C] hover:bg-[#E55A1B] text-white"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <WandSparkles className="mr-2 h-4 w-4" />
                      Generate Prompt
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {generatedPrompt && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-[#FF6B2C] flex items-center">
                <WandSparkles className="mr-2 h-5 w-5" />
                Generated Prompt
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative bg-gray-100 p-4 rounded-md">
                <p className="mb-4 text-lg">
                  {generatedPrompt.split("{").map((part, index) => {
                    if (index === 0) return part;
                    const [variable, rest] = part.split("}");
                    return (
                      <React.Fragment key={index}>
                        <span className="bg-blue-100 px-1 rounded">
                          {"{" + variable + "}"}
                        </span>
                        {rest}
                      </React.Fragment>
                    );
                  })}
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => handleCopy(generatedPrompt)}
                >
                  {copied ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {generatedPrompt && (
          <Card>
            <CardHeader>
              <CardTitle className="text-[#FF6B2C] flex items-center">
                <Code className="mr-2 h-5 w-5" />
                Code Snippets
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="mb-4">
                  <TabsTrigger value="javascript">JavaScript</TabsTrigger>
                  <TabsTrigger value="python">Python</TabsTrigger>
                  <TabsTrigger value="bash">cURL</TabsTrigger>
                </TabsList>
                <TabsContent value="javascript">
                  <CustomCodeEditor
                    value={codeSnippets.javascript}
                    language="javascript"
                    placeholder="Please enter JS code."
                  />
                </TabsContent>
                <TabsContent value="python">
                  <CustomCodeEditor
                    value={codeSnippets.python}
                    language="python"
                    placeholder="Please enter Python code."
                  />
                </TabsContent>
                <TabsContent value="bash">
                  <CustomCodeEditor
                    value={codeSnippets.bash}
                    language="bash"
                    placeholder="Please enter cURL command."
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
            <CardFooter className="flex justify-end">
              <Button
                onClick={() =>
                  handleCopy(
                    codeSnippets[activeTab as keyof typeof codeSnippets]
                  )
                }
                className="bg-[#FF6B2C] hover:bg-[#E55A1B] text-white"
              >
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Code
                  </>
                )}
              </Button>
            </CardFooter>
          </Card>
        )}
      </div>
    </Layout>
  );
}
