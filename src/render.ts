import type { WithResponseContext } from "./utils.ts";

export class ViewRender<Globals extends object, Args extends any[], Return> {
	constructor(
		private readonly render: (
			this: WithResponseContext<Globals>,
			...args: Args
		) => Return,
	) {}

	renderWithContext(globals: Globals, args: Args) {
		const context = this.createContext(globals);

		return this.render.apply(context, args);
	}

	private createContext(globals: Globals): WithResponseContext<Globals> {
		return {
			response: () => ({ text: console.log }),
			...globals,
		};
	}
}
