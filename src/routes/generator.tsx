import React, {useEffect, useState} from "react";
import Navbar from "../components/navbar.tsx";
import type {
    RulesFieldConfig,
    RulesFieldGroup,
    RulesFormValues,
    RulesGeneratorConfig
} from "../types/rulesGenerator.ts";
import {
    buildGeneratedRules,
    getInitialValues,
    getMissingRequiredFields,
    getOperatorFields,
    mergeValuesWithDefaults
} from "../utils/rulesGenerator.ts";

function InputField(props: {
    field: RulesFieldConfig;
    value: string;
    onChange: (fieldId: string, value: string) => void;
}) {
    const {field, value, onChange} = props;
    const baseClasses = "w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20";

    if (field.type === "textarea") {
        return (
            <textarea
                value={value}
                placeholder={field.placeholder}
                onChange={(event) => onChange(field.id, event.target.value)}
                rows={4}
                className={`${baseClasses} resize-y min-h-28`}
            />
        );
    }

    return (
        <input
            type={field.type}
            value={value}
            placeholder={field.placeholder}
            onChange={(event) => onChange(field.id, event.target.value)}
            className={baseClasses}
        />
    );
}

function FieldCard(props: {
    title: string;
    fields: RulesFieldConfig[];
    values: RulesFormValues;
    onChange: (fieldId: string, value: string) => void;
}) {
    const {title, fields, values, onChange} = props;

    if (fields.length === 0) {
        return null;
    }

    return (
        <section className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                    <h2 className="text-base font-semibold text-slate-900">{title}</h2>
                    <p className="mt-1 text-sm text-slate-500">Zmiany od razu aktualizuja tekst po prawej stronie.</p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                {fields.map((field) => (
                    <label key={field.id} className={field.type === "textarea" ? "md:col-span-2" : ""}>
                        <span className="mb-2 block text-sm font-medium text-slate-700">
                            {field.label}
                            {field.required && <span className="ml-1 text-amber-600">*</span>}
                        </span>
                        <InputField
                            field={field}
                            value={values[field.id] ?? ""}
                            onChange={onChange}
                        />
                    </label>
                ))}
            </div>
        </section>
    );
}

const groupOrder: RulesFieldGroup[] = [
    "administrator",
    "contact",
    "service",
    "operator",
    "privacy",
];

function withOperatorDefaults(config: RulesGeneratorConfig, operatorId: string, currentValues?: RulesFormValues) {
    const operator = config.operators.find((item) => item.id === operatorId);

    if (!operator) {
        return {};
    }

    const nextValues = currentValues
        ? mergeValuesWithDefaults(currentValues, getOperatorFields(config, operator))
        : getInitialValues(getOperatorFields(config, operator));

    if (operator.id !== "custom" && !nextValues.operator_name?.trim()) {
        nextValues.operator_name = operator.label;
    }

    return nextValues;
}

