"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FirebaseConfigModule = void 0;
const common_1 = require("@nestjs/common");
const firebase_admin_1 = __importDefault(require("firebase-admin"));
const lernasound_firebase_adminsdk_gvj8o_edb0518c5a_json_1 = __importDefault(require("./lernasound-firebase-adminsdk-gvj8o-edb0518c5a.json"));
let FirebaseConfigModule = class FirebaseConfigModule {
};
exports.FirebaseConfigModule = FirebaseConfigModule;
exports.FirebaseConfigModule = FirebaseConfigModule = __decorate([
    (0, common_1.Global)(),
    (0, common_1.Module)({
        providers: [
            {
                provide: 'FIREBASE_ADMIN',
                useFactory: () => {
                    return firebase_admin_1.default.initializeApp({
                        credential: firebase_admin_1.default.credential.cert(lernasound_firebase_adminsdk_gvj8o_edb0518c5a_json_1.default),
                    });
                },
            },
        ],
        exports: ['FIREBASE_ADMIN'],
    })
], FirebaseConfigModule);
