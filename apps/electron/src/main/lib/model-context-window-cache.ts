/**
 * 模型上下文窗口缓存
 *
 * 用于跨服务复用“服务端回传”的 contextWindow（例如 Agent SDK result modelUsage）。
 * 键统一按小写 modelId 存储。
 */

const modelContextWindowCache = new Map<string, number>()

function normalizeModelId(modelId: string): string {
  return modelId.trim().toLowerCase()
}

export function setModelContextWindow(modelId: string, contextWindow: number): void {
  if (!modelId) return
  if (!Number.isFinite(contextWindow) || contextWindow <= 0) return
  modelContextWindowCache.set(normalizeModelId(modelId), Math.floor(contextWindow))
}

export function getModelContextWindow(modelId: string): number | undefined {
  if (!modelId) return undefined
  return modelContextWindowCache.get(normalizeModelId(modelId))
}