const GeneratorRoute: React.FC = () => {
    const [config, setConfig] = useState<RulesGeneratorConfig | null>(null);
    const [selectedOperatorId, setSelectedOperatorId] = useState("");
    const [values, setValues] = useState<RulesFormValues>({});
    const [copied, setCopied] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [includePrivacy, setIncludePrivacy] = useState(true);

    useEffect(() => {
        const controller = new AbortController();

        fetch("/data/rules-generator.json", {signal: controller.signal})
            .then(async (response) => {
                if (!response.ok) {
                    throw new Error("Nie udalo sie zaladowac konfiguracji generatora.");
                }

                const nextConfig = await response.json() as RulesGeneratorConfig;
                setConfig(nextConfig);

                const defaultOperator = nextConfig.operators[0];
                if (!defaultOperator) {
                    throw new Error("Konfiguracja generatora nie zawiera operatorow.");
                }

                setSelectedOperatorId(defaultOperator.id);
                setValues(withOperatorDefaults(nextConfig, defaultOperator.id));
                setLoading(false);
            })
            .catch((caughtError: unknown) => {
                if (controller.signal.aborted) {
                    return;
                }

                setError(caughtError instanceof Error ? caughtError.message : "Wystapil nieznany blad.");
                setLoading(false);
            });

        return () => controller.abort();
    }, []);

    const selectedOperator = config?.operators.find((operator) => operator.id === selectedOperatorId) ?? null;
    const operatorFields = config && selectedOperator ? getOperatorFields(config, selectedOperator) : [];
    const editableFields = operatorFields.filter((field) => field.group !== "operator");
    const resolvedValues = selectedOperator
        ? {
            ...values,
            ...(selectedOperator.staticValues ?? {}),
        }
        : values;
    const generatedText = config && selectedOperator
        ? buildGeneratedRules(config, selectedOperator, resolvedValues, {includePrivacy})
        : "";
    const missingFields = selectedOperator ? getMissingRequiredFields(editableFields, values) : [];

    const handleOperatorChange = (nextOperatorId: string) => {
        if (!config) {
            return;
        }

        const nextOperator = config.operators.find((operator) => operator.id === nextOperatorId);

        if (!nextOperator) {
            return;
        }

        setSelectedOperatorId(nextOperator.id);
        setValues((currentValues) => withOperatorDefaults(config, nextOperator.id, currentValues));
        setCopied(false);
    };

    const handleValueChange = (fieldId: string, nextValue: string) => {
        setValues((currentValues) => ({
            ...currentValues,
            [fieldId]: nextValue,
        }));
        setCopied(false);
    };

    const handleReset = () => {
        if (!config || !selectedOperator) {
            return;
        }

        setValues(withOperatorDefaults(config, selectedOperator.id));
        setCopied(false);
    };

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(generatedText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
        }
    };

    const groupedFields = groupOrder.map((group) => ({
        group,
        title: config?.groupLabels[group] ?? group,
        fields: editableFields.filter((field) => field.group === group),
    }));

    return (
        <>
            <Navbar />
            <div className="min-h-screen bg-slate-50 text-slate-900">
                <main className="mx-auto max-w-7xl px-4 py-4 md:px-8 md:py-8">
                    {loading && (
                        <div className="rounded-xl border border-slate-200 bg-white p-8 text-sm text-slate-500">
                            Ladowanie generatora...
                        </div>
                    )}

                    {error && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-sm text-red-700">
                            {error}
                        </div>
                    )}

                    {!loading && !error && config && selectedOperator && (
                        <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_420px]">
                            <div className="space-y-6">
                                <section className="rounded-xl border border-slate-200 bg-white p-6">
                                    <div className="mb-6">
                                        <h1 className="text-2xl font-bold text-slate-900">Generator regulaminow</h1>
                                        <p className="mt-1 text-sm text-slate-500">
                                            Wybierz operatora, uzupelnij dane i skopiuj gotowy tekst regulaminu oraz polityki prywatnosci.
                                        </p>
                                    </div>

                                    <div className="grid gap-6 lg:grid-cols-1 lg:items-end">
                                        <label>
                                            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-slate-500">Operator platnosci</span>
                                            <select
                                                value={selectedOperatorId}
                                                onChange={(event) => handleOperatorChange(event.target.value)}
                                                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20"
                                            >
                                                {config.operators.map((operator) => (
                                                    <option key={operator.id} value={operator.id}>
                                                        {operator.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </label>
                                    </div>

                                    {selectedOperator.infoMessage && (
                                        <div className="mt-4 rounded-lg border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
                                            {selectedOperator.infoMessage}
                                        </div>
                                    )}

                                    <label className="mt-4 flex items-start gap-3 rounded-lg border border-slate-200 bg-slate-50 px-4 py-3">
                                        <input
                                            type="checkbox"
                                            checked={includePrivacy}
                                            onChange={() => setIncludePrivacy((currentValue) => !currentValue)}
                                            className="mt-0.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
                                        />
                                        <span className="text-sm text-slate-600">
                                            Dolacz polityke prywatnosci do wyniku
                                        </span>
                                    </label>

                                    <p className="mt-4 text-sm leading-6 text-slate-600">
                                        {selectedOperator.description} Dane operatora sa podstawiane automatycznie po wyborze z listy.
                                    </p>
                                </section>

                                {groupedFields.map((group) => (
                                    <FieldCard
                                        key={group.group}
                                        title={group.title}
                                        fields={group.fields}
                                        values={values}
                                        onChange={handleValueChange}
                                    />
                                ))}
                            </div>

                            <aside className="xl:sticky xl:top-8 xl:self-start">
                                <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
                                    <div className="border-b border-slate-200 p-5">
                                        <div className="flex flex-wrap items-start justify-between gap-4">
                                            <div>
                                                <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Podglad tekstu</p>
                                                <h2 className="mt-1 text-lg font-semibold text-slate-900">{selectedOperator.label}</h2>
                                            </div>

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={handleReset}
                                                    className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                                                >
                                                    Wyczysc
                                                </button>
                                                <button
                                                    onClick={handleCopy}
                                                    className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-indigo-700"
                                                >
                                                    {copied ? "Skopiowano" : "Kopiuj"}
                                                </button>
                                            </div>
                                        </div>

                                        <p className="mt-4 text-sm leading-6 text-slate-500">
                                            Generator tworzy zwykly tekst. Przed publikacja sprawdz go pod katem swoich danych i wymagan prawnych.
                                        </p>
                                    </div>

                                    <div className="space-y-6 p-6">
                                        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                                            <p className="mb-3 text-sm font-semibold text-slate-900">Brakujace wymagane pola</p>
                                            {missingFields.length > 0 ? (
                                                <ul className="space-y-2 text-sm text-amber-200">
                                                    {missingFields.map((field) => (
                                                        <li key={field} className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-amber-800">
                                                            {field}
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="text-sm text-emerald-600">Wszystkie wymagane pola sa uzupelnione.</p>
                                            )}
                                        </div>

                                        <textarea
                                            readOnly
                                            value={generatedText}
                                            className="min-h-[760px] w-full rounded-xl border border-slate-200 bg-slate-50 p-4 font-mono text-sm leading-7 text-slate-800 outline-none"
                                        />
                                    </div>
                                </section>
                            </aside>
                        </div>
                    )}
                </main>
            </div>
        </>
    );
};

export default GeneratorRoute;
