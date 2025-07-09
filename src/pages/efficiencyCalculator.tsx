import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

// 装備の三部位データ型
type CleaningOrRepair = { top: string; bottom: string; shoes: string }

export default function EfficiencyCalculator() {
  const initialState: CleaningOrRepair = { top: '', bottom: '', shoes: '' }
  const keys: (keyof CleaningOrRepair)[] = ['top', 'bottom', 'shoes']

  // 入力ステート
  const [uht, setUht] = useState<string>('')
  const [energy, setEnergy] = useState<string>('')
  const [cleaning, setCleaning] = useState<CleaningOrRepair>({ ...initialState })
  const [repair, setRepair] = useState<CleaningOrRepair>({ ...initialState })

  // リアルレートを取得する
  const rate = 3.06088

  // 値変換
  const uhtNumber = parseFloat(uht) || 0
  const energyNum = parseFloat(energy) || 0

  // コスト計算
  const totalCleaning = Object.values(cleaning)
    .reduce((s, v) => s + (parseFloat(v) || 0), 0)

  const totalRepairGHT = Object.values(repair)
    .reduce((s, v) => s + (parseFloat(v) || 0), 0)

  const repairDivisor = Math.max(5, Math.ceil(energyNum / 5) * 5)
  const totalRepairCost = energyNum > 0
    ? totalRepairGHT * energyNum / repairDivisor * rate
    : 0

  const totalCost = totalCleaning + totalRepairCost
  const rawEfficiency = uhtNumber > 0 ? (1 - totalCost / uhtNumber) * 100 : 0
  const efficiency = rawEfficiency.toFixed(2)

  const efficiencyColor =
    rawEfficiency >= 80 ? 'text-green-600'
    : rawEfficiency >= 70 ? 'text-yellow-600'
    : 'text-red-600'

  const canShowEfficiency =
    uhtNumber >= 0 &&
    energyNum > 0 &&
    rawEfficiency >= 0 &&
    rawEfficiency <= 100

  const errorMessage =
    uht === ''
      ? '獲得UHT を入力してください'
      : energy === '' || energyNum === 0
      ? '消費エナジーを入力してください'
      : rawEfficiency < 0
      ? 'コストが獲得UHTを上回っています'
      : ''

  const inputClass = (hasError: boolean) =>
    `flex-1 ${hasError ? 'ring-1 ring-red-500' : ''}`

  const handleValChange = (
    setter: React.Dispatch<React.SetStateAction<CleaningOrRepair>>,
    field: keyof CleaningOrRepair
  ) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value
    if (v === '' || parseFloat(v) >= 0) setter(prev => ({ ...prev, [field]: v }))
  }

  const resetAll = () => {
    setUht('')
    setEnergy('')
    setCleaning({ ...initialState })
    setRepair({ ...initialState })
  }

  return (
    <div className="w-full sm:max-w-2xl mx-auto p-4 sm:p-6 space-y-6">
      <h1 className="text-4xl font-bold text-center text-blue-700 mb-8">
        獲得効率 試算ツール
      </h1>
	    <p className="text-center text-sm text-gray-700">1 GHT = {rate.toFixed(4)} UHT</p>

      {/* UHT入力 */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6 space-y-2">
          <Label htmlFor="uht" className="text-lg font-semibold text-gray-700">獲得UHT</Label>
          <div className="flex items-center gap-2 sm:gap-4">
            <Input
              id="uht"
              type="number"
              min="0"
              step="0.1"
              value={uht}
              onChange={e => {
                const v = e.target.value
                if (v === '' || parseFloat(v) >= 0) setUht(v)
              }}
              placeholder="0"
              className={inputClass(uht === '' || uhtNumber === 0)}
            />
            <span className="text-gray-500 text-sm">UHT</span>
          </div>
          {(uht === '' || uhtNumber === 0) && (
            <p className="text-red-600 text-sm">必須項目です</p>
          )}
        </CardContent>
      </Card>

      {/* Energy入力 */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6 space-y-2">
          <Label htmlFor="energy" className="text-lg font-semibold text-gray-700">消費エナジー</Label>
          <div className="flex items-center gap-2 sm:gap-4">
            <Input
              id="energy"
              type="number"
              min="0"
              step="1"
              value={energy}
              onChange={e => {
                const v = e.target.value
                if (v === '' || parseFloat(v) >= 0) setEnergy(v)
              }}
              placeholder="0"
              className={inputClass(energy === '' || energyNum === 0)}
            />
            <span className="text-gray-500 text-sm">Energy</span>
          </div>
          {(energy === '' || energyNum === 0) && (
            <p className="text-red-600 text-sm">必須項目です</p>
          )}
        </CardContent>
      </Card>

      {/* Cleaning */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">クリーニングコスト</h2>
          {keys.map(item => (
            <div key={item} className="flex items-center gap-2 sm:gap-4">
              <Label className="w-24 text-gray-600">{item.toUpperCase()}</Label>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={cleaning[item]}
                onChange={handleValChange(setCleaning, item)}
                placeholder="0"
                className="flex-1"
              />
              <span className="text-sm text-gray-500">UHT</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Repair */}
      <Card className="rounded-2xl shadow-sm">
        <CardContent className="p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-700 border-b pb-2">リペアコスト</h2>
          {keys.map(item => (
            <div key={item} className="flex items-center gap-2 sm:gap-4">
              <Label className="w-24 text-gray-600">{item.toUpperCase()}</Label>
              <Input
                type="number"
                min="0"
                step="0.1"
                value={repair[item]}
                onChange={handleValChange(setRepair, item)}
                placeholder="0"
                className="flex-1"
              />
              <span className="text-sm text-gray-500">GHT</span>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* 結果表示 */}
      <Card className="rounded-2xl shadow-md border">
        <CardContent className="p-6 text-center space-y-4">
          <p className="text-lg text-gray-700">
            総コスト：<span className="font-semibold">
              {totalCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} UHT
            </span>
          </p>

          {canShowEfficiency ? (
            <>
              <p className="text-lg text-gray-700">獲得効率</p>
              <p className={`text-5xl font-extrabold ${efficiencyColor}`}>
                {parseFloat(efficiency).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}%
              </p>
            </>
          ) : (
            <p className="text-red-600 text-sm font-medium">{errorMessage}</p>
          )}
        </CardContent>
      </Card>

      {/* リセット */}
      <div className="text-center">
        <Button variant="outline" onClick={resetAll} className="mt-2 w-full sm:w-auto">
          リセット
        </Button>
      </div>
    </div>
  )
}
