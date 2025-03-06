import type React from "react";
import { createContext, useContext, useRef, useState } from "react";
import { PackageInfo, PackageSearch } from "@/lib/package-search";

import type { PackageData } from "@/types/package-types";

interface PackageContextType {
    packageData: PackageData;
    loadPackageData: (data: PackageData) => void;
    isLoaded: boolean;
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    findPackage: (packageName: string) => PackageInfo | undefined
    search: (packageName: string) => PackageInfo[] | undefined
    getPackages: () => PackageInfo[]
}

const PackageContext = createContext<PackageContextType | undefined>(undefined);

export function PackageProvider({ children }: { children: React.ReactNode }) {
    const [packageData, setPackageData] = useState<PackageData>({});
    const [isLoaded, setIsLoaded] = useState(false);
    const packageSearchRef = useRef<PackageSearch | null>(null);
    const [searchQuery, setSearchQuery] = useState("");

    const loadPackageData = (data: PackageData) => {
        setPackageData(data);
        setIsLoaded(true);

        packageSearchRef.current = new PackageSearch(JSON.stringify(data));
    };

    const findPackage = (packageName: string) => {
        const pkg = packageSearchRef.current?.find(packageName);

        return pkg;
    }
    const search = (query: string) => {
        const pkg = packageSearchRef.current?.search(query);

        setSearchQuery(query);

        return pkg;
    }

    const getPackages = () => {
        return packageSearchRef.current?.getPackages() || [];
    }

    return (
        <PackageContext.Provider
            value={{
                packageData,
                loadPackageData,
                isLoaded,
                searchQuery,
                setSearchQuery,
                getPackages,
                findPackage,
                search,
            }}
        >
            {children}
        </PackageContext.Provider>
    );
}

export function usePackage() {
    const context = useContext(PackageContext);

    if (context === undefined) {
        throw new Error("usePackage must be used within a PackageProvider");
    }

    return context;
}
