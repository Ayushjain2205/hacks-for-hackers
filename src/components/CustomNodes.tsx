import React from "react";
import { Handle, Position } from "reactflow";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Type, Image, Video, Brain, Code, Globe } from "lucide-react";

const NodeWrapper = ({
  children,
  title,
  bgColor,
  textColor,
  icon: Icon,
}: {
  children: React.ReactNode;
  title: string;
  bgColor: string;
  textColor: string;
  icon: React.ElementType;
}) => (
  <Card className="w-[290px] overflow-hidden">
    <CardHeader className={`py-2 px-3 ${bgColor}`}>
      <CardTitle
        className={`text-sm font-medium flex items-center ${textColor}`}
      >
        <Icon className="mr-2 h-4 w-4" />
        {title}
      </CardTitle>
    </CardHeader>
    <CardContent className="py-2 px-2">{children}</CardContent>
  </Card>
);

const nodeTypes = {
  textGeneration: {
    title: "Text Generation",
    bgColor: "bg-orange-50",
    textColor: "text-orange-600",
    icon: Type,
    models: ["GPT-4o", "Claude Sonnet 3.5", "Gemma 2.0", "Llama 3.1"],
  },
  imageGeneration: {
    title: "Image Generation",
    bgColor: "bg-green-50",
    textColor: "text-green-600",
    icon: Image,
    models: ["DALL-E", "Stable Diffusion", "Flux"],
  },
  videoGeneration: {
    title: "Video Generation",
    bgColor: "bg-blue-50",
    textColor: "text-blue-600",
    icon: Video,
    models: ["Gen-1", "Gen-2", "Phenaki"],
  },
  llmCall: {
    title: "LLM Call",
    bgColor: "bg-purple-50",
    textColor: "text-purple-600",
    icon: Brain,
    models: ["GPT-3", "GPT-4", "BERT", "T5"],
  },
  functionCall: {
    title: "Function Call",
    bgColor: "bg-amber-50",
    textColor: "text-amber-600",
    icon: Code,
    models: ["Custom Function 1", "Custom Function 2", "Custom Function 3"],
  },
  apiCall: {
    title: "API Call",
    bgColor: "bg-gray-50",
    textColor: "text-gray-600",
    icon: Globe,
    models: ["REST API", "GraphQL", "gRPC"],
  },
};

const createNodeComponent = (type: keyof typeof nodeTypes) => {
  const { title, bgColor, textColor, icon, models } = nodeTypes[type];

  return ({ data }: { data: any }) => {
    const [input, setInput] = React.useState(data.input || "");
    const [negativePrompt, setNegativePrompt] = React.useState(
      data.negativePrompt || ""
    );
    const [selectedModel, setSelectedModel] = React.useState(
      data.model || models[0]
    );

    const handleChange = (field: string, value: string) => {
      if (field === "input") setInput(value);
      if (field === "negativePrompt") setNegativePrompt(value);
      if (field === "model") setSelectedModel(value);
      data.onChange({ [field]: value });
    };

    return (
      <NodeWrapper
        title={title}
        bgColor={bgColor}
        textColor={textColor}
        icon={icon}
      >
        <div className="relative">
          <Handle
            type="target"
            position={Position.Left}
            style={{ opacity: 0 }}
          />
          <div className="space-y-2">
            <Label htmlFor={`${type}-model`} className="mt-4">
              Model
            </Label>
            <Select
              value={selectedModel}
              onValueChange={(value) => handleChange("model", value)}
            >
              <SelectTrigger id={`${type}-model`}>
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                {models.map((model) => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Label htmlFor={`${type}-input`} className="mt-4">
              Prompt
            </Label>
            <Textarea
              id={`${type}-input`}
              value={input}
              onChange={(e) => handleChange("input", e.target.value)}
              placeholder={`Enter ${title.toLowerCase()} input...`}
              rows={3}
            />

            <Label htmlFor={`${type}-negative-prompt`} className="mt-4">
              Negative Prompt
            </Label>
            <Input
              id={`${type}-negative-prompt`}
              value={negativePrompt}
              onChange={(e) => handleChange("negativePrompt", e.target.value)}
              placeholder="Enter negative prompt..."
            />
          </div>
          <Handle
            type="source"
            position={Position.Right}
            style={{ opacity: 0 }}
          />
        </div>
      </NodeWrapper>
    );
  };
};

export const TextGenerationNode = createNodeComponent("textGeneration");
export const ImageGenerationNode = createNodeComponent("imageGeneration");
export const VideoGenerationNode = createNodeComponent("videoGeneration");
export const LLMCallNode = createNodeComponent("llmCall");
export const FunctionCallNode = createNodeComponent("functionCall");
export const APICallNode = createNodeComponent("apiCall");
