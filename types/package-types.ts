export interface PackageDependency {
  version: string
  resolved?: string
  integrity?: string
  requires?: Record<string, string>
  dependencies?: Record<string, string>
}

export interface PackageInfo {
  version?: string
  resolved?: string
  integrity?: string
  dependencies?: Record<string, string>
  devDependencies?: Record<string, string>
  peerDependencies?: Record<string, string>
  optionalDependencies?: Record<string, string>
  bin?: Record<string, string> | string
  engines?: Record<string, string>
  cpu?: string[]
  os?: string[]
  license?: string
  homepage?: string
  repository?: {
    type: string
    url: string
  }
  bugs?: {
    url: string
  }
  size?: string
}

export interface PackageData {
  name?: string
  version?: string
  lockfileVersion?: number
  requires?: boolean
  packages?: Record<string, PackageInfo>
  dependencies?: Record<string, PackageDependency>
  devDependencies?: Record<string, PackageDependency>
  peerDependencies?: Record<string, PackageDependency>
  optionalDependencies?: Record<string, PackageDependency>
}

