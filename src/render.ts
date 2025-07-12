import type { BotLike, Context } from "gramio";
import { ResponseView } from "./response.ts";
import type { WithResponseContext } from "./utils.ts";

const responseKey = "response";

export class ViewRender<Globals extends object, Args extends any[]> {
	constructor(
		private readonly render: (
			this: WithResponseContext<Globals>,
			...args: Args
		) => ResponseView,
	) {}

	async renderWithContext(
		context: Context<BotLike>,
		globals: Globals,
		args: Args,
	) {
		const contextData = this.createContext(globals);

		const result = this.render.apply(contextData, args);

		const response = result[responseKey];

		if (context.is("message")) {
			if (response.text) {
				await context.send(response.text, {
					reply_markup: response.keyboard,
				});
			}
		} else if (context.is("callback_query")) {
			if (response.text) {
				const builtKeyboard =
					response.keyboard && "toJSON" in response.keyboard
						? response.keyboard.toJSON()
						: undefined;

				await context.editText(response.text, {
					reply_markup:
						builtKeyboard && "inline_keyboard" in builtKeyboard
							? builtKeyboard
							: undefined,
				});
			}
		}
	}

	private createContext(globals: Globals): WithResponseContext<Globals> {
		return {
			response: new ResponseView(),
			...globals,
		};
	}
}
