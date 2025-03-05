import {createRootRoute, Outlet} from '@tanstack/react-router'
import {TanStackRouterDevtools} from '@tanstack/router-devtools'
import {SearchQueryProvider} from "../context/search-query-context.tsx";
import {PackageProvider} from "../context/package-context.tsx";
import {PackageExplorer} from "../components/package-explorer.tsx";

export const Route = createRootRoute({
    component: () => (
        <>
            <SearchQueryProvider>
                <PackageProvider>
                    <PackageExplorer>
                        <Outlet/>
                    </PackageExplorer>
                </PackageProvider>
            </SearchQueryProvider>
            <TanStackRouterDevtools/>
        </>
    ),
})
