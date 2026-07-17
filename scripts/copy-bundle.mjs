import { copyFileSync } from "node:fs";
import { join } from "node:path";

const bundleName = "ha-attention-center-card.js";
const mapName = `${bundleName}.map`;

copyFileSync(join("dist", bundleName), bundleName);
copyFileSync(join("dist", mapName), mapName);
