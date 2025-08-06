import type { BotLike, Context } from "gramio";
import { ResponseView } from "./response.ts";
import { isInlineMarkup, type WithResponseContext } from "./utils.ts";

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
		const { text, keyboard, media } = response;

		if (
			context.is("message") ||
			(context.is("callback_query") && !context.message)
		) {
			if (Array.isArray(media) && media.length > 1) {
				const lastMedia = media.at(-1);
				if (lastMedia && text) {
					lastMedia.caption = text;
				}
				await context.sendMediaGroup(media);
			} else if (media) {
				const signleMedia = Array.isArray(media) ? media[0] : media;
				// @ts-expect-error
				await context.sendMedia({
					type: signleMedia.type,
					[signleMedia.type]: signleMedia.media,
					caption: text,
					reply_markup: keyboard,
				});
			} else if (text) {
				await context.send(text, { reply_markup: keyboard });
			}
			if (context.is("callback_query")) {
				await context.answer();
			}
			return;
		}

		if (context.is("callback_query") && context.message) {
			if (Array.isArray(media)) {
				await context.message.delete();
				await context.sendMediaGroup(media);
				return;
			}

			const hasCurrentMedia = context.message.hasAttachment();
			const hasDesiredMedia = !!media;

			if (hasCurrentMedia && !hasDesiredMedia && text) {
				await context.message.delete();
				await context.send(text, { reply_markup: keyboard });
				return;
			}

			if (hasDesiredMedia) {
				const inlineMarkup = isInlineMarkup(keyboard) ? keyboard : undefined;
				await context.editMedia(
					{
						type: media.type,
						media: media.media,
						caption: text,
					},
					{ reply_markup: inlineMarkup },
				);
				return;
			}

			if (!hasCurrentMedia && text) {
				const inlineMarkup = isInlineMarkup(keyboard) ? keyboard : undefined;
				await context.editText(text, { reply_markup: inlineMarkup });
				return;
			}

			if (keyboard && !text && !media) {
				const inlineMarkup = isInlineMarkup(keyboard) ? keyboard : undefined;
				await context.editReplyMarkup(inlineMarkup);
				return;
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
