import type { APIMethodParams } from "gramio";

export class ResponseView {
	private readonly response = {
		text: undefined as string | undefined,
		keyboard: undefined as
			| APIMethodParams<"sendMessage">["reply_markup"]
			| undefined,
	};

	text(text: string) {
		this.response.text = text;

		return this;
	}

	keyboard(keyboard: APIMethodParams<"sendMessage">["reply_markup"]) {
		this.response.keyboard = keyboard;

		return this;
	}
}
