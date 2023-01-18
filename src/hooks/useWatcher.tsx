import { useState } from "react"

import type { Callable } from "@/types/callables/Callable"

type WatcherStateSet<T> = (status: T) => void
export type Watchable<T> = (
  setState: WatcherStateSet<T>
) => Promise<void> | void

export function useWatcher<T extends boolean | string>(
  watchable: Watchable<T>,
  defaultState: T,
  timeout = 0
): [Callable<void>, T] {
  const [isLoading, setLoading] = useState<boolean | string>(defaultState)

  if (typeof defaultState === "string") {
    const statusCaller = async () => {
      await watchable(setLoading)
    }
    // @ts-ignore
    return [statusCaller, isLoading]
  }

  const defaultCaller = async () => {
    let watcherTimeout
    if (timeout > 0) {
      watcherTimeout = setTimeout(() => {
        setLoading(true)
      }, timeout)
    } else {
      setLoading(true)
    }

    await watchable(setLoading)
    clearTimeout(watcherTimeout)
    setLoading(false)
  }

  // @ts-ignore
  return [defaultCaller, isLoading]
}
