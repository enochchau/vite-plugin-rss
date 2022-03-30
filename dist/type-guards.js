"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isSkipDays = exports.isSkipHours = exports.isTextInput = exports.isImage = exports.isJsXmlElement = void 0;
function isJsXmlElement(value) {
    return (typeof value === "object" &&
        value !== null &&
        "_attribute" in value &&
        "_text" in value);
}
exports.isJsXmlElement = isJsXmlElement;
function isImage(value) {
    return (typeof value === "object" &&
        value !== null &&
        "url" in value &&
        "title" in value &&
        "link" in value);
}
exports.isImage = isImage;
function isTextInput(value) {
    return (typeof value === "object" &&
        value !== null &&
        "title" in value &&
        "description" in value &&
        "name" in value &&
        "name" in value &&
        "link" in value);
}
exports.isTextInput = isTextInput;
function isSkipHours(value) {
    return (typeof value === "object" &&
        value !== null &&
        "hour" in value &&
        Array.isArray(value["hour"]));
}
exports.isSkipHours = isSkipHours;
function isSkipDays(value) {
    return (typeof value === "object" &&
        value !== null &&
        "day" in value &&
        Array.isArray(value["day"]));
}
exports.isSkipDays = isSkipDays;
