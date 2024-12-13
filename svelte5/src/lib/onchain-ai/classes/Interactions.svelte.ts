import { Events, type EventsSortOrder } from "$lib/wagmi/classes";
import type { Address } from "abitype";

class Interactions extends Events {
  sender: Address;

  #filterUniqueByRequestId = (events: any[]): any[] => {
    const eventMap = new Map<string, any>();
    for (const event of events) {
      const { requestId, response } = event.args;
      const existingEvent = eventMap.get(requestId);

      if (!existingEvent || (existingEvent.args.response === "" && response !== ""))
        (eventMap.set(requestId, event))
    }
    return Array.from(eventMap.values());
  }
  #listUnique = $derived.by(() => this.#filterUniqueByRequestId(this.listAll));

  list = $derived.by(() => {
    const uniqueList = this.#listUnique;
    const sortedList = this.sort === "DESC" ? uniqueList.toReversed() : uniqueList;
    const slicedList = sortedList.slice(0, this.limit);
    return this.raw ? slicedList : slicedList.map((event) => event.args);
  });
  get max() { return this.#listUnique.length; }

  constructor({ limit, sort, watch }: { limit?: number; sort?: EventsSortOrder; watch?: boolean } = {}) {
    super("OnChainAIv1", { filter: { eventName: "InteractionLog" }, limit, sort, watch, raw: false });
  }
}
export { Interactions };
