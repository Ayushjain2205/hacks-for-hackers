import React, { useState, useCallback, useEffect } from "react";
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
import { Loader2, Copy, Check, WandSparkles, Code } from "lucide-react";
import { useApp } from "@/contexts/AppContext";
import { useToast } from "@/components/ui/use-toast";

export default function PromptGenerator() {
  const { createVersion, currentCollection, loading, error } = useApp();
  const { toast } = useToast();
  const [input, setInput] = useState("");
  const [generatedPrompt, setGeneratedPrompt] = useState("");
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState("javascript");

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleGenerate = useCallback(async () => {
    if (!currentCollection) {
      toast({
        title: "Error",
        description: "Please select a collection first",
        variant: "destructive",
      });
      return;
    }

    try {
      // Create a new version with the generated prompt
      await createVersion({
        variationId: currentCollection.variations[0].id, // Using the first variation for simplicity
        note: "Generated prompt",
        prompt: generatedPrompt,
        output: {
          type: "text",
          content: "Generated output will appear here",
        },
        promptTokens: generatedPrompt.split(" ").length,
        outputTokens: 0,
        tags: ["generated"],
      });

      toast({
        title: "Success",
        description: "Prompt version created successfully",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create prompt version",
        variant: "destructive",
      });
    }
  }, [currentCollection, generatedPrompt, createVersion, toast]);

  const handleCopy = useCallback((text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const codeSnippets = {
    javascript: `import OpenAI from "openai";

const openai = new OpenAI();

async function main() {
    const stream = await openai.chat.completions.create({
        model: "gpt-4",
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
    model="gpt-4",
)`,
    bash: `curl https://api.openai.com/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $OPENAI_API_KEY" \\
  -d '{
     "model": "gpt-4",
     "messages": [{"role": "user", "content": "${generatedPrompt}"}],
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
                  disabled={loading || !input}
                  className="bg-[#FF6B2C] hover:bg-[#E55A1B] text-white"
                >
                  {loading ? (
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
