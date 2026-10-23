const dateFormatter = new Intl.DateTimeFormat("en-US", { dateStyle: "medium" });

export const formatDate = (iso: string) => dateFormatter.format(new Date(iso));
