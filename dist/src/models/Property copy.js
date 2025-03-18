"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const propertySchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
        index: true
    },
    buildingStatus: {
        type: String,
        enum: ['existing', 'completed'],
        required: true
    },
    buildings: {
        type: Number,
        default: 0
    },
    units: {
        type: Number,
        default: 0
    },
    gba: {
        type: String,
        required: true
    },
    floors: {
        type: Number,
        default: 0
    },
    occupancy: {
        type: Number,
        default: 0,
        max: 100
    },
    showOnLoopNet: {
        type: Boolean,
        default: false
    },
    yearBuilt: {
        type: Number,
        default: 0,
    },
    yearRenovated: {
        type: Number,
        default: 0,
    },
    metering: {
        type: String,
        enum: ['individual', 'master'],
        default: "individual"
    },
    construction: {
        type: String
    },
    elevators: {
        type: Number
    },
    elevatorWalkUp: {
        type: Boolean,
        default: false
    },
    parking: {
        type: String
    },
    landArea: {
        type: Number,
        default: 0
    },
    landAreaUnit: {
        type: String,
    },
    zoning: {
        type: String
    },
    zoningDescription: {
        type: String,
        default: ""
    },
    images: [{
            type: String,
        }],
    isDeleted: {
        type: Boolean,
        default: false
    },
}, {
    versionKey: false,
    timestamps: true,
    toJSON: {
        transform: function (doc, ret) {
            delete ret.__v;
            return ret;
        },
    },
});
const Property = mongoose_1.default.model("Property", propertySchema);
exports.default = Property;
//# sourceMappingURL=Property%20copy.js.map