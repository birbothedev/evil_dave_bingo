
// all my homies hate regex

export function addSpaceToCamelCase(name) {
    return name
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, str => str.toUpperCase());
}