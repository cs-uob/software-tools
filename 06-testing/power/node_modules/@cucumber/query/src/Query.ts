import * as messages from '@cucumber/messages'
import {
  Attachment,
  Duration,
  Feature,
  getWorstTestStepResult,
  GherkinDocument,
  Hook,
  Meta,
  Pickle,
  PickleStep,
  Rule,
  Scenario,
  Step,
  TestCase,
  TestCaseFinished,
  TestCaseStarted,
  TestRunFinished,
  TestRunStarted,
  TestStep,
  TestStepFinished,
  TestStepResult,
  TestStepResultStatus,
  TimeConversion,
} from '@cucumber/messages'
import {ArrayMultimap} from '@teppeis/multimaps'
import {Lineage, NamingStrategy} from "./Lineage";
import { comparatorBy, comparatorById, comparatorByStatus, assert } from './helpers'

export default class Query {
  private readonly testStepResultByPickleId = new ArrayMultimap<string, messages.TestStepResult>()
  private readonly testStepResultsByPickleStepId = new ArrayMultimap<
    string,
    messages.TestStepResult
  >()
  private readonly testCaseByPickleId = new Map<string, messages.TestCase>()
  private readonly pickleIdByTestStepId = new Map<string, string>()
  private readonly pickleStepIdByTestStepId = new Map<string, string>()
  private readonly testStepResultsbyTestStepId = new ArrayMultimap<
    string,
    messages.TestStepResult
  >()
  private readonly testStepIdsByPickleStepId = new ArrayMultimap<string, string>()
  private readonly hooksById = new Map<string, messages.Hook>()
  private readonly attachmentsByTestStepId = new ArrayMultimap<string, messages.Attachment>()
  private readonly stepMatchArgumentsListsByPickleStepId = new Map<
    string,
    readonly messages.StepMatchArgumentsList[]
  >()

  private meta: Meta
  private testRunStarted: TestRunStarted
  private testRunFinished: TestRunFinished
  private readonly testCaseStarted: Array<TestCaseStarted> = []
  private readonly lineageById: Map<string, Lineage> = new Map()
  private readonly stepById: Map<string, Step> = new Map()
  private readonly pickleById: Map<string, Pickle> = new Map()
  private readonly pickleStepById: Map<string, PickleStep> = new Map()
  private readonly testCaseById: Map<string, TestCase> = new Map()
  private readonly testStepById: Map<string, TestStep> = new Map()
  private readonly testCaseFinishedByTestCaseStartedId: Map<string, TestCaseFinished> = new Map()
  private readonly testStepFinishedByTestCaseStartedId: ArrayMultimap<string, TestStepFinished> =
      new ArrayMultimap()
  private readonly attachmentsByTestCaseStartedId: ArrayMultimap<string, Attachment> =
      new ArrayMultimap()

  public update(envelope: messages.Envelope) {
    if (envelope.meta) {
      this.meta = envelope.meta
    }
    if (envelope.gherkinDocument) {
      this.updateGherkinDocument(envelope.gherkinDocument)
    }
    if (envelope.pickle) {
      this.updatePickle(envelope.pickle)
    }
    if (envelope.hook) {
      this.hooksById.set(envelope.hook.id, envelope.hook)
    }
    if (envelope.testRunStarted) {
      this.testRunStarted = envelope.testRunStarted
    }
    if (envelope.testCase) {
      this.updateTestCase(envelope.testCase)
    }
    if (envelope.testCaseStarted) {
      this.updateTestCaseStarted(envelope.testCaseStarted)
    }
    if (envelope.attachment) {
      this.updateAttachment(envelope.attachment)
    }
    if (envelope.testStepFinished) {
      this.updateTestStepFinished(envelope.testStepFinished)
    }
    if (envelope.testCaseFinished) {
      this.updateTestCaseFinished(envelope.testCaseFinished)
    }
    if (envelope.testRunFinished) {
      this.testRunFinished = envelope.testRunFinished
    }
  }

