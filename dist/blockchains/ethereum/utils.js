"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
function timestampToBlockNumber(_this, timestamp) {
    return __awaiter(this, void 0, void 0, function () {
        var lo, hi, block;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, getBlock(_this.web3, 1)];
                case 1:
                    lo = _a.sent();
                    return [4 /*yield*/, getBlock(_this.web3, "latest")];
                case 2:
                    hi = _a.sent();
                    return [4 /*yield*/, searchBlock(_this.web3, lo, hi, timestamp)];
                case 3:
                    block = _a.sent();
                    return [2 /*return*/, block.number];
            }
        });
    });
}
exports.timestampToBlockNumber = timestampToBlockNumber;
function searchBlock(web3, lo, hi, timestamp) {
    return __awaiter(this, void 0, void 0, function () {
        var midNumber, mid;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!true) return [3 /*break*/, 6];
                    midNumber = Math.round((timestamp - lo.timestamp) / (hi.timestamp - lo.timestamp) * (hi.number - lo.number) + lo.number);
                    if (!(midNumber == lo.number)) return [3 /*break*/, 2];
                    return [4 /*yield*/, searchBetterBlock(web3, lo, timestamp, +1)];
                case 1: return [2 /*return*/, _a.sent()];
                case 2:
                    if (!(midNumber == hi.number)) return [3 /*break*/, 4];
                    return [4 /*yield*/, searchBetterBlock(web3, hi, timestamp, -1)];
                case 3: return [2 /*return*/, _a.sent()];
                case 4: return [4 /*yield*/, getBlock(web3, midNumber)];
                case 5:
                    mid = _a.sent();
                    if (mid.timestamp < timestamp)
                        lo = mid;
                    else if (mid.timestamp > timestamp)
                        hi = mid;
                    else
                        return [2 /*return*/, mid];
                    return [3 /*break*/, 0];
                case 6: return [2 /*return*/];
            }
        });
    });
}
function searchBetterBlock(web3, block, timestamp, sign) {
    return __awaiter(this, void 0, void 0, function () {
        var nextBlock;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(block.timestamp * sign < timestamp * sign)) return [3 /*break*/, 2];
                    return [4 /*yield*/, getBlock(web3, block.number + sign)];
                case 1:
                    nextBlock = _a.sent();
                    if (nextBlock.timestamp * sign >= timestamp * sign)
                        return [2 /*return*/, (nextBlock.timestamp - timestamp) * sign < (timestamp - block.timestamp) * sign ? nextBlock : block];
                    block = nextBlock;
                    return [3 /*break*/, 0];
                case 2: return [2 /*return*/, block];
            }
        });
    });
}
function getBlock(web3, number) {
    return __awaiter(this, void 0, void 0, function () {
        var block;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (blocks[number])
                        return [2 /*return*/, blocks[number]];
                    return [4 /*yield*/, web3.eth.getBlock(number)];
                case 1:
                    block = _a.sent();
                    return [2 /*return*/, blocks[block.number] = { number: block.number, timestamp: block.timestamp }];
            }
        });
    });
}
var blocks = {};
