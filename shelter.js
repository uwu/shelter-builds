(() => {
  var __defProp = Object.defineProperty;
  var __export = (target, all) => {
    for (var name in all)
      __defProp(target, name, { get: all[name], enumerable: true });
  };

  // src/flux.ts
  var flux_exports = {};
  __export(flux_exports, {
    getDispatcher: () => getDispatcher,
    intercept: () => intercept,
    stores: () => stores
  });

  // ../../node_modules/.pnpm/@cumjar+websmack@1.2.0/node_modules/@cumjar/websmack/src/raid/webpackChunk.js
  var webpackChunk_default = (key) => {
    key ??= Object.keys(window).find((key2) => key2.startsWith("webpackChunk"));
    if (!window[key])
      return;
    let wpRequire;
    window[key].push([
      [Symbol()],
      {},
      (e) => {
        wpRequire = e;
      }
    ]);
    window[key].pop();
    return [wpRequire.c ?? Object.fromEntries(
      Object.entries(wpRequire.m).map(([k]) => [
        k,
        { id: k, loaded: true, exports: wpRequire(k) }
      ])
    ), wpRequire];
  };

  // ../../node_modules/.pnpm/spitroast@1.4.2/node_modules/spitroast/dist/esm/index.js
  var esm_exports = {};
  __export(esm_exports, {
    after: () => after,
    before: () => before,
    instead: () => instead,
    unpatchAll: () => unpatchAll
  });

  // ../../node_modules/.pnpm/spitroast@1.4.2/node_modules/spitroast/dist/esm/shared.js
  var patchTypes = ["a", "b", "i"];
  var patchedObjects = /* @__PURE__ */ new Map();

  // ../../node_modules/.pnpm/spitroast@1.4.2/node_modules/spitroast/dist/esm/hook.js
  function hook_default(funcName, funcParent, funcArgs, ctxt, isConstruct) {
    const patch = patchedObjects.get(funcParent)?.[funcName];
    if (!patch)
      return isConstruct ? Reflect.construct(funcParent[funcName], funcArgs, ctxt) : funcParent[funcName].apply(ctxt, funcArgs);
    for (const hook of patch.b.values()) {
      const maybefuncArgs = hook.call(ctxt, funcArgs);
      if (Array.isArray(maybefuncArgs))
        funcArgs = maybefuncArgs;
    }
    let insteadPatchedFunc = (...args) => isConstruct ? Reflect.construct(patch.o, args, ctxt) : patch.o.apply(ctxt, args);
    for (const callback of patch.i.values()) {
      const oldPatchFunc = insteadPatchedFunc;
      insteadPatchedFunc = (...args) => callback.call(ctxt, args, oldPatchFunc);
    }
    let workingRetVal = insteadPatchedFunc(...funcArgs);
    for (const hook of patch.a.values())
      workingRetVal = hook.call(ctxt, funcArgs, workingRetVal) ?? workingRetVal;
    return workingRetVal;
  }

  // ../../node_modules/.pnpm/spitroast@1.4.2/node_modules/spitroast/dist/esm/unpatch.js
  function unpatch(funcParent, funcName, hookId, type) {
    const patchedObject = patchedObjects.get(funcParent);
    const patch = patchedObject?.[funcName];
    if (!patch?.[type].has(hookId))
      return false;
    patch[type].delete(hookId);
    if (patchTypes.every((t) => patch[t].size === 0)) {
      const success = Reflect.defineProperty(funcParent, funcName, {
        value: patch.o,
        writable: true,
        configurable: true
      });
      if (!success)
        funcParent[funcName] = patch.o;
      delete patchedObject[funcName];
    }
    if (Object.keys(patchedObject).length == 0)
      patchedObjects.delete(funcParent);
    return true;
  }
  function unpatchAll() {
    for (const [parentObject, patchedObject] of patchedObjects.entries())
      for (const funcName in patchedObject)
        for (const hookType of patchTypes)
          for (const hookId of patchedObject[funcName]?.[hookType].keys() ?? [])
            unpatch(parentObject, funcName, hookId, hookType);
  }

  // ../../node_modules/.pnpm/spitroast@1.4.2/node_modules/spitroast/dist/esm/getPatchFunc.js
  var getPatchFunc_default = (patchType) => (funcName, funcParent, callback, oneTime = false) => {
    if (typeof funcParent[funcName] !== "function")
      throw new Error(`${funcName} is not a function in ${funcParent.constructor.name}`);
    if (!patchedObjects.has(funcParent))
      patchedObjects.set(funcParent, {});
    const parentInjections = patchedObjects.get(funcParent);
    if (!parentInjections[funcName]) {
      const origFunc = funcParent[funcName];
      parentInjections[funcName] = {
        o: origFunc,
        b: /* @__PURE__ */ new Map(),
        i: /* @__PURE__ */ new Map(),
        a: /* @__PURE__ */ new Map()
      };
      const runHook = (ctxt, args, construct) => {
        const ret = hook_default(funcName, funcParent, args, ctxt, construct);
        if (oneTime)
          unpatchThisPatch();
        return ret;
      };
      const replaceProxy = new Proxy(origFunc, {
        apply: (_, ctxt, args) => runHook(ctxt, args, false),
        construct: (_, args) => runHook(origFunc, args, true),
        get: (target, prop, receiver) => prop == "toString" ? origFunc.toString.bind(origFunc) : Reflect.get(target, prop, receiver)
      });
      const success = Reflect.defineProperty(funcParent, funcName, {
        value: replaceProxy,
        configurable: true,
        writable: true
      });
      if (!success)
        funcParent[funcName] = replaceProxy;
    }
    const hookId = Symbol();
    const unpatchThisPatch = () => unpatch(funcParent, funcName, hookId, patchType);
    parentInjections[funcName][patchType].set(hookId, callback);
    return unpatchThisPatch;
  };

  // ../../node_modules/.pnpm/spitroast@1.4.2/node_modules/spitroast/dist/esm/index.js
  var before = getPatchFunc_default("b");
  var instead = getPatchFunc_default("i");
  var after = getPatchFunc_default("a");

  // src/flux.ts
  var dispatcher;
  async function getDispatcher() {
    if (dispatcher)
      return dispatcher;
    try {
      dispatcher = Object.values(webpackChunk_default("webpackChunkdiscord_app")[0]).find(
        (x) => x?.exports?.default?._dispatcher
      ).exports.default._dispatcher;
    } catch {
    }
    if (!dispatcher)
      dispatcher = new Promise((res) => {
        Object.defineProperty(Object.prototype, "_dispatcher", {
          set(value) {
            if (dispatcher) {
              dispatcher = Object.defineProperty(this, "_dispatcher", { value })._dispatcher;
              res(dispatcher);
              delete Object.prototype._dispatcher;
            }
          },
          configurable: true
        });
      });
    return dispatcher;
  }
  var stores = {};
  var realDispatchTokenKey = Symbol("shelter _dispatchToken");
  Object.defineProperty(Object.prototype, "_dispatchToken", {
    set(value) {
      this[realDispatchTokenKey] = value;
      const name = this.getName();
      if (!stores[name])
        stores[name] = this;
      else {
        if (Array.isArray(stores[name]))
          stores[name].push(this);
        else
          stores[name] = [stores[name], this];
      }
    },
    get() {
      return this[realDispatchTokenKey];
    }
  });
  var intercepts = [];
  var interceptInjected = false;
  async function injectIntercept() {
    if (interceptInjected)
      return;
    interceptInjected = true;
    const FluxDispatcher = await getDispatcher();
    FluxDispatcher._interceptor ??= () => {
    };
    instead("_interceptor", FluxDispatcher, ([payload], orig) => {
      for (const intercept2 of intercepts) {
        const res = intercept2(payload);
        if (res) {
          if (res[1])
            return true;
          payload = res[0];
        }
      }
      return orig(payload);
    });
  }
  function intercept(cb) {
    injectIntercept();
    intercepts.push(cb);
    return () => {
      intercepts = intercepts.filter((i) => i !== cb);
    };
  }

  // ../../node_modules/.pnpm/solid-js@1.5.7/node_modules/solid-js/dist/solid.js
  var solid_exports = {};
  __export(solid_exports, {
    $DEVCOMP: () => $DEVCOMP,
    $PROXY: () => $PROXY,
    $TRACK: () => $TRACK,
    DEV: () => DEV,
    ErrorBoundary: () => ErrorBoundary,
    For: () => For,
    Index: () => Index,
    Match: () => Match,
    Show: () => Show,
    Suspense: () => Suspense,
    SuspenseList: () => SuspenseList,
    Switch: () => Switch,
    batch: () => batch,
    cancelCallback: () => cancelCallback,
    children: () => children,
    createComponent: () => createComponent,
    createComputed: () => createComputed,
    createContext: () => createContext,
    createDeferred: () => createDeferred,
    createEffect: () => createEffect,
    createMemo: () => createMemo,
    createReaction: () => createReaction,
    createRenderEffect: () => createRenderEffect,
    createResource: () => createResource,
    createRoot: () => createRoot,
    createSelector: () => createSelector,
    createSignal: () => createSignal,
    createUniqueId: () => createUniqueId,
    enableExternalSource: () => enableExternalSource,
    enableHydration: () => enableHydration,
    enableScheduling: () => enableScheduling,
    equalFn: () => equalFn,
    from: () => from,
    getListener: () => getListener,
    getOwner: () => getOwner,
    indexArray: () => indexArray,
    lazy: () => lazy,
    mapArray: () => mapArray,
    mergeProps: () => mergeProps,
    observable: () => observable,
    on: () => on,
    onCleanup: () => onCleanup,
    onError: () => onError,
    onMount: () => onMount,
    requestCallback: () => requestCallback,
    resetErrorBoundaries: () => resetErrorBoundaries,
    runWithOwner: () => runWithOwner,
    sharedConfig: () => sharedConfig,
    splitProps: () => splitProps,
    startTransition: () => startTransition,
    untrack: () => untrack,
    useContext: () => useContext,
    useTransition: () => useTransition
  });
  var taskIdCounter = 1;
  var isCallbackScheduled = false;
  var isPerformingWork = false;
  var taskQueue = [];
  var currentTask = null;
  var shouldYieldToHost = null;
  var yieldInterval = 5;
  var deadline = 0;
  var maxYieldInterval = 300;
  var scheduleCallback = null;
  var scheduledCallback = null;
  var maxSigned31BitInt = 1073741823;
  function setupScheduler() {
    const channel = new MessageChannel(), port = channel.port2;
    scheduleCallback = () => port.postMessage(null);
    channel.port1.onmessage = () => {
      if (scheduledCallback !== null) {
        const currentTime = performance.now();
        deadline = currentTime + yieldInterval;
        const hasTimeRemaining = true;
        try {
          const hasMoreWork = scheduledCallback(hasTimeRemaining, currentTime);
          if (!hasMoreWork) {
            scheduledCallback = null;
          } else
            port.postMessage(null);
        } catch (error) {
          port.postMessage(null);
          throw error;
        }
      }
    };
    if (navigator && navigator.scheduling && navigator.scheduling.isInputPending) {
      const scheduling = navigator.scheduling;
      shouldYieldToHost = () => {
        const currentTime = performance.now();
        if (currentTime >= deadline) {
          if (scheduling.isInputPending()) {
            return true;
          }
          return currentTime >= maxYieldInterval;
        } else {
          return false;
        }
      };
    } else {
      shouldYieldToHost = () => performance.now() >= deadline;
    }
  }
  function enqueue(taskQueue2, task) {
    function findIndex() {
      let m = 0;
      let n = taskQueue2.length - 1;
      while (m <= n) {
        const k = n + m >> 1;
        const cmp = task.expirationTime - taskQueue2[k].expirationTime;
        if (cmp > 0)
          m = k + 1;
        else if (cmp < 0)
          n = k - 1;
        else
          return k;
      }
      return m;
    }
    taskQueue2.splice(findIndex(), 0, task);
  }
  function requestCallback(fn, options) {
    if (!scheduleCallback)
      setupScheduler();
    let startTime = performance.now(), timeout = maxSigned31BitInt;
    if (options && options.timeout)
      timeout = options.timeout;
    const newTask = {
      id: taskIdCounter++,
      fn,
      startTime,
      expirationTime: startTime + timeout
    };
    enqueue(taskQueue, newTask);
    if (!isCallbackScheduled && !isPerformingWork) {
      isCallbackScheduled = true;
      scheduledCallback = flushWork;
      scheduleCallback();
    }
    return newTask;
  }
  function cancelCallback(task) {
    task.fn = null;
  }
  function flushWork(hasTimeRemaining, initialTime) {
    isCallbackScheduled = false;
    isPerformingWork = true;
    try {
      return workLoop(hasTimeRemaining, initialTime);
    } finally {
      currentTask = null;
      isPerformingWork = false;
    }
  }
  function workLoop(hasTimeRemaining, initialTime) {
    let currentTime = initialTime;
    currentTask = taskQueue[0] || null;
    while (currentTask !== null) {
      if (currentTask.expirationTime > currentTime && (!hasTimeRemaining || shouldYieldToHost())) {
        break;
      }
      const callback = currentTask.fn;
      if (callback !== null) {
        currentTask.fn = null;
        const didUserCallbackTimeout = currentTask.expirationTime <= currentTime;
        callback(didUserCallbackTimeout);
        currentTime = performance.now();
        if (currentTask === taskQueue[0]) {
          taskQueue.shift();
        }
      } else
        taskQueue.shift();
      currentTask = taskQueue[0] || null;
    }
    return currentTask !== null;
  }
  var sharedConfig = {};
  function setHydrateContext(context) {
    sharedConfig.context = context;
  }
  function nextHydrateContext() {
    return {
      ...sharedConfig.context,
      id: `${sharedConfig.context.id}${sharedConfig.context.count++}-`,
      count: 0
    };
  }
  var equalFn = (a, b) => a === b;
  var $PROXY = Symbol("solid-proxy");
  var $TRACK = Symbol("solid-track");
  var $DEVCOMP = Symbol("solid-dev-component");
  var signalOptions = {
    equals: equalFn
  };
  var ERROR = null;
  var runEffects = runQueue;
  var STALE = 1;
  var PENDING = 2;
  var UNOWNED = {
    owned: null,
    cleanups: null,
    context: null,
    owner: null
  };
  var NO_INIT = {};
  var Owner = null;
  var Transition = null;
  var Scheduler = null;
  var ExternalSourceFactory = null;
  var Listener = null;
  var Updates = null;
  var Effects = null;
  var ExecCount = 0;
  var [transPending, setTransPending] = /* @__PURE__ */ createSignal(false);
  function createRoot(fn, detachedOwner) {
    const listener = Listener, owner = Owner, unowned = fn.length === 0, root = unowned && true ? UNOWNED : {
      owned: null,
      cleanups: null,
      context: null,
      owner: detachedOwner || owner
    }, updateFn = unowned ? fn : () => fn(() => untrack(() => cleanNode(root)));
    Owner = root;
    Listener = null;
    try {
      return runUpdates(updateFn, true);
    } finally {
      Listener = listener;
      Owner = owner;
    }
  }
  function createSignal(value, options) {
    options = options ? Object.assign({}, signalOptions, options) : signalOptions;
    const s = {
      value,
      observers: null,
      observerSlots: null,
      comparator: options.equals || void 0
    };
    const setter = (value2) => {
      if (typeof value2 === "function") {
        if (Transition && Transition.running && Transition.sources.has(s))
          value2 = value2(s.tValue);
        else
          value2 = value2(s.value);
      }
      return writeSignal(s, value2);
    };
    return [readSignal.bind(s), setter];
  }
  function createComputed(fn, value, options) {
    const c = createComputation(fn, value, true, STALE);
    if (Scheduler && Transition && Transition.running)
      Updates.push(c);
    else
      updateComputation(c);
  }
  function createRenderEffect(fn, value, options) {
    const c = createComputation(fn, value, false, STALE);
    if (Scheduler && Transition && Transition.running)
      Updates.push(c);
    else
      updateComputation(c);
  }
  function createEffect(fn, value, options) {
    runEffects = runUserEffects;
    const c = createComputation(fn, value, false, STALE), s = SuspenseContext && lookup(Owner, SuspenseContext.id);
    if (s)
      c.suspense = s;
    c.user = true;
    Effects ? Effects.push(c) : updateComputation(c);
  }
  function createReaction(onInvalidate, options) {
    let fn;
    const c = createComputation(() => {
      fn ? fn() : untrack(onInvalidate);
      fn = void 0;
    }, void 0, false, 0), s = SuspenseContext && lookup(Owner, SuspenseContext.id);
    if (s)
      c.suspense = s;
    c.user = true;
    return (tracking) => {
      fn = tracking;
      updateComputation(c);
    };
  }
  function createMemo(fn, value, options) {
    options = options ? Object.assign({}, signalOptions, options) : signalOptions;
    const c = createComputation(fn, value, true, 0);
    c.observers = null;
    c.observerSlots = null;
    c.comparator = options.equals || void 0;
    if (Scheduler && Transition && Transition.running) {
      c.tState = STALE;
      Updates.push(c);
    } else
      updateComputation(c);
    return readSignal.bind(c);
  }
  function createResource(pSource, pFetcher, pOptions) {
    let source;
    let fetcher;
    let options;
    if (arguments.length === 2 && typeof pFetcher === "object" || arguments.length === 1) {
      source = true;
      fetcher = pSource;
      options = pFetcher || {};
    } else {
      source = pSource;
      fetcher = pFetcher;
      options = pOptions || {};
    }
    let pr = null, initP = NO_INIT, id = null, loadedUnderTransition = false, scheduled = false, resolved = "initialValue" in options, dynamic = typeof source === "function" && createMemo(source);
    const contexts = /* @__PURE__ */ new Set(), [value, setValue] = (options.storage || createSignal)(options.initialValue), [error, setError] = createSignal(void 0), [track, trigger] = createSignal(void 0, {
      equals: false
    }), [state, setState] = createSignal(resolved ? "ready" : "unresolved");
    if (sharedConfig.context) {
      id = `${sharedConfig.context.id}${sharedConfig.context.count++}`;
      let v;
      if (options.ssrLoadFrom === "initial")
        initP = options.initialValue;
      else if (sharedConfig.load && (v = sharedConfig.load(id)))
        initP = v[0];
    }
    function loadEnd(p, v, error2, key) {
      if (pr === p) {
        pr = null;
        resolved = true;
        if ((p === initP || v === initP) && options.onHydrated)
          queueMicrotask(() => options.onHydrated(key, {
            value: v
          }));
        initP = NO_INIT;
        if (Transition && p && loadedUnderTransition) {
          Transition.promises.delete(p);
          loadedUnderTransition = false;
          runUpdates(() => {
            Transition.running = true;
            completeLoad(v, error2);
          }, false);
        } else
          completeLoad(v, error2);
      }
      return v;
    }
    function completeLoad(v, err) {
      runUpdates(() => {
        if (!err)
          setValue(() => v);
        setError(err);
        setState(err ? "errored" : "ready");
        for (const c of contexts.keys())
          c.decrement();
        contexts.clear();
      }, false);
    }
    function read() {
      const c = SuspenseContext && lookup(Owner, SuspenseContext.id), v = value(), err = error();
      if (err && !pr)
        throw err;
      if (Listener && !Listener.user && c) {
        createComputed(() => {
          track();
          if (pr) {
            if (c.resolved && Transition && Transition.running)
              Transition.promises.add(pr);
            else if (!contexts.has(c)) {
              c.increment();
              contexts.add(c);
            }
          }
        });
      }
      return v;
    }
    function load(refetching = true) {
      if (refetching !== false && scheduled)
        return;
      scheduled = false;
      const lookup2 = dynamic ? dynamic() : source;
      loadedUnderTransition = Transition && Transition.running;
      if (lookup2 == null || lookup2 === false) {
        loadEnd(pr, untrack(value));
        return;
      }
      if (Transition && pr)
        Transition.promises.delete(pr);
      const p = initP !== NO_INIT ? initP : untrack(() => fetcher(lookup2, {
        value: value(),
        refetching
      }));
      if (typeof p !== "object" || !(p && "then" in p)) {
        loadEnd(pr, p);
        return p;
      }
      pr = p;
      scheduled = true;
      queueMicrotask(() => scheduled = false);
      runUpdates(() => {
        setState(resolved ? "refreshing" : "pending");
        trigger();
      }, false);
      return p.then((v) => loadEnd(p, v, void 0, lookup2), (e) => loadEnd(p, void 0, castError(e)));
    }
    Object.defineProperties(read, {
      state: {
        get: () => state()
      },
      error: {
        get: () => error()
      },
      loading: {
        get() {
          const s = state();
          return s === "pending" || s === "refreshing";
        }
      },
      latest: {
        get() {
          if (!resolved)
            return read();
          const err = error();
          if (err && !pr)
            throw err;
          return value();
        }
      }
    });
    if (dynamic)
      createComputed(() => load(false));
    else
      load(false);
    return [read, {
      refetch: load,
      mutate: setValue
    }];
  }
  function createDeferred(source, options) {
    let t, timeout = options ? options.timeoutMs : void 0;
    const node = createComputation(() => {
      if (!t || !t.fn)
        t = requestCallback(() => setDeferred(() => node.value), timeout !== void 0 ? {
          timeout
        } : void 0);
      return source();
    }, void 0, true);
    const [deferred, setDeferred] = createSignal(node.value, options);
    updateComputation(node);
    setDeferred(() => node.value);
    return deferred;
  }
  function createSelector(source, fn = equalFn, options) {
    const subs = /* @__PURE__ */ new Map();
    const node = createComputation((p) => {
      const v = source();
      for (const [key, val] of subs.entries())
        if (fn(key, v) !== fn(key, p)) {
          for (const c of val.values()) {
            c.state = STALE;
            if (c.pure)
              Updates.push(c);
            else
              Effects.push(c);
          }
        }
      return v;
    }, void 0, true, STALE);
    updateComputation(node);
    return (key) => {
      const listener = Listener;
      if (listener) {
        let l;
        if (l = subs.get(key))
          l.add(listener);
        else
          subs.set(key, l = /* @__PURE__ */ new Set([listener]));
        onCleanup(() => {
          l.delete(listener);
          !l.size && subs.delete(key);
        });
      }
      return fn(key, Transition && Transition.running && Transition.sources.has(node) ? node.tValue : node.value);
    };
  }
  function batch(fn) {
    return runUpdates(fn, false);
  }
  function untrack(fn) {
    let result, listener = Listener;
    Listener = null;
    result = fn();
    Listener = listener;
    return result;
  }
  function on(deps, fn, options) {
    const isArray = Array.isArray(deps);
    let prevInput;
    let defer = options && options.defer;
    return (prevValue) => {
      let input;
      if (isArray) {
        input = Array(deps.length);
        for (let i = 0; i < deps.length; i++)
          input[i] = deps[i]();
      } else
        input = deps();
      if (defer) {
        defer = false;
        return void 0;
      }
      const result = untrack(() => fn(input, prevInput, prevValue));
      prevInput = input;
      return result;
    };
  }
  function onMount(fn) {
    createEffect(() => untrack(fn));
  }
  function onCleanup(fn) {
    if (Owner === null)
      ;
    else if (Owner.cleanups === null)
      Owner.cleanups = [fn];
    else
      Owner.cleanups.push(fn);
    return fn;
  }
  function onError(fn) {
    ERROR || (ERROR = Symbol("error"));
    if (Owner === null)
      ;
    else if (Owner.context === null)
      Owner.context = {
        [ERROR]: [fn]
      };
    else if (!Owner.context[ERROR])
      Owner.context[ERROR] = [fn];
    else
      Owner.context[ERROR].push(fn);
  }
  function getListener() {
    return Listener;
  }
  function getOwner() {
    return Owner;
  }
  function runWithOwner(o, fn) {
    const prev = Owner;
    Owner = o;
    try {
      return runUpdates(fn, true);
    } finally {
      Owner = prev;
    }
  }
  function enableScheduling(scheduler = requestCallback) {
    Scheduler = scheduler;
  }
  function startTransition(fn) {
    if (Transition && Transition.running) {
      fn();
      return Transition.done;
    }
    const l = Listener;
    const o = Owner;
    return Promise.resolve().then(() => {
      Listener = l;
      Owner = o;
      let t;
      if (Scheduler || SuspenseContext) {
        t = Transition || (Transition = {
          sources: /* @__PURE__ */ new Set(),
          effects: [],
          promises: /* @__PURE__ */ new Set(),
          disposed: /* @__PURE__ */ new Set(),
          queue: /* @__PURE__ */ new Set(),
          running: true
        });
        t.done || (t.done = new Promise((res) => t.resolve = res));
        t.running = true;
      }
      runUpdates(fn, false);
      Listener = Owner = null;
      return t ? t.done : void 0;
    });
  }
  function useTransition() {
    return [transPending, startTransition];
  }
  function resumeEffects(e) {
    Effects.push.apply(Effects, e);
    e.length = 0;
  }
  function createContext(defaultValue) {
    const id = Symbol("context");
    return {
      id,
      Provider: createProvider(id),
      defaultValue
    };
  }
  function useContext(context) {
    let ctx;
    return (ctx = lookup(Owner, context.id)) !== void 0 ? ctx : context.defaultValue;
  }
  function children(fn) {
    const children2 = createMemo(fn);
    const memo2 = createMemo(() => resolveChildren(children2()));
    memo2.toArray = () => {
      const c = memo2();
      return Array.isArray(c) ? c : c != null ? [c] : [];
    };
    return memo2;
  }
  var SuspenseContext;
  function getSuspenseContext() {
    return SuspenseContext || (SuspenseContext = createContext({}));
  }
  function enableExternalSource(factory) {
    if (ExternalSourceFactory) {
      const oldFactory = ExternalSourceFactory;
      ExternalSourceFactory = (fn, trigger) => {
        const oldSource = oldFactory(fn, trigger);
        const source = factory((x) => oldSource.track(x), trigger);
        return {
          track: (x) => source.track(x),
          dispose() {
            source.dispose();
            oldSource.dispose();
          }
        };
      };
    } else {
      ExternalSourceFactory = factory;
    }
  }
  function readSignal() {
    const runningTransition = Transition && Transition.running;
    if (this.sources && (!runningTransition && this.state || runningTransition && this.tState)) {
      if (!runningTransition && this.state === STALE || runningTransition && this.tState === STALE)
        updateComputation(this);
      else {
        const updates = Updates;
        Updates = null;
        runUpdates(() => lookUpstream(this), false);
        Updates = updates;
      }
    }
    if (Listener) {
      const sSlot = this.observers ? this.observers.length : 0;
      if (!Listener.sources) {
        Listener.sources = [this];
        Listener.sourceSlots = [sSlot];
      } else {
        Listener.sources.push(this);
        Listener.sourceSlots.push(sSlot);
      }
      if (!this.observers) {
        this.observers = [Listener];
        this.observerSlots = [Listener.sources.length - 1];
      } else {
        this.observers.push(Listener);
        this.observerSlots.push(Listener.sources.length - 1);
      }
    }
    if (runningTransition && Transition.sources.has(this))
      return this.tValue;
    return this.value;
  }
  function writeSignal(node, value, isComp) {
    let current = Transition && Transition.running && Transition.sources.has(node) ? node.tValue : node.value;
    if (!node.comparator || !node.comparator(current, value)) {
      if (Transition) {
        const TransitionRunning = Transition.running;
        if (TransitionRunning || !isComp && Transition.sources.has(node)) {
          Transition.sources.add(node);
          node.tValue = value;
        }
        if (!TransitionRunning)
          node.value = value;
      } else
        node.value = value;
      if (node.observers && node.observers.length) {
        runUpdates(() => {
          for (let i = 0; i < node.observers.length; i += 1) {
            const o = node.observers[i];
            const TransitionRunning = Transition && Transition.running;
            if (TransitionRunning && Transition.disposed.has(o))
              continue;
            if (TransitionRunning && !o.tState || !TransitionRunning && !o.state) {
              if (o.pure)
                Updates.push(o);
              else
                Effects.push(o);
              if (o.observers)
                markDownstream(o);
            }
            if (TransitionRunning)
              o.tState = STALE;
            else
              o.state = STALE;
          }
          if (Updates.length > 1e6) {
            Updates = [];
            if (false)
              ;
            throw new Error();
          }
        }, false);
      }
    }
    return value;
  }
  function updateComputation(node) {
    if (!node.fn)
      return;
    cleanNode(node);
    const owner = Owner, listener = Listener, time = ExecCount;
    Listener = Owner = node;
    runComputation(node, Transition && Transition.running && Transition.sources.has(node) ? node.tValue : node.value, time);
    if (Transition && !Transition.running && Transition.sources.has(node)) {
      queueMicrotask(() => {
        runUpdates(() => {
          Transition && (Transition.running = true);
          runComputation(node, node.tValue, time);
        }, false);
      });
    }
    Listener = listener;
    Owner = owner;
  }
  function runComputation(node, value, time) {
    let nextValue;
    try {
      nextValue = node.fn(value);
    } catch (err) {
      if (node.pure)
        Transition && Transition.running ? node.tState = STALE : node.state = STALE;
      handleError(err);
    }
    if (!node.updatedAt || node.updatedAt <= time) {
      if (node.updatedAt != null && "observers" in node) {
        writeSignal(node, nextValue, true);
      } else if (Transition && Transition.running && node.pure) {
        Transition.sources.add(node);
        node.tValue = nextValue;
      } else
        node.value = nextValue;
      node.updatedAt = time;
    }
  }
  function createComputation(fn, init, pure, state = STALE, options) {
    const c = {
      fn,
      state,
      updatedAt: null,
      owned: null,
      sources: null,
      sourceSlots: null,
      cleanups: null,
      value: init,
      owner: Owner,
      context: null,
      pure
    };
    if (Transition && Transition.running) {
      c.state = 0;
      c.tState = state;
    }
    if (Owner === null)
      ;
    else if (Owner !== UNOWNED) {
      if (Transition && Transition.running && Owner.pure) {
        if (!Owner.tOwned)
          Owner.tOwned = [c];
        else
          Owner.tOwned.push(c);
      } else {
        if (!Owner.owned)
          Owner.owned = [c];
        else
          Owner.owned.push(c);
      }
    }
    if (ExternalSourceFactory) {
      const [track, trigger] = createSignal(void 0, {
        equals: false
      });
      const ordinary = ExternalSourceFactory(c.fn, trigger);
      onCleanup(() => ordinary.dispose());
      const triggerInTransition = () => startTransition(trigger).then(() => inTransition.dispose());
      const inTransition = ExternalSourceFactory(c.fn, triggerInTransition);
      c.fn = (x) => {
        track();
        return Transition && Transition.running ? inTransition.track(x) : ordinary.track(x);
      };
    }
    return c;
  }
  function runTop(node) {
    const runningTransition = Transition && Transition.running;
    if (!runningTransition && node.state === 0 || runningTransition && node.tState === 0)
      return;
    if (!runningTransition && node.state === PENDING || runningTransition && node.tState === PENDING)
      return lookUpstream(node);
    if (node.suspense && untrack(node.suspense.inFallback))
      return node.suspense.effects.push(node);
    const ancestors = [node];
    while ((node = node.owner) && (!node.updatedAt || node.updatedAt < ExecCount)) {
      if (runningTransition && Transition.disposed.has(node))
        return;
      if (!runningTransition && node.state || runningTransition && node.tState)
        ancestors.push(node);
    }
    for (let i = ancestors.length - 1; i >= 0; i--) {
      node = ancestors[i];
      if (runningTransition) {
        let top = node, prev = ancestors[i + 1];
        while ((top = top.owner) && top !== prev) {
          if (Transition.disposed.has(top))
            return;
        }
      }
      if (!runningTransition && node.state === STALE || runningTransition && node.tState === STALE) {
        updateComputation(node);
      } else if (!runningTransition && node.state === PENDING || runningTransition && node.tState === PENDING) {
        const updates = Updates;
        Updates = null;
        runUpdates(() => lookUpstream(node, ancestors[0]), false);
        Updates = updates;
      }
    }
  }
  function runUpdates(fn, init) {
    if (Updates)
      return fn();
    let wait = false;
    if (!init)
      Updates = [];
    if (Effects)
      wait = true;
    else
      Effects = [];
    ExecCount++;
    try {
      const res = fn();
      completeUpdates(wait);
      return res;
    } catch (err) {
      if (!Updates)
        Effects = null;
      handleError(err);
    }
  }
  function completeUpdates(wait) {
    if (Updates) {
      if (Scheduler && Transition && Transition.running)
        scheduleQueue(Updates);
      else
        runQueue(Updates);
      Updates = null;
    }
    if (wait)
      return;
    let res;
    if (Transition) {
      if (!Transition.promises.size && !Transition.queue.size) {
        const sources = Transition.sources;
        const disposed = Transition.disposed;
        Effects.push.apply(Effects, Transition.effects);
        res = Transition.resolve;
        for (const e2 of Effects) {
          "tState" in e2 && (e2.state = e2.tState);
          delete e2.tState;
        }
        Transition = null;
        runUpdates(() => {
          for (const d of disposed)
            cleanNode(d);
          for (const v of sources) {
            v.value = v.tValue;
            if (v.owned) {
              for (let i = 0, len = v.owned.length; i < len; i++)
                cleanNode(v.owned[i]);
            }
            if (v.tOwned)
              v.owned = v.tOwned;
            delete v.tValue;
            delete v.tOwned;
            v.tState = 0;
          }
          setTransPending(false);
        }, false);
      } else if (Transition.running) {
        Transition.running = false;
        Transition.effects.push.apply(Transition.effects, Effects);
        Effects = null;
        setTransPending(true);
        return;
      }
    }
    const e = Effects;
    Effects = null;
    if (e.length)
      runUpdates(() => runEffects(e), false);
    if (res)
      res();
  }
  function runQueue(queue) {
    for (let i = 0; i < queue.length; i++)
      runTop(queue[i]);
  }
  function scheduleQueue(queue) {
    for (let i = 0; i < queue.length; i++) {
      const item = queue[i];
      const tasks = Transition.queue;
      if (!tasks.has(item)) {
        tasks.add(item);
        Scheduler(() => {
          tasks.delete(item);
          runUpdates(() => {
            Transition.running = true;
            runTop(item);
          }, false);
          Transition && (Transition.running = false);
        });
      }
    }
  }
  function runUserEffects(queue) {
    let i, userLength = 0;
    for (i = 0; i < queue.length; i++) {
      const e = queue[i];
      if (!e.user)
        runTop(e);
      else
        queue[userLength++] = e;
    }
    if (sharedConfig.context)
      setHydrateContext();
    for (i = 0; i < userLength; i++)
      runTop(queue[i]);
  }
  function lookUpstream(node, ignore) {
    const runningTransition = Transition && Transition.running;
    if (runningTransition)
      node.tState = 0;
    else
      node.state = 0;
    for (let i = 0; i < node.sources.length; i += 1) {
      const source = node.sources[i];
      if (source.sources) {
        if (!runningTransition && source.state === STALE || runningTransition && source.tState === STALE) {
          if (source !== ignore)
            runTop(source);
        } else if (!runningTransition && source.state === PENDING || runningTransition && source.tState === PENDING)
          lookUpstream(source, ignore);
      }
    }
  }
  function markDownstream(node) {
    const runningTransition = Transition && Transition.running;
    for (let i = 0; i < node.observers.length; i += 1) {
      const o = node.observers[i];
      if (!runningTransition && !o.state || runningTransition && !o.tState) {
        if (runningTransition)
          o.tState = PENDING;
        else
          o.state = PENDING;
        if (o.pure)
          Updates.push(o);
        else
          Effects.push(o);
        o.observers && markDownstream(o);
      }
    }
  }
  function cleanNode(node) {
    let i;
    if (node.sources) {
      while (node.sources.length) {
        const source = node.sources.pop(), index = node.sourceSlots.pop(), obs = source.observers;
        if (obs && obs.length) {
          const n = obs.pop(), s = source.observerSlots.pop();
          if (index < obs.length) {
            n.sourceSlots[s] = index;
            obs[index] = n;
            source.observerSlots[index] = s;
          }
        }
      }
    }
    if (Transition && Transition.running && node.pure) {
      if (node.tOwned) {
        for (i = 0; i < node.tOwned.length; i++)
          cleanNode(node.tOwned[i]);
        delete node.tOwned;
      }
      reset(node, true);
    } else if (node.owned) {
      for (i = 0; i < node.owned.length; i++)
        cleanNode(node.owned[i]);
      node.owned = null;
    }
    if (node.cleanups) {
      for (i = 0; i < node.cleanups.length; i++)
        node.cleanups[i]();
      node.cleanups = null;
    }
    if (Transition && Transition.running)
      node.tState = 0;
    else
      node.state = 0;
    node.context = null;
  }
  function reset(node, top) {
    if (!top) {
      node.tState = 0;
      Transition.disposed.add(node);
    }
    if (node.owned) {
      for (let i = 0; i < node.owned.length; i++)
        reset(node.owned[i]);
    }
  }
  function castError(err) {
    if (err instanceof Error || typeof err === "string")
      return err;
    return new Error("Unknown error");
  }
  function handleError(err) {
    err = castError(err);
    const fns = ERROR && lookup(Owner, ERROR);
    if (!fns)
      throw err;
    for (const f of fns)
      f(err);
  }
  function lookup(owner, key) {
    return owner ? owner.context && owner.context[key] !== void 0 ? owner.context[key] : lookup(owner.owner, key) : void 0;
  }
  function resolveChildren(children2) {
    if (typeof children2 === "function" && !children2.length)
      return resolveChildren(children2());
    if (Array.isArray(children2)) {
      const results = [];
      for (let i = 0; i < children2.length; i++) {
        const result = resolveChildren(children2[i]);
        Array.isArray(result) ? results.push.apply(results, result) : results.push(result);
      }
      return results;
    }
    return children2;
  }
  function createProvider(id) {
    return function provider(props) {
      let res;
      createRenderEffect(() => res = untrack(() => {
        Owner.context = {
          [id]: props.value
        };
        return children(() => props.children);
      }));
      return res;
    };
  }
  function observable(input) {
    return {
      subscribe(observer) {
        if (!(observer instanceof Object) || observer == null) {
          throw new TypeError("Expected the observer to be an object.");
        }
        const handler = typeof observer === "function" ? observer : observer.next && observer.next.bind(observer);
        if (!handler) {
          return {
            unsubscribe() {
            }
          };
        }
        const dispose3 = createRoot((disposer) => {
          createEffect(() => {
            const v = input();
            untrack(() => handler(v));
          });
          return disposer;
        });
        if (getOwner())
          onCleanup(dispose3);
        return {
          unsubscribe() {
            dispose3();
          }
        };
      },
      [Symbol.observable || "@@observable"]() {
        return this;
      }
    };
  }
  function from(producer) {
    const [s, set] = createSignal(void 0, {
      equals: false
    });
    if ("subscribe" in producer) {
      const unsub = producer.subscribe((v) => set(() => v));
      onCleanup(() => "unsubscribe" in unsub ? unsub.unsubscribe() : unsub());
    } else {
      const clean = producer(set);
      onCleanup(clean);
    }
    return s;
  }
  var FALLBACK = Symbol("fallback");
  function dispose(d) {
    for (let i = 0; i < d.length; i++)
      d[i]();
  }
  function mapArray(list, mapFn, options = {}) {
    let items = [], mapped = [], disposers = [], len = 0, indexes = mapFn.length > 1 ? [] : null;
    onCleanup(() => dispose(disposers));
    return () => {
      let newItems = list() || [], i, j;
      newItems[$TRACK];
      return untrack(() => {
        let newLen = newItems.length, newIndices, newIndicesNext, temp, tempdisposers, tempIndexes, start2, end, newEnd, item;
        if (newLen === 0) {
          if (len !== 0) {
            dispose(disposers);
            disposers = [];
            items = [];
            mapped = [];
            len = 0;
            indexes && (indexes = []);
          }
          if (options.fallback) {
            items = [FALLBACK];
            mapped[0] = createRoot((disposer) => {
              disposers[0] = disposer;
              return options.fallback();
            });
            len = 1;
          }
        } else if (len === 0) {
          mapped = new Array(newLen);
          for (j = 0; j < newLen; j++) {
            items[j] = newItems[j];
            mapped[j] = createRoot(mapper);
          }
          len = newLen;
        } else {
          temp = new Array(newLen);
          tempdisposers = new Array(newLen);
          indexes && (tempIndexes = new Array(newLen));
          for (start2 = 0, end = Math.min(len, newLen); start2 < end && items[start2] === newItems[start2]; start2++)
            ;
          for (end = len - 1, newEnd = newLen - 1; end >= start2 && newEnd >= start2 && items[end] === newItems[newEnd]; end--, newEnd--) {
            temp[newEnd] = mapped[end];
            tempdisposers[newEnd] = disposers[end];
            indexes && (tempIndexes[newEnd] = indexes[end]);
          }
          newIndices = /* @__PURE__ */ new Map();
          newIndicesNext = new Array(newEnd + 1);
          for (j = newEnd; j >= start2; j--) {
            item = newItems[j];
            i = newIndices.get(item);
            newIndicesNext[j] = i === void 0 ? -1 : i;
            newIndices.set(item, j);
          }
          for (i = start2; i <= end; i++) {
            item = items[i];
            j = newIndices.get(item);
            if (j !== void 0 && j !== -1) {
              temp[j] = mapped[i];
              tempdisposers[j] = disposers[i];
              indexes && (tempIndexes[j] = indexes[i]);
              j = newIndicesNext[j];
              newIndices.set(item, j);
            } else
              disposers[i]();
          }
          for (j = start2; j < newLen; j++) {
            if (j in temp) {
              mapped[j] = temp[j];
              disposers[j] = tempdisposers[j];
              if (indexes) {
                indexes[j] = tempIndexes[j];
                indexes[j](j);
              }
            } else
              mapped[j] = createRoot(mapper);
          }
          mapped = mapped.slice(0, len = newLen);
          items = newItems.slice(0);
        }
        return mapped;
      });
      function mapper(disposer) {
        disposers[j] = disposer;
        if (indexes) {
          const [s, set] = createSignal(j);
          indexes[j] = set;
          return mapFn(newItems[j], s);
        }
        return mapFn(newItems[j]);
      }
    };
  }
  function indexArray(list, mapFn, options = {}) {
    let items = [], mapped = [], disposers = [], signals = [], len = 0, i;
    onCleanup(() => dispose(disposers));
    return () => {
      const newItems = list() || [];
      newItems[$TRACK];
      return untrack(() => {
        if (newItems.length === 0) {
          if (len !== 0) {
            dispose(disposers);
            disposers = [];
            items = [];
            mapped = [];
            len = 0;
            signals = [];
          }
          if (options.fallback) {
            items = [FALLBACK];
            mapped[0] = createRoot((disposer) => {
              disposers[0] = disposer;
              return options.fallback();
            });
            len = 1;
          }
          return mapped;
        }
        if (items[0] === FALLBACK) {
          disposers[0]();
          disposers = [];
          items = [];
          mapped = [];
          len = 0;
        }
        for (i = 0; i < newItems.length; i++) {
          if (i < items.length && items[i] !== newItems[i]) {
            signals[i](() => newItems[i]);
          } else if (i >= items.length) {
            mapped[i] = createRoot(mapper);
          }
        }
        for (; i < items.length; i++) {
          disposers[i]();
        }
        len = signals.length = disposers.length = newItems.length;
        items = newItems.slice(0);
        return mapped = mapped.slice(0, len);
      });
      function mapper(disposer) {
        disposers[i] = disposer;
        const [s, set] = createSignal(newItems[i]);
        signals[i] = set;
        return mapFn(s, i);
      }
    };
  }
  var hydrationEnabled = false;
  function enableHydration() {
    hydrationEnabled = true;
  }
  function createComponent(Comp, props) {
    if (hydrationEnabled) {
      if (sharedConfig.context) {
        const c = sharedConfig.context;
        setHydrateContext(nextHydrateContext());
        const r = untrack(() => Comp(props || {}));
        setHydrateContext(c);
        return r;
      }
    }
    return untrack(() => Comp(props || {}));
  }
  function trueFn() {
    return true;
  }
  var propTraps = {
    get(_, property, receiver) {
      if (property === $PROXY)
        return receiver;
      return _.get(property);
    },
    has(_, property) {
      return _.has(property);
    },
    set: trueFn,
    deleteProperty: trueFn,
    getOwnPropertyDescriptor(_, property) {
      return {
        configurable: true,
        enumerable: true,
        get() {
          return _.get(property);
        },
        set: trueFn,
        deleteProperty: trueFn
      };
    },
    ownKeys(_) {
      return _.keys();
    }
  };
  function resolveSource(s) {
    return (s = typeof s === "function" ? s() : s) == null ? {} : s;
  }
  function mergeProps(...sources) {
    return new Proxy({
      get(property) {
        for (let i = sources.length - 1; i >= 0; i--) {
          const v = resolveSource(sources[i])[property];
          if (v !== void 0)
            return v;
        }
      },
      has(property) {
        for (let i = sources.length - 1; i >= 0; i--) {
          if (property in resolveSource(sources[i]))
            return true;
        }
        return false;
      },
      keys() {
        const keys = [];
        for (let i = 0; i < sources.length; i++)
          keys.push(...Object.keys(resolveSource(sources[i])));
        return [...new Set(keys)];
      }
    }, propTraps);
  }
  function splitProps(props, ...keys) {
    const blocked = new Set(keys.flat());
    const descriptors = Object.getOwnPropertyDescriptors(props);
    const res = keys.map((k) => {
      const clone = {};
      for (let i = 0; i < k.length; i++) {
        const key = k[i];
        Object.defineProperty(clone, key, descriptors[key] ? descriptors[key] : {
          get() {
            return props[key];
          },
          set() {
            return true;
          }
        });
      }
      return clone;
    });
    res.push(new Proxy({
      get(property) {
        return blocked.has(property) ? void 0 : props[property];
      },
      has(property) {
        return blocked.has(property) ? false : property in props;
      },
      keys() {
        return Object.keys(props).filter((k) => !blocked.has(k));
      }
    }, propTraps));
    return res;
  }
  function lazy(fn) {
    let comp;
    let p;
    const wrap3 = (props) => {
      const ctx = sharedConfig.context;
      if (ctx) {
        const [s, set] = createSignal();
        (p || (p = fn())).then((mod) => {
          setHydrateContext(ctx);
          set(() => mod.default);
          setHydrateContext();
        });
        comp = s;
      } else if (!comp) {
        const [s] = createResource(() => (p || (p = fn())).then((mod) => mod.default));
        comp = s;
      } else {
        const c = comp();
        if (c)
          return c(props);
      }
      let Comp;
      return createMemo(() => (Comp = comp()) && untrack(() => {
        if (!ctx)
          return Comp(props);
        const c = sharedConfig.context;
        setHydrateContext(ctx);
        const r = Comp(props);
        setHydrateContext(c);
        return r;
      }));
    };
    wrap3.preload = () => p || ((p = fn()).then((mod) => comp = () => mod.default), p);
    return wrap3;
  }
  var counter = 0;
  function createUniqueId() {
    const ctx = sharedConfig.context;
    return ctx ? `${ctx.id}${ctx.count++}` : `cl-${counter++}`;
  }
  function For(props) {
    const fallback = "fallback" in props && {
      fallback: () => props.fallback
    };
    return createMemo(mapArray(() => props.each, props.children, fallback ? fallback : void 0));
  }
  function Index(props) {
    const fallback = "fallback" in props && {
      fallback: () => props.fallback
    };
    return createMemo(indexArray(() => props.each, props.children, fallback ? fallback : void 0));
  }
  function Show(props) {
    let strictEqual = false;
    const keyed = props.keyed;
    const condition = createMemo(() => props.when, void 0, {
      equals: (a, b) => strictEqual ? a === b : !a === !b
    });
    return createMemo(() => {
      const c = condition();
      if (c) {
        const child = props.children;
        const fn = typeof child === "function" && child.length > 0;
        strictEqual = keyed || fn;
        return fn ? untrack(() => child(c)) : child;
      }
      return props.fallback;
    });
  }
  function Switch(props) {
    let strictEqual = false;
    let keyed = false;
    const conditions = children(() => props.children), evalConditions = createMemo(() => {
      let conds = conditions();
      if (!Array.isArray(conds))
        conds = [conds];
      for (let i = 0; i < conds.length; i++) {
        const c = conds[i].when;
        if (c) {
          keyed = !!conds[i].keyed;
          return [i, c, conds[i]];
        }
      }
      return [-1];
    }, void 0, {
      equals: (a, b) => a[0] === b[0] && (strictEqual ? a[1] === b[1] : !a[1] === !b[1]) && a[2] === b[2]
    });
    return createMemo(() => {
      const [index, when, cond] = evalConditions();
      if (index < 0)
        return props.fallback;
      const c = cond.children;
      const fn = typeof c === "function" && c.length > 0;
      strictEqual = keyed || fn;
      return fn ? untrack(() => c(when)) : c;
    });
  }
  function Match(props) {
    return props;
  }
  var Errors;
  function resetErrorBoundaries() {
    Errors && [...Errors].forEach((fn) => fn());
  }
  function ErrorBoundary(props) {
    let err;
    let v;
    if (sharedConfig.context && sharedConfig.load && (v = sharedConfig.load(sharedConfig.context.id + sharedConfig.context.count)))
      err = v[0];
    const [errored, setErrored] = createSignal(err);
    Errors || (Errors = /* @__PURE__ */ new Set());
    Errors.add(setErrored);
    onCleanup(() => Errors.delete(setErrored));
    return createMemo(() => {
      let e;
      if (e = errored()) {
        const f = props.fallback;
        const res = typeof f === "function" && f.length ? untrack(() => f(e, () => setErrored())) : f;
        onError(setErrored);
        return res;
      }
      onError(setErrored);
      return props.children;
    });
  }
  var suspenseListEquals = (a, b) => a.showContent === b.showContent && a.showFallback === b.showFallback;
  var SuspenseListContext = createContext();
  function SuspenseList(props) {
    let [wrapper, setWrapper] = createSignal(() => ({
      inFallback: false
    })), show;
    const listContext = useContext(SuspenseListContext);
    const [registry, setRegistry] = createSignal([]);
    if (listContext) {
      show = listContext.register(createMemo(() => wrapper()().inFallback));
    }
    const resolved = createMemo((prev) => {
      const reveal = props.revealOrder, tail = props.tail, {
        showContent = true,
        showFallback = true
      } = show ? show() : {}, reg = registry(), reverse = reveal === "backwards";
      if (reveal === "together") {
        const all = reg.every((inFallback2) => !inFallback2());
        const res2 = reg.map(() => ({
          showContent: all && showContent,
          showFallback
        }));
        res2.inFallback = !all;
        return res2;
      }
      let stop = false;
      let inFallback = prev.inFallback;
      const res = [];
      for (let i = 0, len = reg.length; i < len; i++) {
        const n = reverse ? len - i - 1 : i, s = reg[n]();
        if (!stop && !s) {
          res[n] = {
            showContent,
            showFallback
          };
        } else {
          const next = !stop;
          if (next)
            inFallback = true;
          res[n] = {
            showContent: next,
            showFallback: !tail || next && tail === "collapsed" ? showFallback : false
          };
          stop = true;
        }
      }
      if (!stop)
        inFallback = false;
      res.inFallback = inFallback;
      return res;
    }, {
      inFallback: false
    });
    setWrapper(() => resolved);
    return createComponent(SuspenseListContext.Provider, {
      value: {
        register: (inFallback) => {
          let index;
          setRegistry((registry2) => {
            index = registry2.length;
            return [...registry2, inFallback];
          });
          return createMemo(() => resolved()[index], void 0, {
            equals: suspenseListEquals
          });
        }
      },
      get children() {
        return props.children;
      }
    });
  }
  function Suspense(props) {
    let counter2 = 0, show, ctx, p, flicker, error;
    const [inFallback, setFallback] = createSignal(false), SuspenseContext2 = getSuspenseContext(), store = {
      increment: () => {
        if (++counter2 === 1)
          setFallback(true);
      },
      decrement: () => {
        if (--counter2 === 0)
          setFallback(false);
      },
      inFallback,
      effects: [],
      resolved: false
    }, owner = getOwner();
    if (sharedConfig.context && sharedConfig.load) {
      const key = sharedConfig.context.id + sharedConfig.context.count;
      let ref = sharedConfig.load(key);
      if (ref && (p = ref[0]) && p !== "$$f") {
        if (typeof p !== "object" || !("then" in p))
          p = Promise.resolve(p);
        const [s, set] = createSignal(void 0, {
          equals: false
        });
        flicker = s;
        p.then((err) => {
          if (err || sharedConfig.done) {
            err && (error = err);
            return set();
          }
          sharedConfig.gather(key);
          setHydrateContext(ctx);
          set();
          setHydrateContext();
        });
      }
    }
    const listContext = useContext(SuspenseListContext);
    if (listContext)
      show = listContext.register(store.inFallback);
    let dispose3;
    onCleanup(() => dispose3 && dispose3());
    return createComponent(SuspenseContext2.Provider, {
      value: store,
      get children() {
        return createMemo(() => {
          if (error)
            throw error;
          ctx = sharedConfig.context;
          if (flicker) {
            flicker();
            return flicker = void 0;
          }
          if (ctx && p === "$$f")
            setHydrateContext();
          const rendered = createMemo(() => props.children);
          return createMemo((prev) => {
            const inFallback2 = store.inFallback(), {
              showContent = true,
              showFallback = true
            } = show ? show() : {};
            if ((!inFallback2 || p && p !== "$$f") && showContent) {
              store.resolved = true;
              dispose3 && dispose3();
              dispose3 = ctx = p = void 0;
              resumeEffects(store.effects);
              return rendered();
            }
            if (!showFallback)
              return;
            if (dispose3)
              return prev;
            return createRoot((disposer) => {
              dispose3 = disposer;
              if (ctx) {
                setHydrateContext({
                  id: ctx.id + "f",
                  count: 0
                });
                ctx = void 0;
              }
              return props.fallback;
            }, owner);
          });
        });
      }
    });
  }
  var DEV;

  // ../../node_modules/.pnpm/solid-js@1.5.7/node_modules/solid-js/store/dist/store.js
  var store_exports = {};
  __export(store_exports, {
    $RAW: () => $RAW,
    createMutable: () => createMutable,
    createStore: () => createStore,
    modifyMutable: () => modifyMutable,
    produce: () => produce,
    reconcile: () => reconcile,
    unwrap: () => unwrap
  });
  var $RAW = Symbol("store-raw");
  var $NODE = Symbol("store-node");
  var $NAME = Symbol("store-name");
  function wrap$1(value, name) {
    let p = value[$PROXY];
    if (!p) {
      Object.defineProperty(value, $PROXY, {
        value: p = new Proxy(value, proxyTraps$1)
      });
      if (!Array.isArray(value)) {
        const keys = Object.keys(value), desc = Object.getOwnPropertyDescriptors(value);
        for (let i = 0, l = keys.length; i < l; i++) {
          const prop = keys[i];
          if (desc[prop].get) {
            const get = desc[prop].get.bind(p);
            Object.defineProperty(value, prop, {
              get
            });
          }
        }
      }
    }
    return p;
  }
  function isWrappable(obj) {
    let proto;
    return obj != null && typeof obj === "object" && (obj[$PROXY] || !(proto = Object.getPrototypeOf(obj)) || proto === Object.prototype || Array.isArray(obj));
  }
  function unwrap(item, set = /* @__PURE__ */ new Set()) {
    let result, unwrapped, v, prop;
    if (result = item != null && item[$RAW])
      return result;
    if (!isWrappable(item) || set.has(item))
      return item;
    if (Array.isArray(item)) {
      if (Object.isFrozen(item))
        item = item.slice(0);
      else
        set.add(item);
      for (let i = 0, l = item.length; i < l; i++) {
        v = item[i];
        if ((unwrapped = unwrap(v, set)) !== v)
          item[i] = unwrapped;
      }
    } else {
      if (Object.isFrozen(item))
        item = Object.assign({}, item);
      else
        set.add(item);
      const keys = Object.keys(item), desc = Object.getOwnPropertyDescriptors(item);
      for (let i = 0, l = keys.length; i < l; i++) {
        prop = keys[i];
        if (desc[prop].get)
          continue;
        v = item[prop];
        if ((unwrapped = unwrap(v, set)) !== v)
          item[prop] = unwrapped;
      }
    }
    return item;
  }
  function getDataNodes(target) {
    let nodes = target[$NODE];
    if (!nodes)
      Object.defineProperty(target, $NODE, {
        value: nodes = {}
      });
    return nodes;
  }
  function getDataNode(nodes, property, value) {
    return nodes[property] || (nodes[property] = createDataNode(value));
  }
  function proxyDescriptor(target, property) {
    const desc = Reflect.getOwnPropertyDescriptor(target, property);
    if (!desc || desc.get || !desc.configurable || property === $PROXY || property === $NODE || property === $NAME)
      return desc;
    delete desc.value;
    delete desc.writable;
    desc.get = () => target[$PROXY][property];
    return desc;
  }
  function trackSelf(target) {
    if (getListener()) {
      const nodes = getDataNodes(target);
      (nodes._ || (nodes._ = createDataNode()))();
    }
  }
  function ownKeys(target) {
    trackSelf(target);
    return Reflect.ownKeys(target);
  }
  function createDataNode(value) {
    const [s, set] = createSignal(value, {
      equals: false,
      internal: true
    });
    s.$ = set;
    return s;
  }
  var proxyTraps$1 = {
    get(target, property, receiver) {
      if (property === $RAW)
        return target;
      if (property === $PROXY)
        return receiver;
      if (property === $TRACK) {
        trackSelf(target);
        return receiver;
      }
      const nodes = getDataNodes(target);
      const tracked = nodes.hasOwnProperty(property);
      let value = tracked ? nodes[property]() : target[property];
      if (property === $NODE || property === "__proto__")
        return value;
      if (!tracked) {
        const desc = Object.getOwnPropertyDescriptor(target, property);
        if (getListener() && (typeof value !== "function" || target.hasOwnProperty(property)) && !(desc && desc.get))
          value = getDataNode(nodes, property, value)();
      }
      return isWrappable(value) ? wrap$1(value) : value;
    },
    has(target, property) {
      if (property === $RAW || property === $PROXY || property === $TRACK || property === $NODE || property === "__proto__")
        return true;
      const tracked = getDataNodes(target)[property];
      tracked && tracked();
      return property in target;
    },
    set() {
      return true;
    },
    deleteProperty() {
      return true;
    },
    ownKeys,
    getOwnPropertyDescriptor: proxyDescriptor
  };
  function setProperty(state, property, value, deleting = false) {
    if (!deleting && state[property] === value)
      return;
    const prev = state[property];
    const len = state.length;
    if (value === void 0) {
      delete state[property];
    } else
      state[property] = value;
    let nodes = getDataNodes(state), node;
    if (node = getDataNode(nodes, property, prev))
      node.$(() => value);
    if (Array.isArray(state) && state.length !== len)
      (node = getDataNode(nodes, "length", len)) && node.$(state.length);
    (node = nodes._) && node.$();
  }
  function mergeStoreNode(state, value) {
    const keys = Object.keys(value);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      setProperty(state, key, value[key]);
    }
  }
  function updateArray(current, next) {
    if (typeof next === "function")
      next = next(current);
    next = unwrap(next);
    if (Array.isArray(next)) {
      if (current === next)
        return;
      let i = 0, len = next.length;
      for (; i < len; i++) {
        const value = next[i];
        if (current[i] !== value)
          setProperty(current, i, value);
      }
      setProperty(current, "length", len);
    } else
      mergeStoreNode(current, next);
  }
  function updatePath(current, path, traversed = []) {
    let part, prev = current;
    if (path.length > 1) {
      part = path.shift();
      const partType = typeof part, isArray = Array.isArray(current);
      if (Array.isArray(part)) {
        for (let i = 0; i < part.length; i++) {
          updatePath(current, [part[i]].concat(path), traversed);
        }
        return;
      } else if (isArray && partType === "function") {
        for (let i = 0; i < current.length; i++) {
          if (part(current[i], i))
            updatePath(current, [i].concat(path), traversed);
        }
        return;
      } else if (isArray && partType === "object") {
        const {
          from: from2 = 0,
          to = current.length - 1,
          by = 1
        } = part;
        for (let i = from2; i <= to; i += by) {
          updatePath(current, [i].concat(path), traversed);
        }
        return;
      } else if (path.length > 1) {
        updatePath(current[part], path, [part].concat(traversed));
        return;
      }
      prev = current[part];
      traversed = [part].concat(traversed);
    }
    let value = path[0];
    if (typeof value === "function") {
      value = value(prev, traversed);
      if (value === prev)
        return;
    }
    if (part === void 0 && value == void 0)
      return;
    value = unwrap(value);
    if (part === void 0 || isWrappable(prev) && isWrappable(value) && !Array.isArray(value)) {
      mergeStoreNode(prev, value);
    } else
      setProperty(current, part, value);
  }
  function createStore(...[store, options]) {
    const unwrappedStore = unwrap(store || {});
    const isArray = Array.isArray(unwrappedStore);
    const wrappedStore = wrap$1(unwrappedStore);
    function setStore(...args) {
      batch(() => {
        isArray && args.length === 1 ? updateArray(unwrappedStore, args[0]) : updatePath(unwrappedStore, args);
      });
    }
    return [wrappedStore, setStore];
  }
  var proxyTraps = {
    get(target, property, receiver) {
      if (property === $RAW)
        return target;
      if (property === $PROXY)
        return receiver;
      if (property === $TRACK) {
        trackSelf(target);
        return receiver;
      }
      const nodes = getDataNodes(target);
      const tracked = nodes.hasOwnProperty(property);
      let value = tracked ? nodes[property]() : target[property];
      if (property === $NODE || property === "__proto__")
        return value;
      if (!tracked) {
        const desc = Object.getOwnPropertyDescriptor(target, property);
        const isFunction = typeof value === "function";
        if (getListener() && (!isFunction || target.hasOwnProperty(property)) && !(desc && desc.get))
          value = getDataNode(nodes, property, value)();
        else if (value != null && isFunction && value === Array.prototype[property]) {
          return (...args) => batch(() => Array.prototype[property].apply(receiver, args));
        }
      }
      return isWrappable(value) ? wrap(value) : value;
    },
    has(target, property) {
      if (property === $RAW || property === $PROXY || property === $TRACK || property === $NODE || property === "__proto__")
        return true;
      const tracked = getDataNodes(target)[property];
      tracked && tracked();
      return property in target;
    },
    set(target, property, value) {
      batch(() => setProperty(target, property, unwrap(value)));
      return true;
    },
    deleteProperty(target, property) {
      batch(() => setProperty(target, property, void 0, true));
      return true;
    },
    ownKeys,
    getOwnPropertyDescriptor: proxyDescriptor
  };
  function wrap(value, name) {
    let p = value[$PROXY];
    if (!p) {
      Object.defineProperty(value, $PROXY, {
        value: p = new Proxy(value, proxyTraps)
      });
      const keys = Object.keys(value), desc = Object.getOwnPropertyDescriptors(value);
      for (let i = 0, l = keys.length; i < l; i++) {
        const prop = keys[i];
        if (desc[prop].get) {
          const get = desc[prop].get.bind(p);
          Object.defineProperty(value, prop, {
            get
          });
        }
        if (desc[prop].set) {
          const og = desc[prop].set, set = (v) => batch(() => og.call(p, v));
          Object.defineProperty(value, prop, {
            set
          });
        }
      }
    }
    return p;
  }
  function createMutable(state, options) {
    const unwrappedStore = unwrap(state || {});
    const wrappedStore = wrap(unwrappedStore);
    return wrappedStore;
  }
  function modifyMutable(state, modifier) {
    batch(() => modifier(unwrap(state)));
  }
  var $ROOT = Symbol("store-root");
  function applyState(target, parent, property, merge, key) {
    const previous = parent[property];
    if (target === previous)
      return;
    if (!isWrappable(target) || !isWrappable(previous) || key && target[key] !== previous[key]) {
      if (target !== previous) {
        if (property === $ROOT)
          return target;
        setProperty(parent, property, target);
      }
      return;
    }
    if (Array.isArray(target)) {
      if (target.length && previous.length && (!merge || key && target[0][key] != null)) {
        let i, j, start2, end, newEnd, item, newIndicesNext, keyVal;
        for (start2 = 0, end = Math.min(previous.length, target.length); start2 < end && (previous[start2] === target[start2] || key && previous[start2][key] === target[start2][key]); start2++) {
          applyState(target[start2], previous, start2, merge, key);
        }
        const temp = new Array(target.length), newIndices = /* @__PURE__ */ new Map();
        for (end = previous.length - 1, newEnd = target.length - 1; end >= start2 && newEnd >= start2 && (previous[end] === target[newEnd] || key && previous[end][key] === target[newEnd][key]); end--, newEnd--) {
          temp[newEnd] = previous[end];
        }
        if (start2 > newEnd || start2 > end) {
          for (j = start2; j <= newEnd; j++)
            setProperty(previous, j, target[j]);
          for (; j < target.length; j++) {
            setProperty(previous, j, temp[j]);
            applyState(target[j], previous, j, merge, key);
          }
          if (previous.length > target.length)
            setProperty(previous, "length", target.length);
          return;
        }
        newIndicesNext = new Array(newEnd + 1);
        for (j = newEnd; j >= start2; j--) {
          item = target[j];
          keyVal = key ? item[key] : item;
          i = newIndices.get(keyVal);
          newIndicesNext[j] = i === void 0 ? -1 : i;
          newIndices.set(keyVal, j);
        }
        for (i = start2; i <= end; i++) {
          item = previous[i];
          keyVal = key ? item[key] : item;
          j = newIndices.get(keyVal);
          if (j !== void 0 && j !== -1) {
            temp[j] = previous[i];
            j = newIndicesNext[j];
            newIndices.set(keyVal, j);
          }
        }
        for (j = start2; j < target.length; j++) {
          if (j in temp) {
            setProperty(previous, j, temp[j]);
            applyState(target[j], previous, j, merge, key);
          } else
            setProperty(previous, j, target[j]);
        }
      } else {
        for (let i = 0, len = target.length; i < len; i++) {
          applyState(target[i], previous, i, merge, key);
        }
      }
      if (previous.length > target.length)
        setProperty(previous, "length", target.length);
      return;
    }
    const targetKeys = Object.keys(target);
    for (let i = 0, len = targetKeys.length; i < len; i++) {
      applyState(target[targetKeys[i]], previous, targetKeys[i], merge, key);
    }
    const previousKeys = Object.keys(previous);
    for (let i = 0, len = previousKeys.length; i < len; i++) {
      if (target[previousKeys[i]] === void 0)
        setProperty(previous, previousKeys[i], void 0);
    }
  }
  function reconcile(value, options = {}) {
    const {
      merge,
      key = "id"
    } = options, v = unwrap(value);
    return (state) => {
      if (!isWrappable(state) || !isWrappable(v))
        return v;
      const res = applyState(v, {
        [$ROOT]: state
      }, $ROOT, merge, key);
      return res === void 0 ? state : res;
    };
  }
  var producers = /* @__PURE__ */ new WeakMap();
  var setterTraps = {
    get(target, property) {
      if (property === $RAW)
        return target;
      const value = target[property];
      let proxy;
      return isWrappable(value) ? producers.get(value) || (producers.set(value, proxy = new Proxy(value, setterTraps)), proxy) : value;
    },
    set(target, property, value) {
      setProperty(target, property, unwrap(value));
      return true;
    },
    deleteProperty(target, property) {
      setProperty(target, property, void 0, true);
      return true;
    }
  };
  function produce(fn) {
    return (state) => {
      if (isWrappable(state)) {
        let proxy;
        if (!(proxy = producers.get(state))) {
          producers.set(state, proxy = new Proxy(state, setterTraps));
        }
        fn(proxy);
      }
      return state;
    };
  }

  // ../../node_modules/.pnpm/solid-js@1.5.7/node_modules/solid-js/web/dist/web.js
  var web_exports = {};
  __export(web_exports, {
    Aliases: () => Aliases,
    Assets: () => voidFn,
    ChildProperties: () => ChildProperties,
    DOMElements: () => DOMElements,
    DelegatedEvents: () => DelegatedEvents,
    Dynamic: () => Dynamic,
    ErrorBoundary: () => ErrorBoundary,
    For: () => For,
    HydrationScript: () => voidFn,
    Index: () => Index,
    Match: () => Match,
    NoHydration: () => NoHydration,
    Portal: () => Portal,
    PropAliases: () => PropAliases,
    Properties: () => Properties,
    SVGElements: () => SVGElements,
    SVGNamespace: () => SVGNamespace,
    Show: () => Show,
    Suspense: () => Suspense,
    SuspenseList: () => SuspenseList,
    Switch: () => Switch,
    addEventListener: () => addEventListener,
    assign: () => assign,
    classList: () => classList,
    className: () => className,
    clearDelegatedEvents: () => clearDelegatedEvents,
    createComponent: () => createComponent,
    delegateEvents: () => delegateEvents,
    dynamicProperty: () => dynamicProperty,
    effect: () => createRenderEffect,
    escape: () => escape,
    generateHydrationScript: () => voidFn,
    getAssets: () => voidFn,
    getHydrationKey: () => getHydrationKey,
    getNextElement: () => getNextElement,
    getNextMarker: () => getNextMarker,
    getNextMatch: () => getNextMatch,
    getOwner: () => getOwner,
    hydrate: () => hydrate,
    innerHTML: () => innerHTML,
    insert: () => insert,
    isServer: () => isServer,
    memo: () => memo,
    mergeProps: () => mergeProps,
    render: () => render,
    renderToStream: () => renderToStream,
    renderToString: () => renderToString,
    renderToStringAsync: () => renderToStringAsync,
    resolveSSRNode: () => resolveSSRNode,
    runHydrationEvents: () => runHydrationEvents,
    setAttribute: () => setAttribute,
    setAttributeNS: () => setAttributeNS,
    spread: () => spread,
    ssr: () => ssr,
    ssrAttribute: () => ssrAttribute,
    ssrClassList: () => ssrClassList,
    ssrElement: () => ssrElement,
    ssrHydrationKey: () => ssrHydrationKey,
    ssrSpread: () => ssrSpread,
    ssrStyle: () => ssrStyle,
    style: () => style,
    template: () => template,
    untrack: () => untrack,
    use: () => use,
    useAssets: () => voidFn
  });
  var booleans = ["allowfullscreen", "async", "autofocus", "autoplay", "checked", "controls", "default", "disabled", "formnovalidate", "hidden", "indeterminate", "ismap", "loop", "multiple", "muted", "nomodule", "novalidate", "open", "playsinline", "readonly", "required", "reversed", "seamless", "selected"];
  var Properties = /* @__PURE__ */ new Set(["className", "value", "readOnly", "formNoValidate", "isMap", "noModule", "playsInline", ...booleans]);
  var ChildProperties = /* @__PURE__ */ new Set(["innerHTML", "textContent", "innerText", "children"]);
  var Aliases = {
    className: "class",
    htmlFor: "for"
  };
  var PropAliases = {
    class: "className",
    formnovalidate: "formNoValidate",
    ismap: "isMap",
    nomodule: "noModule",
    playsinline: "playsInline",
    readonly: "readOnly"
  };
  var DelegatedEvents = /* @__PURE__ */ new Set(["beforeinput", "click", "dblclick", "contextmenu", "focusin", "focusout", "input", "keydown", "keyup", "mousedown", "mousemove", "mouseout", "mouseover", "mouseup", "pointerdown", "pointermove", "pointerout", "pointerover", "pointerup", "touchend", "touchmove", "touchstart"]);
  var SVGElements = /* @__PURE__ */ new Set([
    "altGlyph",
    "altGlyphDef",
    "altGlyphItem",
    "animate",
    "animateColor",
    "animateMotion",
    "animateTransform",
    "circle",
    "clipPath",
    "color-profile",
    "cursor",
    "defs",
    "desc",
    "ellipse",
    "feBlend",
    "feColorMatrix",
    "feComponentTransfer",
    "feComposite",
    "feConvolveMatrix",
    "feDiffuseLighting",
    "feDisplacementMap",
    "feDistantLight",
    "feFlood",
    "feFuncA",
    "feFuncB",
    "feFuncG",
    "feFuncR",
    "feGaussianBlur",
    "feImage",
    "feMerge",
    "feMergeNode",
    "feMorphology",
    "feOffset",
    "fePointLight",
    "feSpecularLighting",
    "feSpotLight",
    "feTile",
    "feTurbulence",
    "filter",
    "font",
    "font-face",
    "font-face-format",
    "font-face-name",
    "font-face-src",
    "font-face-uri",
    "foreignObject",
    "g",
    "glyph",
    "glyphRef",
    "hkern",
    "image",
    "line",
    "linearGradient",
    "marker",
    "mask",
    "metadata",
    "missing-glyph",
    "mpath",
    "path",
    "pattern",
    "polygon",
    "polyline",
    "radialGradient",
    "rect",
    "set",
    "stop",
    "svg",
    "switch",
    "symbol",
    "text",
    "textPath",
    "tref",
    "tspan",
    "use",
    "view",
    "vkern"
  ]);
  var SVGNamespace = {
    xlink: "http://www.w3.org/1999/xlink",
    xml: "http://www.w3.org/XML/1998/namespace"
  };
  var DOMElements = /* @__PURE__ */ new Set(["html", "base", "head", "link", "meta", "style", "title", "body", "address", "article", "aside", "footer", "header", "main", "nav", "section", "body", "blockquote", "dd", "div", "dl", "dt", "figcaption", "figure", "hr", "li", "ol", "p", "pre", "ul", "a", "abbr", "b", "bdi", "bdo", "br", "cite", "code", "data", "dfn", "em", "i", "kbd", "mark", "q", "rp", "rt", "ruby", "s", "samp", "small", "span", "strong", "sub", "sup", "time", "u", "var", "wbr", "area", "audio", "img", "map", "track", "video", "embed", "iframe", "object", "param", "picture", "portal", "source", "svg", "math", "canvas", "noscript", "script", "del", "ins", "caption", "col", "colgroup", "table", "tbody", "td", "tfoot", "th", "thead", "tr", "button", "datalist", "fieldset", "form", "input", "label", "legend", "meter", "optgroup", "option", "output", "progress", "select", "textarea", "details", "dialog", "menu", "summary", "details", "slot", "template", "acronym", "applet", "basefont", "bgsound", "big", "blink", "center", "content", "dir", "font", "frame", "frameset", "hgroup", "image", "keygen", "marquee", "menuitem", "nobr", "noembed", "noframes", "plaintext", "rb", "rtc", "shadow", "spacer", "strike", "tt", "xmp", "a", "abbr", "acronym", "address", "applet", "area", "article", "aside", "audio", "b", "base", "basefont", "bdi", "bdo", "bgsound", "big", "blink", "blockquote", "body", "br", "button", "canvas", "caption", "center", "cite", "code", "col", "colgroup", "content", "data", "datalist", "dd", "del", "details", "dfn", "dialog", "dir", "div", "dl", "dt", "em", "embed", "fieldset", "figcaption", "figure", "font", "footer", "form", "frame", "frameset", "head", "header", "hgroup", "hr", "html", "i", "iframe", "image", "img", "input", "ins", "kbd", "keygen", "label", "legend", "li", "link", "main", "map", "mark", "marquee", "menu", "menuitem", "meta", "meter", "nav", "nobr", "noembed", "noframes", "noscript", "object", "ol", "optgroup", "option", "output", "p", "param", "picture", "plaintext", "portal", "pre", "progress", "q", "rb", "rp", "rt", "rtc", "ruby", "s", "samp", "script", "section", "select", "shadow", "slot", "small", "source", "spacer", "span", "strike", "strong", "style", "sub", "summary", "sup", "table", "tbody", "td", "template", "textarea", "tfoot", "th", "thead", "time", "title", "tr", "track", "tt", "u", "ul", "var", "video", "wbr", "xmp", "input"]);
  function memo(fn, equals) {
    return createMemo(fn, void 0, !equals ? {
      equals
    } : void 0);
  }
  function reconcileArrays(parentNode, a, b) {
    let bLength = b.length, aEnd = a.length, bEnd = bLength, aStart = 0, bStart = 0, after2 = a[aEnd - 1].nextSibling, map = null;
    while (aStart < aEnd || bStart < bEnd) {
      if (a[aStart] === b[bStart]) {
        aStart++;
        bStart++;
        continue;
      }
      while (a[aEnd - 1] === b[bEnd - 1]) {
        aEnd--;
        bEnd--;
      }
      if (aEnd === aStart) {
        const node = bEnd < bLength ? bStart ? b[bStart - 1].nextSibling : b[bEnd - bStart] : after2;
        while (bStart < bEnd)
          parentNode.insertBefore(b[bStart++], node);
      } else if (bEnd === bStart) {
        while (aStart < aEnd) {
          if (!map || !map.has(a[aStart]))
            a[aStart].remove();
          aStart++;
        }
      } else if (a[aStart] === b[bEnd - 1] && b[bStart] === a[aEnd - 1]) {
        const node = a[--aEnd].nextSibling;
        parentNode.insertBefore(b[bStart++], a[aStart++].nextSibling);
        parentNode.insertBefore(b[--bEnd], node);
        a[aEnd] = b[bEnd];
      } else {
        if (!map) {
          map = /* @__PURE__ */ new Map();
          let i = bStart;
          while (i < bEnd)
            map.set(b[i], i++);
        }
        const index = map.get(a[aStart]);
        if (index != null) {
          if (bStart < index && index < bEnd) {
            let i = aStart, sequence = 1, t;
            while (++i < aEnd && i < bEnd) {
              if ((t = map.get(a[i])) == null || t !== index + sequence)
                break;
              sequence++;
            }
            if (sequence > index - bStart) {
              const node = a[aStart];
              while (bStart < index)
                parentNode.insertBefore(b[bStart++], node);
            } else
              parentNode.replaceChild(b[bStart++], a[aStart++]);
          } else
            aStart++;
        } else
          a[aStart++].remove();
      }
    }
  }
  var $$EVENTS = "_$DX_DELEGATE";
  function render(code, element, init) {
    let disposer;
    createRoot((dispose3) => {
      disposer = dispose3;
      element === document ? code() : insert(element, code(), element.firstChild ? null : void 0, init);
    });
    return () => {
      disposer();
      element.textContent = "";
    };
  }
  function template(html, check, isSVG) {
    const t = document.createElement("template");
    t.innerHTML = html;
    let node = t.content.firstChild;
    if (isSVG)
      node = node.firstChild;
    return node;
  }
  function delegateEvents(eventNames, document2 = window.document) {
    const e = document2[$$EVENTS] || (document2[$$EVENTS] = /* @__PURE__ */ new Set());
    for (let i = 0, l = eventNames.length; i < l; i++) {
      const name = eventNames[i];
      if (!e.has(name)) {
        e.add(name);
        document2.addEventListener(name, eventHandler);
      }
    }
  }
  function clearDelegatedEvents(document2 = window.document) {
    if (document2[$$EVENTS]) {
      for (let name of document2[$$EVENTS].keys())
        document2.removeEventListener(name, eventHandler);
      delete document2[$$EVENTS];
    }
  }
  function setAttribute(node, name, value) {
    if (value == null)
      node.removeAttribute(name);
    else
      node.setAttribute(name, value);
  }
  function setAttributeNS(node, namespace, name, value) {
    if (value == null)
      node.removeAttributeNS(namespace, name);
    else
      node.setAttributeNS(namespace, name, value);
  }
  function className(node, value) {
    if (value == null)
      node.removeAttribute("class");
    else
      node.className = value;
  }
  function addEventListener(node, name, handler, delegate) {
    if (delegate) {
      if (Array.isArray(handler)) {
        node[`$$${name}`] = handler[0];
        node[`$$${name}Data`] = handler[1];
      } else
        node[`$$${name}`] = handler;
    } else if (Array.isArray(handler)) {
      const handlerFn = handler[0];
      node.addEventListener(name, handler[0] = (e) => handlerFn.call(node, handler[1], e));
    } else
      node.addEventListener(name, handler);
  }
  function classList(node, value, prev = {}) {
    const classKeys = Object.keys(value || {}), prevKeys = Object.keys(prev);
    let i, len;
    for (i = 0, len = prevKeys.length; i < len; i++) {
      const key = prevKeys[i];
      if (!key || key === "undefined" || value[key])
        continue;
      toggleClassKey(node, key, false);
      delete prev[key];
    }
    for (i = 0, len = classKeys.length; i < len; i++) {
      const key = classKeys[i], classValue = !!value[key];
      if (!key || key === "undefined" || prev[key] === classValue || !classValue)
        continue;
      toggleClassKey(node, key, true);
      prev[key] = classValue;
    }
    return prev;
  }
  function style(node, value, prev) {
    if (!value)
      return prev ? setAttribute(node, "style") : value;
    const nodeStyle = node.style;
    if (typeof value === "string")
      return nodeStyle.cssText = value;
    typeof prev === "string" && (nodeStyle.cssText = prev = void 0);
    prev || (prev = {});
    value || (value = {});
    let v, s;
    for (s in prev) {
      value[s] == null && nodeStyle.removeProperty(s);
      delete prev[s];
    }
    for (s in value) {
      v = value[s];
      if (v !== prev[s]) {
        nodeStyle.setProperty(s, v);
        prev[s] = v;
      }
    }
    return prev;
  }
  function spread(node, accessor, isSVG, skipChildren) {
    if (typeof accessor === "function") {
      createRenderEffect((current) => spreadExpression(node, accessor(), current, isSVG, skipChildren));
    } else
      spreadExpression(node, accessor, void 0, isSVG, skipChildren);
  }
  function dynamicProperty(props, key) {
    const src = props[key];
    Object.defineProperty(props, key, {
      get() {
        return src();
      },
      enumerable: true
    });
    return props;
  }
  function innerHTML(parent, content) {
    !sharedConfig.context && (parent.innerHTML = content);
  }
  function use(fn, element, arg) {
    return untrack(() => fn(element, arg));
  }
  function insert(parent, accessor, marker, initial) {
    if (marker !== void 0 && !initial)
      initial = [];
    if (typeof accessor !== "function")
      return insertExpression(parent, accessor, initial, marker);
    createRenderEffect((current) => insertExpression(parent, accessor(), current, marker), initial);
  }
  function assign(node, props, isSVG, skipChildren, prevProps = {}, skipRef = false) {
    props || (props = {});
    for (const prop in prevProps) {
      if (!(prop in props)) {
        if (prop === "children")
          continue;
        prevProps[prop] = assignProp(node, prop, null, prevProps[prop], isSVG, skipRef);
      }
    }
    for (const prop in props) {
      if (prop === "children") {
        if (!skipChildren)
          insertExpression(node, props.children);
        continue;
      }
      const value = props[prop];
      prevProps[prop] = assignProp(node, prop, value, prevProps[prop], isSVG, skipRef);
    }
  }
  function hydrate$1(code, element, options = {}) {
    sharedConfig.completed = globalThis._$HY.completed;
    sharedConfig.events = globalThis._$HY.events;
    sharedConfig.load = globalThis._$HY.load;
    sharedConfig.gather = (root) => gatherHydratable(element, root);
    sharedConfig.registry = /* @__PURE__ */ new Map();
    sharedConfig.context = {
      id: options.renderId || "",
      count: 0
    };
    gatherHydratable(element, options.renderId);
    const dispose3 = render(code, element, [...element.childNodes]);
    sharedConfig.context = null;
    return dispose3;
  }
  function getNextElement(template2) {
    let node, key;
    if (!sharedConfig.context || !(node = sharedConfig.registry.get(key = getHydrationKey()))) {
      return template2.cloneNode(true);
    }
    if (sharedConfig.completed)
      sharedConfig.completed.add(node);
    sharedConfig.registry.delete(key);
    return node;
  }
  function getNextMatch(el, nodeName) {
    while (el && el.localName !== nodeName)
      el = el.nextSibling;
    return el;
  }
  function getNextMarker(start2) {
    let end = start2, count = 0, current = [];
    if (sharedConfig.context) {
      while (end) {
        if (end.nodeType === 8) {
          const v = end.nodeValue;
          if (v === "#")
            count++;
          else if (v === "/") {
            if (count === 0)
              return [end, current];
            count--;
          }
        }
        current.push(end);
        end = end.nextSibling;
      }
    }
    return [end, current];
  }
  function runHydrationEvents() {
    if (sharedConfig.events && !sharedConfig.events.queued) {
      queueMicrotask(() => {
        const {
          completed,
          events
        } = sharedConfig;
        events.queued = false;
        while (events.length) {
          const [el, e] = events[0];
          if (!completed.has(el))
            return;
          eventHandler(e);
          events.shift();
        }
      });
      sharedConfig.events.queued = true;
    }
  }
  function toPropertyName(name) {
    return name.toLowerCase().replace(/-([a-z])/g, (_, w) => w.toUpperCase());
  }
  function toggleClassKey(node, key, value) {
    const classNames = key.trim().split(/\s+/);
    for (let i = 0, nameLen = classNames.length; i < nameLen; i++)
      node.classList.toggle(classNames[i], value);
  }
  function assignProp(node, prop, value, prev, isSVG, skipRef) {
    let isCE, isProp, isChildProp;
    if (prop === "style")
      return style(node, value, prev);
    if (prop === "classList")
      return classList(node, value, prev);
    if (value === prev)
      return prev;
    if (prop === "ref") {
      if (!skipRef) {
        value(node);
      }
    } else if (prop.slice(0, 3) === "on:") {
      const e = prop.slice(3);
      prev && node.removeEventListener(e, prev);
      value && node.addEventListener(e, value);
    } else if (prop.slice(0, 10) === "oncapture:") {
      const e = prop.slice(10);
      prev && node.removeEventListener(e, prev, true);
      value && node.addEventListener(e, value, true);
    } else if (prop.slice(0, 2) === "on") {
      const name = prop.slice(2).toLowerCase();
      const delegate = DelegatedEvents.has(name);
      if (!delegate && prev) {
        const h = Array.isArray(prev) ? prev[0] : prev;
        node.removeEventListener(name, h);
      }
      if (delegate || value) {
        addEventListener(node, name, value, delegate);
        delegate && delegateEvents([name]);
      }
    } else if ((isChildProp = ChildProperties.has(prop)) || !isSVG && (PropAliases[prop] || (isProp = Properties.has(prop))) || (isCE = node.nodeName.includes("-"))) {
      if (prop === "class" || prop === "className")
        className(node, value);
      else if (isCE && !isProp && !isChildProp)
        node[toPropertyName(prop)] = value;
      else
        node[PropAliases[prop] || prop] = value;
    } else {
      const ns = isSVG && prop.indexOf(":") > -1 && SVGNamespace[prop.split(":")[0]];
      if (ns)
        setAttributeNS(node, ns, prop, value);
      else
        setAttribute(node, Aliases[prop] || prop, value);
    }
    return value;
  }
  function eventHandler(e) {
    const key = `$$${e.type}`;
    let node = e.composedPath && e.composedPath()[0] || e.target;
    if (e.target !== node) {
      Object.defineProperty(e, "target", {
        configurable: true,
        value: node
      });
    }
    Object.defineProperty(e, "currentTarget", {
      configurable: true,
      get() {
        return node || document;
      }
    });
    if (sharedConfig.registry && !sharedConfig.done) {
      sharedConfig.done = true;
      document.querySelectorAll("[id^=pl-]").forEach((elem) => elem.remove());
    }
    while (node !== null) {
      const handler = node[key];
      if (handler && !node.disabled) {
        const data = node[`${key}Data`];
        data !== void 0 ? handler.call(node, data, e) : handler.call(node, e);
        if (e.cancelBubble)
          return;
      }
      node = node.host && node.host !== node && node.host instanceof Node ? node.host : node.parentNode;
    }
  }
  function spreadExpression(node, props, prevProps = {}, isSVG, skipChildren) {
    props || (props = {});
    if (!skipChildren) {
      createRenderEffect(() => prevProps.children = insertExpression(node, props.children, prevProps.children));
    }
    createRenderEffect(() => props.ref && props.ref(node));
    createRenderEffect(() => assign(node, props, isSVG, true, prevProps, true));
    return prevProps;
  }
  function insertExpression(parent, value, current, marker, unwrapArray) {
    if (sharedConfig.context && !current)
      current = [...parent.childNodes];
    while (typeof current === "function")
      current = current();
    if (value === current)
      return current;
    const t = typeof value, multi = marker !== void 0;
    parent = multi && current[0] && current[0].parentNode || parent;
    if (t === "string" || t === "number") {
      if (sharedConfig.context)
        return current;
      if (t === "number")
        value = value.toString();
      if (multi) {
        let node = current[0];
        if (node && node.nodeType === 3) {
          node.data = value;
        } else
          node = document.createTextNode(value);
        current = cleanChildren(parent, current, marker, node);
      } else {
        if (current !== "" && typeof current === "string") {
          current = parent.firstChild.data = value;
        } else
          current = parent.textContent = value;
      }
    } else if (value == null || t === "boolean") {
      if (sharedConfig.context)
        return current;
      current = cleanChildren(parent, current, marker);
    } else if (t === "function") {
      createRenderEffect(() => {
        let v = value();
        while (typeof v === "function")
          v = v();
        current = insertExpression(parent, v, current, marker);
      });
      return () => current;
    } else if (Array.isArray(value)) {
      const array = [];
      const currentArray = current && Array.isArray(current);
      if (normalizeIncomingArray(array, value, current, unwrapArray)) {
        createRenderEffect(() => current = insertExpression(parent, array, current, marker, true));
        return () => current;
      }
      if (sharedConfig.context) {
        if (!array.length)
          return current;
        for (let i = 0; i < array.length; i++) {
          if (array[i].parentNode)
            return current = array;
        }
      }
      if (array.length === 0) {
        current = cleanChildren(parent, current, marker);
        if (multi)
          return current;
      } else if (currentArray) {
        if (current.length === 0) {
          appendNodes(parent, array, marker);
        } else
          reconcileArrays(parent, current, array);
      } else {
        current && cleanChildren(parent);
        appendNodes(parent, array);
      }
      current = array;
    } else if (value instanceof Node) {
      if (sharedConfig.context && value.parentNode)
        return current = multi ? [value] : value;
      if (Array.isArray(current)) {
        if (multi)
          return current = cleanChildren(parent, current, marker, value);
        cleanChildren(parent, current, null, value);
      } else if (current == null || current === "" || !parent.firstChild) {
        parent.appendChild(value);
      } else
        parent.replaceChild(value, parent.firstChild);
      current = value;
    } else
      ;
    return current;
  }
  function normalizeIncomingArray(normalized, array, current, unwrap3) {
    let dynamic = false;
    for (let i = 0, len = array.length; i < len; i++) {
      let item = array[i], prev = current && current[i];
      if (item instanceof Node) {
        normalized.push(item);
      } else if (item == null || item === true || item === false)
        ;
      else if (Array.isArray(item)) {
        dynamic = normalizeIncomingArray(normalized, item, prev) || dynamic;
      } else if (typeof item === "function") {
        if (unwrap3) {
          while (typeof item === "function")
            item = item();
          dynamic = normalizeIncomingArray(normalized, Array.isArray(item) ? item : [item], Array.isArray(prev) ? prev : [prev]) || dynamic;
        } else {
          normalized.push(item);
          dynamic = true;
        }
      } else {
        const value = String(item);
        if (prev && prev.nodeType === 3 && prev.data === value) {
          normalized.push(prev);
        } else
          normalized.push(document.createTextNode(value));
      }
    }
    return dynamic;
  }
  function appendNodes(parent, array, marker) {
    for (let i = 0, len = array.length; i < len; i++)
      parent.insertBefore(array[i], marker);
  }
  function cleanChildren(parent, current, marker, replacement) {
    if (marker === void 0)
      return parent.textContent = "";
    const node = replacement || document.createTextNode("");
    if (current.length) {
      let inserted = false;
      for (let i = current.length - 1; i >= 0; i--) {
        const el = current[i];
        if (node !== el) {
          const isParent = el.parentNode === parent;
          if (!inserted && !i)
            isParent ? parent.replaceChild(node, el) : parent.insertBefore(node, marker);
          else
            isParent && el.remove();
        } else
          inserted = true;
      }
    } else
      parent.insertBefore(node, marker);
    return [node];
  }
  function gatherHydratable(element, root) {
    const templates = element.querySelectorAll(`*[data-hk]`);
    for (let i = 0; i < templates.length; i++) {
      const node = templates[i];
      const key = node.getAttribute("data-hk");
      if ((!root || key.startsWith(root)) && !sharedConfig.registry.has(key))
        sharedConfig.registry.set(key, node);
    }
  }
  function getHydrationKey() {
    const hydrate2 = sharedConfig.context;
    return `${hydrate2.id}${hydrate2.count++}`;
  }
  function NoHydration(props) {
    return sharedConfig.context ? void 0 : props.children;
  }
  function voidFn() {
  }
  function throwInBrowser(func) {
    const err = new Error(`${func.name} is not supported in the browser, returning undefined`);
    console.error(err);
  }
  function renderToString(fn, options) {
    throwInBrowser(renderToString);
  }
  function renderToStringAsync(fn, options) {
    throwInBrowser(renderToStringAsync);
  }
  function renderToStream(fn, options) {
    throwInBrowser(renderToStream);
  }
  function ssr(template2, ...nodes) {
  }
  function ssrElement(name, props, children2, needsId) {
  }
  function ssrClassList(value) {
  }
  function ssrStyle(value) {
  }
  function ssrAttribute(key, value) {
  }
  function ssrHydrationKey() {
  }
  function resolveSSRNode(node) {
  }
  function escape(html) {
  }
  function ssrSpread(props, isSVG, skipChildren) {
  }
  var isServer = false;
  var SVG_NAMESPACE = "http://www.w3.org/2000/svg";
  function createElement(tagName, isSVG = false) {
    return isSVG ? document.createElementNS(SVG_NAMESPACE, tagName) : document.createElement(tagName);
  }
  var hydrate = (...args) => {
    enableHydration();
    return hydrate$1(...args);
  };
  function Portal(props) {
    const {
      useShadow
    } = props, marker = document.createTextNode(""), mount = props.mount || document.body;
    function renderPortal() {
      if (sharedConfig.context) {
        const [s, set] = createSignal(false);
        queueMicrotask(() => set(true));
        return () => s() && props.children;
      } else
        return () => props.children;
    }
    if (mount instanceof HTMLHeadElement) {
      const [clean, setClean] = createSignal(false);
      const cleanup = () => setClean(true);
      createRoot((dispose3) => insert(mount, () => !clean() ? renderPortal()() : dispose3(), null));
      onCleanup(() => {
        if (sharedConfig.context)
          queueMicrotask(cleanup);
        else
          cleanup();
      });
    } else {
      const container = createElement(props.isSVG ? "g" : "div", props.isSVG), renderRoot = useShadow && container.attachShadow ? container.attachShadow({
        mode: "open"
      }) : container;
      Object.defineProperty(container, "host", {
        get() {
          return marker.parentNode;
        }
      });
      insert(renderRoot, renderPortal());
      mount.appendChild(container);
      props.ref && props.ref(container);
      onCleanup(() => mount.removeChild(container));
    }
    return marker;
  }
  function Dynamic(props) {
    const [p, others] = splitProps(props, ["component"]);
    const cached = createMemo(() => p.component);
    return createMemo(() => {
      const component = cached();
      switch (typeof component) {
        case "function":
          return untrack(() => component(others));
        case "string":
          const isSvg = SVGElements.has(component);
          const el = sharedConfig.context ? getNextElement() : createElement(component, isSvg);
          spread(el, others, isSvg);
          return el;
      }
    });
  }

  // ../shelter-ui/src/index.tsx
  var src_exports = {};
  __export(src_exports, {
    Button: () => Button,
    ButtonColors: () => ButtonColors,
    ButtonLooks: () => ButtonLooks,
    ButtonSizes: () => ButtonSizes,
    Checkbox: () => Checkbox,
    CheckboxItem: () => CheckboxItem,
    Divider: () => Divider,
    Header: () => Header,
    HeaderTags: () => HeaderTags,
    IconAdd: () => IconAdd,
    IconBin: () => IconBin,
    IconClose: () => IconClose,
    ModalBody: () => ModalBody,
    ModalConfirmFooter: () => ModalConfirmFooter,
    ModalFooter: () => ModalFooter,
    ModalHeader: () => ModalHeader,
    ModalRoot: () => ModalRoot2,
    ModalSizes: () => ModalSizes,
    Space: () => Space,
    Switch: () => Switch2,
    SwitchItem: () => SwitchItem,
    Text: () => Text,
    TextArea: () => TextArea,
    TextBox: () => TextBox,
    cleanupCss: () => cleanupCss,
    genId: () => genId,
    injectCss: () => injectCss,
    openConfirmationModal: () => openConfirmationModal,
    openModal: () => openModal,
    withCleanup: () => withCleanup
  });

  // ../shelter-ui/src/util.tsx
  var _tmpl$ = /* @__PURE__ */ template(`<div style="display:contents"></div>`, 2);
  var _tmpl$2 = /* @__PURE__ */ template(`<style></style>`, 2);
  var withCleanup = (comp) => (props) => {
    if (getOwner())
      return comp(props);
    return createRoot((dispose3) => {
      const ret = comp(props);
      const elem = ret instanceof Element ? ret : (() => {
        const _el$ = _tmpl$.cloneNode(true);
        insert(_el$, ret);
        return _el$;
      })();
      elem.addEventListener("DOMNodeRemovedFromDocument", dispose3);
      return elem;
    });
  };
  var injectedStyles = [];
  var cleanupCss = () => {
    injectedStyles.forEach((e) => e.remove());
    injectedStyles = [];
  };
  var injectCss = (css9) => {
    const e = (() => {
      const _el$2 = _tmpl$2.cloneNode(true);
      insert(_el$2, css9);
      return _el$2;
    })();
    document.head.append(e);
    injectedStyles.push(e);
    return (css10) => {
      if (css10 === void 0) {
        e.remove();
        injectedStyles = injectedStyles.filter((v) => v !== e);
      } else
        e.textContent = css10;
    };
  };
  var genId = () => "shltr-ui-" + Math.random().toString(36).slice(2);

  // ../shelter-ui/src/button.tsx.scss
  var css = `._button_1hm31_1{transition:background-color .17s ease,color .17s ease;cursor:pointer;display:flex;justify-content:center;align-items:center;border:none;border-radius:3px;font-size:14px;font-weight:500;line-height:16px;padding:2px 16px;user-select:none;width:var(--shltr-btn-w);height:var(--shltr-btn-h);min-width:var(--shltr-btn-w);min-height:var(--shltr-btn-h)}._button_1hm31_1[disabled]{filter:brightness(0.6)}._button_1hm31_1._grow_1hm31_1{width:auto}._button_1hm31_1._filled_1hm31_1,._button_1hm31_1._outlined_1hm31_1:hover:not([disabled]){color:var(--shltr-btn-col);background:var(--shltr-btn-bg)}._button_1hm31_1._filled_1hm31_1:hover:not([disabled]){background:var(--shltr-btn-bg-hov)}._button_1hm31_1._inverted_1hm31_1{color:var(--shltr-btn-bg);background:var(--shltr-btn-col)}._button_1hm31_1._link_1hm31_1{color:unset;background:rgba(0,0,0,0)}._button_1hm31_1._outlined_1hm31_1{color:var(--shltr-btn-bg);border:1px solid var(--shltr-btn-bg);background:rgba(0,0,0,0)}._button_1hm31_1._xlarge_1hm31_1{font-size:16px;line-height:normal;padding:2px 20px}._button_1hm31_1._large_1hm31_1{padding:2px 4px;display:inline}._button_1hm31_1._max_1hm31_1{font-size:16px}._button_1hm31_1._icon_1hm31_1{padding:4px}`;
  var classes = {
    "button": "_button_1hm31_1",
    "grow": "_grow_1hm31_1",
    "filled": "_filled_1hm31_1",
    "outlined": "_outlined_1hm31_1",
    "inverted": "_inverted_1hm31_1",
    "link": "_link_1hm31_1",
    "xlarge": "_xlarge_1hm31_1",
    "large": "_large_1hm31_1",
    "max": "_max_1hm31_1",
    "icon": "_icon_1hm31_1"
  };

  // ../shelter-ui/src/button.tsx
  var _tmpl$3 = /* @__PURE__ */ template(`<button></button>`, 2);
  var injectedCss = false;
  var ButtonLooks = {
    FILLED: classes.filled,
    INVERTED: classes.inverted,
    OUTLINED: classes.outlined,
    LINK: classes.link
  };
  var ButtonColors = {
    BRAND: ["var(--brand-experiment)", "var(--interactive-active)", "var(--brand-experiment-560)"],
    RED: ["var(--text-danger)", "var(--interactive-active)", "var(--button-danger-background-hover)"],
    GREEN: ["var(--button-positive-background)", "var(--interactive-active)", "var(--button-positive-background-hover)"],
    SECONDARY: ["var(--button-secondary-background)", "hsl(0,calc(var(--saturation-factor, 1)*0%),100%)", "var(--button-secondary-background-hover)"],
    LINK: ["var(--text-link)", "hsl(0,calc(var(--saturation-factor, 1)*0%),100%)", ""],
    WHITE: ["hsl(0,calc(var(--saturation-factor, 1)*0%),100%)", "hsl(217,calc(var(--saturation-factor, 1)*7.6%),33.5%)", ""],
    BLACK: ["", "", ""],
    TRANSPARENT: ["hsla(0,calc(var(--saturation-factor, 1)*0%),100%,.1)", "hsl(240,calc(var(--saturation-factor, 1)*5.9%),96.7%)", "hsla(0,calc(var(--saturation-factor, 1)*0%),100%,.05)"]
  };
  var ButtonSizes = {
    NONE: ["", "", ""],
    TINY: ["53px", "24px", ""],
    SMALL: ["60px", "32px", ""],
    MEDIUM: ["96px", "38px", ""],
    LARGE: ["130px", "44px", ""],
    XLARGE: ["148px", "50px", classes.xlarge],
    MIN: ["auto", "auto", classes.large],
    MAX: ["100%", "100%", classes.max],
    ICON: ["", "auto", classes.icon]
  };
  var Button = (rawProps) => {
    const props = mergeProps({
      look: ButtonLooks.FILLED,
      color: ButtonColors.BRAND,
      size: ButtonSizes.SMALL,
      grow: false,
      type: "button",
      class: ""
    }, rawProps);
    if (!injectedCss) {
      injectCss(css);
      injectedCss = true;
    }
    return (() => {
      const _el$ = _tmpl$3.cloneNode(true);
      addEventListener(_el$, "dblclick", props.onDoubleClick, true);
      addEventListener(_el$, "click", props.onClick, true);
      insert(_el$, () => props.children);
      createRenderEffect((_p$) => {
        const _v$ = props["aria-label"], _v$2 = props.type, _v$3 = props.disabled, _v$4 = `${props.class} ${classes.button} ${props.look} ${props.size[2]} ${props.grow ? classes.grow : ""}`, _v$5 = {
          "--shltr-btn-w": props.size[0],
          "--shltr-btn-h": props.size[1],
          "--shltr-btn-col": props.color[1],
          "--shltr-btn-bg": props.color[0],
          "--shltr-btn-bg-hov": props.color[2],
          ...props.style
        };
        _v$ !== _p$._v$ && setAttribute(_el$, "aria-label", _p$._v$ = _v$);
        _v$2 !== _p$._v$2 && setAttribute(_el$, "type", _p$._v$2 = _v$2);
        _v$3 !== _p$._v$3 && (_el$.disabled = _p$._v$3 = _v$3);
        _v$4 !== _p$._v$4 && className(_el$, _p$._v$4 = _v$4);
        _p$._v$5 = style(_el$, _v$5, _p$._v$5);
        return _p$;
      }, {
        _v$: void 0,
        _v$2: void 0,
        _v$3: void 0,
        _v$4: void 0,
        _v$5: void 0
      });
      return _el$;
    })();
  };
  delegateEvents(["click", "dblclick"]);

  // ../shelter-ui/src/checkbox.tsx.scss
  var css2 = `._cbwrap_8gljn_1{display:flex;color:var(--text-normal);align-items:center}._cbwrap_8gljn_1,._cbwrap_8gljn_1>label{cursor:pointer}._checkbox_8gljn_1{position:relative;margin-right:8px}._checkbox_8gljn_1 input{display:block;width:100%;height:100%;position:absolute;margin:0;opacity:0;cursor:pointer}._icon_8gljn_1{height:24px;width:24px;padding:2px;border:1px solid hsl(218, calc(var(--saturation-factor, 1) * 4.6%), 46.9%);border-radius:6px;color:rgba(0,0,0,0)}._icon_8gljn_1._active_8gljn_1{border-color:var(--brand-experiment-400);color:var(--interactive-active);background:var(--brand-experiment-500)}._disabled_8gljn_1{opacity:.3}._disabled_8gljn_1,._disabled_8gljn_1>label{cursor:not-allowed}`;
  var classes2 = {
    "cbwrap": "_cbwrap_8gljn_1",
    "checkbox": "_checkbox_8gljn_1",
    "icon": "_icon_8gljn_1",
    "active": "_active_8gljn_1",
    "disabled": "_disabled_8gljn_1"
  };

  // ../shelter-ui/src/checkbox.tsx
  var _tmpl$4 = /* @__PURE__ */ template(`<div><svg width="18" height="18" viewBox="0 0 24 24"><path fill="currentColor" d="M8.99991 16.17L4.82991 12L3.40991 13.41L8.99991 19L20.9999 7.00003L19.5899 5.59003L8.99991 16.17Z"></path></svg></div>`, 6);
  var _tmpl$22 = /* @__PURE__ */ template(`<label></label>`, 2);
  var _tmpl$32 = /* @__PURE__ */ template(`<div><div><input type="checkbox" tabindex="0"></div></div>`, 5);
  var injectedCss2 = false;
  var CheckIcon = (props) => (() => {
    const _el$ = _tmpl$4.cloneNode(true);
    createRenderEffect((_$p) => classList(_el$, {
      [classes2.icon]: true,
      [classes2.active]: props.state
    }, _$p));
    return _el$;
  })();
  var CheckboxItem = (props) => {
    if (!injectedCss2) {
      injectCss(css2);
      injectedCss2 = true;
    }
    const id = genId();
    return (() => {
      const _el$2 = _tmpl$32.cloneNode(true), _el$3 = _el$2.firstChild, _el$4 = _el$3.firstChild;
      _el$2.$$click = () => props.disabled || props.onChange?.(!props.checked);
      insert(_el$3, createComponent(CheckIcon, {
        get state() {
          return props.checked;
        }
      }), _el$4);
      insert(_el$2, createComponent(Show, {
        get when() {
          return props.children;
        },
        keyed: false,
        get children() {
          const _el$5 = _tmpl$22.cloneNode(true);
          setAttribute(_el$5, "for", id);
          insert(_el$5, () => props.children);
          return _el$5;
        }
      }), null);
      createRenderEffect((_p$) => {
        const _v$ = {
          [classes2.cbwrap]: true,
          [classes2.disabled]: props.disabled
        }, _v$2 = props.mt ? "margin-top: 20px" : "", _v$3 = classes2.checkbox, _v$4 = props.children ? id : "", _v$5 = props.disabled;
        _p$._v$ = classList(_el$2, _v$, _p$._v$);
        _p$._v$2 = style(_el$2, _v$2, _p$._v$2);
        _v$3 !== _p$._v$3 && className(_el$3, _p$._v$3 = _v$3);
        _v$4 !== _p$._v$4 && setAttribute(_el$4, "id", _p$._v$4 = _v$4);
        _v$5 !== _p$._v$5 && (_el$4.disabled = _p$._v$5 = _v$5);
        return _p$;
      }, {
        _v$: void 0,
        _v$2: void 0,
        _v$3: void 0,
        _v$4: void 0,
        _v$5: void 0
      });
      createRenderEffect(() => _el$4.checked = props.checked);
      return _el$2;
    })();
  };
  var Checkbox = (props) => createComponent(CheckboxItem, props);
  delegateEvents(["click"]);

  // ../shelter-ui/src/switch.tsx.scss
  var css3 = `._switch_1anvu_1{position:relative;background:hsl(218, calc(var(--saturation-factor, 1) * 4.6%), 46.9%);height:24px;width:40px;border-radius:12px;transition:background 250ms}._switch_1anvu_1 input{display:block;width:100%;height:100%;position:absolute;margin:0;opacity:0;cursor:pointer}._on_1anvu_1{background:hsl(139, calc(var(--saturation-factor, 1) * 47.3%), 43.9%)}._disabled_1anvu_1{opacity:.3}._slider_1anvu_1{position:absolute;background:#fff;left:3px;top:3px;height:18px;width:18px;border-radius:9px;transition:transform 250ms cubic-bezier(0.33, 0, 0.24, 1.02)}._on_1anvu_1 ._slider_1anvu_1{transform:translateX(16px)}._sitem_1anvu_1{display:flex;flex-direction:column;margin-bottom:20px}._irow_1anvu_1{display:flex;width:100%;align-items:center}._irow_1anvu_1>label{flex:1;display:block;overflow:hidden;margin:0;color:var(--header-primary);line-height:24px;font-weight:500;word-wrap:break-word;cursor:pointer}._irow_1anvu_1>div{flex:0 0 auto}._note_1anvu_1{margin-top:8px;color:var(--header-secondary);font-size:14px;line-height:20px;font-weight:400;cursor:default}`;
  var classes3 = {
    "switch": "_switch_1anvu_1",
    "on": "_on_1anvu_1",
    "disabled": "_disabled_1anvu_1",
    "slider": "_slider_1anvu_1",
    "sitem": "_sitem_1anvu_1",
    "irow": "_irow_1anvu_1",
    "note": "_note_1anvu_1"
  };

  // ../shelter-ui/src/switch.tsx
  var _tmpl$5 = /* @__PURE__ */ template(`<svg viewBox="0 0 20 20" fill="none"><path style="transition: fill 250ms"><animate dur="250ms" repeatCount="1" attributeName="d"></animate></path><path style="transition: fill 250ms"><animate dur="250ms" repeatCount="1" attributeName="d"></animate></path></svg>`, 10);
  var _tmpl$23 = /* @__PURE__ */ template(`<div><div></div><input type="checkbox" tabindex="0"></div>`, 5);
  var _tmpl$33 = /* @__PURE__ */ template(`<div></div>`, 2);
  var _tmpl$42 = /* @__PURE__ */ template(`<div><div><label></label><div></div></div></div>`, 8);
  var injectedCss3 = false;
  var TickPath1 = " M 4.08643 11.0903 L 5.67742 9.49929 L 9.4485  13.2704 L 7.85751 14.8614 Z";
  var InterPath1 = "M 4.24365 11.125  L 4.24365 8.87500 L 15.7437 8.87504 L 15.7437 11.1251 Z";
  var CrossPath1 = "M 5.13231 6.72963 L 6.7233  5.13864 L 14.855  13.2704 L 13.264  14.8614 Z";
  var TickPath2 = " M 14.3099 5.25755 L 15.9009 6.84854 L 7.89561 14.8538 L 6.30462 13.2629 Z";
  var InterPath2 = "M 15.7437 8.87504 L 15.7437 11.1251 L 4.24365 11.125  L 4.24365 8.87500 Z";
  var CrossPath2 = "M 13.2704 5.13864 L 14.8614 6.72963 L 6.72963 14.8614 L 5.13864 13.2704 Z";
  var TickCol = " hsl(139, calc(var(--saturation-factor, 1) * 47.3%), 43.9%)";
  var CrossCol = "hsl(218, calc(var(--saturation-factor, 1) * 4.6%) , 46.9%)";
  var ButtonIcon = (props) => {
    let animate1;
    let animate2;
    createEffect(on([() => props.state], ([s]) => {
      animate1.setAttribute("values", s ? `${CrossPath1};${InterPath1};${TickPath1}` : `${TickPath1};${InterPath1};${CrossPath1}`);
      animate2.setAttribute("values", s ? `${CrossPath2};${InterPath2};${TickPath2}` : `${TickPath2};${InterPath2};${CrossPath2}`);
      animate1.beginElement();
      animate2.beginElement();
    }, {
      defer: true
    }));
    return (() => {
      const _el$ = _tmpl$5.cloneNode(true), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$2.nextSibling, _el$5 = _el$4.firstChild;
      const _ref$ = animate1;
      typeof _ref$ === "function" ? use(_ref$, _el$3) : animate1 = _el$3;
      const _ref$2 = animate2;
      typeof _ref$2 === "function" ? use(_ref$2, _el$5) : animate2 = _el$5;
      createRenderEffect((_p$) => {
        const _v$ = props.state ? TickCol : CrossCol, _v$2 = props.state ? TickPath1 : CrossPath1, _v$3 = props.state ? TickCol : CrossCol, _v$4 = props.state ? TickPath2 : CrossPath2;
        _v$ !== _p$._v$ && setAttribute(_el$2, "fill", _p$._v$ = _v$);
        _v$2 !== _p$._v$2 && setAttribute(_el$2, "d", _p$._v$2 = _v$2);
        _v$3 !== _p$._v$3 && setAttribute(_el$4, "fill", _p$._v$3 = _v$3);
        _v$4 !== _p$._v$4 && setAttribute(_el$4, "d", _p$._v$4 = _v$4);
        return _p$;
      }, {
        _v$: void 0,
        _v$2: void 0,
        _v$3: void 0,
        _v$4: void 0
      });
      return _el$;
    })();
  };
  var Switch2 = (props) => {
    if (!injectedCss3) {
      injectCss(css3);
      injectedCss3 = true;
    }
    return (() => {
      const _el$6 = _tmpl$23.cloneNode(true), _el$7 = _el$6.firstChild, _el$8 = _el$7.nextSibling;
      insert(_el$7, createComponent(ButtonIcon, {
        get state() {
          return props.checked;
        }
      }));
      _el$8.addEventListener("change", () => props.onChange?.(!props.checked));
      createRenderEffect((_p$) => {
        const _v$5 = classes3.switch, _v$6 = {
          [classes3.on]: props.checked,
          [classes3.disabled]: props.disabled
        }, _v$7 = classes3.slider, _v$8 = props.id, _v$9 = props.disabled;
        _v$5 !== _p$._v$5 && className(_el$6, _p$._v$5 = _v$5);
        _p$._v$6 = classList(_el$6, _v$6, _p$._v$6);
        _v$7 !== _p$._v$7 && className(_el$7, _p$._v$7 = _v$7);
        _v$8 !== _p$._v$8 && setAttribute(_el$8, "id", _p$._v$8 = _v$8);
        _v$9 !== _p$._v$9 && (_el$8.disabled = _p$._v$9 = _v$9);
        return _p$;
      }, {
        _v$5: void 0,
        _v$6: void 0,
        _v$7: void 0,
        _v$8: void 0,
        _v$9: void 0
      });
      createRenderEffect(() => _el$8.checked = props.checked);
      return _el$6;
    })();
  };
  var SwitchItem = (props) => {
    const id = genId();
    return (() => {
      const _el$9 = _tmpl$42.cloneNode(true), _el$10 = _el$9.firstChild, _el$11 = _el$10.firstChild, _el$12 = _el$11.nextSibling;
      setAttribute(_el$11, "for", id);
      insert(_el$11, () => props.children);
      insert(_el$12, createComponent(Switch2, {
        id,
        get checked() {
          return props.value;
        },
        get onChange() {
          return props.onChange;
        },
        get disabled() {
          return props.disabled;
        }
      }));
      insert(_el$9, createComponent(Show, {
        get when() {
          return props.note;
        },
        keyed: true,
        get children() {
          const _el$13 = _tmpl$33.cloneNode(true);
          insert(_el$13, () => props.note);
          createRenderEffect(() => className(_el$13, classes3.note));
          return _el$13;
        }
      }), null);
      insert(_el$9, createComponent(Show, {
        get when() {
          return !props.hideBorder;
        },
        keyed: true,
        get children() {
          return createComponent(Divider, {
            mt: true
          });
        }
      }), null);
      createRenderEffect((_p$) => {
        const _v$10 = classes3.sitem, _v$11 = classes3.irow;
        _v$10 !== _p$._v$10 && className(_el$9, _p$._v$10 = _v$10);
        _v$11 !== _p$._v$11 && className(_el$10, _p$._v$11 = _v$11);
        return _p$;
      }, {
        _v$10: void 0,
        _v$11: void 0
      });
      return _el$9;
    })();
  };

  // ../shelter-ui/src/header.tsx.scss
  var css4 = `._h_vu6ea_1{cursor:default;font-family:var(--font-display);color:var(--header-primary)}._h1_vu6ea_1{font-size:20px;line-height:24px}._h2_vu6ea_1{font-size:16px;line-height:20px}._h1_vu6ea_1,._h2_vu6ea_1{font-weight:500}._h3_vu6ea_1{line-height:24px;font-weight:400}._h4_vu6ea_1{line-height:20px}._h3_vu6ea_1,._h4_vu6ea_1{font-size:16px}._h5_vu6ea_1{font-size:12px;line-height:16px;color:var(--header-secondary)}._h4_vu6ea_1,._h5_vu6ea_1{font-weight:500}._h2_vu6ea_1,._h4_vu6ea_1,._h5_vu6ea_1{text-transform:uppercase}`;
  var classes4 = {
    "h": "_h_vu6ea_1",
    "h1": "_h1_vu6ea_1",
    "h2": "_h2_vu6ea_1",
    "h3": "_h3_vu6ea_1",
    "h4": "_h4_vu6ea_1",
    "h5": "_h5_vu6ea_1"
  };

  // ../shelter-ui/src/header.tsx
  var injectedCss4 = false;
  var HeaderTags = {
    H1: classes4.h1,
    H2: classes4.h2,
    H3: classes4.h3,
    H4: classes4.h4,
    H5: classes4.h5
  };
  var Header = (props) => {
    if (!injectedCss4) {
      injectCss(css4);
      injectedCss4 = true;
    }
    return createComponent(Dynamic, {
      get component() {
        return props.tag === HeaderTags.H5 ? "h3" : "h2";
      },
      get ["class"]() {
        return `${props.class ?? ""} ${props.tag ?? HeaderTags.H5} ${classes4.h}`;
      },
      get id() {
        return props.id;
      },
      get children() {
        return props.children;
      }
    });
  };

  // ../shelter-ui/src/modals.tsx.scss
  var css5 = `._bg_1cqgx_1{background:rgba(0,0,0,.85);transition:background 250ms;align-self:stretch}._mroot_1cqgx_1{position:absolute;width:100%;height:100%;z-index:9999;display:grid;align-items:center}._mroot_1cqgx_1>*{grid-area:1/1/2/2}._wrap_1cqgx_1{transition-property:opacity,transform;transition-duration:250ms;pointer-events:none}._wrap_1cqgx_1:not(._active_1cqgx_1){opacity:0;transform:scale(0)}._wrap_1cqgx_1>*{pointer-events:initial}._modal_1cqgx_1{background:var(--modal-background);border-radius:4px;margin:0 auto;position:relative;display:flex;flex-flow:column nowrap;color:var(--text-normal)}._sm_1cqgx_1{width:440px;min-height:200px;max-height:720px}._md_1cqgx_1{width:600px;min-height:400px;max-height:800px}._body_1cqgx_1{flex:1 1 auto;overflow:hidden auto;position:relative;padding:0 8px 20px 16px;scrollbar-width:thin;scrollbar-color:var(--scrollbar-thin-thumb) var(--scrollbar-thin-track)}._body_1cqgx_1::-webkit-scrollbar{width:8px;height:8px}._body_1cqgx_1::-webkit-scrollbar-track{border-color:var(--scrollbar-thin-track);background-color:var(--scrollbar-thin-track);border:2px solid var(--scrollbar-thin-track)}._body_1cqgx_1::-webkit-scrollbar-thumb{background-clip:padding-box;border:2px solid rgba(0,0,0,0);border-radius:4px;background-color:var(--scrollbar-thin-thumb);min-height:40px}._body_1cqgx_1::-webkit-scrollbar-corner{background-color:rgba(0,0,0,0)}._head_1cqgx_1,._foot_1cqgx_1{flex:0 0 auto;padding:16px}._head_1cqgx_1{display:flex;justify-content:space-between}._foot_1cqgx_1{background:var(--modal-footer-background);border-radius:0 0 4px 4px}._confirm_1cqgx_1{display:flex;justify-content:flex-end;gap:.5rem}._cbtn_1cqgx_1{height:26px;padding:2px;cursor:pointer;opacity:.5;color:var(--interactive-normal);background:rgba(0,0,0,0);border:none;margin:0}._cbtn_1cqgx_1:hover{opacity:1;color:var(--interactive-hover)}`;
  var classes5 = {
    "bg": "_bg_1cqgx_1",
    "mroot": "_mroot_1cqgx_1",
    "wrap": "_wrap_1cqgx_1",
    "active": "_active_1cqgx_1",
    "modal": "_modal_1cqgx_1",
    "sm": "_sm_1cqgx_1",
    "md": "_md_1cqgx_1",
    "body": "_body_1cqgx_1",
    "head": "_head_1cqgx_1",
    "foot": "_foot_1cqgx_1",
    "confirm": "_confirm_1cqgx_1",
    "cbtn": "_cbtn_1cqgx_1"
  };

  // ../shelter-ui/src/openModal.tsx
  var _tmpl$6 = /* @__PURE__ */ template(`<div></div>`, 2);
  var _tmpl$24 = /* @__PURE__ */ template(`<div aria-modal role="dialog"></div>`, 2);
  var [currentModals, setCurrentModals] = createSignal([]);
  var dispose2;
  var cssInjected = false;
  var [animationPrePost, setAnimationPrePost] = createSignal(true);
  var [bgAnimPrePost, setBgAnimPrePost] = createSignal(true);
  var ModalRoot = () => {
    if (!cssInjected) {
      injectCss(css5);
      cssInjected = true;
    }
    const modalCount = createMemo(() => currentModals().length);
    setTimeout(() => setBgAnimPrePost(false));
    return [(() => {
      const _el$ = _tmpl$6.cloneNode(true);
      _el$.$$click = popModal;
      createRenderEffect((_p$) => {
        const _v$ = classes5.bg, _v$2 = bgAnimPrePost() ? "transparent" : "";
        _v$ !== _p$._v$ && className(_el$, _p$._v$ = _v$);
        _v$2 !== _p$._v$2 && _el$.style.setProperty("background", _p$._v$2 = _v$2);
        return _p$;
      }, {
        _v$: void 0,
        _v$2: void 0
      });
      return _el$;
    })(), createComponent(For, {
      get each() {
        return currentModals();
      },
      children: (M, idx) => (() => {
        const _el$2 = _tmpl$6.cloneNode(true);
        insert(_el$2, createComponent(M, {
          close: () => popSpecificModal(M)
        }));
        createRenderEffect((_$p) => classList(_el$2, {
          [classes5.wrap]: true,
          [classes5.active]: idx() === modalCount() - (animationPrePost() ? 2 : 1)
        }, _$p));
        return _el$2;
      })()
    })];
  };
  createEffect(() => {
    if (currentModals().length === 0) {
      dispose2?.();
      dispose2 = void 0;
    } else if (!dispose2) {
      const root = (() => {
        const _el$3 = _tmpl$24.cloneNode(true);
        createRenderEffect(() => className(_el$3, classes5.mroot));
        return _el$3;
      })();
      document.body.append(root);
      const disp = render(() => createComponent(ModalRoot, {}), root);
      dispose2 = () => {
        disp();
        root.remove();
      };
    }
  });
  function popModal() {
    setAnimationPrePost(true);
    if (currentModals().length === 1)
      setBgAnimPrePost(true);
    setTimeout(() => {
      setAnimationPrePost(false);
      setCurrentModals(currentModals().slice(0, -1));
    }, 250);
  }
  function popSpecificModal(comp) {
    setAnimationPrePost(true);
    if (currentModals().length === 1)
      setBgAnimPrePost(true);
    setTimeout(() => {
      setAnimationPrePost(false);
      setCurrentModals(currentModals().filter((m) => m !== comp));
    }, 250);
  }
  function openModal(comp) {
    setAnimationPrePost(true);
    setCurrentModals([...currentModals(), comp]);
    setTimeout(() => setAnimationPrePost(false));
    return () => popSpecificModal(comp);
  }
  delegateEvents(["click"]);

  // ../shelter-ui/src/icons.tsx
  var _tmpl$7 = /* @__PURE__ */ template(`<svg width="24" height="24" viewBox="0 0 24 24"><path fill="currentColor" d="M18.4 4L12 10.4L5.6 4L4 5.6L10.4 12L4 18.4L5.6 20L12 13.6L18.4 20L20 18.4L13.6 12L20 5.6L18.4 4Z"></path></svg>`, 4);
  var _tmpl$25 = /* @__PURE__ */ template(`<svg width="20" height="20" viewBox="0 0 24 24" style="margin-bottom: -4px"><path fill="currentColor" d="M20 11.1111H12.8889V4H11.1111V11.1111H4V12.8889H11.1111V20H12.8889V12.8889H20V11.1111Z"></path></svg>`, 4);
  var _tmpl$34 = /* @__PURE__ */ template(`<svg width="24" height="24" viewBox="0 0 24 24" style="margin-bottom: -4px"><path fill="currentColor" d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zm2.46-7.12 1.41-1.41L12 12.59l2.12-2.12 1.41 1.41L13.41 14l2.12 2.12-1.41 1.41L12 15.41l-2.12 2.12-1.41-1.41L10.59 14l-2.13-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4z"></path></svg>`, 4);
  var IconClose = () => _tmpl$7.cloneNode(true);
  var IconAdd = () => _tmpl$25.cloneNode(true);
  var IconBin = () => _tmpl$34.cloneNode(true);

  // ../shelter-ui/src/modals.tsx
  var _tmpl$8 = /* @__PURE__ */ template(`<div></div>`, 2);
  var _tmpl$26 = /* @__PURE__ */ template(`<div><button></button></div>`, 4);
  var ModalSizes = {
    SMALL: classes5.sm,
    MEDIUM: classes5.md
  };
  var ModalRoot2 = (props) => (() => {
    const _el$ = _tmpl$8.cloneNode(true);
    _el$.$$click = (e) => e.stopPropagation();
    insert(_el$, () => props.children);
    createRenderEffect((_p$) => {
      const _v$ = `${classes5.modal} ${props.size ?? ModalSizes.SMALL} ${props.class ?? ""}`, _v$2 = props.style;
      _v$ !== _p$._v$ && className(_el$, _p$._v$ = _v$);
      _p$._v$2 = style(_el$, _v$2, _p$._v$2);
      return _p$;
    }, {
      _v$: void 0,
      _v$2: void 0
    });
    return _el$;
  })();
  var ModalFooter = (props) => (() => {
    const _el$2 = _tmpl$8.cloneNode(true);
    insert(_el$2, () => props.children);
    createRenderEffect(() => className(_el$2, classes5.foot));
    return _el$2;
  })();
  var ModalHeader = (props) => (() => {
    const _el$3 = _tmpl$26.cloneNode(true), _el$4 = _el$3.firstChild;
    insert(_el$3, createComponent(Header, {
      get tag() {
        return HeaderTags.H1;
      },
      get children() {
        return props.children;
      }
    }), _el$4);
    addEventListener(_el$4, "click", props.close, true);
    insert(_el$4, createComponent(IconClose, {}));
    createRenderEffect((_p$) => {
      const _v$3 = classes5.head, _v$4 = classes5.cbtn, _v$5 = props.noClose ? "none" : "";
      _v$3 !== _p$._v$3 && className(_el$3, _p$._v$3 = _v$3);
      _v$4 !== _p$._v$4 && className(_el$4, _p$._v$4 = _v$4);
      _v$5 !== _p$._v$5 && _el$4.style.setProperty("display", _p$._v$5 = _v$5);
      return _p$;
    }, {
      _v$3: void 0,
      _v$4: void 0,
      _v$5: void 0
    });
    return _el$3;
  })();
  var ModalBody = (props) => (() => {
    const _el$5 = _tmpl$8.cloneNode(true);
    insert(_el$5, () => props.children);
    createRenderEffect(() => className(_el$5, classes5.body));
    return _el$5;
  })();
  var confirmColours = {
    danger: ButtonColors.RED,
    confirm: ButtonColors.GREEN
  };
  var ModalConfirmFooter = (props) => createComponent(ModalFooter, {
    get children() {
      const _el$6 = _tmpl$8.cloneNode(true);
      insert(_el$6, createComponent(Button, {
        get disabled() {
          return props.cancelDisabled;
        },
        get size() {
          return ButtonSizes.MEDIUM;
        },
        get color() {
          return ButtonColors.SECONDARY;
        },
        onClick: () => {
          props.onCancel?.();
          props.close();
        },
        get children() {
          return props.cancelText ?? "Cancel";
        }
      }), null);
      insert(_el$6, createComponent(Button, {
        get disabled() {
          return props.disabled;
        },
        get size() {
          return ButtonSizes.MEDIUM;
        },
        get color() {
          return confirmColours[props.type ?? "neutral"];
        },
        onClick: () => {
          props.onConfirm?.();
          props.close();
        },
        get children() {
          return props.confirmText ?? "Confirm";
        }
      }), null);
      createRenderEffect(() => className(_el$6, classes5.confirm));
      return _el$6;
    }
  });
  var openConfirmationModal = ({
    body,
    header,
    confirmText,
    cancelText,
    type,
    size
  }) => new Promise((res, rej) => {
    openModal((props) => {
      onCleanup(rej);
      return createComponent(ModalRoot2, {
        size,
        get children() {
          return [createComponent(ModalHeader, {
            get close() {
              return props.close;
            },
            get children() {
              return header({});
            }
          }), createComponent(ModalBody, {
            get children() {
              return body({});
            }
          }), createComponent(ModalConfirmFooter, {
            onConfirm: res,
            onCancel: rej,
            get close() {
              return props.close;
            },
            confirmText,
            cancelText,
            type
          })];
        }
      });
    });
  });
  delegateEvents(["click"]);

  // ../shelter-ui/src/textbox.tsx.scss
  var css6 = `._tbox_vp2xy_1,._tarea_vp2xy_1{box-sizing:border-box;font-size:16px;width:100%;border-radius:3px;color:var(--text-normal);background-color:var(--input-background);border:none;transition:border-color .2s ease-in-out;padding:10px}._tbox_vp2xy_1{height:40px;flex-grow:1;margin-right:20px}._tarea_vp2xy_1{resize:none}._rx_vp2xy_1{resize:horizontal}._ry_vp2xy_1{resize:vertical}._rx_vp2xy_1._ry_vp2xy_1{resize:both}._mono_vp2xy_1,._mono_vp2xy_1::placeholder{font-family:var(--font-code)}`;
  var classes6 = {
    "tbox": "_tbox_vp2xy_1",
    "tarea": "_tarea_vp2xy_1",
    "rx": "_rx_vp2xy_1",
    "ry": "_ry_vp2xy_1",
    "mono": "_mono_vp2xy_1"
  };

  // ../shelter-ui/src/textbox.tsx
  var _tmpl$9 = /* @__PURE__ */ template(`<input type="text">`, 1);
  var _tmpl$27 = /* @__PURE__ */ template(`<textarea></textarea>`, 2);
  var injectedCss5 = false;
  var TextBox = (props) => {
    if (!injectedCss5) {
      injectedCss5 = true;
      injectCss(css6);
    }
    return (() => {
      const _el$ = _tmpl$9.cloneNode(true);
      _el$.$$input = (e) => props.onInput(e.target.value);
      createRenderEffect((_p$) => {
        const _v$ = classes6.tbox, _v$2 = props.placeholder, _v$3 = props.maxLength ?? 999, _v$4 = props.labelledBy;
        _v$ !== _p$._v$ && className(_el$, _p$._v$ = _v$);
        _v$2 !== _p$._v$2 && setAttribute(_el$, "placeholder", _p$._v$2 = _v$2);
        _v$3 !== _p$._v$3 && setAttribute(_el$, "maxlength", _p$._v$3 = _v$3);
        _v$4 !== _p$._v$4 && setAttribute(_el$, "aria-labelledby", _p$._v$4 = _v$4);
        return _p$;
      }, {
        _v$: void 0,
        _v$2: void 0,
        _v$3: void 0,
        _v$4: void 0
      });
      createRenderEffect(() => _el$.value = props.value);
      return _el$;
    })();
  };
  var TextArea = (props) => {
    if (!injectedCss5) {
      injectedCss5 = true;
      injectCss(css6);
    }
    return (() => {
      const _el$2 = _tmpl$27.cloneNode(true);
      _el$2.$$input = (e) => props.onInput(e.target.value);
      createRenderEffect((_p$) => {
        const _v$5 = {
          [classes6.tarea]: true,
          [classes6.rx]: props["resize-x"],
          [classes6.ry]: props["resize-y"],
          [classes6.mono]: props.mono
        }, _v$6 = props.placeholder, _v$7 = props.labelledBy;
        _p$._v$5 = classList(_el$2, _v$5, _p$._v$5);
        _v$6 !== _p$._v$6 && setAttribute(_el$2, "placeholder", _p$._v$6 = _v$6);
        _v$7 !== _p$._v$7 && setAttribute(_el$2, "aria-labelledby", _p$._v$7 = _v$7);
        return _p$;
      }, {
        _v$5: void 0,
        _v$6: void 0,
        _v$7: void 0
      });
      createRenderEffect(() => _el$2.value = props.value);
      return _el$2;
    })();
  };
  delegateEvents(["input"]);

  // ../shelter-ui/src/index.tsx
  var _tmpl$10 = /* @__PURE__ */ template(`<span></span>`, 2);
  var _tmpl$28 = /* @__PURE__ */ template(`<div></div>`, 2);
  var _tmpl$35 = /* @__PURE__ */ template(`<pre> </pre>`, 2);
  var Text = (props) => (() => {
    const _el$ = _tmpl$10.cloneNode(true);
    _el$.style.setProperty("color", "var(--text-normal)");
    insert(_el$, () => props.children);
    return _el$;
  })();
  var Divider = (props) => (() => {
    const _el$2 = _tmpl$28.cloneNode(true);
    _el$2.style.setProperty("width", "100%");
    _el$2.style.setProperty("height", "1px");
    _el$2.style.setProperty("border-top", "thin solid var(--background-modifier-accent)");
    createRenderEffect((_p$) => {
      const _v$ = typeof props.mt === "string" ? props.mt : props.mt ? "20px" : "", _v$2 = typeof props.mb === "string" ? props.mb : props.mb ? "20px" : "";
      _v$ !== _p$._v$ && _el$2.style.setProperty("margin-top", _p$._v$ = _v$);
      _v$2 !== _p$._v$2 && _el$2.style.setProperty("margin-bottom", _p$._v$2 = _v$2);
      return _p$;
    }, {
      _v$: void 0,
      _v$2: void 0
    });
    return _el$2;
  })();
  var Space = () => _tmpl$35.cloneNode(true);

  // src/util.ts
  var util_exports = {};
  __export(util_exports, {
    awaitDispatch: () => awaitDispatch,
    createListener: () => createListener,
    createSubscription: () => createSubscription,
    getFiber: () => getFiber,
    log: () => log,
    reactFiberWalker: () => reactFiberWalker,
    storeAssign: () => storeAssign
  });
  var getFiber = (n) => n.__reactFiber$;
  function reactFiberWalker(node, prop, goUp = false) {
    if (!node)
      return;
    if (node.pendingProps?.[prop] !== void 0)
      return node;
    return reactFiberWalker(goUp ? node.return : node.child, prop, goUp) ?? reactFiberWalker(node.sibling, prop, goUp);
  }
  var awaitDispatch = (type) => new Promise(async (res) => {
    const dispatcher2 = await getDispatcher();
    const cb = (d) => {
      res(d);
      dispatcher2.unsubscribe(type, cb);
    };
    dispatcher2.subscribe(type, cb);
  });
  function log(text, func = "log") {
    console[func](
      "%cshelter%c",
      "background: linear-gradient(180deg, #2A3B4B 0%, #2BFAAC 343.17%); color: white; padding: 6px",
      "",
      text
    );
  }
  function createListener(type) {
    const [subData, setSubData] = createSignal();
    let cancel = false, dispatcher2;
    getDispatcher().then((d) => {
      if (cancel)
        return;
      dispatcher2 = d;
      dispatcher2.subscribe(type, setSubData);
    });
    onCleanup(() => {
      cancel = true;
      dispatcher2?.unsubscribe(type, setSubData);
    });
    return subData;
  }
  function createSubscription(store, getStateFromStore) {
    const [data, setData] = createSignal(getStateFromStore(store));
    const cb = () => setData(() => getStateFromStore(store));
    store.addChangeListener(cb);
    onCleanup(() => store.removeChangeListener(cb));
    return data;
  }
  var storeAssign = (store, toApply) => batch(() => Object.assign(store, toApply));

  // src/plugins.ts
  var plugins_exports = {};
  __export(plugins_exports, {
    addLocalPlugin: () => addLocalPlugin,
    addRemotePlugin: () => addRemotePlugin,
    installedPlugins: () => installedPlugins,
    loadedPlugins: () => loadedPlugins,
    removePlugin: () => removePlugin,
    startAllPlugins: () => startAllPlugins,
    startPlugin: () => startPlugin,
    stopPlugin: () => stopPlugin
  });

  // src/storage.ts
  var storage_exports = {};
  __export(storage_exports, {
    dbStore: () => dbStore,
    defaults: () => defaults,
    isInited: () => isInited,
    signalOf: () => signalOf,
    solidMutWithSignal: () => solidMutWithSignal,
    storage: () => storage,
    waitInit: () => waitInit,
    whenInited: () => whenInited
  });

  // ../../node_modules/.pnpm/idb@7.1.0/node_modules/idb/build/wrap-idb-value.js
  var instanceOfAny = (object, constructors) => constructors.some((c) => object instanceof c);
  var idbProxyableTypes;
  var cursorAdvanceMethods;
  function getIdbProxyableTypes() {
    return idbProxyableTypes || (idbProxyableTypes = [
      IDBDatabase,
      IDBObjectStore,
      IDBIndex,
      IDBCursor,
      IDBTransaction
    ]);
  }
  function getCursorAdvanceMethods() {
    return cursorAdvanceMethods || (cursorAdvanceMethods = [
      IDBCursor.prototype.advance,
      IDBCursor.prototype.continue,
      IDBCursor.prototype.continuePrimaryKey
    ]);
  }
  var cursorRequestMap = /* @__PURE__ */ new WeakMap();
  var transactionDoneMap = /* @__PURE__ */ new WeakMap();
  var transactionStoreNamesMap = /* @__PURE__ */ new WeakMap();
  var transformCache = /* @__PURE__ */ new WeakMap();
  var reverseTransformCache = /* @__PURE__ */ new WeakMap();
  function promisifyRequest(request) {
    const promise = new Promise((resolve, reject) => {
      const unlisten = () => {
        request.removeEventListener("success", success);
        request.removeEventListener("error", error);
      };
      const success = () => {
        resolve(wrap2(request.result));
        unlisten();
      };
      const error = () => {
        reject(request.error);
        unlisten();
      };
      request.addEventListener("success", success);
      request.addEventListener("error", error);
    });
    promise.then((value) => {
      if (value instanceof IDBCursor) {
        cursorRequestMap.set(value, request);
      }
    }).catch(() => {
    });
    reverseTransformCache.set(promise, request);
    return promise;
  }
  function cacheDonePromiseForTransaction(tx) {
    if (transactionDoneMap.has(tx))
      return;
    const done = new Promise((resolve, reject) => {
      const unlisten = () => {
        tx.removeEventListener("complete", complete);
        tx.removeEventListener("error", error);
        tx.removeEventListener("abort", error);
      };
      const complete = () => {
        resolve();
        unlisten();
      };
      const error = () => {
        reject(tx.error || new DOMException("AbortError", "AbortError"));
        unlisten();
      };
      tx.addEventListener("complete", complete);
      tx.addEventListener("error", error);
      tx.addEventListener("abort", error);
    });
    transactionDoneMap.set(tx, done);
  }
  var idbProxyTraps = {
    get(target, prop, receiver) {
      if (target instanceof IDBTransaction) {
        if (prop === "done")
          return transactionDoneMap.get(target);
        if (prop === "objectStoreNames") {
          return target.objectStoreNames || transactionStoreNamesMap.get(target);
        }
        if (prop === "store") {
          return receiver.objectStoreNames[1] ? void 0 : receiver.objectStore(receiver.objectStoreNames[0]);
        }
      }
      return wrap2(target[prop]);
    },
    set(target, prop, value) {
      target[prop] = value;
      return true;
    },
    has(target, prop) {
      if (target instanceof IDBTransaction && (prop === "done" || prop === "store")) {
        return true;
      }
      return prop in target;
    }
  };
  function replaceTraps(callback) {
    idbProxyTraps = callback(idbProxyTraps);
  }
  function wrapFunction(func) {
    if (func === IDBDatabase.prototype.transaction && !("objectStoreNames" in IDBTransaction.prototype)) {
      return function(storeNames, ...args) {
        const tx = func.call(unwrap2(this), storeNames, ...args);
        transactionStoreNamesMap.set(tx, storeNames.sort ? storeNames.sort() : [storeNames]);
        return wrap2(tx);
      };
    }
    if (getCursorAdvanceMethods().includes(func)) {
      return function(...args) {
        func.apply(unwrap2(this), args);
        return wrap2(cursorRequestMap.get(this));
      };
    }
    return function(...args) {
      return wrap2(func.apply(unwrap2(this), args));
    };
  }
  function transformCachableValue(value) {
    if (typeof value === "function")
      return wrapFunction(value);
    if (value instanceof IDBTransaction)
      cacheDonePromiseForTransaction(value);
    if (instanceOfAny(value, getIdbProxyableTypes()))
      return new Proxy(value, idbProxyTraps);
    return value;
  }
  function wrap2(value) {
    if (value instanceof IDBRequest)
      return promisifyRequest(value);
    if (transformCache.has(value))
      return transformCache.get(value);
    const newValue = transformCachableValue(value);
    if (newValue !== value) {
      transformCache.set(value, newValue);
      reverseTransformCache.set(newValue, value);
    }
    return newValue;
  }
  var unwrap2 = (value) => reverseTransformCache.get(value);

  // ../../node_modules/.pnpm/idb@7.1.0/node_modules/idb/build/index.js
  function openDB(name, version, { blocked, upgrade, blocking, terminated } = {}) {
    const request = indexedDB.open(name, version);
    const openPromise = wrap2(request);
    if (upgrade) {
      request.addEventListener("upgradeneeded", (event) => {
        upgrade(wrap2(request.result), event.oldVersion, event.newVersion, wrap2(request.transaction), event);
      });
    }
    if (blocked) {
      request.addEventListener("blocked", (event) => blocked(
        event.oldVersion,
        event.newVersion,
        event
      ));
    }
    openPromise.then((db) => {
      if (terminated)
        db.addEventListener("close", () => terminated());
      if (blocking) {
        db.addEventListener("versionchange", (event) => blocking(event.oldVersion, event.newVersion, event));
      }
    }).catch(() => {
    });
    return openPromise;
  }
  var readMethods = ["get", "getKey", "getAll", "getAllKeys", "count"];
  var writeMethods = ["put", "add", "delete", "clear"];
  var cachedMethods = /* @__PURE__ */ new Map();
  function getMethod(target, prop) {
    if (!(target instanceof IDBDatabase && !(prop in target) && typeof prop === "string")) {
      return;
    }
    if (cachedMethods.get(prop))
      return cachedMethods.get(prop);
    const targetFuncName = prop.replace(/FromIndex$/, "");
    const useIndex = prop !== targetFuncName;
    const isWrite = writeMethods.includes(targetFuncName);
    if (!(targetFuncName in (useIndex ? IDBIndex : IDBObjectStore).prototype) || !(isWrite || readMethods.includes(targetFuncName))) {
      return;
    }
    const method = async function(storeName, ...args) {
      const tx = this.transaction(storeName, isWrite ? "readwrite" : "readonly");
      let target2 = tx.store;
      if (useIndex)
        target2 = target2.index(args.shift());
      return (await Promise.all([
        target2[targetFuncName](...args),
        isWrite && tx.done
      ]))[0];
    };
    cachedMethods.set(prop, method);
    return method;
  }
  replaceTraps((oldTraps) => ({
    ...oldTraps,
    get: (target, prop, receiver) => getMethod(target, prop) || oldTraps.get(target, prop, receiver),
    has: (target, prop) => !!getMethod(target, prop) || oldTraps.has(target, prop)
  }));

  // src/storage.ts
  var symWait = Symbol();
  var symDb = Symbol();
  var symSig = Symbol();
  var storesToAdd = [];
  var getDbPromise;
  async function getDb(store) {
    storesToAdd.push(store);
    if (storesToAdd.length > 1)
      return getDbPromise;
    const prom = openDB("shelter", Date.now(), {
      upgrade(udb) {
        for (const name of storesToAdd)
          if (!udb.objectStoreNames.contains(name))
            udb.createObjectStore(name);
      }
    }).then((db) => {
      storesToAdd = [];
      return db;
    });
    return getDbPromise = prom;
  }
  var storage = (name) => {
    const signals = {};
    let db;
    const waitQueue = [];
    const waitInit2 = (cb) => db ? cb() : waitQueue.push(cb);
    const [mainSignal, setMainSignal] = createSignal({});
    const updateMainSignal = () => {
      const o = {};
      for (const k in signals)
        o[k] = signals[k][0]();
      setMainSignal(o);
    };
    getDb(name).then(async (d) => {
      db = d;
      const keys = await db.getAllKeys(name);
      await Promise.all(keys.map(async (k) => [k, await db.get(name, k)])).then((vals) => {
        for (const [k, v] of vals) {
          if (!signals.hasOwnProperty(k)) {
            signals[k] = createSignal(v);
          }
        }
        updateMainSignal();
      });
      waitQueue.forEach((cb) => cb());
    });
    return new Proxy({}, {
      get(_, p) {
        if (p === symWait)
          return waitInit2;
        if (p === symDb)
          return db;
        if (p === symSig)
          return mainSignal;
        if (typeof p === "symbol")
          throw new Error("cannot index db store with a symbol");
        if (signals[p])
          return signals[p][0]();
        const [sig, setsig] = signals[p] = createSignal();
        waitInit2(
          () => db.get(name, p).then((v) => {
            setsig(() => v);
            updateMainSignal();
          })
        );
        return sig();
      },
      set(_, p, v) {
        if (typeof p === "symbol")
          throw new Error("cannot index db store with a symbol");
        if (!signals[p])
          signals[p] = createSignal();
        const [, setsig] = signals[p];
        setsig(() => v);
        updateMainSignal();
        waitInit2(() => db.put(name, v, p));
        return true;
      },
      deleteProperty(_, p) {
        if (typeof p === "symbol")
          throw new Error("cannot index db store with a symbol");
        delete signals[p];
        updateMainSignal();
        waitInit2(() => db.delete(name, p));
        return true;
      },
      has: (_, p) => p in signals,
      ownKeys: () => Object.keys(signals),
      getOwnPropertyDescriptor: (_, p) => ({
        value: p,
        enumerable: true,
        configurable: true,
        writable: true
      })
    });
  };
  var dbStore = storage("dbstore");
  var isInited = (store) => !!store[symDb];
  var whenInited = (store, cb) => store[symWait](cb);
  var waitInit = (store) => new Promise((res) => whenInited(store, res));
  var defaults = (store, fallbacks) => whenInited(
    store,
    () => batch(() => {
      for (const k in fallbacks)
        if (!(k in store))
          store[k] = fallbacks[k];
    })
  );
  var signalOf = (store) => store[symSig];
  var solidMutWithSignal = (store) => {
    const [sig, setSig] = createSignal();
    const update = () => setSig(() => ({ ...store }));
    return [
      new Proxy(store, {
        set(t, p, v, r) {
          const success = Reflect.set(t, p, v, r);
          if (success)
            update();
          return success;
        },
        deleteProperty(t, p) {
          const success = Reflect.deleteProperty(t, p);
          if (success)
            update();
          return success;
        }
      }),
      sig
    ];
  };

  // src/plugins.ts
  var internalData = storage("plugins-internal");
  var pluginStorages = storage("plugins-data");
  var [internalLoaded, loadedPlugins] = solidMutWithSignal(createMutable({}));
  var installedPlugins = signalOf(internalData);
  function createStorage(pluginId) {
    if (!isInited(pluginStorages))
      throw new Error("to keep data persistent, plugin storages must not be created until connected to IDB");
    const data = createMutable(pluginStorages[pluginId] ?? {});
    const flush = () => pluginStorages[pluginId] = { ...data };
    return [
      new Proxy(data, {
        set(t, p, v, r) {
          queueMicrotask(flush);
          return Reflect.set(t, p, v, r);
        },
        deleteProperty(t, p) {
          queueMicrotask(flush);
          return Reflect.deleteProperty(t, p);
        }
      }),
      flush
    ];
  }
  function startPlugin(pluginId) {
    const data = internalData[pluginId];
    if (!data)
      throw new Error(`attempted to load a non-existent plugin: ${pluginId}`);
    if (internalLoaded[pluginId])
      throw new Error("attempted to load an already loaded plugin");
    const [store, flushStore] = createStorage(pluginId);
    const shelterPluginEdition = {
      ...window["shelter"],
      plugin: {
        store,
        flushStore,
        manifest: data.manifest,
        showSettings() {
          throw new Error("not implemented");
        }
      }
    };
    const pluginString = `shelter=>{return ${data.js}}${atob("Ci8v")}# sourceURL=s://!SHELTER/${pluginId}`;
    try {
      const rawPlugin = (0, eval)(pluginString)(shelterPluginEdition);
      const plugin = { ...rawPlugin };
      internalLoaded[pluginId] = plugin;
      plugin.onLoad?.();
      internalData[pluginId] = { ...data, on: true };
    } catch (e) {
      log(`plugin ${pluginId} errored while loading and will be unloaded: ${e}`, "error");
      try {
        internalLoaded[pluginId]?.onUnload?.();
      } catch (e2) {
        log(`plugin ${pluginId} errored while unloading: ${e2}`, "error");
      }
      delete internalLoaded[pluginId];
      internalData[pluginId] = { ...data, on: false };
    }
  }
  function stopPlugin(pluginId) {
    const data = internalData[pluginId];
    const loadedData = internalLoaded[pluginId];
    if (!data)
      throw new Error(`attempted to unload a non-existent plugin: ${pluginId}`);
    if (!loadedData)
      throw new Error(`attempted to unload a non-loaded plugin: ${pluginId}`);
    try {
      loadedData.onUnload();
    } catch (e) {
      log(`plugin ${pluginId} errored while unloading: ${e}`, "error");
    }
    delete internalLoaded[pluginId];
    internalData[pluginId] = { ...data, on: false };
  }
  async function updatePlugin(pluginId) {
    const data = internalData[pluginId];
    if (!data)
      throw new Error(`attempted to update a non-existent plugin: ${pluginId}`);
    if (internalLoaded[pluginId])
      throw new Error(`attempted to update a loaded plugin: ${pluginId}`);
    if (data.update && data.src) {
      try {
        const newPluginManifest = await (await fetch(new URL("plugin.json", data.src))).json();
        if (data.manifest.hash !== void 0 && newPluginManifest.hash === data.manifest.hash)
          return false;
        const newPluginText = await (await fetch(new URL("plugin.js", data.src))).text();
        internalData[pluginId] = {
          ...data,
          js: newPluginText,
          manifest: newPluginManifest
        };
        return true;
      } catch (e) {
        throw new Error(`failed to update plugin ${pluginId}: ${e}`);
      }
    }
    return false;
  }
  var stopAllPlugins = () => Object.keys(internalData).forEach(stopPlugin);
  async function startAllPlugins() {
    await Promise.all([waitInit(internalData), waitInit(pluginStorages)]);
    const allPlugins = Object.keys(internalData);
    await Promise.all(allPlugins.map(updatePlugin));
    const toStart = allPlugins.filter((id) => internalData[id].on);
    toStart.forEach(startPlugin);
    return stopAllPlugins;
  }
  function addLocalPlugin(id, plugin) {
    if (typeof id !== "string" || id in internalData)
      throw new Error("plugin ID invalid or taken");
    if (typeof plugin.js !== "string" || typeof plugin.update !== "boolean" || plugin.src !== void 0 && typeof plugin.src !== "string" || typeof plugin.manifest !== "object")
      throw new Error("Plugin object failed validation");
    plugin.on = false;
    internalData[id] = plugin;
  }
  async function addRemotePlugin(id, src, update = true) {
    if (typeof id !== "string" || id in internalData)
      throw new Error("plugin ID invalid or taken");
    internalData[id] = {
      src,
      update,
      on: false,
      manifest: {},
      js: ""
    };
    try {
      if (!await updatePlugin(id))
        delete internalData[id];
    } catch (e) {
      delete internalData[id];
      throw e;
    }
  }
  function removePlugin(id) {
    if (!internalData[id])
      throw new Error(`attempted to remove non-existent plugin ${id}`);
    if (id in internalLoaded)
      stopPlugin(id);
    delete internalData[id];
  }

  // src/components/Settings.tsx.scss
  var css7 = `._row_i5kc7_1{display:flex;gap:.5rem;align-items:center}._column_i5kc7_1{display:flex;flex-direction:column;gap:.5rem}._slogan_i5kc7_1{font-style:oblique}`;
  var classes7 = {
    "row": "_row_i5kc7_1",
    "column": "_column_i5kc7_1",
    "slogan": "_slogan_i5kc7_1"
  };

  // ../shelter-assets/banner/banner.png
  var banner_default = "data:image/png;base64,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";

  // src/components/ShelterLogo.tsx
  var _tmpl$11 = /* @__PURE__ */ template(`<img>`, 1);
  var ShelterLogo_default = (props) => (() => {
    const _el$ = _tmpl$11.cloneNode(true);
    _el$.style.setProperty("display", "inline");
    _el$.style.setProperty("border-radius", "0.725rem");
    _el$.style.setProperty("user-select", "none");
    setAttribute(_el$, "src", banner_default);
    setAttribute(_el$, "draggable", false);
    createRenderEffect((_p$) => {
      const _v$ = props.width || 225, _v$2 = props.height ?? 80.5;
      _v$ !== _p$._v$ && setAttribute(_el$, "width", _p$._v$ = _v$);
      _v$2 !== _p$._v$2 && setAttribute(_el$, "height", _p$._v$2 = _v$2);
      return _p$;
    }, {
      _v$: void 0,
      _v$2: void 0
    });
    return _el$;
  })();

  // src/components/Plugins.tsx.scss
  var css8 = `._list_1ai5a_1{color:var(--text-normal)}._plugin_1ai5a_1{border:1px solid var(--background-accent);border-radius:4px;padding:.5rem;margin-top:.5rem}._row_1ai5a_1{display:flex;align-items:center;color:hsl(216, calc(var(--saturation-factor, 1) * 3.7%), 73.5%)}._row_1ai5a_1 strong,._row_1ai5a_1 ._author_1ai5a_1{color:var(--header-primary)}._desc_1ai5a_1{font-size:.9em;color:hsl(216, calc(var(--saturation-factor, 1) * 3.7%), 73.5%)}._btn_1ai5a_1{border:none;background:none;color:var(--interactive-active)}._btn_1ai5a_1:hover{color:var(--interactive-hover)}`;
  var classes8 = {
    "list": "_list_1ai5a_1",
    "plugin": "_plugin_1ai5a_1",
    "row": "_row_1ai5a_1",
    "author": "_author_1ai5a_1",
    "desc": "_desc_1ai5a_1",
    "btn": "_btn_1ai5a_1"
  };

  // src/components/PluginAddModal.tsx
  var PluginAddModal_default = (props) => {
    const [local, setLocal] = createSignal(false);
    const [rSrc, setRSrc] = createSignal("");
    const [rUpdate, setRUpdate] = createSignal(true);
    const [lName, setLName] = createSignal("");
    const [lCode, setLCode] = createSignal("");
    const [lAuthor, setLAuthor] = createSignal("");
    const [lDesc, setLDesc] = createSignal("");
    const newId = () => {
      if (!local())
        return rSrc().split("://")[1];
      let id = lName().toLowerCase().replaceAll(/[^A-Za-z0-9-_.]/g, "-");
      while (installedPlugins[id])
        id += "_";
      return id;
    };
    const validate = () => {
      try {
        new URL(rSrc());
      } catch {
        if (!local())
          return false;
      }
      if ((!lName() || !lCode() || !lAuthor()) && local())
        return;
      return !installedPlugins[newId()];
    };
    return createComponent(ModalRoot2, {
      get children() {
        return [createComponent(ModalHeader, {
          get close() {
            return props.close;
          },
          children: "Add plugin"
        }), createComponent(ModalBody, {
          get children() {
            return [createComponent(SwitchItem, {
              get value() {
                return local();
              },
              onChange: setLocal,
              hideBorder: true,
              children: "Local plugin"
            }), createComponent(Switch, {
              get children() {
                return [createComponent(Match, {
                  get when() {
                    return !local();
                  },
                  keyed: false,
                  get children() {
                    return [createComponent(Header, {
                      get tag() {
                        return HeaderTags.H4;
                      },
                      children: "URL"
                    }), createComponent(TextBox, {
                      placeholder: "https://example.com/my-plugin",
                      get value() {
                        return rSrc();
                      },
                      onInput: setRSrc
                    }), createComponent(SwitchItem, {
                      get value() {
                        return rUpdate();
                      },
                      onChange: setRUpdate,
                      hideBorder: true,
                      children: "Automatically update"
                    })];
                  }
                }), createComponent(Match, {
                  get when() {
                    return local();
                  },
                  keyed: false,
                  get children() {
                    return [createComponent(Header, {
                      get tag() {
                        return HeaderTags.H4;
                      },
                      children: "Name"
                    }), createComponent(TextBox, {
                      placeholder: "My Cool Plugin",
                      get value() {
                        return lName();
                      },
                      onInput: setLName
                    }), createComponent(Header, {
                      get tag() {
                        return HeaderTags.H4;
                      },
                      children: "Author"
                    }), createComponent(TextBox, {
                      placeholder: "Rin",
                      get value() {
                        return lAuthor();
                      },
                      onInput: setLAuthor
                    }), createComponent(Header, {
                      get tag() {
                        return HeaderTags.H4;
                      },
                      children: "Description"
                    }), createComponent(TextBox, {
                      placeholder: "The plugin is very cool and helpful",
                      get value() {
                        return lDesc();
                      },
                      onInput: setLDesc
                    }), createComponent(Header, {
                      get tag() {
                        return HeaderTags.H4;
                      },
                      children: "Code"
                    }), createComponent(TextArea, {
                      mono: true,
                      "resize-y": true,
                      placeholder: `{
  onload() {
    const { name } = shelter.plugin.manifest;
    console.log(\`Hello from $\u200C{name}!\`);
  },
  onUnload() {
    console.log("Goodbye :(");
  }
}`,
                      get value() {
                        return lCode();
                      },
                      onInput: setLCode
                    })];
                  }
                })];
              }
            })];
          }
        }), createComponent(ModalConfirmFooter, {
          get close() {
            return props.close;
          },
          get confirmText() {
            return local() ? "Add" : "Fetch";
          },
          get disabled() {
            return !validate();
          },
          onConfirm: async () => {
            if (local()) {
              try {
                addLocalPlugin(newId(), {
                  js: lCode(),
                  manifest: {
                    name: lName(),
                    author: lAuthor(),
                    description: lDesc()
                  },
                  on: false,
                  update: false
                });
              } catch (e) {
              }
            } else {
              try {
                await addRemotePlugin(newId(), rSrc());
              } catch (e) {
              }
            }
          }
        })];
      }
    });
  };

  // src/components/Plugins.tsx
  var _tmpl$12 = /* @__PURE__ */ template(`<div><div><strong></strong>by<span></span><div style="flex:1"></div><button></button></div><span></span></div>`, 14);
  var _tmpl$29 = /* @__PURE__ */ template(`<div></div>`, 2);
  var cssInjected2 = false;
  var PluginCard = (props) => {
    const [on2, setOn] = createSignal(props.plugin.on);
    return (() => {
      const _el$ = _tmpl$12.cloneNode(true), _el$2 = _el$.firstChild, _el$3 = _el$2.firstChild, _el$4 = _el$3.nextSibling, _el$5 = _el$4.nextSibling, _el$6 = _el$5.nextSibling, _el$7 = _el$6.nextSibling, _el$8 = _el$2.nextSibling;
      insert(_el$3, () => props.plugin.manifest.name);
      insert(_el$2, createComponent(Space, {}), _el$4);
      insert(_el$2, createComponent(Space, {}), _el$5);
      insert(_el$5, () => props.plugin.manifest.author);
      _el$7.$$click = () => openConfirmationModal({
        body: () => `Are you sure you want to delete plugin ${props.plugin.manifest.name}?`,
        header: () => "Confirm plugin deletion",
        type: "danger",
        confirmText: "Delete"
      }).then(() => removePlugin(props.id), () => {
      });
      insert(_el$7, createComponent(IconBin, {}));
      insert(_el$2, createComponent(Switch2, {
        get checked() {
          return on2();
        },
        onChange: (newVal) => {
          if (props.plugin.on === newVal)
            return;
          setOn(!on2());
          setTimeout(() => newVal ? startPlugin(props.id) : stopPlugin(props.id), 250);
        }
      }), null);
      insert(_el$8, () => props.plugin.manifest.description);
      createRenderEffect((_p$) => {
        const _v$ = classes8.plugin, _v$2 = classes8.row, _v$3 = classes8.author, _v$4 = classes8.btn, _v$5 = classes8.desc;
        _v$ !== _p$._v$ && className(_el$, _p$._v$ = _v$);
        _v$2 !== _p$._v$2 && className(_el$2, _p$._v$2 = _v$2);
        _v$3 !== _p$._v$3 && className(_el$5, _p$._v$3 = _v$3);
        _v$4 !== _p$._v$4 && className(_el$7, _p$._v$4 = _v$4);
        _v$5 !== _p$._v$5 && className(_el$8, _p$._v$5 = _v$5);
        return _p$;
      }, {
        _v$: void 0,
        _v$2: void 0,
        _v$3: void 0,
        _v$4: void 0,
        _v$5: void 0
      });
      return _el$;
    })();
  };
  var Plugins_default = () => {
    if (!cssInjected2) {
      injectCss(css8);
      cssInjected2 = true;
    }
    return (() => {
      const _el$9 = _tmpl$29.cloneNode(true);
      insert(_el$9, createComponent(Header, {
        get tag() {
          return HeaderTags.H3;
        },
        get children() {
          return ["Plugins", (() => {
            const _el$10 = _tmpl$29.cloneNode(true);
            _el$10.$$click = () => openModal((props) => createComponent(PluginAddModal_default, {
              get close() {
                return props.close;
              }
            }));
            _el$10.style.setProperty("display", "inline");
            _el$10.style.setProperty("margin-left", ".3rem");
            _el$10.style.setProperty("cursor", "pointer");
            insert(_el$10, createComponent(IconAdd, {}));
            return _el$10;
          })()];
        }
      }), null);
      insert(_el$9, () => Object.entries(installedPlugins()).map(([id, plugin]) => createComponent(PluginCard, {
        id,
        plugin
      })), null);
      createRenderEffect(() => className(_el$9, classes8.list));
      return _el$9;
    })();
  };
  delegateEvents(["click"]);

  // src/components/Settings.tsx
  var _tmpl$13 = /* @__PURE__ */ template(`<div></div>`, 2);
  var injectedCss6 = false;
  var Settings_default = () => {
    if (!injectedCss6) {
      injectCss(css7);
      injectedCss6 = true;
    }
    return [createComponent(Header, {
      get tag() {
        return HeaderTags.H1;
      },
      get ["class"]() {
        return `${classes7.row} ${classes7.slogan}`;
      },
      get children() {
        return [createComponent(ShelterLogo_default, {}), "- an attempt to prepare for the worst"];
      }
    }), createComponent(Divider, {
      mt: true,
      mb: true
    }), (() => {
      const _el$ = _tmpl$13.cloneNode(true);
      _el$.style.setProperty("padding", "0.25rem");
      insert(_el$, createComponent(SwitchItem, {
        get value() {
          return dbStore.logDispatch;
        },
        onChange: (v) => dbStore.logDispatch = v,
        children: "Log FluxDispatcher events to the console"
      }), null);
      insert(_el$, createComponent(Plugins_default, {}), null);
      createRenderEffect(() => className(_el$, classes7.column));
      return _el$;
    })()];
  };

  // src/settings.tsx
  var _tmpl$14 = /* @__PURE__ */ template(`<div style="display: contents"><div></div><div role="button" tabindex="-1">Shelter</div><div role="tab" tabindex="-1" aria-label="Shelter Settings">Settings</div></div>`, 8);
  var _tmpl$210 = /* @__PURE__ */ template(`<div style="display: contents"></div>`, 2);
  var SettingsInj = withCleanup((props) => {
    const [settingsOpen, setSettingsOpen] = createSignal();
    const cb = () => {
      if (!settingsOpen())
        return;
      const [theirDiv, ourDiv] = settingsOpen();
      setSettingsOpen();
      ourDiv.remove();
      theirDiv.style.display = "";
    };
    props.dispatcher.subscribe("USER_SETTINGS_MODAL_SET_SECTION", cb);
    onCleanup(() => props.dispatcher.unsubscribe("USER_SETTINGS_MODAL_SET_SECTION", cb));
    return (() => {
      const _el$ = _tmpl$14.cloneNode(true), _el$2 = _el$.firstChild, _el$3 = _el$2.nextSibling, _el$4 = _el$3.nextSibling;
      _el$4.$$click = () => {
        if (settingsOpen())
          return;
        const theirDiv = props.mainSection.firstElementChild;
        const ourDiv = (() => {
          const _el$5 = _tmpl$210.cloneNode(true);
          insert(_el$5, () => props.content({}));
          return _el$5;
        })();
        setSettingsOpen([theirDiv, ourDiv]);
        theirDiv.style.display = "none";
        props.mainSection.append(ourDiv);
      };
      setAttribute(_el$4, "aria-disabled", false);
      createRenderEffect((_p$) => {
        const _v$ = props.dividerClasses, _v$2 = props.headerClasses, _v$3 = props.tabClasses, _v$4 = !!settingsOpen(), _v$5 = settingsOpen() ? "var(--background-modifier-selected)" : "";
        _v$ !== _p$._v$ && className(_el$2, _p$._v$ = _v$);
        _v$2 !== _p$._v$2 && className(_el$3, _p$._v$2 = _v$2);
        _v$3 !== _p$._v$3 && className(_el$4, _p$._v$3 = _v$3);
        _v$4 !== _p$._v$4 && setAttribute(_el$4, "aria-selected", _p$._v$4 = _v$4);
        _v$5 !== _p$._v$5 && _el$4.style.setProperty("background", _p$._v$5 = _v$5);
        return _p$;
      }, {
        _v$: void 0,
        _v$2: void 0,
        _v$3: void 0,
        _v$4: void 0,
        _v$5: void 0
      });
      return _el$;
    })();
  });
  async function initSettings() {
    const FluxDispatcher = await getDispatcher();
    let firstDispatch = true;
    let canceled = false;
    const cb = async () => {
      if (firstDispatch) {
        await awaitDispatch("USER_PROFILE_FETCH_SUCCESS");
        firstDispatch = false;
      }
      if (canceled)
        return;
      queueMicrotask(() => {
        const sidebar = document.querySelector("nav > [role=tablist]");
        const mainSection = document.querySelector("[role=tabpanel]:not([aria-labelledby])");
        if (!sidebar || !mainSection)
          return;
        const changelogIdx = [...sidebar.children].findIndex((c) => reactFiberWalker(getFiber(c), "id", true)?.pendingProps?.id === "changelog");
        if (changelogIdx === -1)
          return;
        const dividerAboveChangelog = sidebar.children[changelogIdx];
        const tabClasses = sidebar.children[changelogIdx + 1].className;
        const dividerClasses = dividerAboveChangelog.className;
        const headerClasses = sidebar.firstElementChild.className;
        const injection = createComponent(SettingsInj, mergeProps({
          dividerClasses,
          headerClasses,
          tabClasses,
          mainSection
        }, {
          dispatcher: FluxDispatcher,
          content: Settings_default
        }));
        sidebar.insertBefore(injection, dividerAboveChangelog);
      });
    };
    FluxDispatcher.subscribe("USER_SETTINGS_MODAL_OPEN", cb);
    return () => {
      FluxDispatcher.unsubscribe("USER_SETTINGS_MODAL_OPEN", cb);
      canceled = true;
    };
  }
  delegateEvents(["click"]);

  // src/dispatchLogger.ts
  defaults(dbStore, { logDispatch: false });
  var initDispatchLogger = () => intercept((payload) => {
    if (dbStore.logDispatch)
      log(payload);
  });

  // src/index.ts
  var start = performance.now();
  log("shelter is initializing...");
  function without(object, ...keys) {
    const cloned = { ...object };
    keys.forEach((k) => delete cloned[k]);
    return cloned;
  }
  getDispatcher().then(async (FluxDispatcher) => {
    const unloads = await Promise.all([initSettings(), initDispatchLogger(), cleanupCss, unpatchAll]);
    window["shelter"] = {
      flux: {
        ...flux_exports,
        dispatcher: FluxDispatcher
      },
      patcher: without(esm_exports, "unpatchAll"),
      solid: solid_exports,
      solidStore: store_exports,
      solidWeb: web_exports,
      util: util_exports,
      plugins: without(plugins_exports, "startAllPlugins"),
      storage: storage_exports,
      ui: without(src_exports, "cleanupCss"),
      unload: () => unloads.forEach((p) => p())
    };
    unloads.push(await startAllPlugins());
    log(`shelter is initialized. took: ${(performance.now() - start).toFixed(1)}ms`);
  });
})();