  private updateGherkinDocument(gherkinDocument: GherkinDocument) {
    if (gherkinDocument.feature) {
      this.updateFeature(gherkinDocument.feature, {
        gherkinDocument,
      })
    }
  }

  private updateFeature(feature: Feature, lineage: Lineage) {
    feature.children.forEach((featureChild) => {
      if (featureChild.background) {
        this.updateSteps(featureChild.background.steps)
      }
      if (featureChild.scenario) {
        this.updateScenario(featureChild.scenario, {
          ...lineage,
          feature,
        })
      }
      if (featureChild.rule) {
        this.updateRule(featureChild.rule, {
          ...lineage,
          feature,
        })
      }
    })
  }

  private updateRule(rule: Rule, lineage: Lineage) {
    rule.children.forEach((ruleChild) => {
      if (ruleChild.background) {
        this.updateSteps(ruleChild.background.steps)
      }
      if (ruleChild.scenario) {
        this.updateScenario(ruleChild.scenario, {
          ...lineage,
          rule,
        })
      }
    })
  }

  private updateScenario(scenario: Scenario, lineage: Lineage) {
    this.lineageById.set(scenario.id, {
      ...lineage,
      scenario,
    })
    scenario.examples.forEach((examples, examplesIndex) => {
      this.lineageById.set(examples.id, {
        ...lineage,
        scenario,
        examples,
        examplesIndex,
      })
      examples.tableBody.forEach((example, exampleIndex) => {
        this.lineageById.set(example.id, {
          ...lineage,
          scenario,
          examples,
          examplesIndex,
          example,
          exampleIndex,
        })
      })
    })
    this.updateSteps(scenario.steps)
  }

  private updateSteps(steps: ReadonlyArray<Step>) {
    steps.forEach((step) => this.stepById.set(step.id, step))
  }

  private updatePickle(pickle: Pickle) {
    this.pickleById.set(pickle.id, pickle)
    pickle.steps.forEach((pickleStep) => this.pickleStepById.set(pickleStep.id, pickleStep))
  }

  private updateTestCase(testCase: TestCase) {
    this.testCaseById.set(testCase.id, testCase)

    this.testCaseByPickleId.set(testCase.pickleId, testCase)
    testCase.testSteps.forEach((testStep) => {
      this.testStepById.set(testStep.id, testStep)
      this.pickleIdByTestStepId.set(testStep.id, testCase.pickleId)
      this.pickleStepIdByTestStepId.set(testStep.id, testStep.pickleStepId)
      this.testStepIdsByPickleStepId.put(testStep.pickleStepId, testStep.id)
      this.stepMatchArgumentsListsByPickleStepId.set(
          testStep.pickleStepId,
          testStep.stepMatchArgumentsLists
      )
    })
  }

  private updateTestCaseStarted(testCaseStarted: TestCaseStarted) {
    this.testCaseStarted.push(testCaseStarted)

    /*
    when a test case attempt starts besides the first one, clear all existing results
    and attachments for that test case, so we always report on the latest attempt
    (applies to legacy pickle-oriented query methods only)
     */
    const testCase = this.testCaseById.get(testCaseStarted.testCaseId)
    this.testStepResultByPickleId.delete(testCase.pickleId)
    for (const testStep of testCase.testSteps) {
      this.testStepResultsByPickleStepId.delete(testStep.pickleStepId)
      this.testStepResultsbyTestStepId.delete(testStep.id)
      this.attachmentsByTestStepId.delete(testStep.id)
    }
  }

  private updateAttachment(attachment: Attachment) {
    if (attachment.testStepId) {
      this.attachmentsByTestStepId.put(attachment.testStepId, attachment)
    }
    if (attachment.testCaseStartedId) {
      this.attachmentsByTestCaseStartedId.put(attachment.testCaseStartedId, attachment)
    }
  }

  private updateTestStepFinished(testStepFinished: TestStepFinished) {
    this.testStepFinishedByTestCaseStartedId.put(
        testStepFinished.testCaseStartedId,
        testStepFinished
    )

    const pickleId = this.pickleIdByTestStepId.get(testStepFinished.testStepId)
    this.testStepResultByPickleId.put(pickleId, testStepFinished.testStepResult)
    const testStep = this.testStepById.get(testStepFinished.testStepId)
    this.testStepResultsByPickleStepId.put(
        testStep.pickleStepId,
        testStepFinished.testStepResult
    )
    this.testStepResultsbyTestStepId.put(testStep.id, testStepFinished.testStepResult)
  }

