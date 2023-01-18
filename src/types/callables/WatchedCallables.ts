import type { Callable } from "@/types/callables/Callable"
import type { ResolvableStatus } from "@/types/callables/ResolvableStatus"

export type WatchedCallable<T> = {
  call: Callable<T>
  status: ResolvableStatus
}
