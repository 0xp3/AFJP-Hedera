import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { QrCode, Coins, CheckCircle2, Minus, DollarSign, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext';


const QRPaymentBenefit: React.FC = () => {
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [discountPercentage, setDiscountPercentage] = useState<number>(15);
  const [showQR, setShowQR] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [showTransfer, setShowTransfer] = useState<boolean>(false);
  const [transferAmount, setTransferAmount] = useState<string>('');
  const [recipientAddress, setRecipientAddress] = useState<string>('');
  const [currency, setCurrency] = useState<'USD' | 'ARS'>('USD');
  const { toast } = useToast();
  const { t } = useLanguage();
  
  // Mock user data
  const juventudBalance = 2500;
  const tokenValue = 25; // USD per JUVENTUD token
  const usdToPesos = 1450; // Tasa de cambio USD a pesos argentinos
  
  // Calculate discount and tokens needed
  const originalAmountInput = parseFloat(paymentAmount) || 0;
  // Convert to USD if input is in ARS
  const originalAmountUSD = currency === 'ARS' ? originalAmountInput / usdToPesos : originalAmountInput;
  const originalAmountARS = currency === 'USD' ? originalAmountInput * usdToPesos : originalAmountInput;
  const discountAmountUSD = originalAmountUSD * (discountPercentage / 100);
  const finalAmountUSD = originalAmountUSD - discountAmountUSD;
  const tokensNeeded = Math.ceil(discountAmountUSD / tokenValue);
  
  // Display amounts in selected currency
  const originalAmountDisplay = currency === 'USD' ? originalAmountUSD : originalAmountUSD * usdToPesos;
  const discountAmountDisplay = currency === 'USD' ? discountAmountUSD : discountAmountUSD * usdToPesos;
  const finalAmountDisplay = currency === 'USD' ? finalAmountUSD : finalAmountUSD * usdToPesos;
  
  const handleGenerateQR = () => {
    if (!paymentAmount || originalAmountUSD <= 0) {
      toast({
        title: "Error",
        description: "Ingresa un monto válido para el pago",
        variant: "destructive"
      });
      return;
    }
    
    if (tokensNeeded > juventudBalance) {
      toast({
        title: "Saldo Insuficiente",
        description: "No tienes suficientes tokens JUVENTUD para este descuento",
        variant: "destructive"
      });
      return;
    }
    
    setShowQR(true);
    toast({
      title: "QR Generado",
      description: `Código QR creado con ${discountPercentage}% de descuento`,
    });
  };
  
  const handlePayment = () => {
    setIsProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowQR(false);
      setPaymentAmount('');
      
      toast({
        title: "¡Pago Exitoso!",
        description: `Pagaste ${currency === 'USD' ? '$' : '$'}${finalAmountDisplay.toFixed(2)} ${currency} usando ${tokensNeeded} tokens JUVENTUD`,
      });
    }, 2000);
  };

  const handleTransfer = () => {
    const transferTokens = parseFloat(transferAmount);
    
    if (!transferAmount || transferTokens <= 0) {
      toast({
        title: "Error",
        description: "Ingresa una cantidad válida de tokens",
        variant: "destructive"
      });
      return;
    }
    
    if (transferTokens > juventudBalance) {
      toast({
        title: "Saldo Insuficiente",
        description: "No tienes suficientes tokens JUVENTUD para esta transferencia",
        variant: "destructive"
      });
      return;
    }

    if (!recipientAddress.trim()) {
      toast({
        title: "Error",
        description: "Ingresa una dirección de destino válida",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate transfer processing
    setTimeout(() => {
      setIsProcessing(false);
      setShowTransfer(false);
      setTransferAmount('');
      setRecipientAddress('');
      
      toast({
        title: "¡Transferencia Exitosa!",
        description: `Transferiste ${transferTokens} tokens JUVENTUD`,
      });
    }, 2000);
  };
  
  return (
    <Card className="border-border/50 glass-card">
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <QrCode className="mr-3 h-6 w-6 text-green-500" />{t('qr-title')}
        </CardTitle>
        <CardDescription>{t('qr-subtile')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Balance Display with Example */}
        <div className="bg-muted/30 p-4 rounded-lg space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Coins className="h-5 w-5 text-purple-500" />
              <span className="font-medium">{t('qr-balance')}</span>
            </div>
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500">
              {juventudBalance.toLocaleString()} tokens
            </Badge>
          </div>
          
          {/* Value Example */}
          <div className="bg-gradient-to-r from-green-50 to-blue-50 p-3 rounded-lg border border-green-200">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-sm font-medium text-green-700">{t('qr-equals')}</span>
            </div>
            <p className="text-sm text-green-600">
              {t('qr-equals-yours')} {juventudBalance} {t('qr-equals-total')}:
            </p>
            <div className="mt-2 space-y-1">
              <p className="text-sm font-bold text-green-700">
                💵 ${(juventudBalance * tokenValue).toLocaleString()} USD
              </p>
              <p className="text-sm font-bold text-blue-700">
                💰 ${(juventudBalance * tokenValue * usdToPesos).toLocaleString()} ARS
              </p>
            </div>
            <p className="text-xs text-green-500 mt-2">
              (1 {t('qr-equals-last')} = ${tokenValue} USD = ${(tokenValue * usdToPesos).toLocaleString()} ARS)
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button 
            onClick={() => {setShowTransfer(false); setShowQR(false);}}
            variant={!showQR && !showTransfer ? "default" : "outline"}
            className="flex-1"
          >
            <QrCode className="mr-2 h-4 w-4" />
            {t('qr-pay')}
          </Button>
          <Button 
            onClick={() => {setShowTransfer(true); setShowQR(false);}}
            variant={showTransfer ? "default" : "outline"}
            className="flex-1"
          >
            <Send className="mr-2 h-4 w-4" />
            {t('qr-transfer')}
          </Button>
        </div>
        
        {/* Payment Form */}
        {!showQR && !showTransfer ? (
          <div className="space-y-4">
            {/* Currency Toggle */}
            <div className="space-y-2">
              <Label>{t('qr-token')}</Label>
              <div className="flex gap-2">
                <Button
                  variant={currency === 'USD' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrency('USD')}
                  className="flex-1"
                >
                  USD ($)
                </Button>
                <Button
                  variant={currency === 'ARS' ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrency('ARS')}
                  className="flex-1"
                >
                  ARS ($)
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-amount">{t('qr-amount')} ({currency})</Label>
              <Input
                id="payment-amount"
                type="number"
                value={paymentAmount}
                onChange={(e) => setPaymentAmount(e.target.value)}
                placeholder="0.00"
                min="0"
                step={currency === 'USD' ? "0.01" : "1"}
              />
              {currency === 'ARS' && originalAmountInput > 0 && (
                <p className="text-xs text-muted-foreground">
                  {t('qr-equals-final')} ${originalAmountUSD.toFixed(2)} USD
                </p>
              )}
              {currency === 'USD' && originalAmountInput > 0 && (
                <p className="text-xs text-muted-foreground">
                  {t('qr-equals-final')} ${originalAmountARS.toFixed(2)} ARS
                </p>
              )}
            </div>
            
            <div className="space-y-2">
              <Label>{t('qr-discount')}:</Label>
              <div className="flex gap-2">
                {[10, 15, 20, 25].map((percentage) => (
                  <Button
                    key={percentage}
                    variant={discountPercentage === percentage ? "default" : "outline"}
                    size="sm"
                    onClick={() => setDiscountPercentage(percentage)}
                    className="flex-1"
                  >
                    {percentage}%
                  </Button>
                ))}
              </div>
            </div>
            
            {/* Payment Calculation */}
            {originalAmountInput > 0 && (
              <Card className="bg-muted/20">
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t('qr-original')}:</span>
                    <span>${originalAmountDisplay.toFixed(currency === 'USD' ? 2 : 0)} {currency}</span>
                  </div>
                  <div className="flex justify-between text-sm text-green-600">
                    <span className="flex items-center gap-1">
                      <Minus className="h-3 w-3" />
                      {t('qr-disc')} ({discountPercentage}%):
                    </span>
                    <span>-${discountAmountDisplay.toFixed(currency === 'USD' ? 2 : 0)} {currency}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t('qr-required')}:</span>
                    <span className="font-medium">{tokensNeeded} JUVENTUD</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between font-bold">
                    <span>{t('qr-total')}:</span>
                    <span className="text-green-600">${finalAmountDisplay.toFixed(currency === 'USD' ? 2 : 0)} {currency}</span>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Button 
              onClick={handleGenerateQR}
              className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
              disabled={!paymentAmount || originalAmountUSD <= 0 || tokensNeeded > juventudBalance}
            >
              <QrCode className="mr-2 h-4 w-4" />
              {t('qr-mint')}
            </Button>
          </div>
        ) : showTransfer ? (
          /* Transfer Form */
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="transfer-amount">{t('transfer-amount')}</Label>
              <Input
                id="transfer-amount"
                type="number"
                value={transferAmount}
                onChange={(e) => setTransferAmount(e.target.value)}
                placeholder="0"
                min="0"
                max={juventudBalance}
                step="1"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="recipient-address">{t('transfer-address')}</Label>
              <Input
                id="recipient-address"
                type="text"
                value={recipientAddress}
                onChange={(e) => setRecipientAddress(e.target.value)}
                placeholder={t('transfer-address-sub')}
              />
            </div>
            
            {/* Transfer Summary */}
            {parseFloat(transferAmount) > 0 && (
              <Card className="bg-muted/20">
                <CardContent className="p-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>{t('transfer-final-amount')}:</span>
                    <span className="font-medium">{transferAmount} JUVENTUD</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t('transfer-final-usd')}:</span>
                    <span>${(parseFloat(transferAmount) * tokenValue).toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>{t('transfer-final-ars')}:</span>
                    <span>${((parseFloat(transferAmount) * tokenValue * usdToPesos)).toLocaleString()}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-sm">
                    <span>{t('transfer-final-balance')}:</span>
                    <span className="font-medium">{juventudBalance - parseFloat(transferAmount)} JUVENTUD</span>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Button 
              onClick={handleTransfer}
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:opacity-90"
              disabled={!transferAmount || !recipientAddress || parseFloat(transferAmount) > juventudBalance || isProcessing}
            >
              <Send className="mr-2 h-4 w-4" />
              {isProcessing ? "Procesando..." : "Transferir Tokens"}
            </Button>
          </div>
        ) : (
          /* QR Code Display */
          <div className="space-y-4 text-center">
            <div className="bg-white p-6 rounded-lg mx-auto w-fit">
              <div className="w-48 h-48 bg-black flex items-center justify-center text-white font-mono text-xs leading-tight">
                QR CODE
                <br />
                ${finalAmountDisplay.toFixed(currency === 'USD' ? 2 : 0)} {currency}
                <br />
                -{tokensNeeded} JUVENTUD
              </div>
            </div>
            
            <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span className="font-semibold text-green-700">{t('qr-active')}</span>
                </div>
                <p className="text-sm text-center text-green-600">
                  {t('qr-active-total')}: ${finalAmountDisplay.toFixed(currency === 'USD' ? 2 : 0)} {currency} {t('qr-active-total-mid')} {tokensNeeded} {t('qr-active-total-last')}
                  <br />
                  <span className="text-xs">
                    ${finalAmountUSD.toFixed(2)} USD {t('qr-active-equals')} ${(finalAmountUSD * usdToPesos).toLocaleString()} ARS
                  </span>
                </p>
              </CardContent>
            </Card>
            
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                onClick={() => setShowQR(false)}
                className="flex-1"
                disabled={isProcessing}
              >
                Cancelar
              </Button>
              <Button 
                onClick={handlePayment}
                className="flex-1 bg-gradient-to-r from-green-500 to-blue-500 hover:opacity-90"
                disabled={isProcessing}
              >
                {isProcessing ? "Procesando..." : "Simular Pago"}
              </Button>
            </div>
          </div>
        )}
        
        {/* Benefits List */}
        <div className="border-t pt-4">
          <h4 className="font-medium mb-3">{t('benefits-title')}Beneficios de los Tokens JUVENTUD</h4>
          <ul className="space-y-2 text-sm">
            <li className="flex items-center gap-2">
              <Badge className="bg-green-100 text-green-700">{t('benefits-div-first')}QR Payments</Badge>
              <span>{t('benefits-div-first-span')}Descuentos automáticos del 10% al 25%</span>
            </li>
            <li className="flex items-center gap-2">
              <Badge className="bg-blue-100 text-blue-700">{t('benefits-div-second')}Transferencias</Badge>
              <span>{t('benefits-div-second-span')}Envío instantáneo a otros usuarios</span>
            </li>
            <li className="flex items-center gap-2">
              <Badge className="bg-purple-100 text-purple-700">{t('benefits-div-third')}Seguridad</Badge>
              <span>{t('benefits-div-third-span')}Transacciones protegidas por blockchain</span>
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default QRPaymentBenefit;
