export type RulesFieldType = "text" | "email" | "textarea" | "url" | "number";

export type RulesFieldGroup =
    | "administrator"
    | "contact"
    | "service"
    | "operator"
    | "privacy";

export interface RulesFieldConfig {
    id: string;
    label: string;
    type: RulesFieldType;
    group: RulesFieldGroup;
    required: boolean;
    placeholder: string;
    defaultValue: string;
}

export interface RulesTemplateTitles {
    terms: string;
    privacy: string;
}

export interface RulesTemplateBlocks {
    terms: string[];
    privacy: string[];
}

export interface RulesOperatorConfig {
    id: string;
    label: string;
    description: string;
    templateVariant: string;
    titles: RulesTemplateTitles;
    fieldIds: string[];
    staticValues?: Record<string, string>;
    infoMessage?: string;
    blocks: RulesTemplateBlocks;
}

export interface RulesGeneratorConfig {
    groupLabels: Record<RulesFieldGroup, string>;
    fields: RulesFieldConfig[];
    operators: RulesOperatorConfig[];
}

export type RulesFormValues = Record<string, string>;
