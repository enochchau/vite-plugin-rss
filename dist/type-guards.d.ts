import { Image, JsXmlElement, SkipDays, SkipHours, TextInput } from "./types";
export declare function isJsXmlElement(value: unknown): value is JsXmlElement;
export declare function isImage(value: unknown): value is Image;
export declare function isTextInput(value: unknown): value is TextInput;
export declare function isSkipHours(value: unknown): value is SkipHours;
export declare function isSkipDays(value: unknown): value is SkipDays;
