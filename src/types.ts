export interface OptionsBase {
  channel: Channel;
  fileName?: string;
  mode: "meta" | "define";
}

export interface OptionsMeta extends OptionsBase {
  mode: "meta";
}

export interface OptionsDefine extends OptionsBase {
  mode: "define";
  items: Item[];
}

export interface JsXmlElement {
  _attribute?: unknown;
  _text?: string | number;
}

export type DaysOfTheWeek =
  | "Monday"
  | "Tuesday"
  | "Wednesday"
  | "Thursday"
  | "Friday"
  | "Saturday"
  | "Sunday";

export type HoursInADay =
  | 0
  | 1
  | 2
  | 3
  | 4
  | 5
  | 6
  | 7
  | 8
  | 9
  | 10
  | 11
  | 12
  | 13
  | 14
  | 15
  | 16
  | 17
  | 18
  | 19
  | 20
  | 21
  | 22
  | 23;

export interface Cloud extends JsXmlElement {
  _attributes: {
    [key: string]: string;
  };
}

export interface Image {
  url: string;
  title: string;
  link: string;
  width?: number;
  height?: number;
  description?: string;
}

export interface TextInput {
  title: string;
  description: string;
  name: string;
  link: string;
}

export interface SkipHours {
  hour: HoursInADay[];
}

export interface SkipDays {
  day: DaysOfTheWeek[];
}

// https://validator.w3.org/feed/docs/rss2.html
export interface Channel {
  title: string;
  link: string;
  description?: string;
  language?: string;
  copyright?: string;
  managingEditor?: string;
  webMaster?: string;
  pubDate?: Date;
  lastBuildDate?: Date;
  category?: string;
  // "vite-plugin-rss"
  generator?: boolean;
  // "https://www.rssboard.org/rss-specification"
  docs?: boolean;
  cloud?: Cloud;
  ttl?: number;
  image?: Image;
  rating?: string;
  textInput?: TextInput;
  skipHours?: SkipHours;
  skipDays?: SkipDays;
}

export interface Comments extends JsXmlElement {
  _attributes: {
    domain?: string;
  };
  _text: string;
}

export interface Enclosure extends JsXmlElement {
  _attributes: {
    url: string;
    length: number;
    type: string;
  };
}

export interface Source extends JsXmlElement {
  _attributes: {
    url: string;
  };
  _text: string;
}

export interface Item {
  title: string;
  link: string;
  description?: string;
  author?: string;
  category?: string;
  comments?: Comments;
  enclosure?: Enclosure;
  guid?: string;
  pubDate?: Date;
  source?: Source;
}