  private updateTestCaseFinished(testCaseFinished: TestCaseFinished) {
    this.testCaseFinishedByTestCaseStartedId.set(
        testCaseFinished.testCaseStartedId,
        testCaseFinished
    )
  }

  /**
   * Gets all the results for multiple pickle steps
   * @param pickleStepIds
   */
  public getPickleStepTestStepResults(
    pickleStepIds: readonly string[]
  ): readonly messages.TestStepResult[] {
    if (pickleStepIds.length === 0) {
      return [
        {
          status: messages.TestStepResultStatus.UNKNOWN,
          duration: messages.TimeConversion.millisecondsToDuration(0),
        },
      ]
    }
    return pickleStepIds.reduce((testStepResults: messages.TestStepResult[], pickleId) => {
      return testStepResults.concat(this.testStepResultsByPickleStepId.get(pickleId))
    }, [])
  }

  /**
   * Gets all the results for multiple pickles
   * @param pickleIds
   */
  public getPickleTestStepResults(
    pickleIds: readonly string[]
  ): readonly messages.TestStepResult[] {
    if (pickleIds.length === 0) {
      return [
        {
          status: messages.TestStepResultStatus.UNKNOWN,
          duration: messages.TimeConversion.millisecondsToDuration(0),
        },
      ]
    }
    return pickleIds.reduce((testStepResults: messages.TestStepResult[], pickleId) => {
      return testStepResults.concat(this.testStepResultByPickleId.get(pickleId))
    }, [])
  }

  /**
   * Gets all the attachments for multiple pickle steps
   * @param pickleStepIds
   */
  public getPickleStepAttachments(
    pickleStepIds: readonly string[]
  ): readonly messages.Attachment[] {
    return this.getTestStepsAttachments(
      pickleStepIds.reduce((testStepIds: string[], pickleStepId: string) => {
        return testStepIds.concat(this.testStepIdsByPickleStepId.get(pickleStepId))
      }, [])
    )
  }

  public getTestStepsAttachments(testStepIds: readonly string[]): readonly messages.Attachment[] {
    return testStepIds.reduce((attachments: messages.Attachment[], testStepId) => {
      return attachments.concat(this.attachmentsByTestStepId.get(testStepId))
    }, [])
  }

  /**
   * Get StepMatchArguments for a pickle step
   * @param pickleStepId
   */
  public getStepMatchArgumentsLists(
    pickleStepId: string
  ): readonly messages.StepMatchArgumentsList[] | undefined {
    return this.stepMatchArgumentsListsByPickleStepId.get(pickleStepId)
  }

  public getHook(hookId: string): messages.Hook {
    return this.hooksById.get(hookId)
  }

  public getBeforeHookSteps(pickleId: string): readonly messages.TestStep[] {
    const hookSteps: messages.TestStep[] = []

    this.identifyHookSteps(
      pickleId,
      (hook) => hookSteps.push(hook),
      () => null
    )
    return hookSteps
  }

  public getAfterHookSteps(pickleId: string): readonly messages.TestStep[] {
    const hookSteps: messages.TestStep[] = []

    this.identifyHookSteps(
      pickleId,
      () => null,
      (hook) => hookSteps.push(hook)
    )
    return hookSteps
  }

  private identifyHookSteps(
    pickleId: string,
    onBeforeHookFound: (hook: messages.TestStep) => void,
    onAfterHookFound: (hook: messages.TestStep) => void
  ): void {
    const testCase = this.testCaseByPickleId.get(pickleId)

    if (!testCase) {
      return
    }

    let pickleStepFound = false

    for (const step of testCase.testSteps) {
      if (step.hookId) {
        pickleStepFound ? onAfterHookFound(step) : onBeforeHookFound(step)
      } else {
        pickleStepFound = true
      }
    }
  }

