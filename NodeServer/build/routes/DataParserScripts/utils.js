"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toDataPost = exports.getBaseFromFile = exports.parseData = void 0;
const fs_1 = __importDefault(require("fs"));
const lodash_1 = require("lodash");
const parseData = (data) => JSON.parse(JSON.stringify(data));
exports.parseData = parseData;
const getBaseFromFile = (file) => {
    const bitmap = fs_1.default.readFileSync(file);
    return Buffer.from(bitmap).toString('base64');
};
exports.getBaseFromFile = getBaseFromFile;
const toDataPost = (rawPost) => (Object.assign(Object.assign({}, (0, lodash_1.omit)(rawPost, ['lat', 'lng'])), { photoes: [], position: {
        lat: rawPost.lat,
        lng: rawPost.lng
    }, rating: {
        likes: 0,
        dislikes: 0,
        isLikedByMe: false,
        isDislikedByMe: false
    } }));
exports.toDataPost = toDataPost;
//# sourceMappingURL=utils.js.map