import type { ViewRender } from "./render.ts";
import type { ViewBuilder } from "./view.ts";

export interface ResponseContext {
	text: (text: string) => void;
}

export type WithResponseContext<T> = T & { response: () => ResponseContext };

export type ExtractViewArgs<View extends ViewRender<any, any, any>> =
	View extends ViewRender<any, infer Args, any> ? Args : never;

export type RenderFunction = <
	View extends ViewRender<any, any, any>,
	Args extends any[] = ExtractViewArgs<View>,
>(
	view: View,
	...args: Args
) => void;

export interface InitViewsBuilderReturn<Globals extends object> {
	(): ViewBuilder<Globals>;

	buildRender: (
		globals: Globals,
	) => <View extends ViewRender<any, any, any>>(
		view: View,
		...args: ExtractViewArgs<View>
	) => void;
}
