'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { encryptQRData } from '@/lib/qr-crypto';
import { Loader2, Download } from 'lucide-react';

interface QRCodeGeneratorProps {
  nomorSeri: string;
  title?: string;
}

export function QRCodeGenerator({
  nomorSeri,
  title = 'QR Code Sepeda'
}: QRCodeGeneratorProps) {
  const [qrValue, setQrValue] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const generateEncryptedQR = async () => {
      if (!nomorSeri) return;

      try {
        setIsLoading(true);
        // Encrypt the nomorSeri for the QR code
        const encryptedValue = await encryptQRData(nomorSeri);
        setQrValue(encryptedValue);
      } catch (error) {
        console.error('Error generating QR code:', error);
      } finally {
        setIsLoading(false);
      }
    };

    generateEncryptedQR();
  }, [nomorSeri]);

  const downloadQRCode = () => {
    const svg = document.getElementById('qr-code-svg');
    if (!svg) return;

    // Create a canvas element
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas dimensions (make it larger for better quality)
    canvas.width = 1000;
    canvas.height = 1000;

    // Create an image from the SVG
    const img = new Image();
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], {
      type: 'image/svg+xml;charset=utf-8'
    });
    const url = URL.createObjectURL(svgBlob);

    img.onload = () => {
      // Fill white background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw the QR code
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Convert to PNG and download
      const pngUrl = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.href = pngUrl;
      downloadLink.download = `qr-code-${nomorSeri}.png`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(url);
    };

    img.src = url;
  };

  return (
    <Card className='mx-auto w-full max-w-sm'>
      <CardHeader>
        <CardTitle className='text-center'>{title}</CardTitle>
      </CardHeader>
      <CardContent className='flex justify-center'>
        {isLoading ? (
          <div className='flex h-64 w-64 items-center justify-center'>
            <Loader2 className='text-muted-foreground h-8 w-8 animate-spin' />
          </div>
        ) : (
          <div className='rounded-lg bg-white p-4'>
            <QRCodeSVG
              id='qr-code-svg'
              value={qrValue}
              size={256}
              level='H' // High error correction for better readability
              includeMargin={true}
            />
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Button
          onClick={downloadQRCode}
          className='w-full'
          disabled={isLoading || !qrValue}
        >
          <Download className='mr-2 h-4 w-4' />
          Download QR Code
        </Button>
      </CardFooter>
    </Card>
  );
}
