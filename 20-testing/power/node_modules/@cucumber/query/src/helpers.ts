import { TestStepResult, TestStepResultStatus } from '@cucumber/messages'

interface WithId {
    id: string | number
}

export function comparatorById(a: WithId, b: WithId) {
    return comparatorBy(a, b, "id")
}

export function comparatorBy(a: any, b: any, key: string) {
    if ( a[key] < b[key] ){
        return -1;
    }
    if ( a[key] > b[key] ){
        return 1;
    }
    return 0;
}

export function comparatorByStatus(a: TestStepResult, b: TestStepResult) {
    if (ordinal(a.status) < ordinal(b.status)) {
        return -1;
    }
    if (ordinal(a.status) > ordinal(b.status) ){
        return 1;
    }
    return 0;
}

function ordinal(status: TestStepResultStatus) {
    return [
        TestStepResultStatus.UNKNOWN,
        TestStepResultStatus.PASSED,
        TestStepResultStatus.SKIPPED,
        TestStepResultStatus.PENDING,
        TestStepResultStatus.UNDEFINED,
        TestStepResultStatus.AMBIGUOUS,
        TestStepResultStatus.FAILED,
    ].indexOf(status)
}

export const assert = {
    ok(target: unknown, message: string) {
        if (!target) {
            throw new Error(message)
        }
    }
}