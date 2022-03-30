import { Image, JsXmlElement, SkipDays, SkipHours, TextInput } from "./types";

export function isJsXmlElement(value: unknown): value is JsXmlElement {
  return (
    typeof value === "object" &&
    value !== null &&
    "_attribute" in value &&
    "_text" in value
  );
}

export function isImage(value: unknown): value is Image {
  return (
    typeof value === "object" &&
    value !== null &&
    "url" in value &&
    "title" in value &&
    "link" in value
  );
}

export function isTextInput(value: unknown): value is TextInput {
  return (
    typeof value === "object" &&
    value !== null &&
    "title" in value &&
    "description" in value &&
    "name" in value &&
    "name" in value &&
    "link" in value
  );
}

export function isSkipHours(value: unknown): value is SkipHours {
  return (
    typeof value === "object" &&
    value !== null &&
    "hour" in value &&
    Array.isArray((value as SkipHours)["hour"])
  );
}

export function isSkipDays(value: unknown): value is SkipDays {
  return (
    typeof value === "object" &&
    value !== null &&
    "day" in value &&
    Array.isArray((value as SkipDays)["day"])
  );
}
