import { useState, useCallback, useMemo, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ChevronRight,
  History,
  Plus,
  Save,
  Undo,
  Calendar,
  Edit3,
  MessageSquare,
  Image as ImageIcon,
  Video,
  Zap,
  WandSparkles,
} from "lucide-react";
import { promptCollections as initialPromptCollections } from "@/data/promptData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { motion, AnimatePresence } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PromptCollection {
  id: number;
  name: string;
  icon: string;
  model: string;
  createdDate: string;
  lastModified: string;
  variations: {
    name: string;
    versions: {
      id: number;
      note: string;
      prompt: string;
      output: { type: string; content: string };
      date: string;
      promptTokens: number;
      outputTokens: number;
    }[];
  }[];
}

export default function PromptBuilder() {
  const [promptCollections, setPromptCollections] = useState<
    PromptCollection[]
  >(initialPromptCollections);
  const [selectedCollectionId, setSelectedCollectionId] = useState(
    promptCollections[0].id.toString()
  );
  const [selectedVariationName, setSelectedVariationName] = useState(
    promptCollections[0].variations[0].name
  );
  const [selectedVersionId, setSelectedVersionId] = useState(
    promptCollections[0].variations[0].versions[0].id
  );
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionIcon, setNewCollectionIcon] = useState("");
  const [newVariationName, setNewVariationName] = useState("");
  const [isNewCollectionDialogOpen, setIsNewCollectionDialogOpen] =
    useState(false);
  const [isNewVariationDialogOpen, setIsNewVariationDialogOpen] =
    useState(false);
  const [editedPrompt, setEditedPrompt] = useState("");
  const [newVersionNote, setNewVersionNote] = useState("");

  const selectedCollection = useMemo(
    () =>
      promptCollections.find((c) => c.id.toString() === selectedCollectionId),
    [promptCollections, selectedCollectionId]
  );
  const selectedVariation = useMemo(
    () =>
      selectedCollection?.variations.find(
        (v) => v.name === selectedVariationName
      ),
    [selectedCollection, selectedVariationName]
  );
  const selectedVersion = useMemo(
    () => selectedVariation?.versions.find((v) => v.id === selectedVersionId),
    [selectedVariation, selectedVersionId]
  );

  useEffect(() => {
    if (selectedVersion) {
      setEditedPrompt(selectedVersion.prompt);
    }
  }, [selectedVersion]);

  const handleCollectionSelect = useCallback(
    (collectionId: string) => {
      setSelectedCollectionId(collectionId);
      const newCollection = promptCollections.find(
        (c) => c.id.toString() === collectionId
      );
      if (newCollection) {
        setSelectedVariationName(newCollection.variations[0].name);
        setSelectedVersionId(newCollection.variations[0].versions[0].id);
      }
    },
    [promptCollections]
  );

  const handleVariationSelect = useCallback(
    (variationName: string) => {
      setSelectedVariationName(variationName);
      const newVariation = selectedCollection?.variations.find(
        (v) => v.name === variationName
      );
      if (newVariation) {
        setSelectedVersionId(newVariation.versions[0].id);
      }
    },
    [selectedCollection]
  );

  const handleCreateNewCollection = useCallback(() => {
    if (newCollectionName && newCollectionIcon) {
      const currentDate = new Date().toISOString().split("T")[0];
      const newCollection: PromptCollection = {
        id: promptCollections.length + 1,
        name: newCollectionName,
        icon: newCollectionIcon,
        model: "GPT-4", // Default model
        createdDate: currentDate,
        lastModified: currentDate,
        variations: [
          {
            name: "main",
            versions: [
              {
                id: 1,
                note: "Initial version",
                prompt: "",
                output: { type: "text", content: "" },
                date: currentDate,
                promptTokens: 0,
                outputTokens: 0,
              },
            ],
          },
        ],
      };
      setPromptCollections([...promptCollections, newCollection]);
      setSelectedCollectionId(newCollection.id.toString());
      setSelectedVariationName("main");
      setSelectedVersionId(1);
      setNewCollectionName("");
      setNewCollectionIcon("");
      setIsNewCollectionDialogOpen(false);
    }
  }, [newCollectionName, newCollectionIcon, promptCollections]);

  const handleCreateNewVariation = useCallback(() => {
    if (newVariationName && selectedCollection) {
      const newVariation = {
        name: newVariationName,
        versions: [
          {
            id: 1,
            note: "Initial version",
            prompt: "",
            output: { type: "text", content: "" },
            date: new Date().toISOString().split("T")[0],
            promptTokens: 0,
            outputTokens: 0,
          },
        ],
      };
      const updatedCollections = promptCollections.map((collection) => {
        if (collection.id.toString() === selectedCollectionId) {
          return {
            ...collection,
            variations: [...collection.variations, newVariation],
          };
        }
        return collection;
      });
      setPromptCollections(updatedCollections);
      setSelectedVariationName(newVariationName);
      setSelectedVersionId(1);
      setNewVariationName("");
      setIsNewVariationDialogOpen(false);
    }
  }, [
    newVariationName,
    selectedCollection,
    selectedCollectionId,
    promptCollections,
  ]);

  const handleSaveNewVersion = useCallback(() => {
    if (
      editedPrompt &&
      newVersionNote &&
      selectedCollection &&
      selectedVariation
    ) {
      const newVersion = {
        id: selectedVariation.versions.length + 1,
        note: newVersionNote,
        prompt: editedPrompt,
        output: { type: "text", content: "New output will be generated here." },
        date: new Date().toISOString().split("T")[0],
        promptTokens: editedPrompt.split(" ").length, // Simple token count
        outputTokens: 0,
      };
      const updatedCollections = promptCollections.map((collection) => {
        if (collection.id.toString() === selectedCollectionId) {
          return {
            ...collection,
            variations: collection.variations.map((variation) => {
              if (variation.name === selectedVariationName) {
                return {
                  ...variation,
                  versions: [...variation.versions, newVersion],
                };
              }
              return variation;
            }),
          };
        }
        return collection;
      });
      setPromptCollections(updatedCollections);
      setSelectedVersionId(newVersion.id);
      setNewVersionNote("");
    }
  }, [
    editedPrompt,
    newVersionNote,
    selectedCollection,
    selectedVariation,
    selectedCollectionId,
    selectedVariationName,
    promptCollections,
  ]);

  if (!selectedCollection || !selectedVariation || !selectedVersion) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="flex flex-col h-[calc(100vh-4rem)]">
        {/* Top Bar */}
        <div className="p-4 border-b border-gray-200 bg-white shadow-sm flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Select
              value={selectedCollectionId}
              onValueChange={handleCollectionSelect}
            >
              <SelectTrigger className="w-[250px]">
                <SelectValue placeholder="Select collection">
                  {selectedCollection ? (
                    <span className="flex items-center">
                      <span className="mr-2">{selectedCollection.icon}</span>
                      {selectedCollection.name}
                    </span>
                  ) : (
                    "Select collection"
                  )}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {promptCollections.map((collection) => (
                  <SelectItem
                    key={collection.id}
                    value={collection.id.toString()}
                  >
                    <span className="flex items-center">
                      <span className="mr-2">{collection.icon}</span>
                      {collection.name}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={selectedVariationName}
              onValueChange={handleVariationSelect}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select variation" />
              </SelectTrigger>
              <SelectContent>
                {selectedCollection.variations.map((variation) => (
                  <SelectItem key={variation.name} value={variation.name}>
                    {variation.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex space-x-2">
            <Dialog
              open={isNewCollectionDialogOpen}
              onOpenChange={setIsNewCollectionDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-green-50 text-green-600 hover:bg-green-100 hover:text-green-700"
                >
                  <Plus className="mr-2 h-4 w-4" /> New Collection
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Collection</DialogTitle>
                  <DialogDescription>
                    Enter the details for your new collection.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="name"
                      value={newCollectionName}
                      onChange={(e) => setNewCollectionName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="icon" className="text-right">
                      Icon
                    </Label>
                    <Input
                      id="icon"
                      value={newCollectionIcon}
                      onChange={(e) => setNewCollectionIcon(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateNewCollection}>
                    Create Collection
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <Dialog
              open={isNewVariationDialogOpen}
              onOpenChange={setIsNewVariationDialogOpen}
            >
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-blue-50 text-blue-600 hover:bg-blue-100 hover:text-blue-700"
                >
                  <Plus className="mr-2 h-4 w-4" /> New Variation
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New Variation</DialogTitle>
                  <DialogDescription>
                    Enter the name for your new variation.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <Label htmlFor="variation-name" className="text-right">
                      Name
                    </Label>
                    <Input
                      id="variation-name"
                      value={newVariationName}
                      onChange={(e) => setNewVariationName(e.target.value)}
                      className="col-span-3"
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button onClick={handleCreateNewVariation}>
                    Create Variation
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="outline"
                    className="bg-amber-50 text-amber-600 hover:bg-amber-100 hover:text-amber-700"
                  >
                    <Undo className="mr-2 h-4 w-4" /> Rollback
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Revert to a previous version</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden bg-gray-50">
          {/* Version History */}
          <div className="w-1/4 p-4 border-r border-gray-200 bg-white overflow-auto">
            <h2 className="text-lg font-semibold mb-4 text-gray-700 flex items-center">
              <History className="mr-2 h-5 w-5" />
              Version History
            </h2>
            <ScrollArea className="h-[calc(100vh-16rem)]">
              {selectedVariation.versions
                .slice()
                .reverse()
                .map((version) => (
                  <div
                    key={version.id}
                    className={`p-3 mb-2 cursor-pointer rounded-lg transition-all duration-200 ${
                      selectedVersion.id === version.id
                        ? "bg-blue-100 border-l-4 border-blue-500"
                        : "hover:bg-gray-100 border-l-4 border-transparent"
                    }`}
                    onClick={() => setSelectedVersionId(version.id)}
                  >
                    <div className="flex justify-between items-center">
                      <span className="font-medium text-gray-800">
                        V{version.id}
                      </span>
                      <span className="text-xs  text-gray-500 flex items-center">
                        <Calendar className="mr-1 h-3 w-3" />
                        {version.date}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600 truncate mt-1">
                      {version.note}
                    </div>
                  </div>
                ))}
            </ScrollArea>
          </div>
          {/* Prompt and Output */}
          <div className="flex-1 p-4 overflow-auto">
            {/* Collection Details Section */}
            <Card className="mb-4 shadow-md">
              <CardContent className="py-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-semibold text-gray-800">
                    {selectedCollection.name}
                  </h2>
                  <div className="flex items-center text-lg text-gray-600">
                    <WandSparkles className="mr-2 h-5 w-5" />

                    <span>{selectedCollection.model || "Not specified"}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-4 shadow-md">
              <CardHeader className="border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-[#FF6B2C] text-lg font-semibold tracking-tight flex items-center">
                    <Edit3 className="mr-2 h-5 w-5" />
                    Prompt (Version {selectedVersion.id})
                  </CardTitle>
                  <Badge variant="secondary" className="text-xs">
                    <Calendar className="mr-1 h-3 w-3 inline" />
                    {selectedVersion.date}
                  </Badge>
                </div>
                <CardDescription>{selectedVersion.note}</CardDescription>
              </CardHeader>
              <CardContent className="pt-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedVersion.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="bg-gray-100 p-4 rounded-md mb-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
                        <MessageSquare className="mr-2 h-4 w-4" />
                        Input Prompt:
                      </h3>
                      <Textarea
                        value={editedPrompt}
                        onChange={(e) => setEditedPrompt(e.target.value)}
                        className="min-h-[100px] w-full border-gray-300 focus:border-[#FF6B2C] focus:ring-[#FF6B2C]"
                      />
                    </div>
                    <div className="flex justify-between items-center mb-4 text-sm text-gray-600">
                      <div>
                        <span className="font-medium flex items-center">
                          <Zap className="mr-1 h-4 w-4" />
                          Prompt Tokens:
                        </span>{" "}
                        {selectedVersion.promptTokens}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </CardContent>
              <CardFooter className="border-t border-gray-200 pt-4">
                <div className="flex justify-between items-center w-full">
                  <Input
                    placeholder="Version note"
                    className="w-2/3 mr-2"
                    value={newVersionNote}
                    onChange={(e) => setNewVersionNote(e.target.value)}
                  />
                  <Button
                    className="w-1/3 bg-[#FF6B2C] hover:bg-[#E55A1B] text-white"
                    onClick={handleSaveNewVersion}
                  >
                    <Save className="mr-2 h-4 w-4" /> Save New Version
                  </Button>
                </div>
              </CardFooter>
            </Card>
            <Card className="shadow-md">
              <CardHeader className="border-b border-gray-200">
                <CardTitle className="text-[#FF6B2C] text-lg font-semibold tracking-tight flex items-center">
                  <ChevronRight className="mr-2 h-5 w-5" />
                  Output
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={selectedVersion.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="bg-white border border-gray-200 rounded-md p-4 mb-4">
                      {selectedVersion.output.type === "text" && (
                        <div className="flex items-start">
                          <MessageSquare className="mr-2 h-5 w-5 text-gray-500 mt-1" />
                          <p className="text-gray-800 whitespace-pre-wrap flex-grow">
                            {selectedVersion.output.content}
                          </p>
                        </div>
                      )}
                      {selectedVersion.output.type === "image" && (
                        <div className="flex flex-col items-center">
                          <ImageIcon className="mb-2 h-8 w-8 text-gray-500" />
                          <img
                            src={selectedVersion.output.content}
                            alt="Generated image"
                            className="max-w-full h-auto rounded-md"
                          />
                        </div>
                      )}
                      {selectedVersion.output.type === "video" && (
                        <div className="flex flex-col items-center">
                          <Video className="mb-2 h-8 w-8 text-gray-500" />
                          <video controls className="w-full rounded-md">
                            <source
                              src={selectedVersion.output.content}
                              type="video/mp4"
                            />
                            Your browser does not support the video tag.
                          </video>
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between items-center text-sm text-gray-600">
                      <div>
                        <span className="font-medium flex items-center">
                          <Zap className="mr-1 h-4 w-4" />
                          Output Type:
                        </span>{" "}
                        {selectedVersion.output.type}
                      </div>
                      <div>
                        <span className="font-medium flex items-center">
                          <Zap className="mr-1 h-4 w-4" />
                          Output Tokens:
                        </span>{" "}
                        {selectedVersion.outputTokens}
                      </div>
                      <div>
                        <span className="font-medium flex items-center">
                          <Zap className="mr-1 h-4 w-4" />
                          Total Tokens:
                        </span>{" "}
                        {selectedVersion.promptTokens +
                          selectedVersion.outputTokens}
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
