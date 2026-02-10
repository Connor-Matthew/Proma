/**
 * ContextSettingsPopover - 上下文长度设置弹出层
 *
 * Popover 内含上下文长度 Slider（0/5/10/15/20/∞ 轮），
 * 以及 infinite 模式的自动压缩阈值（默认 75%）。
 */

import { useState } from 'react'
import { useAtom } from 'jotai'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Slider } from '@/components/ui/slider'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { cn } from '@/lib/utils'
import { Settings2 } from 'lucide-react'
import {
  contextLengthAtom,
  infiniteContextThresholdAtom,
  CONTEXT_LENGTH_OPTIONS,
  type ContextLengthValue,
} from '@/atoms/chat-atoms'

/** 上下文长度滑块标签 */
function getContextLengthLabel(value: ContextLengthValue): string {
  if (value === 'infinite') return '无限'
  if (value === 0) return '0 轮'
  return `${value} 轮`
}

/** 将滑块位置转换为实际值 */
function sliderPositionToValue(position: number): ContextLengthValue {
  return CONTEXT_LENGTH_OPTIONS[position]
}

/** 将实际值转换为滑块位置 */
function valueToSliderPosition(value: ContextLengthValue): number {
  const index = CONTEXT_LENGTH_OPTIONS.indexOf(value)
  return index >= 0 ? index : CONTEXT_LENGTH_OPTIONS.length - 2 // 默认 20
}

export function ContextSettingsPopover(): React.ReactElement {
  const [open, setOpen] = useState(false)
  const [contextLength, setContextLength] = useAtom(contextLengthAtom)
  const [infiniteThreshold, setInfiniteThreshold] = useAtom(infiniteContextThresholdAtom)
  const isInfiniteMode = contextLength === 'infinite'

  const sliderPosition = valueToSliderPosition(contextLength)
  const maxSliderPosition = CONTEXT_LENGTH_OPTIONS.length - 1

  const handleSliderChange = (values: number[]): void => {
    const newValue = sliderPositionToValue(values[0])
    setContextLength(newValue)
  }

  const handleThresholdChange = (value: string): void => {
    const parsed = Number.parseInt(value, 10)
    if (!Number.isFinite(parsed)) return
    const clamped = Math.min(95, Math.max(10, parsed))
    setInfiniteThreshold(clamped)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <Tooltip open={open ? false : undefined}>
        <TooltipTrigger asChild>
          <PopoverTrigger asChild>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8">
              <Settings2 className="h-4 w-4 text-muted-foreground" />
            </Button>
          </PopoverTrigger>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>上下文设置</p>
        </TooltipContent>
      </Tooltip>
      <PopoverContent className="w-72" side="top" align="center">
        <div className="space-y-3">
          {/* 上下文长度设置 */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium">上下文长度</span>
              <span className="text-xs text-muted-foreground">
                {getContextLengthLabel(contextLength)}
              </span>
            </div>

            <Slider
              value={[sliderPosition]}
              onValueChange={handleSliderChange}
              max={maxSliderPosition}
              step={1}
              className="w-full"
            />

            {/* 刻度标签 */}
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>0</span>
              <span>5</span>
              <span>10</span>
              <span>15</span>
              <span>20</span>
              <span className={cn(
                contextLength === 'infinite' ? '' : 'opacity-50'
              )}>
                ∞
              </span>
            </div>

            {/* 无限上下文提示 */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-muted-foreground">
                  ∞ 自动压缩阈值
                </span>
                <div className="flex items-center gap-1">
                  <Input
                    type="number"
                    min={10}
                    max={95}
                    value={infiniteThreshold}
                    onChange={(e) => handleThresholdChange(e.target.value)}
                    disabled={!isInfiniteMode}
                    className={cn(
                      'h-6 w-14 px-2 text-center text-xs',
                      !isInfiniteMode && 'opacity-60 cursor-not-allowed'
                    )}
                  />
                  <span className="text-[10px] text-muted-foreground">%</span>
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground">
                ∞ 模式下按窗口比例保留最近原文，其余历史自动压缩
              </p>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  )
}
