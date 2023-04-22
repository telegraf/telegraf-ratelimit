export class MemoryStore {
  constructor(clearPeriod: number) {
    setInterval(this.reset.bind(this), clearPeriod)
  }

  private readonly store = new Map<string, number>()

  public incr(key: string): number {
    let counter = this.store.get(key) || 0
    counter++
    this.store.set(key, counter)
    return counter
  }

  private reset(): void {
    this.store.clear()
  }
}
