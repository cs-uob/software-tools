import assert from 'node:assert'
import fs from 'node:fs'
import * as path from 'node:path'
import {pipeline, Writable} from 'node:stream'
import util from 'node:util'

import {NdjsonToMessageStream} from '@cucumber/message-streams'
import {Duration, Envelope, TestRunFinished, TestRunStarted, TestStepResultStatus} from '@cucumber/messages'
import {glob} from 'glob'

import Query from './Query'
import {
    namingStrategy,
    NamingStrategyExampleName,
    NamingStrategyFeatureName,
    NamingStrategyLength
} from './Lineage'

const asyncPipeline = util.promisify(pipeline)
const TESTDATA_PATH = path.join(__dirname, '..', '..', 'testdata')

describe('Acceptance Tests', async () => {
    const fixtureFiles = glob.sync(`*.query-results.json`, {
        cwd: TESTDATA_PATH,
        absolute: true
    })

    for (const fixtureFile of fixtureFiles) {
        const [suiteName] = path.basename(fixtureFile).split('.')
        const ndjsonFile = fixtureFile.replace('.query-results.json', '.ndjson')

        it(suiteName, async () => {
            const query = new Query()

            await asyncPipeline(
                fs.createReadStream(ndjsonFile, { encoding: 'utf-8' }),
                new NdjsonToMessageStream(),
                new Writable({
                    objectMode: true,
                    write(envelope: Envelope, _: BufferEncoding, callback) {
                        query.update(envelope)
                        callback()
                    },
                })
            )

            const expectedResults: ResultsFixture = {
                ...defaults,
                ...JSON.parse(fs.readFileSync(fixtureFile, {
                    encoding: 'utf-8',
                }))
            }

            const actualResults: ResultsFixture = JSON.parse(JSON.stringify({
                countMostSevereTestStepResultStatus: query.countMostSevereTestStepResultStatus(),
                countTestCasesStarted: query.countTestCasesStarted(),
                findAllPickles: query.findAllPickles().length,
                findAllPickleSteps: query.findAllPickleSteps().length,
                findAllTestCaseStarted: query.findAllTestCaseStarted().length,
                findAllTestSteps: query.findAllTestSteps().length,
                findAllTestCaseStartedGroupedByFeature: [...query.findAllTestCaseStartedGroupedByFeature().entries()]
                    .map(([feature, testCaseStarteds]) => [feature.name, testCaseStarteds.map(testCaseStarted => testCaseStarted.id)]),
                findAttachmentsBy: query.findAllTestCaseStarted()
                    .map(testCaseStarted => query.findTestStepsFinishedBy(testCaseStarted))
                    .map(testStepFinisheds => testStepFinisheds.map(testStepFinished => query.findAttachmentsBy(testStepFinished)))
                    .flat(2)
                    .map(attachment => ([
                      attachment.testStepId,
                      attachment.testCaseStartedId,
                      attachment.mediaType,
                      attachment.contentEncoding,
                    ])),
                findFeatureBy: query.findAllTestCaseStarted()
                    .map(testCaseStarted => query.findFeatureBy(testCaseStarted))
                    .map(feature => feature?.name),
                findHookBy: query.findAllTestSteps()
                    .map(testStep => query.findHookBy(testStep))
                    .map(hook => hook?.id)
                    .filter(value => !!value),
                findMeta: query.findMeta()?.implementation?.name,
                findMostSevereTestStepResultBy: query.findAllTestCaseStarted()
                    .map(testCaseStarted => query.findMostSevereTestStepResultBy(testCaseStarted))
                    .map(testStepResult => testStepResult?.status),
                findNameOf: {
                    long : query.findAllPickles().map(pickle => query.findNameOf(pickle, namingStrategy(NamingStrategyLength.LONG))),
                    excludeFeatureName : query.findAllPickles().map(pickle => query.findNameOf(pickle, namingStrategy(NamingStrategyLength.LONG, NamingStrategyFeatureName.EXCLUDE))),
                    longPickleName : query.findAllPickles().map(pickle => query.findNameOf(pickle, namingStrategy(NamingStrategyLength.LONG, NamingStrategyFeatureName.INCLUDE, NamingStrategyExampleName.PICKLE))),
                    short : query.findAllPickles().map(pickle => query.findNameOf(pickle, namingStrategy(NamingStrategyLength.SHORT))),
                    shortPickleName : query.findAllPickles().map(pickle => query.findNameOf(pickle, namingStrategy(NamingStrategyLength.SHORT, NamingStrategyFeatureName.INCLUDE, NamingStrategyExampleName.PICKLE)))
                },
                findPickleBy: query.findAllTestCaseStarted()
                    .map(testCaseStarted => query.findPickleBy(testCaseStarted))
                    .map(pickle => pickle?.name),
                findPickleStepBy: query.findAllTestSteps()
                    .map(testStep => query.findPickleStepBy(testStep))
                    .map(pickleStep => pickleStep?.text)
                    .filter(value => !!value),
                findStepBy: query.findAllPickleSteps()
                    .map(pickleStep => query.findStepBy(pickleStep))
                    .map(step => step?.text),
                findTestCaseBy: query.findAllTestCaseStarted()
                    .map(testCaseStarted => query.findTestCaseBy(testCaseStarted))
                    .map(testCase => testCase?.id),
                findTestCaseDurationBy: query.findAllTestCaseStarted()
                    .map(testCaseStarted => query.findTestCaseDurationBy(testCaseStarted)),
                findTestCaseFinishedBy: query.findAllTestCaseStarted()
                    .map(testCaseStarted => query.findTestCaseFinishedBy(testCaseStarted))
                    .map(testCaseFinished => testCaseFinished?.testCaseStartedId),
                findTestRunDuration: query.findTestRunDuration(),
                findTestRunFinished: query.findTestRunFinished(),
                findTestRunStarted: query.findTestRunStarted(),
                findTestStepBy: query.findAllTestCaseStarted()
                    .flatMap(testCaseStarted => query.findTestStepsFinishedBy(testCaseStarted))
                    .map(testStepFinished => query.findTestStepBy(testStepFinished))
                    .map(testStep => testStep?.id),
                findTestStepsFinishedBy: query.findAllTestCaseStarted()
                    .map(testCaseStarted => query.findTestStepsFinishedBy(testCaseStarted))
                    .map(testStepFinisheds => testStepFinisheds.map(testStepFinished => testStepFinished?.testStepId)),
                findTestStepFinishedAndTestStepBy: query.findAllTestCaseStarted()
                    .flatMap(testCaseStarted => query.findTestStepFinishedAndTestStepBy(testCaseStarted))
                    .map(([testStepFinished, testStep]) => ([testStepFinished.testStepId, testStep.id]))
            }))

            assert.deepStrictEqual(actualResults, expectedResults)
        })
    }
})

