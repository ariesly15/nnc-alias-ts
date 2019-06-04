import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { getAlias } from './utils';
import config from './_config';

class aliasProvider implements vscode.DefinitionProvider {
    provideDefinition(document: vscode.TextDocument, position: vscode.Position) {
        const fileName: string = document.fileName;
        const alias = getAlias(fileName);
        const line: string = document.lineAt(position).text;

        const loc = Object.keys(alias).map(key => {
            if (line.indexOf(key) >= 0) {
                const pathReg: RegExp = new RegExp(`${key}/(.+)[\'\"]`, 'g');
                const result = pathReg.exec(line);
                let dist: string = '';
                if (result && result[1]) {
                    dist = path.join(config.projectDir, alias[key], result[1]);
                }
                if (!fs.existsSync(dist)) {
                    if (fs.existsSync(`${dist}/index.js`)) {
                        dist = `${dist}/index.js`;
                    }
                    if (fs.existsSync(`${dist}.js`)) {
                        dist = `${dist}.js`;
                    }
                }
                return new vscode.Location(vscode.Uri.file(dist), new vscode.Range(0, 0, 0, 0));
            }
        });
        return loc && loc[0];
    }
}

export default (content: vscode.ExtensionContext) => {
    console.log('...................... alias jump is run ......................');
    const registorAlias = vscode.languages.registerDefinitionProvider(
        [{ scheme: 'file', pattern: '**/*.{js,jsx,ts,tsx,vue}' }],
        new aliasProvider()
    );
    content.subscriptions.push(registorAlias);
};
