import { tryJSONparse } from "./utils";
import MiniSearch from 'minisearch'
import { PackageDependency, PackageInfo } from "@/types/package-types.ts";

export type PackageItem = {
    name?: string;
    version: string;
    size?: string;
    resolved?: string;
    inBundle?: boolean;
    integrity?: string;
    json: string
    // dependencies?: Record<string, PackageInfo>;
    dependents: { name: string, version: string }[];
    otherVersions: { name: string, version: string }[];
    location: string;

    license?: string;
    homepage?: string;
    repository?: {
        type: string;
        url: string;
    };
} & Partial<PackageInfo> & Partial<PackageDependency>

export class PackageSearch {
    private packages: Map<string, PackageItem>;
    private searchIndex: Map<string, Set<string>>;
    private licenseIndex: Map<string, Set<string>>;
    private namesIndex: Map<string, Set<string>>;
    private searchEngine: MiniSearch;

    constructor(packageLockContent: string) {
        const lockFile = tryJSONparse(packageLockContent);
        this.packages = new Map();
        this.searchIndex = new Map();
        this.licenseIndex = new Map();
        this.namesIndex = new Map();

        this.searchEngine = new MiniSearch({
            fields: ['name', 'location', 'version', 'license'], // fields to index for full-text search
            storeFields: ['name', 'location', 'version', 'license'] // fields to return with search results
        })

        const directDependencies = {
            ...lockFile.packages,
            ...lockFile.dependencies,
            ...lockFile.devDependencies,
            ...lockFile.optionalDependencies,
            ...lockFile.peerDependencies,
        }

        this.buildIndexes(directDependencies || {});
    }

    private pathToName(path: string) {
        return path.split('node_modules/').reverse().at(0)
    }

    private buildIndexes(packages: Record<string, PackageItem>) {
        for (const [path, pkg] of Object.entries(packages)) {
            const name = this.pathToName(path);
            const document = {
                id: path,
                ...pkg,
                name,
                location: path,
            }
            this.packages.set(path, document);

            if (pkg.license) {
                const license = pkg.license;

                if (!this.licenseIndex.has(license)) {
                    this.licenseIndex.set(license, new Set());
                }

                this.licenseIndex.get(license)?.add(path);
            }

            if (name) {
                if (!this.namesIndex.has(name)) {
                    this.namesIndex.set(name, new Set());
                }

                this.namesIndex.get(name)?.add(path);
            }

            this.searchEngine.add(document);
        }

    }

    getPackages() {
        const packages = Array.from(this.packages.values());

        return packages
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

        const paths = this.namesIndex.get(packageName);

        if (!paths) {
            return this.packages.get(packageName);
        }

        const first = paths.values().next().value;

        if (first) {
            return this.packages.get(first);
        }
    }

    search(query: string): PackageInfo[] {
        const results = this.searchEngine.search(query)

        console.log({ results })

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
