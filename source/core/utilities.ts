export function deep_equals<T>(a: T, b: T): boolean {
    return JSON.stringify(a) === JSON.stringify(b);
}

export function deep_copy<T>(value: T): T {
    return JSON.parse(JSON.stringify(value));
}

export function sleep(duration_ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, duration_ms));
}

export function has_property<X extends unknown, Y extends PropertyKey>(
    obj: X,
    property: Y
): obj is X & Record<Y, unknown> {
    return Object.prototype.hasOwnProperty.call(obj, property);
}
