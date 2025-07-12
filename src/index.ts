import type { InitViewsBuilderReturn } from "./utils.ts";
import { ViewBuilder } from "./view.ts";

export function initViewsBuilder<
	Globals extends object,
>(): InitViewsBuilderReturn<Globals> {
	const returnResult: InitViewsBuilderReturn<Globals> = () => {
		const builder = new ViewBuilder<Globals>();

		return builder;
	};

	returnResult.buildRender = (context, globals) => {
		return (viewRender, ...args) => {
			return viewRender.renderWithContext(context, globals, args);
		};
	};

	return returnResult;
}
