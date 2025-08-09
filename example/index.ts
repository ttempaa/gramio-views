import { initViewsBuilder } from "@gramio/views";
import { Bot, InlineKeyboard, MediaInput, MediaUpload } from "gramio";

const defineView = initViewsBuilder();

const onlyMessageView = defineView().render(function () {
	return this.response
		.text(`Only message. Current timestamp: ${Date.now()}`)
		.keyboard(
			new InlineKeyboard()
				.columns(1)
				.text("Message with text only ›", "TEXT")
				.text("Message with single media ›", "MEDIA")
				.text("Message with media group ›", "MEDIA_GROUP"),
		);
});

const singleMediaView = defineView().render(async function () {
	return this.response
		.text("Message with single media.")
		.keyboard(
			new InlineKeyboard()
				.columns(1)
				.text("Message with text only ›", "TEXT")
				.text("Message with single media ›", "MEDIA")
				.text("Message with media group ›", "MEDIA_GROUP"),
		)
		.media(
			MediaInput.photo(await MediaUpload.url("https://picsum.photos/500")),
		);
});

const mediaGroupView = defineView().render(async function () {
	return this.response
		.text("Message with media group. Buttons is not allowed.")
		.media([
			MediaInput.photo(await MediaUpload.url("https://picsum.photos/500")),
			MediaInput.photo(await MediaUpload.url("https://picsum.photos/500")),
			MediaInput.photo(await MediaUpload.url("https://picsum.photos/500")),
		]);
});

const bot = new Bot(process.env.BOT_TOKEN!)
	.derive(["message", "callback_query"], (context) => ({
		render: defineView.buildRender(context, {}),
	}))
	.command("text", async (context) => {
		return context.render(onlyMessageView);
	})
	.command("media", async (context) => {
		return context.render(singleMediaView);
	})
	.command("media_group", async (context) => {
		return context.render(mediaGroupView);
	})
	.on("callback_query", async (context) => {
		if (context.queryPayload === "TEXT") {
			return context.render(onlyMessageView);
		}
		if (context.queryPayload === "MEDIA") {
			return context.render(singleMediaView);
		}
		if (context.queryPayload === "MEDIA_GROUP") {
			return context.render(mediaGroupView);
		}
	});

bot.start();
