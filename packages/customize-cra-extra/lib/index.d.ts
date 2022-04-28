import { OverrideFunc } from 'customize-cra';
import { PluginItem as BabelPlugin, TransformOptions } from 'babel__core';
import {
  Configuration as WebpackConfig,
  RuleSetRule,
  WebpackPluginInstance,
  ResolveOptions,
} from 'webpack';

export * from 'customize-cra';

export function addBabelIncludes(options: TransformOptions['include']): OverrideFunc;
export function removeInternalBabelPlugin(plugin: BabelPlugin): OverrideFunc;

export function addLoader(loader: RuleSetRule): OverrideFunc;
export function addLoaders(loaders: RuleSetRule[]): OverrideFunc;
export function removeLoader(loaderName: string): OverrideFunc;
export function clearLoader(loaderName: string): OverrideFunc;

export function addPlugin(plugin: WebpackPluginInstance): OverrideFunc;
export function addPlugins(plugin: WebpackPluginInstance[]): OverrideFunc;
export function removePlugin(pluginName: string): OverrideFunc;
export function cleanPlugin(pluginName: string): OverrideFunc;

export function addLessLoader(loaderOptions?: any): OverrideFunc;
export function addSassLoader(loaderOptions?: any): OverrideFunc;
export function addCssLoader(): OverrideFunc;
export function addFileLoader(): OverrideFunc;
export function addSourceMapLoader(): OverrideFunc;

export function addMultipleEntries(
  entries: Array<{
    entry: string | undefined;
    name: string | undefined;
    template: string | undefined;
  }>
): OverrideFunc;

export function mergeOutput(output: WebpackConfig['output']): OverrideFunc;
export function mergeOptimization(optimization: WebpackConfig['optimization']): OverrideFunc;
export function mergeWebpackResolveFallback(
  resolveFallback: ResolveOptions['fallback']
): OverrideFunc;
/**
 * @deprecated
 */
export function adjustWorkbox(): OverrideFunc;
/**
 *
 * @deprecated
 */
export function useEslintRc(configFile?: string): OverrideFunc;
/**
 * @deprecated
 */
export function enableEslintTypescript(): OverrideFunc;
/**
 *
 * @deprecated
 */
export function addTslintLoader(x: any): OverrideFunc;
/**
 *
 * @deprecated
 */
export function adjustStyleLoaders(callback: (loader: Required<RuleSetRule>) => void): OverrideFunc;
