import { ViewRender } from "./render.ts";
import type { WithResponseContext } from "./utils.ts";

export class ViewBuilder<Globals extends object> {
	render<Args extends any[], Return>(
		callback: (this: WithResponseContext<Globals>, ...args: Args) => Return,
	) {
		return new ViewRender(callback);
	}
}
