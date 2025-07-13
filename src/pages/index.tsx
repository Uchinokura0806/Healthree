// pages/index.tsx
import Link from 'next/link';
import Head from 'next/head';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Home() {
  return (
    <>
      <Head>
        <title>Healthree攻略サイト</title>
        <meta
          name="description"
          content="HealthreeのBenefit・UHT計算ツールと効率シミュレーターを提供"
        />
        {/* viewport をここで指定（_document で既設定なら削除） */}
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="flex min-h-screen flex-col items-center bg-gray-50 px-4 py-8 sm:px-6 lg:px-8">
        {/* ヒーローセクション */}
        <h1 className="mb-8 text-center text-2xl font-bold sm:text-3xl lg:text-4xl">
          Healthree攻略サイト
        </h1>

        {/* ツール一覧 */}
        <div className="grid w-full max-w-2xl gap-5 sm:grid-cols-2">
          {/* Benefit ↔ UHT */}
          <Card className="flex flex-col">
            <CardContent className="flex flex-1 flex-col items-center gap-4 p-6">
              <h2 className="text-lg font-semibold sm:text-xl">Benefit ⇔ UHT シミュレーター</h2>
              <p className="text-center text-sm text-muted-foreground sm:text-base">
                Benefit値を入力して獲得UHTを予測<br />UHTを入力して必要なBenefit値を試算
              </p>
              <Link href="/benefitToUhtCalculator" passHref>
                <Button size="lg" className="w-full sm:w-auto">
                  ツールを開く
                </Button>
              </Link>
            </CardContent>
          </Card>

          {/* 獲得効率 */}
          <Card className="flex flex-col">
            <CardContent className="flex flex-1 flex-col items-center gap-4 p-6">
              <h2 className="text-lg font-semibold sm:text-xl">獲得効率シミュレーター</h2>
              <p className="text-center text-sm text-muted-foreground sm:text-base">
                <br />獲得量とコストを入力して獲得効率を試算
              </p>
              <Link href="/efficiencyCalculator" passHref>
                <Button size="lg" className="w-full sm:w-auto">
                  ツールを開く
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
