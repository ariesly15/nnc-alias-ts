import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import config from '../_config';

export function isDir(filePath: string) {
    return fs.existsSync(filePath) && fs.statSync(filePath).isDirectory();
}

export function getAppJsonPath(filePath: string) {
    return path.join(filePath, 'source', 'app.json');
}

export function existsAppJson(filePath: string) {
    return fs.existsSync(getAppJsonPath(filePath));
}

export function getAlias(fileName: string) {
    const vw = vscode.workspace;
    const vsConfig = vw.getConfiguration('nncAliasPath');
    const rootPath = vw.rootPath;
    if (!rootPath) return {};
    if (vsConfig && vsConfig.isNNC) {
        if (existsAppJson(rootPath)) {
            config.projectDir = rootPath;
        } else {
            // mutil root dir
            config.projectDir = fs
                .readdirSync(rootPath)
                .map((item: string) => path.join(rootPath, item))
                .filter((item: string) => isDir(item) && existsAppJson(item) && fileName.includes(item))[0];
        }
        const appJson = JSON.parse(fs.readFileSync(getAppJsonPath(config.projectDir)).toString() || '{}');
        return (appJson && appJson.alias) || {};
    }
    if (vsConfig && !vsConfig.isNNC) {
        // TODO 自定义配置的别名解析
    }
    return {};
}
