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
		// @ts-expect-error
		const render: ReturnType<InitViewsBuilderReturn<Globals>["buildRender"]> = (
			viewRender,
			...args
		) => {
			// @ts-expect-error
			return viewRender.renderWithContext(context, globals, args);
		};

		// @ts-expect-error
		render.send = (viewRender, ...args) => {
			// @ts-expect-error
			return viewRender.renderWithContext(context, globals, args, "send");
		};

		// @ts-expect-error
		render.edit = (viewRender, ...args) => {
			// @ts-expect-error
			return viewRender.renderWithContext(context, globals, args, "edit");
		};

		return render;
	};

	return returnResult;
}