  public getTestStepResults(testStepId: string): messages.TestStepResult[] {
    return this.testStepResultsbyTestStepId.get(testStepId)
  }

  public getStatusCounts(
    pickleIds: readonly string[]
  ): Partial<Record<messages.TestStepResultStatus, number>> {
    const result: Partial<Record<messages.TestStepResultStatus, number>> = {}
    for (const pickleId of pickleIds) {
      const testStepResult = getWorstTestStepResult(this.getPickleTestStepResults([pickleId]))
      const count = result[testStepResult.status] || 0
      result[testStepResult.status] = count + 1
    }
    return result
  }

  /* new common interface with Java starts here */

  public countMostSevereTestStepResultStatus(): Record<TestStepResultStatus, number> {
    const result: Record<TestStepResultStatus, number> = {
      [TestStepResultStatus.AMBIGUOUS]: 0,
      [TestStepResultStatus.FAILED]: 0,
      [TestStepResultStatus.PASSED]: 0,
      [TestStepResultStatus.PENDING]: 0,
      [TestStepResultStatus.SKIPPED]: 0,
      [TestStepResultStatus.UNDEFINED]: 0,
      [TestStepResultStatus.UNKNOWN]: 0,
    }
    for (const testCaseStarted of this.findAllTestCaseStarted()) {
      const mostSevereResult = this.findTestStepFinishedAndTestStepBy(testCaseStarted)
        .map(([testStepFinished]) => testStepFinished.testStepResult)
        .sort(comparatorByStatus)
        .at(-1)
      if (mostSevereResult) {
        result[mostSevereResult.status]++
      }
    }
    return result
  }

  public countTestCasesStarted(): number {
    return this.findAllTestCaseStarted().length
  }

  public findAllPickles(): ReadonlyArray<Pickle> {
    const pickles = [...this.pickleById.values()]
    return pickles.sort(comparatorById)
  }

  public findAllPickleSteps(): ReadonlyArray<PickleStep> {
    const pickleSteps = [...this.pickleStepById.values()]
    return pickleSteps.sort(comparatorById)
  }

  public findAllTestCaseStarted(): ReadonlyArray<TestCaseStarted> {
    return this.testCaseStarted.filter((testCaseStarted) => {
      const testCaseFinished = this.testCaseFinishedByTestCaseStartedId.get(testCaseStarted.id)
      // only include if not yet finished OR won't be retried
      return !testCaseFinished?.willBeRetried
    })
  }

  public findAllTestCaseStartedGroupedByFeature(): Map<Feature | undefined, ReadonlyArray<TestCaseStarted>> {
    const results = new Map();
    this.findAllTestCaseStarted()
        .map(testCaseStarted => ([this.findLineageBy(testCaseStarted), testCaseStarted] as const))
        .sort(([a], [b]) => comparatorBy(a.gherkinDocument, b.gherkinDocument, "uri"))
        .forEach(([{feature}, testCaseStarted]) => {
          results.set(feature, [...results.get(feature) ?? [], testCaseStarted])
        })
    return results
  }

  public findAllTestSteps(): ReadonlyArray<TestStep> {
    const testSteps = [...this.testStepById.values()]
    return testSteps.sort(comparatorById)
  }

  public findAttachmentsBy(testStepFinished: TestStepFinished): ReadonlyArray<Attachment> {
    return this.attachmentsByTestCaseStartedId.get(testStepFinished.testCaseStartedId)
        .filter(attachment => attachment.testStepId === testStepFinished.testStepId)
  }

  public findFeatureBy(testCaseStarted: TestCaseStarted): Feature | undefined {
    return this.findLineageBy(testCaseStarted)?.feature
  }

  public findHookBy(testStep: TestStep): Hook | undefined {
    if (!testStep.hookId){
      return undefined
    }
    return this.hooksById.get(testStep.hookId)
  }

  public findMeta(): Meta | undefined {
    return this.meta;
  }

