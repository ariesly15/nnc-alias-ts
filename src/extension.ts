// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import jump from './jump';

export function activate(context: vscode.ExtensionContext) {
    jump(context);
}

export function deactivate() {}
