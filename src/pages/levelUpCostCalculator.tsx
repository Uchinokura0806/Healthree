// pages/evolutionCalculator.tsx
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { createClient } from '@supabase/supabase-js';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Home, ArrowRight, ArrowDown } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

type LevelCost = {
  level: number;
  uht: number;
  ght: number;
  time: number;
};

export default function LevelUpSimulator() {
  const [beforeLevel, setBeforeLevel] = useState('0');
  const [afterLevel, setAfterLevel] = useState('1');
  const [levelData, setLevelData] = useState<LevelCost[]>([]);
  const [result, setResult] = useState<{ uht: number; ght: number; time: number } | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase
        .from('level_up_costs')
        .select('level, cost_uht, cost_ght, cost_time')
        .order('level', { ascending: true });

      if (error) {
        console.error('データ取得エラー:', error.message);
        return;
      }

      if (data) {
        const parsed = data.map(row => ({
          level: row.level,
          uht: row.cost_uht ?? 0,
          ght: row.cost_ght ?? 0,
          time: row.cost_time ?? 0,
        }));
        setLevelData(parsed);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const before = parseInt(beforeLevel, 10);
    const after = parseInt(afterLevel, 10);

    if (before > after) {
      const next = Math.min(before + 1, 30);
      setAfterLevel(next.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [beforeLevel]);

  useEffect(() => {
    if (result && resultRef.current) {
      resultRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [result]);

  const calculate = () => {
    const start = parseInt(beforeLevel, 10);
    const end = parseInt(afterLevel, 10);
    const filtered = levelData.filter(entry => entry.level > start && entry.level <= end);

    const total = filtered.reduce(
      (acc, cur) => ({
        uht: acc.uht + cur.uht,
        ght: acc.ght + cur.ght,
        time: acc.time + cur.time,
      }),
      { uht: 0, ght: 0, time: 0 }
    );

    setResult(total);
  };

  const reset = () => {
    setBeforeLevel('0');
    setAfterLevel('1');
    setResult(null);
  };

  const levelOptions = Array.from({ length: 31 }, (_, i) => i.toString());

  return (
    <div className="w-full sm:max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-4xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
        レベルアップコスト
      </h1>

      <div className="flex justify-end">
        <Link href="/" passHref>
          <Button variant="ghost" className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            ホームへ
          </Button>
        </Link>
      </div>

      <Card className="w-full p-8 space-y-8 border border-gray-200 shadow-xl rounded-2xl bg-white">
        <CardContent className="space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-6 justify-center">
            <div className="flex flex-col items-center space-y-2">
              <Label>Before Lv.</Label>
              <Select value={beforeLevel} onValueChange={setBeforeLevel}>
                <SelectTrigger className="w-28 border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="選択" />
                </SelectTrigger>
                <SelectContent>
                  {levelOptions.map(level => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="inline-flex items-center justify-center select-none">
              <ArrowDown className="w-5 h-5 sm:hidden" />
              <ArrowRight className="w-5 h-5 hidden sm:block" />
            </div>

            <div className="flex flex-col items-center space-y-2">
              <Label>After Lv.</Label>
              <Select value={afterLevel} onValueChange={setAfterLevel}>
                <SelectTrigger className="w-28 border-gray-300 shadow-sm focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="選択" />
                </SelectTrigger>
                <SelectContent>
                  {levelOptions
                    .filter(level => parseInt(level) >= parseInt(beforeLevel))
                    .map(level => (
                      <SelectItem key={level} value={level}>
                        {level}
                      </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center gap-6">
            <Button onClick={calculate} className="w-32 bg-blue-600 hover:bg-blue-700 text-white">
              計算する
            </Button>
            <Button variant="outline" onClick={reset} className="w-32 border-gray-400 text-gray-600 hover:bg-gray-100">
              リセット
            </Button>
          </div>

          {result && (
            <div ref={resultRef} className="border-t pt-6 space-y-4 text-center">
              <p className="text-xl font-bold text-blue-700 flex justify-center items-center gap-2">
                <span className="w-5 h-5" />
                計算結果
              </p>

              <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center mt-6">
                <Card className="w-50 text-center shadow-md">
                  <CardContent>
                    <div className="text-sm text-muted-foreground mt-2">トークン</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {result.uht.toLocaleString()} UHT
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {result.ght.toLocaleString()} GHT
                    </div>
                  </CardContent>
                </Card>

                <Card className="w-50 text-center shadow-md">
                  <CardContent>
                    <div className="text-sm text-muted-foreground mt-2">時間</div>
                    <div className="text-2xl font-bold text-gray-700">
                      {result.time.toLocaleString()} 時間
                    </div>
                  </CardContent>
                </Card>

                <Card className="w-50 text-center shadow-md">
                  <CardContent>
                    <div className="text-sm text-muted-foreground mt-2">ブースト</div>
                    <div className="text-2xl font-bold text-purple-600">
                      {(result.time * 60 / 10).toLocaleString()} UHT
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
