const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

export const formatDate = (iso: string) => dateFormatter.format(new Date(iso));

export const formatRepo = (url: string) =>
  url.replace(/^https:\/\/(www\.)?github\.com\//i, "");

export const formatLiveUrl = (url: string) => url.replace(/^https?:\/\//i, "");

export const EXTERNAL_LINK_CLASS =
  "inline-flex min-w-0 items-center gap-1.5 text-muted-foreground underline-offset-4 hover:text-foreground hover:underline";