interface ResultsFixture {
    countMostSevereTestStepResultStatus: Record<TestStepResultStatus, number>,
    countTestCasesStarted: number,
    findAllPickles: number,
    findAllPickleSteps: number,
    findAllTestCaseStarted: number,
    findAllTestSteps: number,
    findAllTestCaseStartedGroupedByFeature: Array<[string, string[]]>,
    findAttachmentsBy: Array<[string, string, string, string]>,
    findFeatureBy: Array<string>,
    findMeta: string,
    findMostSevereTestStepResultBy: Array<TestStepResultStatus>,
    findNameOf: {
        long: Array<string>,
        excludeFeatureName: Array<string>,
        longPickleName: Array<string>,
        short: Array<string>,
        shortPickleName: Array<string>
    },
    findHookBy: Array<string>,
    findPickleBy: Array<string>,
    findPickleStepBy: Array<string>,
    findStepBy: Array<string>,
    findTestCaseBy: Array<string>,
    findTestCaseDurationBy: Array<Duration>,
    findTestCaseFinishedBy: Array<string>,
    findTestRunDuration: Duration,
    findTestRunFinished: TestRunFinished,
    findTestRunStarted: TestRunStarted,
    findTestStepBy: Array<string>,
    findTestStepsFinishedBy: Array<Array<string>>
    findTestStepFinishedAndTestStepBy: Array<[string, string]>
}

const defaults: Partial<ResultsFixture> = {
    findAllTestCaseStartedGroupedByFeature: [],
    findAttachmentsBy: [],
    findFeatureBy: [],
    findMostSevereTestStepResultBy: [],
    findNameOf: {
        long: [],
        excludeFeatureName: [],
        longPickleName: [],
        short: [],
        shortPickleName: []
    },
    findHookBy: [],
    findPickleBy: [],
    findPickleStepBy: [],
    findStepBy: [],
    findTestCaseBy: [],
    findTestCaseDurationBy: [],
    findTestCaseFinishedBy: [],
    findTestStepBy: [],
    findTestStepsFinishedBy: [],
    findTestStepFinishedAndTestStepBy: []
}