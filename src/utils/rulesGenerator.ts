import type {
    RulesFieldConfig,
    RulesFormValues,
    RulesGeneratorConfig,
    RulesOperatorConfig,
} from "../types/rulesGenerator.ts";

const tokenPattern = /\{\{(.*?)\}\}/g;

function normalizeValue(value: string | undefined) {
    return value?.trim() ?? "";
}

function fieldMap(fields: RulesFieldConfig[]) {
    return new Map(fields.map((field) => [field.id, field]));
}

function replaceTokens(line: string, values: RulesFormValues, fields: Map<string, RulesFieldConfig>) {
    return line.replace(tokenPattern, (_, rawToken: string) => {
        const token = rawToken.trim();
        const value = normalizeValue(values[token]);

        if (value) {
            return value;
        }

        const field = fields.get(token);
        return `[uzupelnij: ${field?.label.toLowerCase() ?? token}]`;
    });
}

function buildSection(title: string, blocks: string[], values: RulesFormValues, fields: Map<string, RulesFieldConfig>) {
    const renderedBlocks = blocks.map((block, index) => `${index + 1}. ${replaceTokens(block, values, fields)}`);
    return [title, "", renderedBlocks.join("\n")].join("\n");
}

export function getOperatorFields(config: RulesGeneratorConfig, operator: RulesOperatorConfig) {
    const fieldsById = fieldMap(config.fields);

    return operator.fieldIds
        .map((fieldId) => fieldsById.get(fieldId))
        .filter((field): field is RulesFieldConfig => field !== undefined);
}

export function getInitialValues(fields: RulesFieldConfig[]) {
    return fields.reduce<RulesFormValues>((accumulator, field) => {
        accumulator[field.id] = field.defaultValue ?? "";
        return accumulator;
    }, {});
}

export function mergeValuesWithDefaults(values: RulesFormValues, fields: RulesFieldConfig[]) {
    const defaults = getInitialValues(fields);

    for (const field of fields) {
        if (values[field.id] !== undefined) {
            defaults[field.id] = values[field.id];
        }
    }

    return defaults;
}

export function getMissingRequiredFields(fields: RulesFieldConfig[], values: RulesFormValues) {
    return fields
        .filter((field) => field.required && !normalizeValue(values[field.id]))
        .map((field) => field.label);
}

export function buildGeneratedRules(
    config: RulesGeneratorConfig,
    operator: RulesOperatorConfig,
    values: RulesFormValues,
    options?: {
        includePrivacy?: boolean;
    },
) {
    const fields = fieldMap(config.fields);
    const includePrivacy = options?.includePrivacy ?? true;

    if (!includePrivacy) {
        return buildSection(operator.titles.terms, operator.blocks.terms, values, fields);
    }

    return [
        buildSection(operator.titles.terms, operator.blocks.terms, values, fields),
        "",
        buildSection(operator.titles.privacy, operator.blocks.privacy, values, fields),
    ].join("\n");
}
