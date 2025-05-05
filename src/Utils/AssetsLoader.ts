import { Assets } from "pixi.js";

export default class AssetsLoader {
    
    public static async loadAssets(bundleName: string, paths: string[]) {
        const bundle: Record<string, string> = {};

        for (const path of paths) {
            // Extract the file name from the path and use it as the key in the bundle object
            const parts: string[] = path.split("/");
            const fileName: string = parts[parts.length - 1];
            const key: string = fileName.split('.')[0];

            bundle[key] = path;
        }

        await Assets.addBundle(bundleName, bundle);
        await Assets.loadBundle(bundleName);
    }
}