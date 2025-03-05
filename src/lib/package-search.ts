import { tryJSONparse } from "./utils";

export type PackageInfo = {
  name: string;
  version: string;
  size?: string;
  resolved?: string;
  json: string
  dependencies?: Record<string, PackageInfo>;
  dependents: {name: string, version: string}[];
  otherVersions: {name: string, version: string}[];
  location: string;

  license?: string;
  homepage?: string;
  repository?: {
    type: string;
    url: string;
  };
};

export class PackageSearch {
  private packages: Map<string, PackageInfo>;
  private searchIndex: Map<string, Set<string>>;

  constructor(packageLockContent: string) {
    const lockFile = tryJSONparse(packageLockContent);
    this.packages = new Map();
    this.searchIndex = new Map();

    this.buildIndexes(lockFile.packages || {});
  }

  private buildIndexes(packages: Record<string, PackageInfo>) {
    for (const [path, pkg] of Object.entries(packages)) {
      this.packages.set(path, pkg);

      const searchableText = [path, pkg.name, pkg.version, pkg.resolved]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      for (let i = 0; i < searchableText.length - 2; i++) {
        const token = searchableText.slice(i, i + 3);

        if (!this.searchIndex.has(token)) {
          this.searchIndex.set(token, new Set());
        }
        this.searchIndex.get(token)?.add(path);
      }
    }
  }

  find(packageName: string): PackageInfo | undefined {

    // Find packages that depend on this one
    // const dependents = Object.entries(packageData.packages || {})
    //     .filter(([_, pkg]) => {
    //       const deps = {
    //         ...pkg.dependencies,
    //         ...pkg.devDependencies,
    //         ...pkg.peerDependencies,
    //         ...pkg.optionalDependencies,
    //       };
    //       return deps && packageName in deps;
    //     })
    //     .map(([path]) => path);

    return this.packages.get(packageName);
  }

  search(query: string): PackageInfo[] {
    if (query.length < 3) return [];

    query = query.toLowerCase();

    const matchingSets = Array.from(query).map((_, i) => {
      if (i > query.length - 3) return new Set<string>();
      const token = query.slice(i, i + 3);
      return this.searchIndex.get(token) || new Set<string>();
    });

    const intersection = matchingSets.reduce((acc, set) => {
      if (acc.size === 0) return set;
      return new Set([...acc].filter((x) => set.has(x)));
    });

    return Array.from(intersection)
      .map((path) => ({
        path,
        package: this.packages.get(path)!,
        relevance: this.calculateRelevance(path, query),
      }))
      .sort((a, b) => b.relevance - a.relevance)
      .map(({ package: pkg }) => pkg);
  }

  private calculateRelevance(path: string, query: string): number {
    const lowerPath = path.toLowerCase();
    const queryIndex = lowerPath.indexOf(query);

    if (queryIndex === 0) return 100;

    if (path.includes(`/${query}`)) return 75;

    return queryIndex === -1 ? 0 : 50 - queryIndex;
  }
}
