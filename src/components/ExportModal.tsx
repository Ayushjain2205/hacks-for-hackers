import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Node, Edge } from "reactflow";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow } from "react-syntax-highlighter/dist/cjs/styles/prism";
import { Copy, Check } from "lucide-react";

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  nodes: Node[];
  edges: Edge[];
}

const ExportModal: React.FC<ExportModalProps> = ({
  isOpen,
  onClose,
  nodes,
  edges,
}) => {
  const [activeTab, setActiveTab] = useState("javascript");
  const [copied, setCopied] = useState(false);

  const generateCode = (language: string) => {
    // This is a simple example. You may want to create more sophisticated code generation based on your needs.
    const nodesJson = JSON.stringify(nodes, null, 2);
    const edgesJson = JSON.stringify(edges, null, 2);

    switch (language) {
      case "javascript":
        return `
const nodes = ${nodesJson};
const edges = ${edgesJson};

// Use these nodes and edges with your ReactFlow component
`;
      case "python":
        return `
import json

nodes = json.loads('''${nodesJson}''')
edges = json.loads('''${edgesJson}''')

# Use these nodes and edges with your ReactFlow component
`;
      default:
        return "Unsupported language";
    }
  };

  const handleCopy = () => {
    const code = generateCode(activeTab);
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Export Pipeline</DialogTitle>
        </DialogHeader>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="javascript">JavaScript</TabsTrigger>
            <TabsTrigger value="python">Python</TabsTrigger>
          </TabsList>
          <TabsContent value="javascript">
            <SyntaxHighlighter language="javascript" style={tomorrow}>
              {generateCode("javascript")}
            </SyntaxHighlighter>
          </TabsContent>
          <TabsContent value="python">
            <SyntaxHighlighter language="python" style={tomorrow}>
              {generateCode("python")}
            </SyntaxHighlighter>
          </TabsContent>
        </Tabs>
        <div className="flex justify-end mt-4">
          <Button
            onClick={handleCopy}
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
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExportModal;
