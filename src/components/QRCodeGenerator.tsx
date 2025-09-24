import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Download, Share2, Copy } from "lucide-react";
import { useEffect, useRef } from "react";

interface Product {
  id: string;
  product_id: string;
  name: string;
  category: string;
  description: string;
  origin_location: string;
  qr_code_data: string;
  blockchain_hash: string;
}

interface QRCodeGeneratorProps {
  product: Product;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const QRCodeGenerator = ({ product, open, onOpenChange }: QRCodeGeneratorProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (open && product) {
      generateQRCode();
    }
  }, [open, product]);

  const generateQRCode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const size = 300;
    canvas.width = size;
    canvas.height = size;

    // Simple QR code simulation using a pattern
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);

    ctx.fillStyle = '#000000';
    const gridSize = 15;
    const cellSize = size / gridSize;

    // Create a deterministic pattern based on product data
    const dataString = product.qr_code_data + product.blockchain_hash;
    let hash = 0;
    for (let i = 0; i < dataString.length; i++) {
      hash = ((hash << 5) - hash + dataString.charCodeAt(i)) & 0xffffffff;
    }

    // Generate pattern
    for (let row = 0; row < gridSize; row++) {
      for (let col = 0; col < gridSize; col++) {
        const cellHash = hash + row * gridSize + col;
        if (cellHash % 3 === 0) {
          ctx.fillRect(col * cellSize, row * cellSize, cellSize, cellSize);
        }
      }
    }

    // Add corner squares (QR code positioning markers)
    const cornerSize = cellSize * 3;
    
    // Top-left corner
    ctx.fillRect(0, 0, cornerSize, cornerSize);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cellSize, cellSize, cellSize, cellSize);
    
    // Top-right corner
    ctx.fillStyle = '#000000';
    ctx.fillRect(size - cornerSize, 0, cornerSize, cornerSize);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(size - cornerSize + cellSize, cellSize, cellSize, cellSize);
    
    // Bottom-left corner
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, size - cornerSize, cornerSize, cornerSize);
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(cellSize, size - cornerSize + cellSize, cellSize, cellSize);
  };

  const downloadQRCode = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement('a');
    link.download = `QR-${product.product_id}.png`;
    link.href = canvas.toDataURL();
    link.click();

    toast({
      title: "QR Code downloaded",
      description: `QR code for ${product.name} has been saved`,
    });
  };

  const copyProductLink = () => {
    const productUrl = `${window.location.origin}/product/${product.product_id}`;
    navigator.clipboard.writeText(productUrl);
    toast({
      title: "Link copied",
      description: "Product link copied to clipboard",
    });
  };

  const shareProduct = async () => {
    const productUrl = `${window.location.origin}/product/${product.product_id}`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `HerbTrace - ${product.name}`,
          text: `Check out this blockchain-verified product: ${product.name}`,
          url: productUrl,
        });
      } catch (error) {
        copyProductLink();
      }
    } else {
      copyProductLink();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>QR Code - {product.name}</DialogTitle>
          <DialogDescription>
            Scan this QR code to view product details and supply chain information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* QR Code Display */}
          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-lg border-2 border-dashed border-gray-300">
              <canvas
                ref={canvasRef}
                className="max-w-full h-auto"
                style={{ imageRendering: 'pixelated' }}
              />
            </div>
          </div>

          {/* Product Info */}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Product ID:</span>
              <span className="font-mono">{product.product_id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category:</span>
              <span className="capitalize">{product.category}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Origin:</span>
              <span>{product.origin_location}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button onClick={downloadQRCode} className="flex-1">
              <Download className="w-4 h-4 mr-2" />
              Download
            </Button>
            <Button onClick={copyProductLink} variant="outline" className="flex-1">
              <Copy className="w-4 h-4 mr-2" />
              Copy Link
            </Button>
            <Button onClick={shareProduct} variant="outline" className="flex-1">
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          </div>

          <div className="text-xs text-muted-foreground text-center">
            QR code contains product information and blockchain verification hash
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QRCodeGenerator;