'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabaseClient'

type RarityRow = {
  id: number
  created_at: string
  rarerity: string
  init_min_ability_value: number
  init_max_ability_value: number
  level_up_points: number
}

export default function Home() {
  const [data, setData] = useState<RarityRow[]>([])

  useEffect(() => {
    const fetchData = async () => {
      const { data, error } = await supabase.from('cloth').select('*')
      if (error) {
        console.error('取得エラー:', error)
      } else {
        setData(data)
      }
    }

    fetchData()
  }, [])

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">レアリティ別能力値一覧</h1>
      <table className="table-auto border-collapse w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-4 py-2">レアリティ</th>
            <th className="border px-4 py-2">初期能力値（最小）</th>
            <th className="border px-4 py-2">初期能力値（最大）</th>
            <th className="border px-4 py-2">レベルアップ時のポイント</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td className="border px-4 py-2">{row.rarerity}</td>
              <td className="border px-4 py-2">{row.init_min_ability_value}</td>
              <td className="border px-4 py-2">{row.init_max_ability_value}</td>
              <td className="border px-4 py-2">{row.level_up_points}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
