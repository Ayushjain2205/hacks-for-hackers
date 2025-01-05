export interface Collection {
  id: string;
  name: string;
  icon: string;
  model: string;
  description?: string;
  isPublic: boolean;
  forkCount: number;
  starCount: number;
  author: {
    name: string;
    email: string;
  };
  variations: Variation[];
  tags: string[];
}

export interface Variation {
  id: string;
  name: string;
  description?: string;
  versions: Version[];
}

export interface Version {
  id: string;
  note: string;
  prompt: string;
  output: {
    type: string;
    content: string;
  };
  promptTokens: number;
  outputTokens: number;
  metadata?: Record<string, any>;
  tags: string[];
}

class ApiService {
  private async fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const response = await fetch(`/api/${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.statusText}`);
    }

    return response.json();
  }

  // Collections
  async getCollections(): Promise<Collection[]> {
    return this.fetchApi<Collection[]>("collections");
  }

  async createCollection(
    data: Omit<Collection, "id" | "author" | "variations">
  ): Promise<Collection> {
    return this.fetchApi<Collection>("collections", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Versions
  async getVersions(variationId: string): Promise<Version[]> {
    return this.fetchApi<Version[]>(`versions?variationId=${variationId}`);
  }

  async createVersion(
    data: Omit<Version, "id"> & { variationId: string }
  ): Promise<{
    version: Version;
    experiment: any;
  }> {
    return this.fetchApi<{ version: Version; experiment: any }>("versions", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // Experiments
  async getExperiments(versionId: string): Promise<any[]> {
    return this.fetchApi<any[]>(`experiments?versionId=${versionId}`);
  }
}

export const apiService = new ApiService();
