const presence = new Presence({
		clientId: "719127768868061246",
	}),
	browsingTimestamp = Math.floor(Date.now() / 1000),
	staticPages: Record<string, PresenceData> = {
		"/": { details: "Viewing homepage" },
		"/home": { details: "Viewing homepage" },
		"/achievements": { details: "Viewing achievements" },
		"/appeals": { details: "Viewing Appeals" },
		"/anime": { details: "Viewing Anime" },
		"/bank": { details: "Viewing the Bank" },
		"/bump": { details: "Bumping" },
		"/card-abilities": { details: "Viewing Card Abilities" },
		"/cardmakers/leaderboard": { details: "Viewing CardMaker Leaderboards" },
		"/copyright": { details: "Viewing Copyright Policy" },
		"/creators": { details: "Viewing Creators" },
		"/dashboard": { details: "Viewing the Dashboard" },
		"/events": { details: "Viewing Events" },
		"/friends": { details: "Viewing Friends" },
		"/fusion": { details: "Fusing Cards" },
		"/giveaway": { details: "Viewing Giveaways" },
		"/inventory": { details: "Viewing Inventory" },
		"/keysgiveaways": { details: "Viewing Key Giveaways" },
		"/leaderboards": { details: "Viewing Leaderboards" },
		"/market": { details: "Viewing the Market" },
		"/medals": { details: "Viewing Medals" },
		"/messages": { details: "Viewing Private Messages" },
		"/mini-games": { details: "Viewing Mini-Games" },
		"/notifications": { details: "Viewing Notifications" },
		"/premium": { details: "Viewing Premium" },
		"/privacy-policy": { details: "Viewing Privacy Policy" },
		"/rules": { details: "Reading the Rules" },
		"/settings": { details: "Managing Settings" },
		"/shop": { details: "Viewing the Shop" },
		"/stacks": { details: "Viewing Stacks" },
		"/staff": { details: "Viewing Staff Pages" },
		"/staff-list": { details: "Viewing Staff List" },
		"/submit": { details: "Submitting a Card" },
		"/tasks": { details: "Viewing Statistics & Tasks" },
		"/this-or-that": { details: "Playing This or That" },
		"/trades": { details: "Viewing Trades" },
		"/updates": { details: "Viewing Updates" },
	};

presence.on("UpdateData", async () => {
	let presenceData: PresenceData = {
		largeImageKey: "https://i.imgur.com/aI1Qn8s.png",
		startTimestamp: browsingTimestamp,
	};
	const { pathname, href } = window.location,
		pathSplit = pathname.split("/").slice(1),
		pageTitle = document.querySelector(
			"[itemprop='breadcrumb'] > li:last-child"
		)?.textContent,
		profileImage = document.querySelector<HTMLImageElement>(".header-avatar");

	if (profileImage) {
		presenceData.smallImageKey = profileImage.src;
		presenceData.smallImageText = `Wallet: ${
			document.querySelector<HTMLSpanElement>(".header-wallet").textContent
		} | Bank: ${
			document.querySelector<HTMLSpanElement>(".header-bank:not(.orange)")
				.textContent
		} | Sōru: ${document
			.querySelector<HTMLSpanElement>(".header-bank.orange")
			.textContent.substring(1)}`;
	}

	for (const [path, data] of Object.entries(staticPages))
		if (pathname.startsWith(path)) presenceData = { ...presenceData, ...data };

	switch (pathSplit[0] ?? "") {
		case "articles":
			if (pathSplit[1]) {
				presenceData.details = "Reading an Article";
				presenceData.state = pageTitle;
				presenceData.largeImageKey =
					document.querySelector<HTMLImageElement>(".articleimg-img").src;
				presenceData.buttons = [{ label: "Read Article", url: href }];
			} else presenceData.details = "Viewing Articles";
			break;
		case "auction":
			if (pathSplit[1]) {
				presenceData.details = "Viewing an Auction";
				presenceData.state = pageTitle;
				presenceData.buttons = [{ label: "View Auction", url: href }];
			} else presenceData.details = "Viewing the Auction HQ";
			break;
		case "cards":
			if (pathSplit[1] === "info") {
				presenceData.details = "Viewing a Card";
				presenceData.state = pageTitle;
				presenceData.buttons = [{ label: "View Card", url: href }];
			} else presenceData.details = "Viewing the Cards";
			break;
		case "card-events":
			presenceData.details = "Viewing Card Events";
			if (pathSplit[1]) {
				if (pathSplit[2]) {
					presenceData.details = "Viewing an Event Card";
					presenceData.state = pageTitle;
					presenceData.buttons = [{ label: "View Card", url: href }];
				} else {
					presenceData.state = `${
						document.querySelector(
							"[itemprop='breadcrumb'] [href*='/card-events/']"
						).textContent
					} Cards`;
				}
			}
			break;
		case "servers":
			if (pathSplit[1]) {
				presenceData.details = "Viewing a Server";
				presenceData.state = pageTitle;
				presenceData.buttons = [{ label: "View Server", url: href }];
			} else presenceData.details = "Viewing Servers";
			break;
		case "support":
			switch (pathSplit[1]) {
				case "category": {
					presenceData.details = "Browsing a Support Category";
					presenceData.state = pageTitle;
					break;
				}
				case "thread": {
					presenceData.details = "Viewing a Support Thread";
					presenceData.state = pageTitle;
					presenceData.buttons = [{ label: "View Thread", url: href }];
					break;
				}
				default: {
					presenceData.details = "Browsing Support";
				}
			}
			break;
		case "user":
			presenceData.details = "Viewing a profile";
			presenceData.state = pageTitle;
			presenceData.smallImageKey = document.querySelector<HTMLImageElement>(
				".profile-avatar-pic img"
			).src;
			presenceData.buttons = [{ label: "View Profile", url: href }];
			break;
	}

	if (presenceData.details) presence.setActivity(presenceData);
	else presence.setActivity();
});
