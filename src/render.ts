import type { BotLike, ContextType } from "gramio";
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
		context: ContextType<BotLike, "message" | "callback_query">,
		globals: Globals,
		args: Args,
		strategyRaw?: "send" | "edit",
	) {
		const contextData = this.createContext(globals);

		const result = this.render.apply(contextData, args);

		const response = result[responseKey];

		const strategy = strategyRaw ?? (context.is("message") ? "send" : "edit");

		if (strategy === "send") {
			if (response.text) {
				const builtKeyboard =
					response.keyboard && "toJSON" in response.keyboard
						? response.keyboard.toJSON()
						: response.keyboard;

				await context.send(response.text, {
					reply_markup: builtKeyboard,
				});
			}
		} else if (strategy === "edit" && context.is("callback_query")) {
			if (response.text) {
				const builtKeyboard =
					response.keyboard && "toJSON" in response.keyboard
						? response.keyboard.toJSON()
						: response.keyboard;

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
