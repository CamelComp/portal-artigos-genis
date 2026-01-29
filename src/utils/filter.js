export function filterBySearch(list, search, fields = []) {
    if(!search || !fields.length) return list;
    const normalizedSearch = normalize(search);
    return list.filter(item =>
        fields.some(field => {
            const value = getValueByPath(item, field);
            return normalize(value).includes(normalizedSearch);
        })
    );
}

function normalize(value) {
    return String(value ?? '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}

function getValueByPath(obj, path) {
    return path.split('.').reduce((acc, key) => acc?.[key], obj);
}