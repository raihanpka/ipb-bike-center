"use client"

import { useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Download } from "lucide-react"

type QRCodeGeneratorProps = {
  defaultValue?: string
  showInput?: boolean
}

export function QRCodeGenerator({ defaultValue = "", showInput = true }: QRCodeGeneratorProps) {
  const [nomorSeri, setNomorSeri] = useState(defaultValue)

  // Update nomorSeri ketika defaultValue berubah
  useEffect(() => {
    if (defaultValue) {
      setNomorSeri(defaultValue)
    }
  }, [defaultValue])

  const handleDownload = () => {
    const svg = document.getElementById("qr-code")
    if (!svg) return

    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    const img = new Image()
    img.crossOrigin = "anonymous" // Menghindari CORS issues
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const pngFile = canvas.toDataURL("image/png")

      // Download file
      const downloadLink = document.createElement("a")
      downloadLink.download = `qr-code-${nomorSeri}.png`
      downloadLink.href = pngFile
      downloadLink.click()
    }
    img.src = "data:image/svg+xml;base64," + btoa(svgData)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>QR Code Sepeda</CardTitle>
        <CardDescription>
          {showInput ? "Buat QR Code untuk nomor seri sepeda" : "QR Code untuk nomor seri sepeda yang dipilih"}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {showInput && (
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Masukkan nomor seri sepeda"
              value={nomorSeri}
              onChange={(e) => setNomorSeri(e.target.value)}
            />
          </div>
        )}

        {nomorSeri ? (
          <div className="flex flex-col items-center p-4 bg-white rounded-md">
            <div className="text-center mb-2 font-medium text-primary">Nomor Seri: {nomorSeri}</div>
            <QRCodeSVG id="qr-code" value={nomorSeri} size={200} />
          </div>
        ) : (
          <div className="flex justify-center items-center h-[200px] bg-gray-100 rounded-md">
            <p className="text-muted-foreground">QR Code akan muncul di sini</p>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex gap-2">
        <Button onClick={handleDownload} disabled={!nomorSeri} className="w-full">
          <Download className="mr-2 h-4 w-4" /> Download QR Code
        </Button>
      </CardFooter>
    </Card>
  )
}
