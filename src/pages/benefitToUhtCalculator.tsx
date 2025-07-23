// pages/benefitToUhtCalculator.tsx
import { useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowUpDown, Home } from 'lucide-react';

// ===== 係数定義 =====
const COEF = 0.082;
const EXP  = 0.522;

export default function BenefitUHTSwap() {
  const [isBenefitOnTop, setIsBenefitOnTop] = useState(true);
  const [benefit, setBenefit] = useState('');
  const [uht, setUht]       = useState('');

  /* ── 計算＆ユーティリティ ── */
  const toFixed1 = (n: number) => Number(n.toFixed(1)).toString();
  const toFixed3 = (n: number) => Number(n.toFixed(3)).toString();
  const sanitize = (v: string) => {
    const n = Math.max(0, parseFloat(v));
    return isNaN(n) ? null : n;
  };
  const calcFromBenefit = (b: number) => COEF * Math.pow(b, EXP);
  const calcFromUht     = (u: number) => Math.pow(u / COEF, 1 / EXP);

  const handleBenefit = (v: string) => {
    const b = sanitize(v);
    if (b === null) { setBenefit(v); setUht(''); return; }
    setBenefit(toFixed1(b));
    setUht(toFixed3(calcFromBenefit(b)));
  };
  const handleUht = (v: string) => {
    const u = sanitize(v);
    if (u === null) { setUht(v); setBenefit(''); return; }
    setUht(toFixed3(u));
    setBenefit(toFixed1(calcFromUht(u)));
  };
  const reset      = () => { setBenefit(''); setUht(''); };
  const swapFields = () => setIsBenefitOnTop(!isBenefitOnTop);

  /* ── 入力フィールド JSX ── */
  const benefitField = (
    <div className="space-y-2">
      <Label htmlFor="benefit">Benefit 値</Label>
      <Input
        id="benefit"
        type="number"
        min={0}
        step={1}
        value={benefit}
        onChange={e => handleBenefit(e.target.value)}
        placeholder="例: 700.0"
      />
    </div>
  );
  const uhtField = (
    <div className="space-y-2">
      <Label htmlFor="uht">UHT</Label>
      <Input
        id="uht"
        type="number"
        min={0}
        step={0.01}
        value={uht}
        onChange={e => handleUht(e.target.value)}
        placeholder="例: 2.500"
      />
    </div>
  );

  return (
    <div className="w-full sm:max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
      <h1 className="text-3xl sm:text-4xl font-bold text-blue-700 text-center">
        Benefit ⇔ UHT シミュレーター
      </h1>

      <div className="flex justify-end">
        <Link href="/" passHref>
          <Button variant="ghost" className="mt-2 flex items-center gap-1 w-full sm:w-auto">
            <Home className="h-5 w-5" />
            ホームへ
          </Button>
        </Link>
      </div>

      <p className="text-center text-xs sm:text-sm text-gray-700">
        ※歩き時のデータを元に作成したものです。スピードによって獲得量は変動しますので、参考程度に。
      </p>

      <Card className="max-w-md mx-auto p-6 space-y-6">
        <CardContent className="space-y-4">
          {isBenefitOnTop ? benefitField : uhtField}

          <div className="flex items-center justify-center py-1">
            <Button variant="ghost" size="icon" onClick={swapFields}>
              <ArrowUpDown className="h-5 w-5" />
            </Button>
          </div>

          {isBenefitOnTop ? uhtField : benefitField}

          <div className="flex items-center justify-center py-1">
            <Button variant="secondary" onClick={reset}>
              リセット
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