  public findMostSevereTestStepResultBy(testCaseStarted: TestCaseStarted): TestStepResult | undefined {
    return this.findTestStepFinishedAndTestStepBy(testCaseStarted)
      .map(([testStepFinished]) => testStepFinished.testStepResult)
      .sort(comparatorByStatus)
      .at(-1)
  }

  public findNameOf(pickle: Pickle, namingStrategy: NamingStrategy): string {
    const lineage = this.findLineageBy(pickle)
    return lineage ? namingStrategy.reduce(lineage, pickle) : pickle.name
  }

  public findPickleBy(testCaseStarted: TestCaseStarted): Pickle | undefined {
    const testCase = this.findTestCaseBy(testCaseStarted)
    assert.ok(testCase, 'Expected to find TestCase from TestCaseStarted')
    return this.pickleById.get(testCase.pickleId)
  }

  public findPickleStepBy(testStep: TestStep): PickleStep | undefined {
    if (!testStep.pickleStepId){
      return undefined
    }
    return this.pickleStepById.get(testStep.pickleStepId)
  }

  public findStepBy(pickleStep: PickleStep): Step | undefined {
    const [astNodeId] = pickleStep.astNodeIds
    assert.ok(astNodeId, 'Expected PickleStep to have an astNodeId')
    return this.stepById.get(astNodeId)
  }

  public findTestCaseBy(testCaseStarted: TestCaseStarted): TestCase | undefined {
    return this.testCaseById.get(testCaseStarted.testCaseId)
  }

  public findTestCaseDurationBy(testCaseStarted: TestCaseStarted): Duration | undefined {
    const testCaseFinished = this.findTestCaseFinishedBy(testCaseStarted)
    if (!testCaseFinished) {
      return undefined
    }
    return TimeConversion.millisecondsToDuration(
        TimeConversion.timestampToMillisecondsSinceEpoch(testCaseFinished.timestamp) -
        TimeConversion.timestampToMillisecondsSinceEpoch(testCaseStarted.timestamp)
    )
  }

  public findTestCaseFinishedBy(testCaseStarted: TestCaseStarted): TestCaseFinished | undefined {
    return this.testCaseFinishedByTestCaseStartedId.get(testCaseStarted.id)
  }

  public findTestRunDuration(): Duration | undefined {
    if (!this.testRunStarted || !this.testRunFinished) {
      return undefined
    }
    return TimeConversion.millisecondsToDuration(
        TimeConversion.timestampToMillisecondsSinceEpoch(this.testRunFinished.timestamp) -
        TimeConversion.timestampToMillisecondsSinceEpoch(this.testRunStarted.timestamp)
    )
  }

  public findTestRunFinished(): TestRunFinished | undefined {
    return this.testRunFinished
  }

  public findTestRunStarted(): TestRunStarted | undefined {
    return this.testRunStarted
  }

  public findTestStepBy(testStepFinished: TestStepFinished): TestStep | undefined {
    return this.testStepById.get(testStepFinished.testStepId)
  }

  public findTestStepsFinishedBy(testCaseStarted: TestCaseStarted): ReadonlyArray<TestStepFinished> {
    // multimaps `get` implements `getOrDefault([])` behaviour internally
    return [...this.testStepFinishedByTestCaseStartedId.get(testCaseStarted.id)]
  }

  public findTestStepFinishedAndTestStepBy(
      testCaseStarted: TestCaseStarted
  ): ReadonlyArray<[TestStepFinished, TestStep]> {
    return this.testStepFinishedByTestCaseStartedId
        .get(testCaseStarted.id)
        .map((testStepFinished) => {
          const testStep = this.findTestStepBy(testStepFinished)
          assert.ok(testStep, 'Expected to find TestStep by TestStepFinished')
          return [testStepFinished, testStep]
        })
  }

  private findLineageBy(element: Pickle | TestCaseStarted) {
    const pickle = "testCaseId" in element ? this.findPickleBy(element) : element
    const deepestAstNodeId = pickle.astNodeIds.at(-1)
    assert.ok(deepestAstNodeId, 'Expected Pickle to have at least one astNodeId')
    return this.lineageById.get(deepestAstNodeId)
  }
}
