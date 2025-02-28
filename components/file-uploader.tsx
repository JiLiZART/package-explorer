"use client"

import type React from "react"

import { useState } from "react"
import { Upload, FileJson } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface FileUploaderProps {
  onFileLoaded: (data: any) => void
}

export function FileUploader({ onFileLoaded }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const files = e.dataTransfer.files
    if (files.length > 0) {
      processFile(files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      processFile(files[0])
    }
  }

  const processFile = (file: File) => {
    setError(null)

    if (file.name !== "package-lock.json") {
      setError("Please upload a package-lock.json file")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const json = JSON.parse(e.target?.result as string)
        onFileLoaded(json)
      } catch (err) {
        setError("Invalid JSON file")
      }
    }
    reader.readAsText(file)
  }

  const loadSampleData = () => {
    // Load sample data for demonstration
    fetch("/sample-package-lock.json")
      .then((response) => response.json())
      .then((data) => {
        onFileLoaded(data)
      })
      .catch(() => {
        // If fetch fails, load minimal sample data
        onFileLoaded({
          name: "sample-project",
          version: "1.0.0",
          dependencies: {
            react: "^18.2.0",
            "react-dom": "^18.2.0",
            next: "^14.0.0",
          },
          packages: {
            "": {
              name: "sample-project",
              version: "1.0.0",
              dependencies: {
                react: "^18.2.0",
                "react-dom": "^18.2.0",
                next: "^14.0.0",
              },
            },
            "node_modules/react": {
              version: "18.2.0",
              dependencies: {
                "loose-envify": "^1.1.0",
              },
            },
            "node_modules/react-dom": {
              version: "18.2.0",
              dependencies: {
                "loose-envify": "^1.1.0",
                scheduler: "^0.23.0",
              },
            },
            "node_modules/next": {
              version: "14.0.0",
              dependencies: {
                react: "^18.2.0",
                "react-dom": "^18.2.0",
              },
            },
          },
        })
      })
  }

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileJson className="h-5 w-5" />
            Package Explorer
          </CardTitle>
          <CardDescription>Upload your package-lock.json file to analyze dependencies</CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center ${
              isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Upload className="h-10 w-10 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-1">Drag &amp; Drop your package-lock.json file</h3>
            <h3 className="text-lg font-medium mb-1">Drag &amp; Drop your package-lock.json file</h3>
            <p className="text-sm text-muted-foreground mb-4">or click to browse</p>

            <Input type="file" className="hidden" id="file-upload" onChange={handleFileChange} />
            <Label htmlFor="file-upload">
              <Button variant="outline" className="w-full">
                Select File
              </Button>
            </Label>

            {error && <p className="text-sm text-destructive mt-2">{error}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={loadSampleData}>
            Load Sample Data
          </Button>
          <Button onClick={() => document.getElementById("file-upload")?.click()}>Upload package-lock.json</Button>
        </CardFooter>
      </Card>
    </div>
  )
}

